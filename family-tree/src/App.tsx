import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/Toast'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SetupBanner } from '@/components/ui/SetupBanner'
import { AuthPage } from '@/pages/AuthPage'
import { TreeListPage } from '@/pages/TreeListPage'
import { TreePage } from '@/pages/TreePage'
import { useAuthListener } from '@/hooks/useAuth'

function AppRoutes() {
  useAuthListener()
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/trees" element={<ProtectedRoute><TreeListPage /></ProtectedRoute>} />
      <Route path="/trees/:treeId" element={<ProtectedRoute><TreePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/trees" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SetupBanner />
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  )
}
