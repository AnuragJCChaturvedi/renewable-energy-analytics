// src/pages/Register.tsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-200">
      <RegisterForm />
    </div>
  );
};

export default Register;
