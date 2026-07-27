import React from 'react'
import { Link } from 'react-router-dom'

const Course = ({ course, customClasses }) => {
  // Fallback pengaman untuk mendeteksi string kosong atau null pada url gambar
  const hasImage = course.course_small_image && course.course_small_image !== "";
  const imageUrl = hasImage 
    ? course.course_small_image 
    : `https://placehold.co/600x380?text=${encodeURIComponent(course.title)}`;

  return (
    <div className={customClasses}>
      <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100 d-flex flex-column position-relative'>
        
        {/* Container Cover Gambar Kursus */}
        <div className='position-relative bg-light' style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
          <img 
            src={imageUrl} 
            alt={course.title} 
            className='w-100 h-100 object-fit-cover'
          />
          {/* Lencana Level Kelas Melayang di Kiri Atas */}
          {course.level?.name && (
            <span className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-white fw-medium px-2.5 py-1.5 rounded-2 small text-uppercase tracking-wider">
              {course.level.name}
            </span>
          )}
        </div>

        {/* Konten Utama Informasi Kursus */}
        <div className='card-body px-4 d-flex flex-column flex-grow-1'>
          <h5 className="card-title fw-bold text-dark lh-base mb-2 text-line-clamp-2">
            {course.title}
          </h5>
          
          {/* Baris Meta Statistik */}
          <div className="d-flex align-items-center gap-3 mt-auto mb-3 text-muted small">
            {/* Jumlah Siswa Terdaftar */}
            <div className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-secondary opacity-75" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
              </svg>
              <span className="ms-1 fw-medium">{course.enrollments_count || 0} Students</span>
            </div>

            {/* Skor Rating Bintang */}
            {course.rating && (
              <div className="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#ffc107" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <span className="ms-1 fw-bold text-dark">{Number(course.rating).toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Area: Harga & Navigasi */}
        <div className="card-footer bg-transparent border-top border-light px-4 py-3">
          <div className="d-flex justify-content-between align-items-center gap-2">
            
            {/* Blok Informasi Harga */}
            <div className="fs-5 fw-bold text-success">
              {course.price && course.price > 0 ? (
                `$${course.price}`
              ) : (
                <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1 fs-7 rounded-2">Free</span>
              )}
            </div>

            {/* Tombol Aksi Utama */}
            <div className="add-to-cart">
              <Link 
                to={`/detail/${course.id}`} 
                className="btn btn-primary btn-sm px-3 py-2 fw-semibold rounded-3 shadow-sm"
              >
                Read More
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Course