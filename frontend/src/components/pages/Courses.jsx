import React, { useEffect, useState } from 'react'
import Course from '../common/Course'
import Layout from '../common/Layout'
import { apiUrl } from '../common/Config'
import { Link, useSearchParams } from 'react-router-dom'
import Loading from '../common/Loading'
import NotFound from '../common/NotFound'

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('desc');
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Default diubah menjadi boolean true

  const [categoryChecked, setCategoryChecked] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : []
  });

  const [levelChecked, setLevelChecked] = useState(() => {
    const level = searchParams.get('level');
    return level ? level.split(',') : []
  });

  const [languageChecked, setLanguageChecked] = useState(() => {
    const language = searchParams.get('language');
    return language ? language.split(',') : []
  });

  const handleCategory = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setCategoryChecked(prev => [...prev, value])
    } else {
      setCategoryChecked(categoryChecked.filter(id => id != value))
    }
  }

  const handleLevel = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setLevelChecked(prev => [...prev, value])
    } else {
      setLevelChecked(levelChecked.filter(id => id != value))
    }
  }

  const handleLanguage = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setLanguageChecked(prev => [...prev, value])
    } else {
      setLanguageChecked(languageChecked.filter(id => id != value))
    }
  }

  const fetchCourses = async () => {
    setLoading(true)
    let search = [];
    let params = "";

    if (categoryChecked.length > 0) search.push(['category', categoryChecked])
    if (levelChecked.length > 0) search.push(['level', levelChecked])
    if (languageChecked.length > 0) search.push(['language', languageChecked])
    if (keyword.length > 0) search.push(['keyword', keyword])
    search.push(['sort', sort])

    if (search.length > 0) {
      params = new URLSearchParams(search)
      setSearchParams(params)
    } else {
      setSearchParams([])
    }

    try {
      const response = await fetch(`${apiUrl}/fetch-courses?${params}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        }
      })
      const result = await response.json()
      if (result.status === 200) {
        setCourses(result.data || [])
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch-categories`, { method: 'GET' })
      const result = await response.json()
      if (result.status === 200) setCategories(result.data)
    } catch (e) { console.error(e) }
  }

  const fetchLevels = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch-levels`, { method: 'GET' })
      const result = await response.json()
      if (result.status === 200) setLevels(result.data)
    } catch (e) { console.error(e) }
  }

  const fetchLanguages = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch-languages`, { method: 'GET' })
      const result = await response.json()
      if (result.status === 200) setLanguages(result.data)
    } catch (e) { console.error(e) }
  }

  const clearFilters = () => {
    setLevelChecked([])
    setCategoryChecked([])
    setLanguageChecked([])
    setKeyword('')
    document.querySelectorAll('.form-check-input').forEach(element => element.checked = false)
  }

  useEffect(() => {
    fetchCategories()
    fetchLevels()
    fetchLanguages()
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [categoryChecked, levelChecked, languageChecked, keyword, sort])

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          
          {/* Breadcrumb Minimalis */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb small bg-transparent p-0 m-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li className="breadcrumb-item active fw-medium text-dark" aria-current="page">Courses</li>
            </ol>
          </nav>

          <div className='row g-4'>
            {/* Sidebar Filter Kiri */}
            <div className='col-lg-3'>
              <div className='card border-0 shadow-sm rounded-4 p-3 bg-white mb-4'>
                <div className='card-body p-2'>
                  
                  {/* Kolom Pencarian Kata Kunci */}
                  <div className='mb-4'>
                    <label className="form-label fw-bold text-dark small text-uppercase tracking-wider mb-2">Search</label>
                    <div className='input-group bg-light rounded-3 overflow-hidden p-1 border border-light'>
                      <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        type="text"
                        className='form-control border-0 bg-transparent fs-6 py-2 shadow-none'
                        placeholder='Type keyword...' 
                      />
                    </div>
                  </div>

                  {/* Filter Kategori */}
                  <div className='mb-4'>
                    <h4 className='fw-bold text-dark small text-uppercase tracking-wider mb-3'>Category</h4>
                    <div className="d-flex flex-column gap-2.5">
                      {categories && categories.map(category => (
                        <div className="form-check m-0 d-flex align-items-center" key={category.id}>
                          <input
                            defaultChecked={searchParams.get('category') ? searchParams.get('category').includes(category.id) : false}
                            onClick={(e) => handleCategory(e)}
                            className="form-check-input mt-0"
                            type="checkbox"
                            value={category.id}
                            id={`category-${category.id}`} 
                          />
                          <label className="form-check-label text-secondary small ms-2 lh-sm" htmlFor={`category-${category.id}`}>
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filter Level Kelas */}
                  <div className='mb-4'>
                    <h4 className='fw-bold text-dark small text-uppercase tracking-wider mb-3'>Level</h4>
                    <div className="d-flex flex-column gap-2.5">
                      {levels && levels.map(level => (
                        <div className="form-check m-0 d-flex align-items-center" key={level.id}>
                          <input
                            defaultChecked={searchParams.get('level') ? searchParams.get('level').includes(level.id) : false}
                            onClick={(e) => handleLevel(e)}
                            className="form-check-input mt-0"
                            type="checkbox"
                            value={level.id}
                            id={`level-${level.id}`} 
                          />
                          <label className="form-check-label text-secondary small ms-2 lh-sm" htmlFor={`level-${level.id}`}>
                            {level.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filter Bahasa Pengantar */}
                  <div className='mb-4'>
                    <h4 className='fw-bold text-dark small text-uppercase tracking-wider mb-3'>Language</h4>
                    <div className="d-flex flex-column gap-2.5">
                      {languages && languages.map(language => (
                        <div className="form-check m-0 d-flex align-items-center" key={language.id}>
                          <input
                            defaultChecked={searchParams.get('language') ? searchParams.get('language').includes(language.id) : false}
                            onClick={(e) => handleLanguage(e)}
                            className="form-check-input mt-0"
                            type="checkbox"
                            value={language.id}
                            id={`language-${language.id}`} 
                          />
                          <label className="form-check-label text-secondary small ms-2 lh-sm" htmlFor={`language-${language.id}`}>
                            {language.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tombol Hapus Semua Filter */}
                  <button 
                    onClick={clearFilters} 
                    className='btn btn-link text-danger text-decoration-none small fw-semibold p-0 w-100 text-start border-0 mt-2 d-flex align-items-center gap-1'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>
                    Clear All Filters
                  </button>

                </div>
              </div>
            </div>

            {/* Bagian Katalog Kelas Kanan */}
            <div className='col-lg-9'>
              
              {/* Toolbar Informasi & Pengurutan Data */}
              <div className='d-flex justify-content-between mb-4 align-items-center flex-wrap gap-2 bg-white p-3 rounded-4 shadow-sm'>
                <div className='text-muted small fw-medium'>
                  {!loading && `${courses.length} courses found`}
                </div>
                <div>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className='form-select form-select-sm border-light rounded-3 fw-medium text-secondary py-1.5'
                    style={{ minWidth: '140px' }}
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Grid Katalog Kursus */}
              <div className="row g-4">
                {loading ? (
                  <div className="col-12 text-center py-5">
                    <Loading />
                  </div>
                ) : courses.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <NotFound />
                  </div>
                ) : (
                  courses.map(course => (
                    <Course
                      key={course.id}
                      course={course}
                      customClasses="col-md-6 col-xl-4"
                    />
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Courses