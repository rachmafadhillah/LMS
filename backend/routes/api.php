<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\ChapterController;
use App\Http\Controllers\front\CourseController;
use App\Http\Controllers\front\HomeController;
use App\Http\Controllers\front\LessonController;
use App\Http\Controllers\front\OutcomeController;
use App\Http\Controllers\front\RequirementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::get('/fetch-categories', [HomeController::class, 'fetchCategories']);
Route::get('/fetch-levels', [HomeController::class, 'fetchLevels']);
Route::get('/fetch-languages', [HomeController::class, 'fetchLanguages']);
Route::get('/fetch-featured-courses', [HomeController::class, 'fetchFeaturedCourses']);
Route::get('/fetch-courses', [HomeController::class, 'courses']);
Route::get('/fetch-course/{id}', [HomeController::class, 'course']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/courses', [CourseController::class, 'store']);
    Route::get('/courses/meta-data', [CourseController::class, 'metaData']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::post('/save-course-image/{id}', [CourseController::class, 'saveCourseImage']);
    Route::post('/change-course-status/{id}', [CourseController::class, 'changeStatus']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Outcome routes
    Route::get('/outcomes', [OutcomeController::class, 'index']);
    Route::post('/outcomes', [OutcomeController::class, 'store']);
    Route::put('/outcomes/{id}', [OutcomeController::class, 'update']);
    Route::delete('/outcomes/{id}', [OutcomeController::class, 'destroy']);
    Route::post('/sort-outcomes', [OutcomeController::class, 'sortOutcomes']);

    // Requirement routes
    Route::get('/requirements', [RequirementController::class, 'index']);
    Route::post('/requirements', [RequirementController::class, 'store']);
    Route::put('/requirements/{id}', [RequirementController::class, 'update']);
    Route::delete('/requirements/{id}', [RequirementController::class, 'destroy']);
    Route::post('/sort-requirements', [RequirementController::class, 'sortRequirements']);

    // Chapter routes
    Route::get('/chapters', [ChapterController::class, 'index']);
    Route::post('/chapters', [ChapterController::class, 'store']);
    Route::put('/chapters/{id}', [ChapterController::class, 'update']);
    Route::delete('/chapters/{id}', [ChapterController::class, 'destroy']);
    Route::post('/sort-chapters', [ChapterController::class, 'sortChapters']);

    // Lesson Routes
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::get('/lessons/{id}', [LessonController::class, 'show']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
    Route::post('/save-lesson-video/{id}', [LessonController::class, 'saveVideo']);
    Route::post('/sort-lessons', [LessonController::class, 'sortLessons']);

    Route::get('/my-courses', [AccountController::class, 'courses']);
    Route::get('/enrollments', [AccountController::class, 'enrollments']);
    Route::post('/enroll-course', [HomeController::class, 'enroll']);
    Route::get('/enroll/{id}', [AccountController::class, 'course']);
    Route::post('/save-activity', [AccountController::class, 'saveUserActivity']);
    Route::post('/mark-as-complete', [AccountController::class, 'markAsComplete']);
    Route::post('/leave-rating', [AccountController::class, 'saveRating']);
    Route::get('/fetch-user', [AccountController::class, 'fetchUser']);
    Route::post('/update-user', [AccountController::class, 'updateUser']);
    Route::post('/update-password', [AccountController::class, 'updatePassword']);
});
