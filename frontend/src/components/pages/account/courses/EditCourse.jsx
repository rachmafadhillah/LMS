import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/Config'
import toast from 'react-hot-toast'
import ManageOutcome from './ManageOutcome'
import ManageRequirement from './ManageRequirement'
import EditCover from './EditCover'
import ManageCover from './ManageChapter'

const EditCourse = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    defaultValues: async () => {
      try {
        const response = await fetch(`${apiUrl}/courses/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        const result = await response.json();
        if (result.status === 200) {
          setCourse(result.data);
          return {
            title: result.data.title,
            category: result.data.category_id,
            level: result.data.level_id,
            language: result.data.language_id,
            description: result.data.description,
            sell_price: result.data.price,
            cross_price: result.data.cross_price,
          };
        }
      } catch (error) {
        console.error("Failed to fetch initial course data", error);
      }
      return {};
    }
  });

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/courses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.status === 200) {
        toast.success(result.message || 'Course updated successfully!');
      } else {
        const backendErrors = result.errors;
        if (backendErrors) {
          Object.keys(backendErrors).forEach(field => {
            setError(field, { message: backendErrors[field][0] })
          });
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const courseMetaData = async () => {
    try {
      const response = await fetch(`${apiUrl}/courses/meta-data`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = await response.json();
      if (result.status === 200) {
        setCategories(result.categories || [])
        setLevels(result.levels || [])
        setLanguages(result.languages || [])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const changeStatus = async (currentCourse) => {
    if (!currentCourse) return;
    const targetStatus = currentCourse.status === 1 ? 0 : 1;

    try {
      const response = await fetch(`${apiUrl}/change-course-status/${currentCourse.id}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: targetStatus })
      });
      const result = await response.json();
      if (result.status === 200) {
        toast.success(result.message);
        setCourse({ ...currentCourse, status: result.course.status });
      }
    } catch (error) {
      toast.error('Failed to change course status');
    }
  }

  useEffect(() => {
    courseMetaData();
  }, [])

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb Minimalis */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item"><Link to="/account" className="text-decoration-none text-muted">Account</Link></li>
              <li className="breadcrumb-item"><Link to="/account/my-courses" className="text-decoration-none text-muted">My Courses</Link></li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Edit Course</li>
            </ol>
          </nav>

          <div className='row g-4'>
            {/* Header Judul & Kontrol Status Atas */}
            <div className='col-12 mb-2'>
              <div className='d-flex align-items-center justify-content-between flex-wrap gap-3'>
                <div>
                  <h2 className='fw-bold text-dark h3 mb-1'>Edit Course</h2>
                  <p className='text-muted small m-0'>Modify course details, structure, curriculum and metadata pricing</p>
                </div>
                <div className="d-flex gap-2">
                  {course && (
                    course.status === 0 ? (
                      <button onClick={() => changeStatus(course)} className='btn btn-success fw-semibold shadow-sm px-3'>Publish</button>
                    ) : (
                      <button onClick={() => changeStatus(course)} className='btn btn-secondary fw-semibold shadow-sm px-3'>Unpublish</button>
                    )
                  )}
                  <Link to={'/account/my-courses'} className='btn btn-white border border-light-subtle bg-white text-dark fw-semibold px-3 shadow-sm'>Back</Link>
                </div>
              </div>
            </div>

            {/* Sidebar Kolom Kiri */}
            <div className='col-lg-3 account-sidebar'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar />
              </div>
            </div>

            {/* Area Workspace Kolom Kanan */}
            <div className='col-lg-9'>
              <div className='row g-4'>
                {/* Bagian Kiri Workspace: Form Pengisian Data Utama */}
                <div className='col-md-7 d-flex flex-column gap-4'>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-sm rounded-4 bg-white">
                      <div className="card-body p-4">
                        <h4 className='fw-bold text-dark h5 mb-4 pb-2 border-bottom border-light-subtle'>Course Details</h4>
                        
                        {/* Title Field */}
                        <div className='mb-3.5'>
                          <label className='form-label fw-semibold small text-secondary' htmlFor="title">Course Title</label>
                          <input 
                            type="text"
                            {...register('title', { required: "The title field is required." })}
                            className={`form-control form-control-lg fs-6 ${errors.title && "is-invalid"}`}
                            placeholder='e.g. Advanced React Architecture' 
                          />
                          {errors.title && <div className='invalid-feedback'>{errors.title.message}</div>}
                        </div>

                        {/* Dropdown Meta Row (Category & Level) */}
                        <div className="row g-3 mb-3.5">
                          <div className='col-sm-6'>
                            <label className='form-label fw-semibold small text-secondary' htmlFor="category">Category</label>
                            <select
                              id='category'
                              className={`form-select form-select-lg fs-6 ${errors.category && "is-invalid"}`}
                              {...register('category', { required: "The category field is required." })}
                            >
                              <option value="">Select Category</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                            {errors.category && <div className='invalid-feedback'>{errors.category.message}</div>}
                          </div>

                          <div className='col-sm-6'>
                            <label className='form-label fw-semibold small text-secondary' htmlFor="level">Level</label>
                            <select
                              id='level'
                              className={`form-select form-select-lg fs-6 ${errors.level && "is-invalid"}`}
                              {...register('level', { required: "The level field is required." })}
                            >
                              <option value="">Select Level</option>
                              {levels.map(lvl => (
                                <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                              ))}
                            </select>
                            {errors.level && <div className='invalid-feedback'>{errors.level.message}</div>}
                          </div>
                        </div>

                        {/* Language Field */}
                        <div className='mb-3.5'>
                          <label className='form-label fw-semibold small text-secondary' htmlFor="language">Language</label>
                          <select
                            id='language'
                            className={`form-select form-select-lg fs-6 ${errors.language && "is-invalid"}`}
                            {...register('language', { required: "The language field is required." })}
                          >
                            <option value="">Select Language</option>
                            {languages.map(lang => (
                              <option key={lang.id} value={lang.id}>{lang.name}</option>
                            ))}
                          </select>
                          {errors.language && <div className='invalid-feedback'>{errors.language.message}</div>}
                        </div>

                        {/* Description Field */}
                        <div className='mb-4.5'>
                          <label className='form-label fw-semibold small text-secondary' htmlFor="description">Description</label>
                          <textarea
                            id="description"
                            rows={5}
                            {...register('description')}
                            placeholder='Provide a comprehensive summary about your learning program...'
                            className='form-control fs-6'
                          />
                        </div>

                        <h4 className='fw-bold text-dark h5 mt-2 mb-4 pb-2 border-bottom border-light-subtle pt-2'>Pricing</h4>
                        
                        {/* Price Input Row */}
                        <div className="row g-3 mb-4.5">
                          <div className='col-sm-6'>
                            <label className='form-label fw-semibold small text-secondary' htmlFor="sell-price">Sell Price ($)</label>
                            <input 
                              type="text"
                              id='sell-price'
                              {...register('sell_price', { required: "The sell price field is required." })}
                              className={`form-control form-control-lg fs-6 ${errors.sell_price && "is-invalid"}`}
                              placeholder='0.00'
                            />
                            {errors.sell_price && <div className='invalid-feedback'>{errors.sell_price.message}</div>}
                          </div>

                          <div className='col-sm-6'>
                            <label className='form-label fw-semibold small text-secondary' htmlFor="cross-price">Cross Price ($)</label>
                            <input 
                              type="text"
                              id='cross-price'
                              {...register('cross_price')}
                              className='form-control form-control-lg fs-6'
                              placeholder='0.00'
                            />
                          </div>
                        </div>

                        {/* Submit Update Action */}
                        <button disabled={loading} type="submit" className='btn btn-primary btn-lg fs-6 fw-semibold mt-3 px-4 py-2.5 shadow-sm'>
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : 'Update Details'}
                        </button>

                      </div>
                    </div>
                  </form>
                  
                  {/* Komponen Manajemen Kurikulum Silabus */}
                  {course && <ManageCover course={course} params={params} />}
                </div>

                {/* Bagian Kanan Workspace: Komponen Pengelolaan Persyaratan & Cover Media */}
                <div className="col-md-5 d-flex flex-column gap-4">
                  <ManageOutcome />
                  <ManageRequirement />
                  {course && <EditCover course={course} setCourse={setCourse} />}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default EditCourse