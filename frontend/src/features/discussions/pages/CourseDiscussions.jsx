import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../../../components/common/Layout'
import Loading from '../../../components/common/Loading'
import EmptyState from '../../../components/ui/EmptyState'
import { apiRequest } from '../../../lib/api'

const CourseDiscussions = () => {
  const { id } = useParams()
  const [discussions, setDiscussions] = useState([])
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [topicForm, setTopicForm] = useState({ title: '', body: '' })
  const [replyForms, setReplyForms] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      const [courseResult, discussionResult] = await Promise.all([
        apiRequest(`/fetch-course/${id}`),
        apiRequest(`/courses/${id}/discussions`),
      ])

      if (courseResult.status === 200) setCourse(courseResult.data)
      if (discussionResult.status === 200) setDiscussions(discussionResult.data || [])
    } catch (error) {
      toast.error('Failed to load discussion')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const submitTopic = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      const result = await apiRequest(`/courses/${id}/discussions`, {
        method: 'POST',
        body: JSON.stringify(topicForm),
      })

      if (result.status === 201) {
        toast.success(result.message)
        setDiscussions(prev => [{ ...result.data, replies: [] }, ...prev])
        setTopicForm({ title: '', body: '' })
      }
    } catch (error) {
      toast.error(error.message || 'Failed to post discussion')
    } finally {
      setSaving(false)
    }
  }

  const submitReply = async (discussionId) => {
    const body = replyForms[discussionId]
    if (!body) return

    try {
      const result = await apiRequest(`/courses/${id}/discussions`, {
        method: 'POST',
        body: JSON.stringify({ parent_id: discussionId, body }),
      })

      if (result.status === 201) {
        toast.success(result.message)
        setDiscussions(prev => prev.map(topic => (
          topic.id === discussionId
            ? { ...topic, replies: [...(topic.replies || []), result.data] }
            : topic
        )))
        setReplyForms(prev => ({ ...prev, [discussionId]: '' }))
      }
    } catch (error) {
      toast.error(error.message || 'Failed to post reply')
    }
  }

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          <nav aria-label='breadcrumb' className='mb-4'>
            <ol className='breadcrumb small bg-transparent p-0 m-0'>
              <li className='breadcrumb-item'><Link to='/courses' className='text-decoration-none text-muted'>Courses</Link></li>
              <li className='breadcrumb-item'><Link to={`/detail/${id}`} className='text-decoration-none text-muted'>Detail</Link></li>
              <li className='breadcrumb-item active fw-medium text-dark' aria-current='page'>Discussion</li>
            </ol>
          </nav>

          {loading ? (
            <div className='card border-0 shadow-sm rounded-4 p-5 bg-white text-center'><Loading /></div>
          ) : (
            <div className='row g-4'>
              <div className='col-12'>
                <div className='card border-0 shadow-sm rounded-4 bg-white'>
                  <div className='card-body p-4 p-lg-5'>
                    <span className='badge bg-primary bg-opacity-10 text-primary fw-semibold rounded-pill px-3 py-2 mb-3'>Course Q&A</span>
                    <h1 className='fw-bold text-dark h3 mb-2'>{course?.title || 'Course Discussion'}</h1>
                    <p className='text-muted mb-0'>Tanya jawab seputar materi, bug project, dan final submission.</p>
                  </div>
                </div>
              </div>

              <div className='col-lg-4'>
                <div className='card border-0 shadow-sm rounded-4 bg-white sticky-top' style={{ top: '96px' }}>
                  <div className='card-body p-4'>
                    <h5 className='fw-bold text-dark mb-3'>Ask Question</h5>
                    <form onSubmit={submitTopic} className='d-flex flex-column gap-3'>
                      <input className='form-control rounded-3' placeholder='Question title' value={topicForm.title} onChange={(event) => setTopicForm(prev => ({ ...prev, title: event.target.value }))} required />
                      <textarea className='form-control rounded-3' rows='5' placeholder='Explain your question clearly...' value={topicForm.body} onChange={(event) => setTopicForm(prev => ({ ...prev, body: event.target.value }))} required></textarea>
                      <button className='btn btn-primary rounded-3 fw-semibold' disabled={saving}>{saving ? 'Posting...' : 'Post Question'}</button>
                    </form>
                    <p className='text-muted small mt-3 mb-0'>Login dan enroll course diperlukan untuk post pertanyaan.</p>
                  </div>
                </div>
              </div>

              <div className='col-lg-8'>
                {discussions.length === 0 ? (
                  <EmptyState title='No Discussion Yet' description='Be the first student to ask a question in this course.' />
                ) : (
                  <div className='d-flex flex-column gap-3'>
                    {discussions.map(topic => (
                      <div className='card border-0 shadow-sm rounded-4 bg-white' key={topic.id}>
                        <div className='card-body p-4'>
                          <div className='d-flex justify-content-between gap-3 flex-wrap mb-2'>
                            <div>
                              <h5 className='fw-bold text-dark mb-1'>{topic.title}</h5>
                              <p className='text-muted small mb-0'>Asked by {topic.user?.name}</p>
                            </div>
                            <span className='badge bg-light text-dark border align-self-start'>{topic.replies?.length || 0} replies</span>
                          </div>
                          <p className='text-muted small mb-3'>{topic.body}</p>

                          {(topic.replies || []).length > 0 && (
                            <div className='d-flex flex-column gap-2 mb-3'>
                              {topic.replies.map(reply => (
                                <div className='border rounded-4 p-3 bg-light' key={reply.id}>
                                  <p className='small mb-1'>{reply.body}</p>
                                  <span className='text-muted small'>Reply by {reply.user?.name}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className='d-flex gap-2'>
                            <input className='form-control rounded-3' placeholder='Write reply...' value={replyForms[topic.id] || ''} onChange={(event) => setReplyForms(prev => ({ ...prev, [topic.id]: event.target.value }))} />
                            <button className='btn btn-outline-primary rounded-3 fw-semibold px-3' onClick={() => submitReply(topic.id)}>Reply</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CourseDiscussions
