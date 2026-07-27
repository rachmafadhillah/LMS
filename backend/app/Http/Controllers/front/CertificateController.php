<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Services\CourseProgressService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function __construct(private CourseProgressService $courseProgressService)
    {
    }

    public function issue(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $enrolled = Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $request->course_id)
            ->exists();

        if (!$enrolled) {
            return response()->json([
                'status' => 403,
                'message' => 'You must enroll before requesting certificate.'
            ], 403);
        }

        $progress = $this->courseProgressService->calculate($request->course_id, $request->user()->id);

        if ($progress['percentage'] < 100) {
            return response()->json([
                'status' => 422,
                'message' => 'Complete all lessons before requesting certificate.',
                'progress' => $progress['percentage']
            ], 422);
        }

        $certificate = Certificate::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'course_id' => $request->course_id
            ],
            [
                'certificate_number' => 'CERT-' . now()->format('Ymd') . '-' . strtoupper(Str::random(8)),
                'issued_at' => now()
            ]
        );

        $certificate->load(['course', 'user']);

        return response()->json([
            'status' => 200,
            'message' => 'Certificate ready.',
            'data' => $certificate
        ], 200);
    }

    public function show($courseId, Request $request)
    {
        $certificate = Certificate::where('user_id', $request->user()->id)
            ->where('course_id', $courseId)
            ->with(['course', 'user'])
            ->first();

        if ($certificate == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Certificate not found.'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $certificate
        ], 200);
    }

}
