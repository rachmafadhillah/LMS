import React, { useEffect, useState } from 'react'
import { apiUrl, token } from './Config';
import Course from './Course'

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/fetch-featured-courses`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = await response.json();
      
      if (result.status === 200) { // Bug fixing: '=' diubah menjadi '==='
        setCourses(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching featured courses:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeaturedCourses();
  }, [])

  return (
    <section className='p-5 bg-light'>
      <div className="container py-3">
        
        {/* Header Seksi Utama */}
        <div className='mb-5 text-center text-md-start'>
          <h2 className='fw-bold text-dark h3 mb-2'>Featured Courses</h2>
          <p className="text-secondary small m-0" style={{ maxWidth: '540px' }}>
            Discover expert-led courses designed to help you excel in your professional career and personal development.
          </p>
        </div>
        
        {/* Grid Render Katalog Unggulan */}
        <div className="row g-4">
          {loading ? (
            // Spinner halus saat data sedang dimuat
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : courses && courses.length > 0 ? (
            courses.map(course => (
              <Course
                key={course.id}
                course={course}
                // Grid disamakan menjadi 4 kolom di monitor besar (col-lg-3)
                customClasses="col-12 col-sm-6 col-lg-3"
              />
            ))
          ) : (
            <div className="col-12 text-center py-5 text-muted small">
              No featured courses available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCourses