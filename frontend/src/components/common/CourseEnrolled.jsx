import React from 'react'
import { Link } from 'react-router-dom'

const CourseEnrolled = ({ enrollment }) => {
  // Fallback untuk mendeteksi string kosong atau gambar null
  const hasImage = enrollment.course.course_small_image && enrollment.course.course_small_image !== '';
  const imageUrl = hasImage 
    ? enrollment.course.course_small_image 
    : `https://placehold.co/600x380?text=${encodeURIComponent(enrollment.course.title)}`;

  return (
    <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100 d-flex flex-column'>
      
      {/* Container Gambar dengan Aspek Rasio Tetap */}
      <div className='position-relative bg-light' style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
        <img 
          src={imageUrl} 
          alt={enrollment.course.title} 
          className='w-100 h-100 object-fit-cover'
        />
        {/* Badge Level yang Melayang di Pojok Kiri Atas */}
        {enrollment.course.level?.name && (
          <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-white fw-medium px-2.5 py-1.5 rounded-2 small text-uppercase tracking-wider">
            {enrollment.course.level.name}
          </span>
        )}
      </div>

      {/* Konten Utama */}
      <div className='card-body px-4 d-flex flex-column flex-grow-1'>
        <h5 className="card-title fw-bold text-dark lh-base mb-2 text-line-clamp-2">
          {enrollment.course.title}
        </h5>
        
        {/* Baris Meta Statistik */}
        <div className="d-flex align-items-center gap-3 mt-auto mb-3 text-muted small">
          {/* Total Enrolled Student */}
          <div className="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-secondary opacity-75" viewBox="0 0 16 16">
              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
            </svg>
            <span className="ms-1 fw-medium">{enrollment.course.enrollments_count || 0} Students</span>
          </div>

          {/* Rating Bintang */}
          {enrollment.course.rating && (
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ffc107" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
              <span className="ms-1 fw-bold text-dark">{Number(enrollment.course.rating).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Area Tombol Aksi Bawah */}
      <div className="card-footer bg-transparent border-top border-light px-4 py-3">
        <div className="d-flex justify-content-between align-items-center gap-2">
          <Link 
            to={`/account/watch-course/${enrollment.course_id}`} 
            className="btn btn-primary btn-sm px-3 py-2 fw-semibold rounded-3 shadow-sm flex-grow-1 text-center"
          >
            Watch Now
          </Link>
          <Link 
            to={`/account/leave-rating/${enrollment.course_id}`}
            className="btn btn-link btn-sm text-secondary text-decoration-none fw-medium px-2 py-2 hover-text-primary text-nowrap"
          >
            Leave Rating
          </Link>
        </div>
      </div>

    </div>
  )
}

export default CourseEnrolled