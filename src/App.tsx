import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/Login'
import PrivateRoute from './components/PrivateRoute'
// import DashboardPage from './pages/Dashboard'
import AppsPage from './pages/Apps'
import EditProfilPage from './pages/EditProfil'
import AdminPage from './pages/Admin'
import AdminRoute from './components/AdminRoute'
import IsActiveCheckRoute from './components/IsActiveCheckRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard */}
        <Route element={<PrivateRoute />}>
          <Route element={<IsActiveCheckRoute />}>
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/edit-profil" element={<EditProfilPage />} />
            <Route element={<AdminRoute />}>
              <Route path='/admin' element={<AdminPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
