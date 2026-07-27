<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSubmission;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseSubmissionController extends Controller
{
    public function mySubmissions(Request $request)
    {
        $submissions = CourseSubmission::where('user_id', $request->user()->id)
            ->with(['course.level', 'reviewer'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $submissions
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'project_title' => 'required|min:5|max:150',
            'description' => 'nullable|max:2000',
            'repository_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $enrolled = Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $request->course_id)
            ->exists();

        if (!$enrolled) {
            return response()->json([
                'status' => 403,
                'message' => 'You must enroll before submitting a project.'
            ], 403);
        }

        $submission = CourseSubmission::create([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'project_title' => $request->project_title,
            'description' => $request->description,
            'repository_url' => $request->repository_url,
            'demo_url' => $request->demo_url,
            'status' => CourseSubmission::STATUS_SUBMITTED,
        ]);

        $submission->load(['course.level']);

        return response()->json([
            'status' => 201,
            'message' => 'Project submitted successfully.',
            'data' => $submission
        ], 201);
    }

    public function instructorSubmissions(Request $request)
    {
        $courseIds = Course::where('user_id', $request->user()->id)->pluck('id');

        if ($request->user()->isAdmin()) {
            $courseIds = Course::pluck('id');
        }

        $submissions = CourseSubmission::whereIn('course_id', $courseIds)
            ->with(['course.level', 'user', 'reviewer'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $submissions
        ], 200);
    }

    public function review($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:reviewed,approved,revision',
            'score' => 'nullable|integer|min:0|max:100',
            'feedback' => 'required|min:5|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $submission = CourseSubmission::with('course')->find($id);

        if ($submission == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Submission not found.'
            ], 404);
        }

        if (!$request->user()->isAdmin() && $submission->course->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 403,
                'message' => 'You can only review submissions for your own courses.'
            ], 403);
        }

        $submission->status = $request->status;
        $submission->score = $request->score;
        $submission->feedback = $request->feedback;
        $submission->reviewed_by = $request->user()->id;
        $submission->reviewed_at = now();
        $submission->save();

        $submission->load(['course.level', 'user', 'reviewer']);

        return response()->json([
            'status' => 200,
            'message' => 'Submission reviewed successfully.',
            'data' => $submission
        ], 200);
    }
}
