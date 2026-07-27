import React, { useEffect, useState } from 'react'
import Course from '../common/Course'
import Layout from '../common/Layout'
import { Link, useSearchParams } from 'react-router-dom'
import Loading from '../common/Loading'
import EmptyState from '../ui/EmptyState'
import { apiRequest, buildQueryString } from '../../lib/api'

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [levels, setLevels] = useState([])
  const [languages, setLanguages] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'desc')
  const [categoryChecked, setCategoryChecked] = useState(searchParams.get('category') ? searchParams.get('category').split(',') : [])
  const [levelChecked, setLevelChecked] = useState(searchParams.get('level') ? searchParams.get('level').split(',') : [])
  const [languageChecked, setLanguageChecked] = useState(searchParams.get('language') ? searchParams.get('language').split(',') : [])

  const toggleFilter = (value, selectedValues, setSelectedValues) => {
    setSelectedValues(
      selectedValues.includes(value)
        ? selectedValues.filter(item => item !== value)
        : [...selectedValues, value]
    )
  }

  const fetchCourses = async () => {
    setLoading(true)
    const query = buildQueryString({
      category: categoryChecked,
      level: levelChecked,
      language: languageChecked,
      keyword,
      sort,
    })

    setSearchParams(query ? new URLSearchParams(query) : {})

    try {
      const result = await apiRequest(`/fetch-courses?${query}`)
      if (result.status === 200) {
        setCourses(result.data || [])
      }
    } catch (error) {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMetaData = async () => {
    const [categoryResult, levelResult, languageResult] = await Promise.all([
      apiRequest('/fetch-categories'),
      apiRequest('/fetch-levels'),
      apiRequest('/fetch-languages'),
    ])

    if (categoryResult.status === 200) setCategories(categoryResult.data || [])
    if (levelResult.status === 200) setLevels(levelResult.data || [])
    if (languageResult.status === 200) setLanguages(languageResult.data || [])
  }

  const clearFilters = () => {
    setLevelChecked([])
    setCategoryChecked([])
    setLanguageChecked([])
    setKeyword('')
    setSort('desc')
  }

  useEffect(() => {
    fetchMetaData()
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [categoryChecked, levelChecked, languageChecked, keyword, sort])

  const filterGroup = (title, items, selectedValues, setSelectedValues) => (
    <div className='mb-4'>
      <h6 className='fw-bold text-dark mb-3'>{title}</h6>
      <div className='d-flex flex-column gap-2'>
        {items.map(item => (
          <label className='form-check d-flex align-items-center gap-2 m-0' key={item.id}>
            <input
              className='form-check-input m-0'
              type='checkbox'
              value={String(item.id)}
              checked={selectedValues.includes(String(item.id))}
              onChange={() => toggleFilter(String(item.id), selectedValues, setSelectedValues)}
            />
            <span className='form-check-label text-muted small'>{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <Layout>
      <div className='bg-light py-4 px-5' style={{ minHeight: 'calc(100vh - 73px)' }}>
        <div className='container pb-5 pt-2'>
          <nav aria-label='breadcrumb' className='mb-4'>
            <ol className='breadcrumb small bg-transparent p-0 m-0'>
              <li className='breadcrumb-item'>
                <Link to='/' className='text-decoration-none text-muted'>Home</Link>
              </li>
              <li className='breadcrumb-item active fw-medium text-dark' aria-current='page'>Courses</li>
            </ol>
          </nav>

          <div className='row g-4'>
            <div className='col-12'>
              <div className='d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3'>
                <div>
                  <h2 className='fw-bold text-dark h3 mb-1'>Explore Courses</h2>
                  <p className='text-muted small m-0'>Find courses by topic, level, language, popularity, or rating.</p>
                </div>
                <div className='d-flex gap-2' style={{ minWidth: '320px' }}>
                  <input
                    type='search'
                    className='form-control rounded-3 border-0 shadow-sm'
                    placeholder='Search course...'
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                  />
                  <select
                    className='form-select rounded-3 border-0 shadow-sm'
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value='desc'>Newest</option>
                    <option value='asc'>Oldest</option>
                    <option value='popular'>Popular</option>
                    <option value='rating'>Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='col-lg-3'>
              <div className='card border-0 shadow-sm rounded-4 bg-white sticky-top' style={{ top: '96px' }}>
                <div className='card-body p-4'>
                  <div className='d-flex justify-content-between align-items-center mb-4'>
                    <h5 className='fw-bold text-dark mb-0'>Filters</h5>
                    <button type='button' className='btn btn-link btn-sm text-decoration-none p-0' onClick={clearFilters}>Clear</button>
                  </div>

                  {filterGroup('Category', categories, categoryChecked, setCategoryChecked)}
                  {filterGroup('Level', levels, levelChecked, setLevelChecked)}
                  {filterGroup('Language', languages, languageChecked, setLanguageChecked)}
                </div>
              </div>
            </div>

            <div className='col-lg-9'>
              {loading ? (
                <div className='card border-0 shadow-sm rounded-4 p-5 bg-white text-center'>
                  <Loading />
                </div>
              ) : courses.length === 0 ? (
                <EmptyState
                  title='No Courses Found'
                  description='Try another keyword or clear selected filters.'
                  action={<button type='button' className='btn btn-primary px-4 py-2 fw-semibold rounded-3' onClick={clearFilters}>Clear Filters</button>}
                />
              ) : (
                <div className='row g-4'>
                  {courses.map(course => (
                    <Course key={course.id} course={course} customClasses='col-md-6 col-xl-4' />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Courses
