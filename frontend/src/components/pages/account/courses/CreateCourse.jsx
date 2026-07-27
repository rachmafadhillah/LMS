import React, { useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/Config'
import toast from 'react-hot-toast'

const CreateCourse = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.status === 200) {
        toast.success(result.message || 'Course initialization successful!');
        navigate('/account/courses/edit/' + result.data.id);
      } else {
        toast.error(result.message || 'Failed to create course');
      }
    } catch (error) {
      toast.error('Something went wrong. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb Minimalis */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item">
                <Link to="/account" className="text-decoration-none text-muted">Account</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/account/my-courses" className="text-decoration-none text-muted">My Courses</Link>
              </li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Create Course</li>
            </ol>
          </nav>

          <div className='row g-4'>
            {/* Judul Halaman */}
            <div className='col-12 mb-2'>
              <h2 className='fw-bold text-dark h3 mb-1'>Create New Course</h2>
              <p className='text-muted small m-0'>Start by entering the title. You can add curriculum and pricing details in the next step.</p>
            </div>
            
            {/* Sidebar Kolom Kiri */}
            <div className='col-lg-3 account-sidebar'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar />
              </div>
            </div>
            
            {/* Konten Utama Kolom Kanan */}
            <div className='col-lg-9'>
              <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden'>
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Input Field Title */}
                    <div className='mb-4'>
                      <label className='form-label fw-semibold small text-secondary' htmlFor="title">
                        Course Title
                      </label>
                      <input 
                        type="text"
                        id="title"
                        {...register('title', {
                          required: "The title field is required."
                        })}
                        className={`form-control form-control-lg fs-6 ${errors.title && "is-invalid"}`}
                        placeholder='e.g. Complete Web Development Bootcamp' 
                      />
                      {errors.title && <div className='invalid-feedback'>{errors.title.message}</div>}
                    </div>

                    {/* Tombol Aksi Bawah */}
                    <div className="d-flex align-items-center gap-2 pt-3 border-top mt-4">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className='btn btn-primary btn-lg fs-6 fw-semibold px-4 py-2.5 shadow-sm d-flex align-items-center'
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating...
                          </>
                        ) : 'Continue'}
                      </button>
                      
                      <Link 
                        to="/account/my-courses" 
                        className='btn btn-light btn-lg fs-6 fw-semibold px-4 py-2.5 text-secondary text-decoration-none border border-light-subtle bg-white hover-bg-light'
                      >
                        Cancel
                      </Link>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default CreateCourse