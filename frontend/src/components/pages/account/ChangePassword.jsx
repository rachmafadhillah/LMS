import React, { useState } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import UserSidebar from '../../common/UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../common/Config'
import toast from 'react-hot-toast'

const ChangePassword = () => {
  const { register, handleSubmit, formState: { errors }, reset, setError, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // State untuk fitur Show/Hide password
  
  const newPassword = watch('new_password')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/update-password`, {
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
        toast.success(result.message || 'Password successfully updated!')
        reset()
        setShowPassword(false) // Sembunyikan kembali setelah sukses
      } else {
        const backendErrors = result.errors
        if (backendErrors) {
          Object.keys(backendErrors).forEach(field => {
            setError(field, { message: backendErrors[field][0] })
          })
        } else {
          toast.error(result.message || 'Failed to update password.')
        }
      }
    } catch (error) {
      toast.error('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Komponen Ikon Mata (재사용 가능한 SVG 아이콘)
  const EyeIcon = () => showPassword ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>
  );

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb Minimalis */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item">
                <Link to="/account" className="text-decoration-none text-muted">Account</Link>
              </li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Change Password</li>
            </ol>
          </nav>

          <div className='row'>
            {/* Judul & Deskripsi Halaman */}
            <div className='col-12 mb-4'>
              <h2 className='fw-bold text-dark h3 mb-1'>Change Password</h2>
              <p className='text-muted small m-0'>Ensure your account is using a long, random password to stay secure.</p>
            </div>
            
            {/* Sidebar Kiri */}
            <div className='col-lg-3 account-sidebar mb-4 mb-lg-0'>
              <div className="card border-0 shadow-sm rounded-4 p-2 bg-white">
                <UserSidebar />
              </div>
            </div>
            
            {/* Konten Form Utama Kanan */}
            <div className='col-lg-9'>
              <div className='card border-0 shadow-sm rounded-4 bg-white overflow-hidden'>
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Old Password Field */}
                    <div className="mb-4">
                      <label className='form-label fw-semibold small text-secondary'>Current Password</label>
                      <div className='input-group'>
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          {...register('old_password', {
                            required: "The old password field is required."
                          })}
                          className={`form-control form-control-lg fs-6 ${errors.old_password && 'is-invalid'}`}
                          placeholder='Enter your current password' 
                        />
                        <button 
                          type="button"
                          className="btn btn-outline-secondary px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <EyeIcon />
                        </button>
                      </div>
                      {errors.old_password && <div className='d-block invalid-feedback mt-1'>{errors.old_password.message}</div>}
                    </div>

                    {/* Pembatas Visual Halus */}
                    <hr className="my-4 text-muted opacity-10" />

                    {/* New Password Field */}
                    <div className="mb-4">
                      <label className='form-label fw-semibold small text-secondary'>New Password</label>
                      <div className='input-group'>
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          {...register('new_password', {
                            required: "The new password field is required.",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters long."
                            }
                          })}
                          className={`form-control form-control-lg fs-6 ${errors.new_password && 'is-invalid'}`}
                          placeholder='Create a new password' 
                        />
                        <button 
                          type="button"
                          className="btn btn-outline-secondary px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <EyeIcon />
                        </button>
                      </div>
                      {errors.new_password && <div className='d-block invalid-feedback mt-1'>{errors.new_password.message}</div>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                      <label className='form-label fw-semibold small text-secondary'>Confirm New Password</label>
                      <div className='input-group'>
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          {...register('confirm_password', {
                            required: "Please confirm your password.",
                            validate: (value) => value === newPassword || "Passwords do not match."
                          })}
                          className={`form-control form-control-lg fs-6 ${errors.confirm_password && 'is-invalid'}`}
                          placeholder='Repeat your new password' 
                        />
                        <button 
                          type="button"
                          className="btn btn-outline-secondary px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <EyeIcon />
                        </button>
                      </div>
                      {errors.confirm_password && <div className='d-block invalid-feedback mt-1'>{errors.confirm_password.message}</div>}
                    </div>

                    {/* Area Tombol Aksi */}
                    <div className="pt-2 border-top mt-4">
                      <button 
                        type='submit' 
                        disabled={loading} 
                        className='btn btn-primary btn-lg fs-6 fw-semibold px-4 py-2 mt-3 d-flex align-items-center'
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : 'Update Password'}
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ChangePassword