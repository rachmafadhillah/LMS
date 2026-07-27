import { useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Courses from './components/pages/Courses'
import Detail from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import MyCourses from './components/pages/account/MyCourses'
import MyLearning from './components/pages/account/MyLearning'
import WatchCourse from './components/pages/account/WatchCourse'
import ChangePassword from './components/pages/account/ChangePassword'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/pages/account/Dashboard'
import { RequireAuth } from './components/common/RequireAuth'
import CreateCourse from './components/pages/account/courses/CreateCourse'
import EditCourse from './components/pages/account/courses/EditCourse'
import EditLesson from './components/pages/account/courses/EditLesson'
import LeaveRating from './components/pages/account/courses/LeaveRating'
import Profile from './components/pages/account/Profile'
import LearningPaths from './features/learning-paths/pages/LearningPaths'
import LearningPathDetail from './features/learning-paths/pages/LearningPathDetail'
import AdminPermissions from './components/pages/account/AdminPermissions'
import SubmitProject from './features/submissions/pages/SubmitProject'
import InstructorSubmissions from './features/submissions/pages/InstructorSubmissions'
import CourseDiscussions from './features/discussions/pages/CourseDiscussions'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/learning-paths' element={<LearningPaths />} />
          <Route path='/learning-paths/:slug' element={<LearningPathDetail />} />
          <Route path='/courses/:id/discussions' element={<CourseDiscussions />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />
          <Route path='/account/my-courses' element={<MyCourses />} />

          <Route path='/account/change-password' element={
            <RequireAuth>
              <ChangePassword />
            </RequireAuth>
          } />

          <Route path='/account/watch-course/:id' element={
            <RequireAuth>
              <WatchCourse />
            </RequireAuth>
          } />

          <Route path='/account/profile' element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />

          <Route path='/account/leave-rating/:id' element={
            <RequireAuth>
              <LeaveRating />
            </RequireAuth>
          } />

          <Route path='/account/my-learning' element={
            <RequireAuth>
              <MyLearning />
            </RequireAuth>
          } />

          <Route path='/account/submit-project' element={
            <RequireAuth>
              <SubmitProject />
            </RequireAuth>
          } />

          <Route path='/account/submissions' element={
            <RequireAuth>
              <InstructorSubmissions />
            </RequireAuth>
          } />

          <Route path='/account/dashboard' element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />

          <Route path='/account/courses/create' element={
            <RequireAuth>
              <CreateCourse />
            </RequireAuth>
          } />

          <Route path='/account/courses/edit/:id' element={
            <RequireAuth>
              <EditCourse />
            </RequireAuth>
          } />

          <Route path='/account/courses/edit-lesson/:id/:courseId' element={
            <RequireAuth>
              <EditLesson />
            </RequireAuth>
          } />

          <Route path='/account/admin/permissions' element={
            <RequireAuth>
              <AdminPermissions />
            </RequireAuth>
          } />

        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App
