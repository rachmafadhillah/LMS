import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../../../components/common/Layout'
import UserSidebar from '../../../components/common/UserSidebar'
import Loading from '../../../components/common/Loading'
import EmptyState from '../../../components/ui/EmptyState'
import { apiRequest } from '../../../lib/api'

const InstructorSubmissions = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewingId, setReviewingId] = useState(null)
  const [reviewForm, setReviewForm] = useState({ status: 'reviewed', score: '', feedback: '' })

  const fetchSubmissions = async () => {
    try {
      const result = await apiRequest('/instructor/submissions')
      if (result.status === 200) setSubmissions(result.data || [])
    } catch (error) {
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const startReview = (submission) => {
    setReviewingId(submission.id)
    setReviewForm({
      status: submission.status === 'submitted' ? 'reviewed' : submission.status,
      score: submission.score || '',
      feedback: submission.feedback || '',
    })
  }

  const submitReview = async (submissionId) => {
    try {
      const result = await apiRequest(`/submissions/${submissionId}/review`, {
        method: 'PUT',
        body: JSON.stringify(reviewForm),
      })

      if (result.status === 200) {
        toast.success(result.message)
        setSubmissions(prev => prev.map(item => item.id === submissionId ? result.data : item))
        setReviewingId(null)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to review submission')
    }
  }

  const statusClass = (status) => {
    if (status === 'approved') return 'success'
    if (status === 'revision') return 'warning'
    if (status === 'reviewed') return 'info'
    return 'secondary'
  }

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          <nav aria-label='breadcrumb' className='mb-4'>
            <ol className='breadcrumb small bg-transparent p-0 m-0'>
              <li className='breadcrumb-item'><Link to='/account/dashboard' className='text-decoration-none text-muted'>Account</Link></li>
              <li className='breadcrumb-item active fw-medium text-dark' aria-current='page'>Review Submissions</li>
            </ol>
          </nav>

          <div className='row'>
            <div className='col-12 mb-4'>
              <h2 className='fw-bold text-dark h3 mb-1'>Review Submissions</h2>
              <p className='text-muted small m-0'>Review final projects, score, approve, or request revision.</p>
            </div>

            <div className='col-lg-3 account-sidebar mb-4 mb-lg-0'>
              <div className='card border-0 shadow-sm rounded-4 p-2 bg-white'><UserSidebar /></div>
            </div>

            <div className='col-lg-9'>
              {loading ? (
                <div className='card border-0 shadow-sm rounded-4 p-5 bg-white text-center'><Loading /></div>
              ) : submissions.length === 0 ? (
                <EmptyState title='No Submissions Yet' description='Student final project submissions will appear here.' />
              ) : (
                <div className='d-flex flex-column gap-3'>
                  {submissions.map(submission => (
                    <div className='card border-0 shadow-sm rounded-4 bg-white' key={submission.id}>
                      <div className='card-body p-4'>
                        <div className='d-flex justify-content-between flex-wrap gap-3 mb-3'>
                          <div>
                            <h5 className='fw-bold text-dark mb-1'>{submission.project_title}</h5>
                            <p className='text-muted small mb-1'>{submission.course?.title}</p>
                            <p className='text-muted small mb-0'>Submitted by {submission.user?.name}</p>
                          </div>
                          <span className={`badge bg-${statusClass(submission.status)} bg-opacity-10 text-${statusClass(submission.status)} align-self-start text-uppercase`}>{submission.status}</span>
                        </div>

                        <p className='small text-muted'>{submission.description || 'No description provided.'}</p>
                        <div className='d-flex flex-wrap gap-2 mb-3'>
                          {submission.repository_url && <a href={submission.repository_url} target='_blank' rel='noreferrer' className='btn btn-outline-dark btn-sm rounded-3'>Repository</a>}
                          {submission.demo_url && <a href={submission.demo_url} target='_blank' rel='noreferrer' className='btn btn-outline-primary btn-sm rounded-3'>Live Demo</a>}
                        </div>

                        {reviewingId === submission.id ? (
                          <div className='border rounded-4 p-3 bg-light'>
                            <div className='row g-3'>
                              <div className='col-md-4'>
                                <label className='form-label small fw-semibold text-muted'>Status</label>
                                <select className='form-select rounded-3' value={reviewForm.status} onChange={(event) => setReviewForm(prev => ({ ...prev, status: event.target.value }))}>
                                  <option value='reviewed'>Reviewed</option>
                                  <option value='approved'>Approved</option>
                                  <option value='revision'>Revision</option>
                                </select>
                              </div>
                              <div className='col-md-4'>
                                <label className='form-label small fw-semibold text-muted'>Score</label>
                                <input type='number' min='0' max='100' className='form-control rounded-3' value={reviewForm.score} onChange={(event) => setReviewForm(prev => ({ ...prev, score: event.target.value }))} />
                              </div>
                              <div className='col-12'>
                                <label className='form-label small fw-semibold text-muted'>Feedback</label>
                                <textarea className='form-control rounded-3' rows='3' value={reviewForm.feedback} onChange={(event) => setReviewForm(prev => ({ ...prev, feedback: event.target.value }))} required></textarea>
                              </div>
                              <div className='col-12 d-flex gap-2'>
                                <button className='btn btn-primary rounded-3 fw-semibold px-4' onClick={() => submitReview(submission.id)}>Save Review</button>
                                <button className='btn btn-light rounded-3 fw-semibold px-4' onClick={() => setReviewingId(null)}>Cancel</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className='d-flex justify-content-between flex-wrap gap-2 border-top border-light pt-3'>
                            <span className='small text-muted'>{submission.score !== null ? `Score ${submission.score}/100` : 'Not scored yet'}</span>
                            <button className='btn btn-primary btn-sm rounded-3 fw-semibold px-3' onClick={() => startReview(submission)}>Review</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default InstructorSubmissions
