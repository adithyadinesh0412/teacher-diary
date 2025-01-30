import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CContainer,
  CRow,
  CCol,
  CCardGroup,
  CCard,
  CCardBody,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilLockLocked } from '@coreui/icons';
import apiService from '../../../services/apiService'
// import Toast from '../../../components/Toast'; // Import the Toast component
// import { AuthContext } from '../../../services/AuthContext';



const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // const { login } = useContext(AuthContext);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const [showToast, setShowToast] = useState(false); // State to control toast visibility
      // const [toastMessage, setToastMessage] = useState(''); // State to store toast message
      // Show success toast
      // setToastMessage('Login successful! Redirecting...');
      // setShowToast(true);
      // Call the apiService to send login data to the backend
      const response = await apiService.login(formData);

      // Save the token or user data to local storage (if applicable)
      localStorage.setItem('authToken', response.result.access_token);
      localStorage.setItem('refreshToken', response.result.refresh_token);
      localStorage.setItem('name', response.result.user.name);
      localStorage.setItem('roles', response.result.user.user_roles.map(roles => roles.title));

      // Redirect the user to the dashboard or home page
      window.location.href = '/dashboard'; // Or use React Router's `useNavigate`
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.'); // Display error message
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="username"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      {/* {showToast && <Toast message={toastMessage} />} */}
    </div>
  );
};

export default Login;