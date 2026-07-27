<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Review;
use App\Models\User;
use App\Services\CourseProgressService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    public function __construct(private CourseProgressService $courseProgressService)
    {
    }

    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:5',
            'email' => 'required|email|unique:users',
            'password' => 'required',
        ]);

        // This will return validation errors
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ]);
        }

        // Now save user info in database
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'student';
        $user->save();
        $user->assignRole('student');

        return response()->json([
            'status' => 200,
            'message' => 'User registered successfully.'
        ], 200);
    }


    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // This will return validation errors
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ]);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'name' => $user->name,
                'id' => Auth::user()->id,
                'role' => $user->roles->first()?->name ?? $user->role,
                'permissions' => $user->getAllPermissions()->pluck('name')->values(),

            ], 200);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Either email/password is incorrect.'
            ], 401);
        }
    }

    public function courses(Request $request)
    {
        $courses = Course::where('user_id', $request->user()->id)
            ->withCount('reviews')
            ->withCount('enrollments')
            ->withSum('reviews', 'rating')
            ->with('level')
            ->get();

        $courses->map(function ($course) {
            $course->rating = $course->reviews_count > 0 ?
                number_format(($course->reviews_sum_rating / $course->reviews_count), 1) : "0.0";
        });

        return response()->json([
            'status' => 200,
            'courses' => $courses
        ], 200);
    }

    public function enrollments(Request $request)
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with(['course' => function ($query) {
                $query->withCount('reviews');
                $query->withSum('reviews', 'rating');
                $query->withCount('enrollments');
            }, 'course.level'])
            ->get();

        $enrollments->map(function ($enrollment) {
            $enrollment->course->rating = $enrollment->course->reviews_count > 0 ?
                number_format(($enrollment->course->reviews_sum_rating / $enrollment->course->reviews_count), 1) : "0.0";

            $progress = $this->courseProgressService->calculate($enrollment->course->id, $enrollment->user_id);
            $enrollment->course->progress = $progress['percentage'];
            $enrollment->course->completed_lessons_count = $progress['completed_lessons_count'];
            $enrollment->course->total_lessons_count = $progress['total_lessons_count'];
        });

        return response()->json([
            'status' => 200,
            'data' => $enrollments
        ], 200);
    }

    public function continueLearning(Request $request)
    {
        $activity = Activity::where('user_id', $request->user()->id)
            ->where('is_last_watched', 'yes')
            ->with(['course.level', 'chapter', 'lesson'])
            ->latest('updated_at')
            ->first();

        if ($activity == null) {
            $enrollment = Enrollment::where('user_id', $request->user()->id)
                ->with(['course.level'])
                ->latest('updated_at')
                ->first();

            if ($enrollment == null) {
                return response()->json([
                    'status' => 200,
                    'data' => null
                ], 200);
            }

            $progress = $this->courseProgressService->calculate($enrollment->course_id, $request->user()->id);

            return response()->json([
                'status' => 200,
                'data' => [
                    'course' => $enrollment->course,
                    'chapter' => null,
                    'lesson' => null,
                    'progress' => $progress['percentage'],
                    'completed_lessons_count' => $progress['completed_lessons_count'],
                    'total_lessons_count' => $progress['total_lessons_count'],
                ]
            ], 200);
        }

        $progress = $this->courseProgressService->calculate($activity->course_id, $request->user()->id);

        return response()->json([
            'status' => 200,
            'data' => [
                'course' => $activity->course,
                'chapter' => $activity->chapter,
                'lesson' => $activity->lesson,
                'progress' => $progress['percentage'],
                'completed_lessons_count' => $progress['completed_lessons_count'],
                'total_lessons_count' => $progress['total_lessons_count'],
            ]
        ], 200);
    }

    public function course($id, Request $request)
    {
        $count = Enrollment::where([
            'user_id' => $request->user()->id,
            'course_id' => $id
        ])->count();

        if ($count == 0) {
            return response()->json([
                'status' => 404,
                'message' => "You can not access this course"
            ], 404);
        }

        $course = Course::where('id', $id)
            ->withCount('chapters')
            ->with([
                'category',
                'level',
                'language',
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function ($q) {
                    $q->where('status', 1);
                    $q->whereNotNull('video');
                },
                'outcomes',
                'requirements'
            ])
            ->first();

        $totalLessons = $course->chapters->sum('lessons_count');

        $activeLesson = collect();

        // if no activity saved then show first lesson of first chapter
        $activityCount = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $id
        ])->count();

        if ($activityCount == 0) {

            $chapter = Chapter::where('course_id', $id)
                ->orderBy('sort_order', 'ASC')
                ->first();

            $lesson = Lesson::where('chapter_id', $chapter->id)
                ->where('status', 1)
                ->whereNotNull('video')
                ->orderBy('sort_order', 'ASC')
                ->first();

            $activity = new Activity();
            $activity->user_id = $request->user()->id;
            $activity->course_id = $id;
            $activity->chapter_id = $chapter->id;
            $activity->lesson_id = $lesson->id;
            $activity->is_last_watched = "yes";
            $activity->save();

            $activeLesson = $lesson;
        } else {
            $activity = Activity::where([
                'user_id' => $request->user()->id,
                'course_id' => $id,
                'is_last_watched' => 'yes'
            ])->first();

            $activeLesson = Lesson::where('id', $activity->lesson_id)
                ->first();
        }

        // Fetch lessons which are completed
        $completedLessons = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $id,
            'is_complete' => 'yes'
        ])
            ->pluck('lesson_id')
            ->toArray();

        $completedLessonsCount = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $id,
            'is_complete' => 'yes'
        ])
            ->count();

        $progress = $totalLessons > 0 ? round(($completedLessonsCount / $totalLessons) * 100) : 0;

        return response()->json([
            'status' => 200,
            'data' => $course,
            'progress' => $progress,
            'activeLesson' => $activeLesson,
            'completedLessons' => $completedLessons
        ], 200);
    }

    public function saveUserActivity(Request $request)
    {
        Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id
        ])->update(['is_last_watched' => 'no']);

        Activity::updateOrInsert(
            [
                'user_id' => $request->user()->id,
                'course_id' => $request->course_id,
                'lesson_id' => $request->lesson_id,
                'chapter_id' => $request->chapter_id,
            ],
            [
                'is_last_watched' => 'yes'
            ]
        );

        return response()->json([
            'status' => 200,
            'message' => "User activity saved successfully."
        ], 200);
    }

    public function markAsComplete(Request $request)
    {

        Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'lesson_id' => $request->lesson_id,
            'chapter_id' => $request->chapter_id,
        ])->update([
            'is_complete' => 'yes'
        ]);

        // Fetch lessons which are completed
        $completedLessons = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'is_complete' => 'yes'
        ])
            ->pluck('lesson_id')
            ->toArray();

        $completedLessonsCount = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'is_complete' => 'yes'
        ])
            ->count();

        $course = Course::where('id', $request->course_id)
            ->withCount('chapters')
            ->with([
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function ($q) {
                        $q->where('status', 1);
                        $q->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function ($q) {
                    $q->where('status', 1);
                    $q->whereNotNull('video');
                },
                'outcomes',
                'requirements'
            ])
            ->first();

        $totalLessons = $course->chapters->sum('lessons_count');

        $progress = $totalLessons > 0 ? round(($completedLessonsCount / $totalLessons) * 100) : 0;

        return response()->json([
            'status' => 200,
            'completedLessons' => $completedLessons,
            'progress' => $progress,
            'message' => "Lesson marked as completed successfully."
        ], 200);
    }

    public function saveRating(Request $request)
    {
        $course = Course::find($request->course_id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        $count = Review::where('course_id', $request->course_id)
            ->where('user_id', $request->user()->id)
            ->count();

        if ($count > 0) {
            return response()->json([
                'status' => 200,
                'message' => 'You already rated this course.'
            ], 200);
        }
        $review = new Review();
        $review->comment = $request->comment;
        $review->rating = $request->rating;
        $review->user_id = $request->user()->id;
        $review->course_id = $request->course_id;
        $review->status = 1;
        $review->save();

        return response()->json([
            'status' => 200,
            'message' => 'Thanks for your feedback'
        ], 200);
    }

    public function fetchUser(Request $request)
    {
        $user = User::find($request->user()->id);

        if ($user == null) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $user->load('roles.permissions'),
            'permissions' => $user->getAllPermissions()->pluck('name')->values()
        ], 200);
    }

    public function updateUser(Request $request)
    {
        $user = User::find($request->user()->id);

        if ($user == null) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ], 404);
        }

        $validator =  Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $request->user()->id . ',id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => "Profile updated successfully."
        ], 200);
    }

    public function updatePassword(Request $request)
    {
        $user = User::find($request->user()->id);

        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => 'required|min:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Match old password
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'status' => 400,
                'errors' => ['old_password' => ['The old password is incorrect.']]
            ], 400);
        }

        $user->password = $request->new_password;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => "Password has been updated successfully."
        ], 200);
    }
}


