import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};

    if (!username.trim()) {
      errs.username = 'Username is required';
    } else if (username.length < 3) {
      errs.username = 'Username must be at least 3 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);

      await axios.post('/auth/register', formData);
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please check your details and try again.');
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>

      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
            errors.username ? 'border-red-500' : 'border-gray-300 focus:ring-green-400'
          }`}
          required
        />
        {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
            errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-green-400'
          }`}
          required
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
            errors.password ? 'border-red-500' : 'border-gray-300 focus:ring-green-400'
          }`}
          required
        />
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200"
      >
        Register
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
