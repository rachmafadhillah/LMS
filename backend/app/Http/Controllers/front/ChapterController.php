<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    // This method will return all chapter of a course
    public function index(Request $request)
    {
        $chapters = Chapter::where('course_id', $request->course_id)
            ->orderBy('sort_order')
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $chapters
        ], 200);
    }

    // This method will store/save chapter
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required',
            'course_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // This will store in db
        $chapter = new Chapter();
        $chapter->course_id = $request->course_id;
        $chapter->title = $request->chapter;
        $chapter->sort_order = 1000;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => 'Chapter added successfully.'
        ], 200);
    }

    // This method will update chapter
    public function update($id, Request $request)
    {
        $chapter = Chapter::find($id);

        if ($chapter == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter->title = $request->chapter;
        $chapter->save();

        $chapter->load('lessons');

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => 'Chapter updated successfully.'
        ], 200);
    }

    // This method will delete chapter
    public function destroy($id)
    {
        $chapter = Chapter::find($id);

        if ($chapter == null) {
            return response()->json([
                'status' => 404,
                'errors' => 'Chapter not found'
            ], 404);
        }

        $chapter->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter deleted successfully.'
        ], 200);
    }

    // This method will sort chapters
    public function sortChapters(Request $request)
    {
        $courseId = '';
        if (!empty($request->chapters)) {
            foreach ($request->chapters as $key => $chapter) {
                $courseId = $chapter['course_id'];
                Chapter::where('id', $chapter['id'])->update(['sort_order' => $key]);
            }
        }

        $chapters = Chapter::where('course_id',$courseId)
                    ->with('lessons')
                    ->orderBy('sort_order','ASC')->get();

        return response()->json([
            'status' => 200,
            'chapters' => $chapters,
            'message' => 'Order updated succsessfully.'
        ]);
    }
}
