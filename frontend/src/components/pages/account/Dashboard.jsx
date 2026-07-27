import React from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb yang lebih rapi */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item">
                <Link to="/account" className="text-decoration-none text-muted">Account</Link>
              </li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Dashboard</li>
            </ol>
          </nav>

          <div className='row'>
            {/* Judul Dashboard */}
            <div className='col-12 mb-4'>
              <h2 className='fw-bold text-dark h3 mb-1'>Dashboard</h2>
              <p className='text-muted small m-0'>Overview of your learning and platform performance</p>
            </div>
            
            {/* Sidebar Kolom Kiri */}
            <div className='col-lg-3 account-sidebar mb-4 mb-lg-0'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar/>
              </div>
            </div>
            
            {/* Konten Utama Kolom Kanan */}
            <div className='col-lg-9'>
              <div className='row g-4'>
                
                {/* Kartu 1: Sales */}
                <div className='col-md-4'>
                  <div className='card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden'>
                    <div className='card-body p-4 d-flex align-items-center justify-content-between'>
                      <div>
                        <span className='text-muted small fw-medium text-uppercase tracking-wider'>Sales</span>
                        <h2 className='fw-bold text-dark display-6 mt-1 mb-0'>0</h2>
                      </div>
                      <div className='p-3 bg-primary bg-opacity-10 text-primary rounded-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>
                      </div>
                    </div>
                    <div className='card-footer bg-transparent border-0 px-4 pb-4 pt-0'>
                      <span className='text-muted small'>No transaction updates</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 2: Enrolled Users */}
                <div className='col-md-4'>
                  <div className='card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden'>
                    <div className='card-body p-4 d-flex align-items-center justify-content-between'>
                      <div>
                        <span className='text-muted small fw-medium text-uppercase tracking-wider'>Enrolled Users</span>
                        <h2 className='fw-bold text-dark display-6 mt-1 mb-0'>0</h2>
                      </div>
                      <div className='p-3 bg-success bg-opacity-10 text-success rounded-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 12.5c0-1.343.887-2.523 2.354-3.152C5.164 9.354 4 10.749 4 13s1 1 1 1zM6.5 7a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/></svg>
                      </div>
                    </div>
                    <div className='card-footer bg-transparent border-0 px-4 pb-4 pt-0'>
                      <span className='text-muted small'>Students registered</span>
                    </div>
                  </div>
                </div>

                {/* Kartu 3: Active Courses */}
                <div className='col-md-4'>
                  <div className='card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden'>
                    <div className='card-body p-4 d-flex align-items-center justify-content-between'>
                      <div>
                        <span className='text-muted small fw-medium text-uppercase tracking-wider'>Active Courses</span>
                        <h2 className='fw-bold text-dark display-6 mt-1 mb-0'>0</h2>
                      </div>
                      <div className='p-3 bg-warning bg-opacity-10 text-warning rounded-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M9.283 4.002H1.717c-.482 0-.874.404-.874.903v6.196c0 .499.392.903.874.903h7.566c.483 0 .874-.404.874-.903V4.905c0-.499-.391-.903-.874-.903M1.857 5.003h7.286v6.002H1.857z"/><path d="M11.947 4.542a.25.25 0 0 0-.284.053l-1.908 1.908A.5.5 0 0 0 9.5 6.854v3.292a.5.5 0 0 0 .255.433l1.908 1.09a.25.25 0 0 0 .384-.216V4.82a.25.25 0 0 0-.1-.278z"/></svg>
                      </div>
                    </div>
                    <div className='card-footer bg-transparent border-0 px-4 pb-4 pt-0'>
                      <Link to="/admin/orders" className="text-primary text-decoration-none small fw-semibold d-flex align-items-center">
                        View Courses 
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="ms-1" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/></svg>
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Dashboard