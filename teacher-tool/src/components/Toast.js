// src/components/Toast.js
import React, { useRef, useState, useEffect } from 'react';
import { CToast, CToastBody, CToastHeader, CToaster } from '@coreui/react';

const Toast = ({ message, title = 'Notification', duration = 30000 }) => {
  const [toast, setToast] = useState(0);
  const toaster = useRef();

  useEffect(() => {
    if (message) {
      const newToast = (
        <CToast autohide={duration}>
          <CToastHeader closeButton>
            <strong className="me-auto">{title}</strong>
            <small>Just now</small>
          </CToastHeader>
          <CToastBody>{message}</CToastBody>
        </CToast>
      );
      setToast(newToast);
    }
  }, [message, title, duration]);

  return <CToaster ref={toaster} push={toast} placement="top-end" />;
};

export default Toast;