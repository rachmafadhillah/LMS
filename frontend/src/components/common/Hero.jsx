import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='position-relative overflow-hidden p-5 d-flex align-items-center bg-light'>
      
      {/* Dekorasi Aksen Elemen Abstrak di Latar Belakang agar tidak sepi */}
      <div 
        className="position-absolute bg-white rounded-circle opacity-50" 
        style={{ width: '400px', height: '400px', top: '-10%', left: '-10%', filter: 'blur(80px)' }}
      />
      <div 
        className="position-absolute bg-white rounded-circle opacity-50" 
        style={{ width: '500px', height: '500px', bottom: '-20%', right: '-10%', filter: 'blur(100px)' }}
      />

      <div className='container position-relative z-1 py-5 text-center'>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            
            {/* Tagline Kecil di Atas */}
            <span className="badge bg-dark bg-opacity-10 text-dark fw-semibold px-3 py-2 rounded-pill text-uppercase tracking-wider small mb-3">
              🚀 Welcome to AkademiKita
            </span>
            
            {/* Judul Utama yang Besar dan Tipografi Bold */}
            <h1 className="display-2 fw-extrabold text-dark tracking-tight mb-3">
              Learn <span className="text-primary">Anytime</span>,<br className="d-none d-sm-block"/> Anywhere.
            </h1>
            
            {/* Sub-deskripsi Pendukung */}
            <p className="lead text-secondary mx-auto mb-5 fs-5 lh-base" style={{ maxWidth: '640px' }}>
              Join our Learning Management System and explore a wide range of courses to enhance your skills, learn from experts, and achieve your goals.
            </p>
            
            {/* Kelompok Tombol Aksi Utama */}
            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
              <a 
                href="#courses" 
                className="btn btn-primary btn-lg px-4 py-3 fw-semibold rounded-3 shadow-sm transition-all"
              >
                Explore Courses
              </a>
              <Link 
                to="/account/register" 
                className="btn btn-white btn-lg px-4 py-3 fw-semibold rounded-3 shadow-sm border border-light text-dark bg-white transition-all"
              >
                Get Started Free
              </Link>
            </div>

          </div>
        </div>            
      </div>
    </section>
  )
}

export default Hero