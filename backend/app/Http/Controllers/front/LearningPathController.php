<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\LearningPath;

class LearningPathController extends Controller
{
    public function index()
    {
        $paths = LearningPath::where('status', 1)
            ->withCount('courses')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $paths
        ], 200);
    }

    public function show($slug)
    {
        $path = LearningPath::where('slug', $slug)
            ->where('status', 1)
            ->with(['courses' => function ($query) {
                $query->where('status', 1)
                    ->with('level')
                    ->withCount('enrollments')
                    ->withCount('reviews')
                    ->withSum('reviews', 'rating');
            }])
            ->first();

        if ($path == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Learning path not found.'
            ], 404);
        }

        $path->courses->map(function ($course) {
            $course->rating = $course->reviews_count > 0 ?
                number_format($course->reviews_sum_rating / $course->reviews_count, 1) : "0.0";
        });

        return response()->json([
            'status' => 200,
            'data' => $path
        ], 200);
    }
}
