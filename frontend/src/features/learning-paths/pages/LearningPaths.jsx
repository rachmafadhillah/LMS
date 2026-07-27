import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../../components/common/Layout'
import Loading from '../../../components/common/Loading'
import EmptyState from '../../../components/ui/EmptyState'
import { apiRequest } from '../../../lib/api'

const LearningPaths = () => {
  const [paths, setPaths] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const result = await apiRequest('/learning-paths')
        if (result.status === 200) {
          setPaths(result.data || [])
        }
      } catch (error) {
        setPaths([])
      } finally {
        setLoading(false)
      }
    }

    fetchPaths()
  }, [])

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          <nav aria-label='breadcrumb' className='mb-4'>
            <ol className='breadcrumb small bg-transparent p-0 m-0'>
              <li className='breadcrumb-item'><Link to='/' className='text-decoration-none text-muted'>Home</Link></li>
              <li className='breadcrumb-item active fw-medium text-dark' aria-current='page'>Learning Paths</li>
            </ol>
          </nav>

          <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4'>
            <div>
              <span className='badge bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill px-3 py-2 mb-3'>Career Roadmap</span>
              <h1 className='fw-bold text-dark h2 mb-2'>Learning Paths</h1>
              <p className='text-muted mb-0' style={{ maxWidth: '680px' }}>
                Ikuti urutan belajar seperti Dicoding: dari skill dasar, project, sampai siap portofolio.
              </p>
            </div>
            <Link to='/courses' className='btn btn-outline-primary rounded-3 fw-semibold px-4'>Browse All Courses</Link>
          </div>

          {loading ? (
            <div className='card border-0 shadow-sm rounded-4 p-5 bg-white text-center'><Loading /></div>
          ) : paths.length === 0 ? (
            <EmptyState title='No Learning Path Yet' description='Learning path will appear after admin adds roadmap data.' />
          ) : (
            <div className='row g-4'>
              {paths.map(path => (
                <div className='col-md-6 col-xl-4' key={path.id}>
                  <div className='card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden'>
                    <div className='card-body p-4 d-flex flex-column h-100'>
                      <div className='d-flex justify-content-between align-items-start gap-3 mb-3'>
                        <span className='badge bg-success bg-opacity-10 text-success fw-semibold rounded-pill px-3 py-2'>{path.career_goal}</span>
                        <span className='text-muted small fw-semibold'>{path.estimated_hours}h</span>
                      </div>
                      <h5 className='fw-bold text-dark mb-2'>{path.title}</h5>
                      <p className='text-muted small flex-grow-1'>{path.description}</p>
                      <div className='d-flex justify-content-between align-items-center pt-3 border-top border-light'>
                        <span className='text-muted small'>{path.courses_count || 0} courses</span>
                        <Link to={`/learning-paths/${path.slug}`} className='btn btn-primary btn-sm rounded-3 fw-semibold px-3'>View Path</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default LearningPaths
