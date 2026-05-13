import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user?.role)) {
    // Redirect to correct dashboard
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
    if (user?.role === 'TEACHER') return <Navigate to="/teacher" replace />
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export const PublicOnlyRoute = () => {
  const { isAuthenticated, user } = useAuthStore()
  if (isAuthenticated) {
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
    if (user?.role === 'TEACHER') return <Navigate to="/teacher" replace />
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}
