import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { apiUrl, token } from '../../common/Config'
import Loading from '../../common/Loading'
import toast from 'react-hot-toast'

const Profile = () => {
  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm()
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/fetch-user`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const result = await response.json()
      
      if (result.status === 200) {
        setUser(result.data)
        reset({
          name: result.data.name,
          email: result.data.email
        })
      } else {
        toast.error('Failed to load profile data')
      }
    } catch (error) {
      toast.error('Network error. Failed to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${apiUrl}/update-user`, {
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
        toast.success(result.message || 'Profile updated successfully!')
      } else {
        const backendErrors = result.errors
        if (backendErrors) {
          Object.keys(backendErrors).forEach(field => {
            setError(field, { message: backendErrors[field][0] })
          })
        } else {
          toast.error(result.message || 'Update failed')
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb minimalis */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item">
                <Link to="/account" className="text-decoration-none text-muted">Account</Link>
              </li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Profile</li>
            </ol>
          </nav>

          <div className='row'>
            {/* Judul Halaman */}
            <div className='col-12 mb-4'>
              <h2 className='fw-bold text-dark h3 mb-1'>Profile Settings</h2>
              <p className='text-muted small m-0'>View and update your personal account information</p>
            </div>
            
            {/* Sidebar Kolom Kiri */}
            <div className='col-lg-3 account-sidebar mb-4 mb-lg-0'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar />
              </div>
            </div>
            
            {/* Konten Utama Form Kolom Ranan */}
            <div className='col-lg-9'>
              {loading ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <Loading />
                </div>
              ) : (
                <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden'>
                  <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      
                      {/* Name Field */}
                      <div className="mb-4">
                        <label className='form-label fw-semibold small text-secondary' htmlFor="name">Full Name</label>
                        <input 
                          type='text'
                          {...register('name', {
                            required: "The name field is required."
                          })}
                          className={`form-control form-control-lg fs-6 ${errors.name && 'is-invalid'}`}
                          placeholder='Your Name' 
                        />
                        {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                      </div>

                      {/* Email Field */}
                      <div className="mb-4">
                        <label className='form-label fw-semibold small text-secondary' htmlFor="email">Email Address</label>
                        <input 
                          type='text'
                          {...register('email', {
                            required: "The email field is required.",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })}
                          className={`form-control form-control-lg fs-6 ${errors.email && 'is-invalid'}`}
                          placeholder='name@example.com' 
                        />
                        {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2 border-top mt-4">
                        <button 
                          type="submit" 
                          className='btn btn-primary btn-lg fs-6 fw-semibold px-4 py-2 mt-3'
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : 'Save Changes'}
                        </button>
                      </div>

                    </form>
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

export default Profile