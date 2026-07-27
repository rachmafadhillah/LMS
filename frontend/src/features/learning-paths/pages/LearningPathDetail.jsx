import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../../../components/common/Layout'
import Course from '../../../components/common/Course'
import Loading from '../../../components/common/Loading'
import EmptyState from '../../../components/ui/EmptyState'
import { apiRequest } from '../../../lib/api'

const LearningPathDetail = () => {
  const { slug } = useParams()
  const [path, setPath] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const result = await apiRequest(`/learning-paths/${slug}`)
        if (result.status === 200) {
          setPath(result.data)
        }
      } catch (error) {
        setPath(null)
      } finally {
        setLoading(false)
      }
    }

    fetchPath()
  }, [slug])

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          <nav aria-label='breadcrumb' className='mb-4'>
            <ol className='breadcrumb small bg-transparent p-0 m-0'>
              <li className='breadcrumb-item'><Link to='/' className='text-decoration-none text-muted'>Home</Link></li>
              <li className='breadcrumb-item'><Link to='/learning-paths' className='text-decoration-none text-muted'>Learning Paths</Link></li>
              <li className='breadcrumb-item active fw-medium text-dark' aria-current='page'>{path?.title || 'Detail'}</li>
            </ol>
          </nav>

          {loading ? (
            <div className='card border-0 shadow-sm rounded-4 p-5 bg-white text-center'><Loading /></div>
          ) : path ? (
            <>
              <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden mb-4'>
                <div className='card-body p-4 p-lg-5'>
                  <span className='badge bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill px-3 py-2 mb-3'>{path.career_goal}</span>
                  <h1 className='fw-bold text-dark h2 mb-2'>{path.title}</h1>
                  <p className='text-muted mb-4' style={{ maxWidth: '760px' }}>{path.description}</p>
                  <div className='d-flex flex-wrap gap-3'>
                    <span className='badge bg-light text-dark border px-3 py-2'>{path.estimated_hours} learning hours</span>
                    <span className='badge bg-light text-dark border px-3 py-2'>{path.courses?.length || 0} courses</span>
                  </div>
                </div>
              </div>

              <div className='row g-4'>
                {(path.courses || []).map((course, index) => (
                  <div className='col-12' key={course.id}>
                    <div className='d-flex align-items-stretch gap-3'>
                      <div className='d-none d-md-flex align-items-center justify-content-center bg-primary text-white fw-bold rounded-circle flex-shrink-0' style={{ width: '44px', height: '44px' }}>
                        {index + 1}
                      </div>
                      <Course course={course} customClasses='flex-grow-1' />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title='Learning Path Not Found' description='The requested roadmap is unavailable or inactive.' action={<Link to='/learning-paths' className='btn btn-primary rounded-3 fw-semibold px-4'>Back to Paths</Link>} />
          )}
        </div>
      </div>
    </Layout>
  )
}

export default LearningPathDetail
