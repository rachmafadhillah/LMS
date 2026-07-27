import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../../../components/common/Layout'
import UserSidebar from '../../../components/common/UserSidebar'
import Loading from '../../../components/common/Loading'
import EmptyState from '../../../components/ui/EmptyState'
import { apiRequest } from '../../../lib/api'

const SubmitProject = () => {
  const [enrollments, setEnrollments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    course_id: '',
    project_title: '',
    repository_url: '',
    demo_url: '',
    description: '',
  })

  const fetchData = async () => {
    try {
      const [enrollmentResult, submissionResult] = await Promise.all([
        apiRequest('/enrollments'),
        apiRequest('/submissions'),
      ])

      if (enrollmentResult.status === 200) setEnrollments(enrollmentResult.data || [])
      if (submissionResult.status === 200) setSubmissions(submissionResult.data || [])
    } catch (error) {
      toast.error('Failed to load submission data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const submitProject = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const result = await apiRequest('/submissions', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      if (result.status === 201) {
        toast.success(result.message)
        setSubmissions(prev => [result.data, ...prev])
        setForm({ course_id: '', project_title: '', repository_url: '', demo_url: '', description: '' })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit project')
    } finally {
      setSaving(false)
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
              <li className='breadcrumb-item active fw-medium text-dark' aria-current='page'>Submit Project</li>
            </ol>
          </nav>

          <div className='row'>
            <div className='col-12 mb-4'>
              <h2 className='fw-bold text-dark h3 mb-1'>Submit Project</h2>
              <p className='text-muted small m-0'>Kumpulkan final project seperti submission Dicoding.</p>
            </div>

            <div className='col-lg-3 account-sidebar mb-4 mb-lg-0'>
              <div className='card border-0 shadow-sm rounded-4 p-2 bg-white'><UserSidebar /></div>
            </div>

            <div className='col-lg-9'>
              {loading ? (
                <div className='card border-0 shadow-sm rounded-4 p-5 bg-white text-center'><Loading /></div>
              ) : (
                <div className='row g-4'>
                  <div className='col-12'>
                    <div className='card border-0 shadow-sm rounded-4 bg-white'>
                      <div className='card-body p-4'>
                        <h5 className='fw-bold text-dark mb-3'>New Submission</h5>
                        {enrollments.length === 0 ? (
                          <EmptyState title='No Enrolled Course' description='Enroll course first before submitting final project.' action={<Link to='/courses' className='btn btn-primary rounded-3 fw-semibold px-4'>Browse Courses</Link>} />
                        ) : (
                          <form onSubmit={submitProject} className='row g-3'>
                            <div className='col-md-6'>
                              <label className='form-label small fw-semibold text-muted'>Course</label>
                              <select className='form-select rounded-3' value={form.course_id} onChange={(event) => updateForm('course_id', event.target.value)} required>
                                <option value=''>Choose course</option>
                                {enrollments.map(enrollment => (
                                  <option value={enrollment.course_id} key={enrollment.id}>{enrollment.course.title}</option>
                                ))}
                              </select>
                            </div>
                            <div className='col-md-6'>
                              <label className='form-label small fw-semibold text-muted'>Project Title</label>
                              <input className='form-control rounded-3' value={form.project_title} onChange={(event) => updateForm('project_title', event.target.value)} required />
                            </div>
                            <div className='col-md-6'>
                              <label className='form-label small fw-semibold text-muted'>Repository URL</label>
                              <input type='url' className='form-control rounded-3' value={form.repository_url} onChange={(event) => updateForm('repository_url', event.target.value)} placeholder='https://github.com/...' />
                            </div>
                            <div className='col-md-6'>
                              <label className='form-label small fw-semibold text-muted'>Demo URL</label>
                              <input type='url' className='form-control rounded-3' value={form.demo_url} onChange={(event) => updateForm('demo_url', event.target.value)} placeholder='https://...' />
                            </div>
                            <div className='col-12'>
                              <label className='form-label small fw-semibold text-muted'>Description</label>
                              <textarea className='form-control rounded-3' rows='4' value={form.description} onChange={(event) => updateForm('description', event.target.value)} placeholder='Jelaskan fitur project, stack, dan cara menjalankan.'></textarea>
                            </div>
                            <div className='col-12'>
                              <button className='btn btn-primary rounded-3 fw-semibold px-4' disabled={saving}>{saving ? 'Submitting...' : 'Submit Project'}</button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-12'>
                    <div className='card border-0 shadow-sm rounded-4 bg-white'>
                      <div className='card-body p-4'>
                        <h5 className='fw-bold text-dark mb-3'>My Submissions</h5>
                        {submissions.length === 0 ? (
                          <p className='text-muted small mb-0'>No project submitted yet.</p>
                        ) : (
                          <div className='d-flex flex-column gap-3'>
                            {submissions.map(submission => (
                              <div className='border rounded-4 p-3' key={submission.id}>
                                <div className='d-flex justify-content-between gap-3 flex-wrap'>
                                  <div>
                                    <h6 className='fw-bold text-dark mb-1'>{submission.project_title}</h6>
                                    <p className='text-muted small mb-2'>{submission.course?.title}</p>
                                  </div>
                                  <span className={`badge bg-${statusClass(submission.status)} bg-opacity-10 text-${statusClass(submission.status)} align-self-start text-uppercase`}>{submission.status}</span>
                                </div>
                                {submission.score !== null && <p className='small mb-1'><strong>Score:</strong> {submission.score}/100</p>}
                                {submission.feedback && <p className='small text-muted mb-0'><strong>Feedback:</strong> {submission.feedback}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
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

export default SubmitProject
