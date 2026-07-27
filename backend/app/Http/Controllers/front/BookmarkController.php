<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseBookmark;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function index(Request $request)
    {
        $bookmarks = CourseBookmark::where('user_id', $request->user()->id)
            ->with(['course.level'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $bookmarks
        ], 200);
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $course = Course::where('id', $request->course_id)
            ->where('status', 1)
            ->first();

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        $bookmark = CourseBookmark::where('user_id', $request->user()->id)
            ->where('course_id', $request->course_id)
            ->first();

        if ($bookmark) {
            $bookmark->delete();

            return response()->json([
                'status' => 200,
                'bookmarked' => false,
                'message' => 'Course removed from bookmarks.'
            ], 200);
        }

        CourseBookmark::create([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id
        ]);

        return response()->json([
            'status' => 200,
            'bookmarked' => true,
            'message' => 'Course saved to bookmarks.'
        ], 200);
    }
}
