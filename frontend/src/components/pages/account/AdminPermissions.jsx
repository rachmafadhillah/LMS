import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { apiUrl } from '../../common/Config'
import Loading from '../../common/Loading'
import toast from 'react-hot-toast'

const AdminPermissions = () => {
  const getToken = () => {
    const userInfo = localStorage.getItem('userInfoLms')
    return userInfo ? JSON.parse(userInfo).token : null
  }
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [users, setUsers] = useState([])
  const [permissionName, setPermissionName] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/admin/roles-permissions`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        }
      })
      const result = await response.json()

      if (result.status === 200) {
        setRoles(result.roles)
        setPermissions(result.permissions)
        setUsers(result.users)
      } else {
        toast.error(result.message || 'Failed to load admin permissions')
      }
    } catch (error) {
      toast.error('Network error. Failed to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = async (role, permission) => {
    if (role.name === 'admin') {
      toast.error('Admin role always has all permissions')
      return
    }

    const currentPermissions = role.permissions.map(item => item.name)
    const nextPermissions = currentPermissions.includes(permission.name)
      ? currentPermissions.filter(item => item !== permission.name)
      : [...currentPermissions, permission.name]

    setSaving(true)
    try {
      const response = await fetch(`${apiUrl}/admin/roles/${role.id}/permissions`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ permissions: nextPermissions })
      })
      const result = await response.json()

      if (result.status === 200) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message || 'Failed to update permissions')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateUserRole = async (userId, role) => {
    setSaving(true)
    try {
      const response = await fetch(`${apiUrl}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ role })
      })
      const result = await response.json()

      if (result.status === 200) {
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.message || 'Failed to update user role')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const createPermission = async (event) => {
    event.preventDefault()
    if (!permissionName.trim()) return

    setSaving(true)
    try {
      const response = await fetch(`${apiUrl}/admin/permissions`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: permissionName.trim() })
      })
      const result = await response.json()

      if (result.status === 200) {
        setPermissionName('')
        toast.success(result.message)
        fetchData()
      } else {
        toast.error(result.errors?.name?.[0] || result.message || 'Failed to create permission')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <div className='container py-5'>
        <div className='row'>
          <div className='col-lg-3 mb-4 mb-lg-0'><UserSidebar /></div>
          <div className='col-lg-9'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <div>
                <h2 className='fw-bold text-dark mb-1'>Admin Permissions</h2>
                <p className='text-muted mb-0'>Atur role user dan akses fitur admin.</p>
              </div>
            </div>

            {loading ? <Loading /> : (
              <>
                <div className='card border-0 shadow-sm rounded-4 mb-4'>
                  <div className='card-body p-4'>
                    <h5 className='fw-bold mb-3'>Tambah Permission</h5>
                    <form onSubmit={createPermission} className='d-flex gap-2'>
                      <input className='form-control' value={permissionName} onChange={(e) => setPermissionName(e.target.value)} placeholder='contoh: manage reports' />
                      <button className='btn btn-primary text-nowrap' disabled={saving}>Tambah</button>
                    </form>
                  </div>
                </div>

                <div className='card border-0 shadow-sm rounded-4 mb-4'>
                  <div className='card-body p-4'>
                    <h5 className='fw-bold mb-3'>Role Permissions</h5>
                    <div className='table-responsive'>
                      <table className='table align-middle'>
                        <thead><tr><th>Role</th>{permissions.map(permission => <th key={permission.id}>{permission.name}</th>)}</tr></thead>
                        <tbody>
                          {roles.map(role => (
                            <tr key={role.id}>
                              <td className='fw-semibold text-capitalize'>{role.name}</td>
                              {permissions.map(permission => (
                                <td key={permission.id}>
                                  <input type='checkbox' className='form-check-input' checked={role.name === 'admin' || role.permissions.some(item => item.name === permission.name)} disabled={saving || role.name === 'admin'} onChange={() => togglePermission(role, permission)} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className='card border-0 shadow-sm rounded-4'>
                  <div className='card-body p-4'>
                    <h5 className='fw-bold mb-3'>User Roles</h5>
                    <div className='table-responsive'>
                      <table className='table align-middle'>
                        <thead><tr><th>User</th><th>Email</th><th>Role</th></tr></thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td style={{ maxWidth: '220px' }}>
                                <select className='form-select' value={user.roles?.[0]?.name || user.role || 'student'} disabled={saving} onChange={(e) => updateUserRole(user.id, e.target.value)}>
                                  {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminPermissions
