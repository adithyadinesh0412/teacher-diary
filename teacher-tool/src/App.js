import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// AppRouter component to handle routing and accessToken check
const AppRouter = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check for accessToken in local storage
    const accessToken = localStorage.getItem('authToken')
    const currentPath = window.location.pathname

    // If accessToken is not found and the user is not on the login or register page, redirect to login
    if (!accessToken && currentPath !== '/login' && currentPath !== '/register') {
      navigate('/login')
    }
  }, [navigate])

  return (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        <Route exact path="/login" name="Login Page" element={<Login />} />
        <Route exact path="/register" name="Register Page" element={<Register />} />
        <Route exact path="/404" name="Page 404" element={<Page404 />} />
        <Route exact path="/500" name="Page 500" element={<Page500 />} />
        <Route path="*" name="Home" element={<DefaultLayout />} />
      </Routes>
    </Suspense>
  )
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

export default App