import React, { useState } from 'react';
import { X } from './icons';
import { useAuth } from './AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login, verifyLogin, signup, verifySignup } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateLoginForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!loginData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!loginData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!signupData.name.trim()) {
      errors.name = 'Name is required';
    } else if (signupData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!signupData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!signupData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(signupData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!signupData.address.trim()) {
      errors.address = 'Address is required';
    } else if (signupData.address.trim().length < 10) {
      errors.address = 'Please enter a complete address';
    }

    if (!signupData.password) {
      errors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!signupData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateLoginForm()) return;

    setIsSubmitting(true);

    const result = await login(loginData.email, loginData.password);

    setIsSubmitting(false);

    if (result.success) {
      if (result.requiresOtp) {
        setAuthStep('otp');
        setError('');
      } else {
        // Direct success (fallback)
        setLoginData({ email: '', password: '' });
        setFormErrors({});
        if (onSuccess) onSuccess();
        onClose();
      }
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateSignupForm()) return;

    setIsSubmitting(true);

    const result = await signup({
      name: signupData.name,
      email: signupData.email,
      phone: signupData.phone,
      address: signupData.address,
      password: signupData.password
    });

    setIsSubmitting(false);

    if (result.success) {
      if (result.requiresOtp) {
        setAuthStep('otp');
        setError('');
      } else {
        // Direct success
        setSignupData({
          name: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          confirmPassword: ''
        });
        setFormErrors({});
        if (onSuccess) onSuccess();
        onClose();
      }
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const switchTab = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setAuthStep('credentials');
    setError('');
    setFormErrors({});
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter a valid OTP');
      return;
    }

    setIsSubmitting(true);
    let result;

    if (activeTab === 'login') {
      result = await verifyLogin(loginData.email, otp);
    } else {
      result = await verifySignup(signupData, otp);
    }

    setIsSubmitting(false);

    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
      // Reset state after close
      setTimeout(() => {
        setAuthStep('credentials');
        setOtp('');
        setLoginData({ email: '', password: '' });
        setSignupData({
          name: '', email: '', phone: '', address: '', password: '', confirmPassword: ''
        });
      }, 300);
    } else {
      setError(result.error || 'Verification failed');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black z-[9999] backdrop-blur-sm transition-opacity duration-500 ease-in-out opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
        <div
          className="w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl transform transition-all duration-500 ease-in-out"
          style={{
            backgroundColor: 'rgba(57, 30, 16, 0.98)',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'rgba(199, 160, 122, 0.4)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#FDFCE8', fontFamily: 'Georgia, serif' }}>
              {authStep === 'otp' ? 'Verification' : (activeTab === 'login' ? 'Welcome Back' : 'Create Account')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-opacity-80 transition-all"
              style={{ backgroundColor: 'rgba(199, 160, 122, 0.2)' }}
            >
              <X className="w-5 h-5" style={{ color: '#C7A07A' }} />
            </button>
          </div>

          {/* Tabs */}
          {authStep === 'credentials' && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => switchTab('login')}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'login' ? 'shadow-lg' : ''
                  }`}
                style={{
                  backgroundColor: activeTab === 'login' ? '#C7A07A' : 'rgba(199, 160, 122, 0.2)',
                  color: activeTab === 'login' ? '#16302B' : '#C7A07A'
                }}
              >
                Login
              </button>
              <button
                onClick={() => switchTab('signup')}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${activeTab === 'signup' ? 'shadow-lg' : ''
                  }`}
                style={{
                  backgroundColor: activeTab === 'signup' ? '#C7A07A' : 'rgba(199, 160, 122, 0.2)',
                  color: activeTab === 'signup' ? '#16302B' : '#C7A07A'
                }}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="mb-4 p-3 rounded-lg"
              style={{ backgroundColor: 'rgba(244, 67, 54, 0.2)', borderLeft: '3px solid #f44336' }}
            >
              <p className="text-sm" style={{ color: '#f44336' }}>
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && authStep === 'credentials' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.email ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.email && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Password *
                </label>
                <input
                  type="password"
                  id="login-password"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
                    if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.password ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.password && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 mt-6"
                style={{
                  backgroundColor: isSubmitting ? 'rgba(199, 160, 122, 0.5)' : '#C7A07A',
                  color: '#16302B',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Login to Continue'
                )}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && authStep === 'credentials' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="signup-name"
                  value={signupData.name}
                  onChange={(e) => {
                    setSignupData({ ...signupData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.name ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.name && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={signupData.email}
                  onChange={(e) => {
                    setSignupData({ ...signupData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.email ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.email && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-phone" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="signup-phone"
                  value={signupData.phone}
                  onChange={(e) => {
                    setSignupData({ ...signupData, phone: e.target.value });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                  }}
                  placeholder="0701234567"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.phone ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.phone && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-address" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Address *
                </label>
                <textarea
                  id="signup-address"
                  value={signupData.address}
                  onChange={(e) => {
                    setSignupData({ ...signupData, address: e.target.value });
                    if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                  }}
                  placeholder="Street address, City, Postal Code"
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.address ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.address && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Password *
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({ ...signupData, password: e.target.value });
                    if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.password ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.password && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="signup-confirm"
                  value={signupData.confirmPassword}
                  onChange={(e) => {
                    setSignupData({ ...signupData, confirmPassword: e.target.value });
                    if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: '' });
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg outline-none"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: formErrors.confirmPassword ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                />
                {formErrors.confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: '#f44336' }}>
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 mt-6"
                style={{
                  backgroundColor: isSubmitting ? 'rgba(199, 160, 122, 0.5)' : '#C7A07A',
                  color: '#16302B',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* OTP Verification Form */}
          {authStep === 'otp' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center mb-6">
                <p style={{ color: '#E2CEB1' }}>
                  We've sent a verification code to <br />
                  <span className="font-semibold" style={{ color: '#C7A07A' }}>
                    {activeTab === 'login' ? loginData.email : signupData.email}
                  </span>
                </p>
              </div>

              <div>
                <label htmlFor="otp-input" className="block text-sm font-semibold mb-2" style={{ color: '#FDFCE8' }}>
                  Enter OTP Code *
                </label>
                <input
                  type="text"
                  id="otp-input"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                    setError('');
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-lg outline-none text-center tracking-widest text-xl"
                  style={{
                    backgroundColor: 'rgba(22, 48, 43, 0.5)',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    borderColor: error ? '#f44336' : 'rgba(199, 160, 122, 0.3)',
                    color: '#FDFCE8'
                  }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length < 6}
                className="w-full py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 mt-6"
                style={{
                  backgroundColor: isSubmitting ? 'rgba(199, 160, 122, 0.5)' : '#C7A07A',
                  color: '#16302B',
                  cursor: (isSubmitting || otp.length < 6) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthStep('credentials')}
                className="w-full text-center text-sm hover:underline mt-4 block"
                style={{ color: '#C7A07A' }}
              >
                Back to {activeTab === 'login' ? 'Login' : 'Signup'}
              </button>
            </form>
          )}

          {/* Footer Note */}
          {authStep === 'credentials' && (
            <p className="text-xs text-center mt-6" style={{ color: '#E2CEB1' }}>
              {activeTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => switchTab(activeTab === 'login' ? 'signup' : 'login')}
                className="font-semibold hover:underline"
                style={{ color: '#C7A07A' }}
              >
                {activeTab === 'login' ? 'Sign up here' : 'Login here'}
              </button>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
