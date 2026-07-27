import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Accordion from 'react-bootstrap/Accordion'
import { MdSlowMotionVideo } from "react-icons/md"
import { IoMdCheckmarkCircleOutline, IoMdCheckmarkCircle } from "react-icons/io"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Link, useParams } from 'react-router-dom'
import { apiUrl, token } from '../../common/Config'
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast'

const WatchCourse = () => {
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const params = useParams()

  const fetchCourse = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/enroll/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const result = await response.json()
      if (result.status === 200) {
        setCourse(result.data)
        setActiveLesson(result.activeLesson)
        setCompletedLessons(result.completedLessons || [])
        setProgress(result.progress || 0)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to load course player")
    } finally {
      setLoading(false)
    }
  }

  const showLesson = async (lesson) => {
    setActiveLesson(lesson)
    const data = {
      lesson_id: lesson.id,
      chapter_id: lesson.chapter_id,
      course_id: params.id,
    }

    try {
      await fetch(`${apiUrl}/save-activity`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.error("Error saving activity:", error)
    }
  }

  const markAsComplete = async (currentLesson) => {
    if (!currentLesson) return;
    
    const data = {
      lesson_id: currentLesson.id,
      chapter_id: currentLesson.chapter_id,
      course_id: params.id,
    }

    try {
      const response = await fetch(`${apiUrl}/mark-as-complete`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      if (result.status === 200) {
        toast.success(result.message || "Lesson completed!")
        setCompletedLessons(result.completedLessons || [])
        setProgress(result.progress || 0)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update progress")
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [params.id])

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container-fluid px-md-4 py-2'>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : course ? (
            <div className='row g-4'>
              
              {/* KOLOM KIRI: Pemutar Video & Detail Informasi */}
              <div className='col-lg-8'>
                {activeLesson ? (
                  <>
                    {/* Pembungkus Video dengan Rasio Layar Lebar Tetap */}
                    <div className='bg-dark rounded-4 overflow-hidden shadow-sm mb-4 position-relative' style={{ aspectRatio: '16/9' }}>
                      <ReactPlayer
                        width='100%'
                        height='100%'
                        controls
                        playing
                        config={{
                          file: {
                            attributes: {
                              controlsList: 'nodownload'
                            }
                          }
                        }}
                        url={activeLesson.video_url}
                      />
                    </div>

                    {/* Area Judul & Tombol Selesai */}
                    <div className='bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4'>
                      <div className='d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-3 mb-4 gap-3'>
                        <h2 className='fw-bold text-dark h3 m-0'>{activeLesson.title}</h2>
                        
                        <button 
                          onClick={() => markAsComplete(activeLesson)} 
                          className={`btn btn-lg fs-6 fw-semibold px-4 py-2 d-flex align-items-center justify-content-center gap-2 text-nowrap rounded-3 ${
                            completedLessons && completedLessons.includes(activeLesson.id) 
                              ? 'btn-success disabled opacity-75' 
                              : 'btn-primary shadow-sm'
                          }`}
                          disabled={completedLessons && completedLessons.includes(activeLesson.id)}
                        >
                          {completedLessons && completedLessons.includes(activeLesson.id) ? (
                            <>
                              Completed <IoMdCheckmarkCircle size={20} />
                            </>
                          ) : (
                            <>
                              Mark as Complete <IoMdCheckmarkCircleOutline size={20} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Deskripsi Materi */}
                      <div className='text-secondary lh-base fs-6 custom-video-description'>
                        <h5 className="fw-bold text-dark mb-3">About this lecture</h5>
                        <div dangerouslySetInnerHTML={{ __html: activeLesson.description }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                    <p className="text-muted m-0">Select a lecture from the playlist to start watching.</p>
                  </div>
                )}
              </div>

              {/* KOLOM KANAN: Daftar Putar Silabus & Progres (Sticky Sidebar) */}
              <div className='col-lg-4'>
                <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden sticky-lg-top' style={{ top: '90px', zIndex: '10' }}>
                  <div className='card-body p-4'>
                    
                    {/* Judul & Baris Informasi Progres */}
                    <div className='mb-4'>
                      <h5 className='fw-bold text-dark mb-1 text-truncate' title={course.title}>
                        {course.title}
                      </h5>
                      <div className='mt-3'>
                        <div className='d-flex justify-content-between align-items-center mb-1.5 small text-muted font-monospace mb-2'>
                          <span className="fw-medium text-dark">Course Progress</span>
                          <span className="fw-bold text-primary">{progress}%</span>
                        </div>
                        <ProgressBar now={progress} variant={progress === 100 ? "success" : "primary"} style={{ height: '6px' }} className="rounded-pill" />
                      </div>
                    </div>

                    {/* Silabus Accordion Bebas Border */}
                    <Accordion defaultActiveKey="0" flush className="custom-watch-accordion border rounded-3 overflow-hidden">
                      {course.chapters && course.chapters.map((chapter, index) => (
                        <Accordion.Item eventKey={String(chapter.id)} key={chapter.id} className="border-bottom border-light-subtle last-border-0">
                          <Accordion.Header className="small fw-semibold text-dark py-1">
                            {chapter.title}
                          </Accordion.Header>
                          <Accordion.Body className='p-0 bg-light bg-opacity-25'>
                            <div className="d-flex flex-column">
                              {chapter.lessons && chapter.lessons.map(lesson => {
                                const isCompleted = completedLessons && completedLessons.includes(lesson.id);
                                const isActive = activeLesson && activeLesson.id === lesson.id;
                                
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => showLesson(lesson)}
                                    className={`w-100 text-start border-0 py-3 px-4 d-flex align-items-start gap-3 transition-all ${
                                      isActive 
                                        ? 'bg-primary bg-opacity-10 text-primary fw-bold' 
                                        : 'bg-transparent text-secondary hover-bg-light'
                                    }`}
                                    style={{ outline: 'none' }}
                                  >
                                    <div className={`mt-0.5 flex-shrink-0 ${isCompleted ? 'text-success' : isActive ? 'text-primary' : 'text-muted opacity-50'}`}>
                                      {isCompleted ? <IoMdCheckmarkCircle size={18} /> : <MdSlowMotionVideo size={18} />}
                                    </div>
                                    <span className="small-medium lh-sm text-truncate-2">{lesson.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>

                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-5 text-muted small">
              Course player could not be initialized.
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default WatchCourse