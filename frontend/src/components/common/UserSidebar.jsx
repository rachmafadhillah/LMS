import React, { useContext } from 'react'
import { BsMortarboardFill } from 'react-icons/bs'
import { FaChartBar, FaDesktop, FaUserLock } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/Auth'
import { FaUser } from "react-icons/fa";

const UserSidebar = () => {
    const {logout} = useContext(AuthContext);

  return (
    <div className='card border-0 shadow-lg'>
        <div className='card-body  p-4'>
            <ul>
                <li className='d-flex align-items-center'>
                    <Link to="/account/dashboard"><FaChartBar  size={16} className='me-2 ' /> Dashboard</Link>
                </li>

                <li className='d-flex align-items-center'>
                    <Link to="/account/profile"><FaUser  size={16} className='me-2 ' /> Profile</Link>
                </li>
               
                <li  className='d-flex align-items-center'>
                    <Link to="/account/my-learning"><BsMortarboardFill  size={16} className='me-2' /> My Learning</Link>
                </li>
                <li  className='d-flex align-items-center'>
                    <Link to="/account/my-courses"><FaDesktop  size={16} className='me-2'/> My Courses</Link>
                </li>
                <li  className='d-flex align-items-center '>
                    <Link to="/account/change-password"><FaUserLock  size={16}  className='me-2'/> Change Password</Link>
                </li>
                <li>
                    <Link onClick={logout} className='text-danger'><MdLogout  size={16} className='me-2'/> Logout</Link>
                </li>
            </ul>
        </div>                             
    </div>
  )
}

export default UserSidebar