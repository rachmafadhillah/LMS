<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    // This method will return all outcomes of a course
    public function index(Request $request)
    {
        $outcomes = Outcome::where('course_id', $request->course_id)
            ->orderBy('sort_order')
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $outcomes
        ], 200);
    }

    // This method will store/save outcome
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
            'course_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // This will store in db
        $outcome = new Outcome();
        $outcome->course_id = $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'data' => $outcome,
            'message' => 'Outcome added successfully.'
        ], 200);
    }

    // This method will update outcome
    public function update($id, Request $request)
    {
        $outcome = Outcome::find($id);

        if ($outcome == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome->text = $request->outcome;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'data' => $outcome,
            'message' => 'Outcome updated successfully.'
        ], 200);
    }

    // This method will delete outcome
    public function destroy($id)
    {
        $outcome = Outcome::find($id);

        if ($outcome == null) {
            return response()->json([
                'status' => 404,
                'errors' => 'Outcome not found'
            ], 404);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome deleted successfully.'
        ], 200);
    }

    // This method will sort outcomes
    public function sortOutcomes(Request $request)
    {
        if (!empty($request->outcomes)) {
            foreach ($request->outcomes as $key => $outcome) {
                Outcome::where('id', $outcome['id'])->update(['sort_order' => $key]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order updated succsessfully.'
        ]);
    }
}
