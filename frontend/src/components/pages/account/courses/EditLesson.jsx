import React, { useEffect, useState, useRef, useMemo } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/Config'
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast'
import LessonVideo from './LessonVideo'

const EditLesson = ({ placeholder }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [lesson, setLesson] = useState([]);
  const params = useParams();

  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [checked, setChecked] = useState(false);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...'
    }),
    [placeholder]
  );

  const onSubmit = async (data) => {
    data.description = content;
    data.free_preview = checked ? 'yes' : 'no'; // Mengonversi nilai boolean ke string API backend
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/lessons/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.status === 200) { // Perbaikan bug '=' menjadi '==='
        toast.success(result.message || 'Lesson updated successfully!');
      } else {
        toast.error(result.message || 'Failed to update lesson');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const loadInitialData = async () => {
    try {
      // 1. Ambil data Bab (Chapters)
      const resChapters = await fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const resultChapters = await resChapters.json();
      if (resultChapters.status === 200) { // Perbaikan bug '=' menjadi '==='
        setChapters(resultChapters.data || []);
      }

      // 2. Ambil data detail Pelajaran (Lesson)
      const resLesson = await fetch(`${apiUrl}/lessons/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const resultLesson = await resLesson.json();
      if (resultLesson.status === 200) { // Perbaikan bug '=' menjadi '==='
        setLesson(resultLesson.data);
        reset({
          lesson: resultLesson.data.title,
          chapter_id: resultLesson.data.chapter_id,
          status: resultLesson.data.status,
          duration: resultLesson.data.duration,
        });
        setContent(resultLesson.data.description || '');
        setChecked(resultLesson.data.is_free_preview === "yes");
      }
    } catch (error) {
      console.error("Error loading lesson setup data:", error);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [params.id, params.courseId]);

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb Kontrol */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item"><Link to="/account" className="text-decoration-none text-muted">Account</Link></li>
              <li className="breadcrumb-item"><Link to={`/account/courses/edit/${params.courseId}`} className="text-decoration-none text-muted">Edit Course</Link></li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Edit Lesson</li>
            </ol>
          </nav>

          <div className='row g-4'>
            {/* Header Informasi Utama */}
            <div className='col-12 mb-2'>
              <div className='d-flex align-items-center justify-content-between flex-wrap gap-3'>
                <div>
                  <h2 className='fw-bold text-dark h3 mb-1'>Edit Lesson</h2>
                  <p className='text-muted small m-0'>Update lecture text information, configure duration, settings and video stream sources</p>
                </div>
                <Link className='btn btn-white border border-light-subtle bg-white text-dark fw-semibold px-4 shadow-sm' to={`/account/courses/edit/${params.courseId}`}>
                  Back to Course
                </Link>
              </div>
            </div>

            {/* Sidebar Komponen Kiri */}
            <div className='col-lg-3 account-sidebar'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar />
              </div>
            </div>

            {/* Area Workspace Pengeditan Kanan */}
            <div className='col-lg-9'>
              <div className='row g-4'>
                {/* Panel Form Input Kiri */}
                <div className='col-md-8'>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-sm rounded-4 bg-white">
                      <div className="card-body p-4 p-md-5">
                        <h4 className='fw-bold text-dark h5 mb-4 pb-2 border-bottom border-light-subtle'>Basic Information</h4>

                        {/* Title Field */}
                        <div className='mb-3.5'>
                          <label htmlFor="lesson" className='form-label fw-semibold small text-secondary'>Lecture Title</label>
                          <input
                            type="text"
                            id="lesson"
                            {...register('lesson', { required: "The title field is required." })}
                            className={`form-control form-control-lg fs-6 ${errors.lesson && 'is-invalid'}`}
                            placeholder='e.g. Introduction to Global State'
                          />
                          {errors.lesson && <div className='invalid-feedback'>{errors.lesson.message}</div>}
                        </div>

                        {/* Chapter Selection Field */}
                        <div className='mb-3.5'>
                          <label htmlFor="chapter_id" className='form-label fw-semibold small text-secondary'>Target Chapter</label>
                          <select
                            id="chapter_id"
                            {...register('chapter_id', { required: "Please select a chapter." })}
                            className={`form-select form-select-lg fs-6 ${errors.chapter_id && 'is-invalid'}`}
                          >
                            <option value="">Select a Chapter</option>
                            {chapters && chapters.map(chapter => (
                              <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                            ))}
                          </select>
                          {errors.chapter_id && <div className='invalid-feedback'>{errors.chapter_id.message}</div>}
                        </div>

                        {/* Duration & Status Multi-Row */}
                        <div className="row g-3 mb-3.5">
                          <div className='col-sm-6'>
                            <label htmlFor="duration" className='form-label fw-semibold small text-secondary'>Duration (Minutes)</label>
                            <input
                              type="number"
                              id="duration"
                              {...register('duration', { required: "The duration field is required." })}
                              className={`form-control form-control-lg fs-6 ${errors.duration && 'is-invalid'}`}
                              placeholder='e.g. 15'
                            />
                            {errors.duration && <div className='invalid-feedback'>{errors.duration.message}</div>}
                          </div>

                          <div className='col-sm-6'>
                            <label htmlFor="status" className='form-label fw-semibold small text-secondary'>Status Visibility</label>
                            <select
                              id="status"
                              {...register('status', { required: "The status field is required." })}
                              className='form-select form-select-lg fs-6'
                            >
                              <option value="1">Active</option>
                              <option value="0">Block</option>
                            </select>
                          </div>
                        </div>

                        {/* Rich Text Editor Field */}
                        <div className='mb-4'>
                          <label className='form-label fw-semibold small text-secondary'>Lecture Article Description</label>
                          <div className="rounded-3 overflow-hidden border border-light-subtle">
                            <JoditEditor
                              ref={editor}
                              value={content}
                              config={config}
                              tabIndex={1}
                              onBlur={newContent => setContent(newContent)}
                            />
                          </div>
                        </div>

                        {/* Interactive Checkbox Control Row */}
                        <div className='mb-4.5 pt-1'>
                          <div className='form-check d-flex align-items-center m-0'>
                            <input
                              checked={checked}
                              onChange={(e) => setChecked(e.target.checked)}
                              className='form-check-input mt-0 cursor-pointer shadow-none'
                              type="checkbox"
                              id='freeLesson'
                            />
                            <label className='form-check-label text-dark fw-medium small ms-2 cursor-pointer user-select-none' htmlFor="freeLesson">
                              Allow Free Preview Lesson (Siswa dapat menonton tanpa membeli kelas)
                            </label>
                          </div>
                        </div>

                        {/* Submit Action Control */}
                        <button
                          disabled={loading}
                          type='submit'
                          className='btn btn-primary btn-lg fs-6 fw-semibold px-4 mt-3 shadow-sm d-flex align-items-center'
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : 'Update Lesson'}
                        </button>

                      </div>
                    </div>
                  </form>
                </div>

                {/* Panel Konten Media Video Kanan */}
                <div className='col-md-4'>
                  <LessonVideo lesson={lesson} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default EditLesson