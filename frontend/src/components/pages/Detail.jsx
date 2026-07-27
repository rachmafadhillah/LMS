import React, { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { Rating } from 'react-simple-star-rating'
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiUrl, convertMinutesToHours, token } from '../common/Config'
import { LuMonitorPlay } from "react-icons/lu";
import Loading from '../common/Loading'
import FreePreview from '../common/FreePreview';
import toast from 'react-hot-toast';

const Detail = () => {
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const [freeLesson, setFreeLesson] = useState(null)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const params = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (lesson) => {
    setShow(true);
    setFreeLesson(lesson)
  }

  const fetchCourse = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/fetch-course/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        }
      })
      const result = await response.json()
      if (result.status === 200) {
        setCourse(result.data)
      } else {
        toast.error("Failed to load course details")
      }
    } catch (error) {
      console.error(error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const enrollCourse = async () => {
    if (!token) {
      toast.error("Please login to enroll in this course")
      navigate('/account/login')
      return
    }

    setIsEnrolling(true)
    try {
      const response = await fetch(`${apiUrl}/enroll-course`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: course.id })
      })
      
      const result = await response.json()
      
      if (response.status === 200) {
        toast.success(result.message || "Enrolled successfully!")
        navigate('/account/my-learning')
      } else {
        toast.error(result.message || "Enrollment failed")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsEnrolling(false)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  return (
    <Layout>
      {freeLesson && (
        <FreePreview
          show={show}
          handleClose={handleClose}
          freeLesson={freeLesson}
        />
      )}
      
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        {loading ? (
          <div className='container text-center py-5 my-5'>
            <Loading />
          </div>
        ) : course ? (
          <div className='container pb-5 pt-2'>
            {/* Breadcrumb minimalis */}
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb small bg-transparent p-0 m-0">
                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/courses" className="text-decoration-none text-muted">Courses</Link></li>
                <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">{course.title}</li>
              </ol>
            </nav>

            <div className='row g-4'>
              {/* KOLOM KIRI: Detail Utama Materi */}
              <div className='col-lg-8'>
                <h1 className='fw-bold text-dark display-6 mb-3'>{course.title}</h1>
                
                {/* Baris Kategori & Rating */}
                <div className='d-flex align-items-center flex-wrap gap-3 mb-4'>
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-2 text-uppercase tracking-wider small fw-semibold">
                    {course.category?.name}
                  </span>
                  <div className='d-flex align-items-center border-start ps-3 border-light-subtle'>
                    <span className="fw-bold text-dark fs-6 me-2 pt-0.5">{Number(course.rating || 0).toFixed(1)}</span>
                    <Rating readonly initialValue={Number(course.rating || 0)} size={18} />
                  </div>
                </div>

                {/* Grid Sekilas Metadata Khusus */}
                <div className="row bg-white rounded-4 shadow-sm p-3 mx-0 mb-4 text-center text-sm-start border border-light-subtle">
                  <div className="col-6 col-sm-4 py-2">
                    <span className="text-muted d-block small text-uppercase tracking-wide mb-1">Level</span>
                    <span className="fw-bold text-dark">{course.level?.name || 'All Levels'}</span>
                  </div>
                  <div className="col-6 col-sm-4 py-2 border-sm-start">
                    <span className="text-muted d-block small text-uppercase tracking-wide mb-1">Students Joined</span>
                    <span className="fw-bold text-dark">{course.enrollments_count || 0} Learners</span>
                  </div>
                  <div className="col-6 col-sm-4 py-2 border-sm-start mt-2 mt-sm-0">
                    <span className="text-muted d-block small text-uppercase tracking-wide mb-1">Language</span>
                    <span className="fw-bold text-dark">{course.language?.name || 'English'}</span>
                  </div>
                </div>

                {/* Konten Kotak: Deskripsi/Overview */}
                <div className='card border-0 shadow-sm rounded-4 bg-white mb-4'>
                  <div className='card-body p-4 p-md-5'>
                    <h3 className='fw-bold text-dark h4 mb-3'>Overview</h3>
                    <div className="text-secondary lh-base fs-6" style={{ whiteSpace: 'pre-line' }}>
                      {course.description}
                    </div>
                  </div>
                </div>

                {/* Konten Kotak: Capaian Pembelajaran */}
                {course.outcomes && course.outcomes.length > 0 && (
                  <div className='card border-0 shadow-sm rounded-4 bg-white mb-4'>
                    <div className='card-body p-4 p-md-5'>
                      <h3 className='fw-bold text-dark h4 mb-3'>What you will learn</h3>
                      <div className="row g-2 mt-2">
                        {course.outcomes.map((outcome, idx) => (
                          <div key={idx} className="col-md-6 d-flex align-items-start gap-2.5 py-1">
                            <span className="text-success fw-bold fs-5 lh-1">✓</span>
                            <span className="text-secondary small-medium ms-2">{outcome.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Konten Kotak: Prasyarat */}
                {course.requirements && course.requirements.length > 0 && (
                  <div className='card border-0 shadow-sm rounded-4 bg-white mb-4'>
                    <div className='card-body p-4 p-md-5'>
                      <h3 className='fw-bold text-dark h4 mb-3'>Requirements</h3>
                      <div className="d-flex flex-column gap-2 mt-2">
                        {course.requirements.map((req, idx) => (
                          <div key={idx} className="d-flex align-items-start gap-2.5 py-0.5">
                            <span className="text-primary fw-bold fs-5 lh-1">•</span>
                            <span className="text-secondary small-medium ms-2">{req.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Konten Kotak: Struktur Kurikulum Pelajaran */}
                <div className='card border-0 shadow-sm rounded-4 bg-white mb-4'>
                  <div className='card-body p-4 p-md-5'>
                    <h3 className="fw-bold text-dark h4 mb-2">Course Structure</h3>
                    <p className="text-muted small mb-4">
                      {course.chapters_count || 0} Chapters • {course.total_lessons || 0} Lectures • {convertMinutesToHours(course.total_duration || 0)} Total Hours
                    </p>
                    
                    <Accordion defaultActiveKey="0" className="custom-accordion border rounded-3 overflow-hidden">
                      {course.chapters && course.chapters.map((chapter, index) => (
                        <Accordion.Item eventKey={String(index)} key={index} className="border-bottom border-light-subtle">
                          <Accordion.Header>
                            <div className="d-flex flex-column flex-sm-row align-items-sm-center w-100 gap-1 gap-sm-2 pe-3">
                              <span className="fw-bold text-dark fs-6">{chapter.title}</span>
                              <span className="text-muted small ms-sm-auto">
                                ({chapter.lessons_count || 0} lectures • {convertMinutesToHours(chapter.lessons_sum_duration || 0)})
                              </span>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body className="p-0 bg-light bg-opacity-25">
                            <ListGroup variant="flush">
                              {chapter.lessons && chapter.lessons.map((lesson, lIdx) => (
                                <ListGroup.Item key={lIdx} className="bg-transparent py-3 px-4 border-light-subtle">
                                  <div className='row align-items-center g-2'>
                                    <div className='col-8 col-sm-9 d-flex align-items-center gap-2 text-dark fs-6 fw-medium'>
                                      <LuMonitorPlay className='text-primary flex-shrink-0' size={18} />
                                      <span className="text-truncate">{lesson.title}</span>
                                    </div>
                                    <div className='col-4 col-sm-3 d-flex justify-content-end align-items-center gap-2'>
                                      {lesson.is_free_preview === 'yes' && (
                                        <Badge bg="primary" className="bg-primary px-2.5 py-1.5 rounded-2 shadow-sm cursor-pointer">
                                          <Link onClick={() => handleShow(lesson)} className="text-white text-decoration-none small fw-semibold">Preview</Link>
                                        </Badge>
                                      )}
                                      <span className="text-muted small ms-1 text-nowrap">{convertMinutesToHours(lesson.duration)}</span>
                                    </div>
                                  </div>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                </div>

                {/* Konten Kotak: Ulasan Kelas */}
                {course.reviews && course.reviews.length > 0 && (
                  <div className='card border-0 shadow-sm rounded-4 bg-white mb-4'>
                    <div className='card-body p-4 p-md-5'>
                      <h3 className='fw-bold text-dark h4 mb-1'>Reviews</h3>
                      <p className="text-muted small">What our learners say about this course</p>
                      
                      <div className='mt-4 d-flex flex-column gap-3'>
                        {course.reviews.map(review => (
                          <div key={review.id} className="d-flex flex-column align-items-start pb-4 border-bottom border-light-subtle last-border-0">
                            <div className="d-flex align-items-center gap-2 mb-1 w-100">
                              <h6 className="fw-bold text-dark mb-0 fs-6">{review.user?.name}</h6>
                              <span className="text-muted small ms-auto">{review.created_at}</span>
                            </div>
                            <div className="mb-2.5">
                              <Rating readonly initialValue={Number(review.rating)} size={15} />
                            </div>
                            <p className="text-secondary small-medium m-0 lh-base">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* KOLOM KANAN: Kartu Aksi Transaksi Beli/Daftar */}
              <div className='col-lg-4'>
                <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden sticky-lg-top' style={{ top: '90px', zIndex: '10' }}>
                  <div className="position-relative" style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                    <img 
                      src={course.course_small_image || `https://placehold.co/600x380?text=${encodeURIComponent(course.title)}`} 
                      className="w-100 h-100 object-fit-cover" 
                      alt={course.title}
                    />
                  </div>
                  <div className='card-body p-4'>
                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <h2 className="fw-black text-dark display-6 mb-0">${course.price}</h2>
                      {course.cross_price && (
                        <span className="text-muted text-decoration-line-through small fs-6">${course.cross_price}</span>
                      )}
                    </div>

                    <button 
                      onClick={enrollCourse} 
                      className="btn btn-primary btn-lg w-100 fw-semibold rounded-3 py-2.5 shadow-sm mt-2"
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-plus me-2 mb-0.5" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/><path d="M8 4a.5.5 0 0 1 .5.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2A.5.5 0 0 1 8 4"/></svg>
                          Enroll Now
                        </>
                      )}
                    </button>

                    <div className="mt-4 pt-3 border-top border-light-subtle">
                      <h6 className="fw-bold text-dark small text-uppercase tracking-wider mb-3">This course includes:</h6>
                      <ListGroup variant="flush" className="small-medium text-secondary">
                        <ListGroup.Item className='bg-transparent px-0 py-2 d-flex align-items-center border-0'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-primary me-2" viewBox="0 0 16 16"><path d="M11 2a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM0 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
                          Full lifetime access
                        </ListGroup.Item>
                        <ListGroup.Item className='bg-transparent px-0 py-2 d-flex align-items-center border-0'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-primary me-2" viewBox="0 0 16 16"><path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 13.5 1M3 2.5h10a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5m4.354 3.146a.5.5 0 0 0-.708.708L8.293 8 6.646 9.646a.5.5 0 1 0 .708.708L9 8.707l1.646 1.647a.5.5 0 0 0 .708-.708L9.707 8l1.647-1.646a.5.5 0 0 0-.708-.708L9 7.293z"/></svg>
                          Access on mobile and TV
                        </ListGroup.Item>
                        <ListGroup.Item className='bg-transparent px-0 py-2 d-flex align-items-center border-0'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-primary me-2" viewBox="0 0 16 16"><path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/><path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z.5 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/></svg>
                          Certificate of completion
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='container text-center py-5 my-5 text-muted small'>
            Course data could not be found.
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Detail