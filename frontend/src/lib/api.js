import { apiUrl } from '../components/common/Config'

const getToken = () => {
  const userInfo = localStorage.getItem('userInfoLms')
  return userInfo ? JSON.parse(userInfo).token : null
}

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    Accept: 'application/json',
    ...(options.body instanceof FormData ? {} : { 'Content-type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
  })

  const data = response.status === 204 ? null : await response.json()

  if (response.status === 401) {
    localStorage.removeItem('userInfoLms')
    window.location.href = '/account/login'
    return data
  }

  if (!response.ok) {
    throw data || { message: 'Request failed' }
  }

  return data
}

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      searchParams.set(key, value.join(','))
      return
    }

    if (!Array.isArray(value) && value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value)
    }
  })

  return searchParams.toString()
}
