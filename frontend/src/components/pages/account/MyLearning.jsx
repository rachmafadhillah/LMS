import React, { useEffect, useState } from 'react'
import UserSidebar from '../../common/UserSidebar'
import CourseEnrolled from '../../common/CourseEnrolled'
import Layout from '../../common/Layout'
import Loading from '../../common/Loading'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiRequest } from '../../../lib/api'

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchEnrollments = async () => {
    setLoading(true)
    try {
      const result = await apiRequest('/enrollments')
      
      if (result.status === 200) {
        setEnrollments(result.data)
      } else {
        toast.error('Failed to load your courses')
      }
    } catch (error) {
      toast.error('Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnrollments()
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
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">My Learning</li>
            </ol>
          </nav>

          <div className='row'>
            {/* Judul Halaman */}
            <div className='col-12 mb-4'>
              <h2 className='fw-bold text-dark h3 mb-1'>My Learning</h2>
              <p className='text-muted small m-0'>Keep track of all the courses you are currently taking</p>
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
              ) : enrollments && enrollments.length > 0 ? (
                <div className='row g-4'>
                  {enrollments.map(enrollment => (
                    <div className="col-md-6 col-xl-4" key={enrollment.id}>
                      <CourseEnrolled enrollment={enrollment} />
                    </div>
                  ))}
                </div>
              ) : (
                /* Tampilan ketika siswa belum mendaftar kelas apa pun (Empty State) */
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <div className="py-4">
                    <div className="p-4 bg-primary bg-opacity-10 text-primary rounded-circle d-inline-block mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.73l1.17-.468a.5.5 0 0 0 .024-.917z"/><path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .254.574l5 2.5a.5.5 0 0 0 .452 0l5-2.5a.5.5 0 0 0 .254-.574l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.966z"/></svg>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">No Courses Enrolled Yet</h5>
                    <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '320px' }}>
                      You haven't joined any learning class yet. Explore our wide variety of courses and upgrade your skills today.
                    </p>
                    <Link to="/courses" className="btn btn-primary px-4 py-2 fw-semibold rounded-3 shadow-sm">
                      Browse All Courses
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

export default MyLearning
