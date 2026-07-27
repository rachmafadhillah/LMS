import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../../../lib/api'

const BookmarkButton = ({ courseId, initialBookmarked = false }) => {
  const navigate = useNavigate()
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [loading, setLoading] = useState(false)

  const toggleBookmark = async () => {
    const userInfo = localStorage.getItem('userInfoLms')

    if (!userInfo) {
      navigate('/account/login')
      return
    }

    setLoading(true)
    try {
      const result = await apiRequest('/bookmarks/toggle', {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId }),
      })

      if (result.status === 200) {
        setBookmarked(result.bookmarked)
        toast.success(result.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type='button'
      className={`btn btn-sm rounded-circle shadow-sm position-absolute top-0 end-0 m-3 ${bookmarked ? 'btn-danger' : 'btn-light'}`}
      onClick={toggleBookmark}
      disabled={loading}
      aria-label={bookmarked ? 'Remove bookmark' : 'Save bookmark'}
    >
      {bookmarked ? '?' : '?'}
    </button>
  )
}

export default BookmarkButton
