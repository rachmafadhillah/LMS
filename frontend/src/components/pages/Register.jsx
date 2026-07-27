import React, { useState } from 'react'
import Layout from '../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/Config'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit, register, formState: { errors }, setError
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.status === 200) {
        toast.success(result.message || 'Registration successful!');
        navigate('/account/login');
      } else {
        const backendErrors = result.errors;
        if (backendErrors) {
          Object.keys(backendErrors).forEach(field => {
            setError(field, { message: backendErrors[field][0] })
          });
        } else {
          toast.error(result.message || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }
    
  return (
    <Layout>
      <div className='py-5 bg-light'>
        <div className='container my-5'>
          <div className='row justify-content-center'>
            <div className='col-12 col-md-6 col-lg-4'>
              <div className='card border-0 shadow-lg rounded-4 p-2'>
                <div className='card-body p-4'>
                  <div className='text-center mb-4'>
                    <h3 className='fw-bold text-dark mb-1'>Get Started</h3>
                    <p className='text-muted small'>Create your account to start learning</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Field */}
                    <div className='mb-3'>
                      <label className='form-label fw-semibold small text-secondary' htmlFor="name">Full Name</label>
                      <input
                        {...register('name', {
                          required: "The name field is required."
                        })}
                        type="text"
                        className={`form-control form-control-lg fs-6 ${errors.name && 'is-invalid'}`}
                        placeholder='John Doe' 
                      />
                      {errors.name && <div className='invalid-feedback'>{errors.name.message}</div>}
                    </div>

                    {/* Email Field */}
                    <div className='mb-3'>
                      <label className='form-label fw-semibold small text-secondary' htmlFor="email">Email Address</label>
                      <input
                        {...register('email', {
                          required: "The email field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        type="text" 
                        className={`form-control form-control-lg fs-6 ${errors.email && 'is-invalid'}`}
                        placeholder='name@example.com' 
                      />
                      {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
                    </div>

                    {/* Password Field */}
                    <div className='mb-4'>
                      <label className='form-label fw-semibold small text-secondary' htmlFor="password">Password</label>
                      <div className='input-group'>
                        <input
                          {...register('password', {
                            required: "The password field is required."
                          })}
                          type={showPassword ? "text" : "password"}
                          className={`form-control form-control-lg fs-6 ${errors.password && 'is-invalid'}`}
                          placeholder='Create a password' 
                        />
                        <button 
                          type="button"
                          className="btn btn-outline-secondary px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>
                          )}
                        </button>
                      </div>
                      {errors.password && <div className='d-block invalid-feedback'>{errors.password.message}</div>}
                    </div>

                    {/* Submit Button */}
                    <button 
                      type='submit' 
                      className='btn btn-primary btn-lg w-100 fs-6 fw-semibold mb-3'
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      ) : 'Sign Up'}
                    </button>

                    {/* Redirect Link */}
                    <div className='text-center'>
                      <span className='text-muted small'>Already have an account? </span>
                      <Link to={`/account/login`} className='text-primary fw-semibold small text-decoration-none'>Login Here</Link>
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

export default Register