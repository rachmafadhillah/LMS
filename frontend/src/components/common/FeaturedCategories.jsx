import React, { useEffect, useState } from 'react'
import { apiUrl, token } from './Config';
import { Link } from 'react-router-dom';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/fetch-categories`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      const result = await response.json();
      
      if (result.status === 200) { // Bug fixing: '=' diubah menjadi '==='
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  return (
    <section className='p-5 bg-white'>
      <div className="container py-3">
        
        {/* Judul Seksi Utama */}
        <div className='mb-5'>
          <h2 className='fw-bold text-dark h3 mb-2'>Explore Top Categories</h2>
          <p className="text-secondary small m-0" style={{ maxWidth: '500px' }}>
            Discover categories designed to help you excel in your professional and personal growth.
          </p>
        </div>
        
        {/* Grid Grid Kategori */}
        <div className='row g-4'>
          {loading ? (
            // Spinner tipis saat memuat kategori
            <div className="col-12 text-center py-4">
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>
          ) : categories && categories.length > 0 ? (
            categories.map(category => (
              <div key={category.id} className='col-12 col-sm-6 col-md-4 col-lg-3'>
                
                {/* Kartu Kategori Interaktif */}
                <Link 
                  to={`/courses?category=${category.id}`} 
                  className='card border-0 shadow-sm rounded-4 bg-light text-decoration-none h-100 transition-all custom-category-card'
                  style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                >
                  <div className='card-body p-4 d-flex align-items-center justify-content-between'>
                    <div className="d-flex align-items-center gap-3">
                      {/* Ikon Dekoratif Awal Huruf Kategori */}
                      <div className="d-flex align-items-center justify-content-center bg-white text-primary fw-bold rounded-3 shadow-sm text-uppercase" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                        {category.name.charAt(0)}
                      </div>
                      <span className='fw-bold text-dark fs-6 lh-sm'>{category.name}</span>
                    </div>
                    
                    {/* Ikon Panah Kecil Petunjuk Aksi */}
                    <div className='text-primary opacity-50 mobile-arrow-hide'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/></svg>
                    </div>
                  </div>
                </Link>

              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 text-muted small">
              No categories available at the moment.
            </div>
          )}                    
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories