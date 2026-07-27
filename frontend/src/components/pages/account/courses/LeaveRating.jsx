import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { Link, useParams } from 'react-router-dom'
import UserSidebar from '../../../common/UserSidebar'
import { Rating } from 'react-simple-star-rating'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/Config'
import toast from 'react-hot-toast'

const LeaveRating = () => {
    const [rating, setRating] = useState(0)
    const [course, setCourse] = useState([])
    const params = useParams()

    // Catch Rating value
    const handleRating = (rate) => {
        setRating(rate)
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const onSubmit = async (data) => {
        data.course_id = course.id
        data.rating = rating

        await fetch(`${apiUrl}/leave-rating`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    toast.success(result.message)
                    reset()
                    setRating(0)
                } else {
                    console.log("Something went wrong")
                }
            });
    }

    const fetchCourse = async () => {
        await fetch(`${apiUrl}/courses/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setCourse(result.data)
                } else {
                    console.log("Something went wrong")
                }
            });
    }

    useEffect(() => {
        fetchCourse()
    }, [])
    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Leave Rating</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Leave Rating / {course.title}</h2>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='card p-3 border-0 shadow-lg'>
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="mb-3">
                                                    <label className='form-label'>Comment</label>
                                                    <textarea
                                                        {
                                                        ...register('comment', {
                                                            required: "Please enter your feedback."
                                                        })
                                                        }
                                                        className={`form-control ${errors.comment && 'is-invalid'}`}
                                                        placeholder='What is you personal feedback?'></textarea>
                                                    {
                                                        errors.comment && <p className='invalid-feedback'>{errors.comment?.message}</p>
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <Rating onClick={handleRating} initialValue={rating} />
                                                </div>
                                                <button className='btn btn-primary'>Submit</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default LeaveRating