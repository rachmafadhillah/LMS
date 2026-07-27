import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import UserSidebar from '../../common/UserSidebar'
import EditCourse from '../../common/EditCourse'
import Loading from '../../common/Loading'
import { apiUrl, token } from '../../common/Config'
import toast from 'react-hot-toast'

const MyCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/my-courses`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const result = await response.json()
      
      if (result.status === 200) {
        setCourses(result.courses || [])
      } else {
        toast.error('Failed to load courses data')
      }
    } catch (error) {
      toast.error('Network error. Failed to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`${apiUrl}/courses/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        })
        const result = await response.json()
        
        if (result.status === 200) {
          toast.success(result.message || 'Course deleted successfully')
          const newCourses = courses.filter(course => course.id !== id)
          setCourses(newCourses)
        } else {
          toast.error(result.message || 'Failed to delete course')
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb minimalis agar konsisten */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item">
                <Link to="/account" className="text-decoration-none text-muted">Account</Link>
              </li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">My Courses</li>
            </ol>
          </nav>

          <div className='row'>
            {/* Judul & Tombol Aksi Utama */}
            <div className='col-12 mb-4'>
              <div className='d-flex align-items-center justify-content-between flex-wrap gap-3'>
                <div>
                  <h2 className='fw-bold text-dark h3 mb-1'>My Courses</h2>
                  <p className='text-muted small m-0'>Manage, edit, and publish your teaching programs</p>
                </div>
                <Link to="/account/courses/create" className='btn btn-primary px-4 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>
                  Create Course
                </Link>
              </div>
            </div>
            
            {/* Sidebar Kolom Kiri */}
            <div className='col-lg-3 account-sidebar mb-4 mb-lg-0'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar />
              </div>
            </div>
            
            {/* Konten Utama Kolom Kanan */}
            <div className='col-lg-9'>
              {loading ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <Loading />
                </div>
              ) : courses && courses.length > 0 ? (
                <div className='row g-4'>
                  {courses.map(course => (
                    <div className="col-md-6 col-xl-4" key={course.id}>
                      <EditCourse
                        course={course}
                        deleteCourse={deleteCourse}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Tampilan ketika instruktur belum membuat kelas (Empty State) */
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <div className="py-5">
                    <div className="p-4 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-block mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" viewBox="0 0 16 16"><path d="M12 11.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M1.375 2.25a.75.75 0 0 0 0 1.5h1.365l1.222 5.5A1.5 1.5 0 0 0 5.42 10.5h7.16a1.5 1.5 0 0 0 1.458-1.166l1.205-5.423A.25.25 0 0 0 15 3.615H3.615l-.271-1.217A.75.75 0 0 0 2.62 1.8zM2.68 4.115h11.83l-.865 3.897H5.216zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">No Courses Created</h5>
                    <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '340px' }}>
                      You haven't added any courses to your portfolio yet. Click the button below to publish your first program.
                    </p>
                    <Link to="/account/courses/create" className="btn btn-primary px-4 py-2 fw-semibold rounded-3 shadow-sm">
                      Create Your First Course
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyCourses