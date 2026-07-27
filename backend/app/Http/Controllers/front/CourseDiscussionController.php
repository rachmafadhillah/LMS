<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseDiscussion;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseDiscussionController extends Controller
{
    public function index($courseId)
    {
        $discussions = CourseDiscussion::where('course_id', $courseId)
            ->whereNull('parent_id')
            ->where('status', 1)
            ->with(['user', 'replies'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $discussions
        ], 200);
    }

    public function store($courseId, Request $request)
    {
        $course = Course::find($courseId);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        if (!$this->canDiscuss($request, $course)) {
            return response()->json([
                'status' => 403,
                'message' => 'Enroll this course before joining discussion.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required_without:parent_id|nullable|min:5|max:150',
            'body' => 'required|min:3|max:2000',
            'parent_id' => 'nullable|exists:course_discussions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->parent_id) {
            $parent = CourseDiscussion::where('id', $request->parent_id)
                ->where('course_id', $courseId)
                ->whereNull('parent_id')
                ->first();

            if ($parent == null) {
                return response()->json([
                    'status' => 404,
                    'message' => 'Discussion topic not found.'
                ], 404);
            }
        }

        $discussion = CourseDiscussion::create([
            'course_id' => $courseId,
            'user_id' => $request->user()->id,
            'parent_id' => $request->parent_id,
            'title' => $request->parent_id ? null : $request->title,
            'body' => $request->body,
            'status' => 1,
        ]);

        $discussion->load('user');

        return response()->json([
            'status' => 201,
            'message' => $request->parent_id ? 'Reply posted successfully.' : 'Discussion posted successfully.',
            'data' => $discussion
        ], 201);
    }

    private function canDiscuss(Request $request, Course $course): bool
    {
        if ($request->user()->isAdmin() || $course->user_id === $request->user()->id) {
            return true;
        }

        return Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->exists();
    }
}
