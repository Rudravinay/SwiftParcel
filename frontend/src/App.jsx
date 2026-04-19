import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import Layout           from './components/common/Layout'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import DashboardPage    from './pages/DashboardPage'
import BookParcelPage   from './pages/BookParcelPage'
import TrackPage        from './pages/TrackPage'
import HistoryPage      from './pages/HistoryPage'
import ManagePage       from './pages/ManagePage'
import UpdateStatusPage from './pages/UpdateStatusPage'
import ReportsPage      from './pages/ReportsPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard"     element={<DashboardPage />} />
            <Route path="/book"          element={<BookParcelPage />} />
            <Route path="/track"         element={<TrackPage />} />
            <Route path="/history"       element={<HistoryPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<Layout />}>
            <Route path="/admin/parcels" element={<ManagePage />} />
            <Route path="/admin/status"  element={<UpdateStatusPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
