import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import Loading from '../../common/Loading'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { apiRequest } from '../../../lib/api'

const Dashboard = () => {
  const [continueLearning, setContinueLearning] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchContinueLearning = async () => {
    setLoading(true)
    try {
      const result = await apiRequest('/continue-learning')

      if (result.status === 200) {
        setContinueLearning(result.data)
      } else {
        toast.error('Failed to load your learning progress')
      }
    } catch (error) {
      toast.error('Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContinueLearning()
  }, [])

  const progress = continueLearning?.progress || 0

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item">
                <Link to="/account" className="text-decoration-none text-muted">Account</Link>
              </li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Dashboard</li>
            </ol>
          </nav>

          <div className='row'>
            <div className='col-12 mb-4'>
              <h2 className='fw-bold text-dark h3 mb-1'>Dashboard</h2>
              <p className='text-muted small m-0'>Overview of your learning and platform performance</p>
            </div>
            
            <div className='col-lg-3 account-sidebar mb-4 mb-lg-0'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar/>
              </div>
            </div>
            
            <div className='col-lg-9'>
              {loading ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <Loading />
                </div>
              ) : continueLearning ? (
                <div className='row g-4'>
                  <div className='col-12'>
                    <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden'>
                      <div className='card-body p-4 p-lg-5'>
                        <div className='d-flex flex-column flex-md-row justify-content-between gap-4'>
                          <div className='flex-grow-1'>
                            <span className='badge bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill px-3 py-2 mb-3'>Continue Learning</span>
                            <h3 className='fw-bold text-dark h4 mb-2'>{continueLearning.course.title}</h3>
                            <p className='text-muted small mb-3'>
                              {continueLearning.lesson ? `Last watched: ${continueLearning.lesson.title}` : 'Start your first lesson in this course.'}
                            </p>

                            <div className="mb-3" style={{ maxWidth: '520px' }}>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-muted small fw-medium">Course Progress</span>
                                <span className="text-dark small fw-bold">{progress}%</span>
                              </div>
                              <div className="progress rounded-pill bg-light" style={{ height: '10px' }}>
                                <div
                                  className="progress-bar bg-success rounded-pill"
                                  role="progressbar"
                                  style={{ width: `${progress}%` }}
                                  aria-valuenow={progress}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <div className="text-muted small mt-2">
                                {continueLearning.completed_lessons_count || 0} of {continueLearning.total_lessons_count || 0} lessons completed
                              </div>
                            </div>
                          </div>

                          <div className='d-flex align-items-md-end'>
                            <Link
                              to={`/account/watch-course/${continueLearning.course.id}`}
                              className='btn btn-primary px-4 py-2 fw-semibold rounded-3 shadow-sm text-nowrap'
                            >
                              Continue Course
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className='card border-0 shadow-sm rounded-4 h-100 bg-white'>
                      <div className='card-body p-4'>
                        <span className='text-muted small fw-medium text-uppercase'>Progress</span>
                        <h2 className='fw-bold text-dark display-6 mt-1 mb-0'>{progress}%</h2>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className='card border-0 shadow-sm rounded-4 h-100 bg-white'>
                      <div className='card-body p-4'>
                        <span className='text-muted small fw-medium text-uppercase'>Completed</span>
                        <h2 className='fw-bold text-dark display-6 mt-1 mb-0'>{continueLearning.completed_lessons_count || 0}</h2>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-4'>
                    <div className='card border-0 shadow-sm rounded-4 h-100 bg-white'>
                      <div className='card-body p-4'>
                        <span className='text-muted small fw-medium text-uppercase'>Total Lessons</span>
                        <h2 className='fw-bold text-dark display-6 mt-1 mb-0'>{continueLearning.total_lessons_count || 0}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <div className="py-4">
                    <h5 className="fw-bold text-dark mb-2">No Learning Activity Yet</h5>
                    <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '360px' }}>
                      Enroll in a course first, then your latest lesson and progress will appear here.
                    </p>
                    <Link to="/courses" className="btn btn-primary px-4 py-2 fw-semibold rounded-3 shadow-sm">
                      Browse Courses
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

export default Dashboard
