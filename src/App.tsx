import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/auth/Login'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
