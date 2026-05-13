import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import TeacherLayout from './layouts/TeacherLayout'
import AdminLayout from './layouts/AdminLayout'
import PageLoader from './components/ui/PageLoader'
import GameOverlay from './components/game/GameOverlay'

// Public
const LandingPage   = lazy(() => import('./pages/public/LandingPage'))
const LoginPage     = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage  = lazy(() => import('./pages/auth/RegisterPage'))

// Student
const DashboardPage      = lazy(() => import('./pages/student/DashboardPage'))
const ActivitiesPage     = lazy(() => import('./pages/student/ActivitiesPage'))
const ActivityDetailPage = lazy(() => import('./pages/student/ActivityDetailPage'))
const RankingPage        = lazy(() => import('./pages/student/RankingPage'))
const StorePage          = lazy(() => import('./pages/student/StorePage'))
const RewardDetailsPage  = lazy(() => import('./pages/student/RewardDetailsPage'))
const AchievementsPage   = lazy(() => import('./pages/student/AchievementsPage'))
const ProfilePage        = lazy(() => import('./pages/student/ProfilePage'))
const HistoryPage        = lazy(() => import('./pages/student/HistoryPage'))
const Loja24Page         = lazy(() => import('./pages/student/Loja24Page'))
const InventoryPage      = lazy(() => import('./pages/student/InventoryPage'))

// Teacher
const TeacherDashboard   = lazy(() => import('./pages/teacher/TeacherDashboard'))
const CreateActivity     = lazy(() => import('./pages/teacher/CreateActivity'))
const TeacherActivities  = lazy(() => import('./pages/teacher/TeacherActivities'))
const GradingPage        = lazy(() => import('./pages/teacher/GradingPage'))
const TeacherReports     = lazy(() => import('./pages/teacher/TeacherReports'))

// Admin
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers         = lazy(() => import('./pages/admin/AdminUsers'))
const AdminStore         = lazy(() => import('./pages/admin/AdminStore'))
const AdminLogs          = lazy(() => import('./pages/admin/AdminLogs'))

export default function App() {
  return (
    <>
      <GameOverlay />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth (only when NOT logged in) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute roles={['STUDENT']} />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard"          element={<DashboardPage />} />
              <Route path="/activities"         element={<ActivitiesPage />} />
              <Route path="/activities/:id"     element={<ActivityDetailPage />} />
              <Route path="/ranking"            element={<RankingPage />} />
              <Route path="/store"              element={<StorePage />} />
              <Route path="/store/:id"          element={<RewardDetailsPage />} />
              <Route path="/achievements"       element={<AchievementsPage />} />
              <Route path="/profile"            element={<ProfilePage />} />
              <Route path="/history"            element={<HistoryPage />} />
              <Route path="/loja24"             element={<Loja24Page />} />
              <Route path="/inventory"          element={<InventoryPage />} />
            </Route>
          </Route>

          {/* Teacher Routes */}
          <Route element={<ProtectedRoute roles={['TEACHER', 'ADMIN']} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/teacher"                    element={<TeacherDashboard />} />
              <Route path="/teacher/create"             element={<CreateActivity />} />
              <Route path="/teacher/activities"         element={<TeacherActivities />} />
              <Route path="/teacher/grading"            element={<GradingPage />} />
              <Route path="/teacher/reports"            element={<TeacherReports />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin"          element={<AdminDashboard />} />
              <Route path="/admin/users"    element={<AdminUsers />} />
              <Route path="/admin/store"    element={<AdminStore />} />
              <Route path="/admin/logs"     element={<AdminLogs />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}
