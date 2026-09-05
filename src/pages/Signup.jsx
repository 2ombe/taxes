import React, { useState } from 'react';
import { Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { FaLock, FaEnvelope, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = () => {
    if (!password) return { level: 0, label: '', color: '#e5e7eb' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: '#dc3545' };
    if (password.length < 10) return { level: 2, label: 'Fair', color: '#f0a500' };
    return { level: 3, label: 'Strong', color: '#10b981' };
  };
  const strength = passwordStrength();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== passwordConfirm) return setError('Passwords do not match.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account. ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Brand panel */}
      <Col lg={5} className="auth-brand-panel d-none d-lg-flex">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-center gap-2 mb-5">
            <img src="/logo.jpg" alt="AGN Logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
            <div>
              <div className="fw-bold text-white" style={{ fontSize: '1rem' }}>AGN Bridge Consult</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>RWANDA TAX & ADVISORY</div>
            </div>
          </div>

          <h2 className="display-5 fw-bold text-white mb-3">Start Computing Rwanda Tax in Minutes</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Create your free account and immediately access Rwanda's most complete tax platform.
          </p>

          <div className="d-flex flex-column gap-3">
            {[
              'No credit card required',
              'Full CIT engine access',
              'VAT, PAYE & WHT calculators',
              'AI advisor powered by Gemini',
              'Excel export for all computations',
            ].map((f, i) => (
              <div key={i} className="d-flex align-items-center gap-3">
                <FaCheckCircle style={{ color: '#F9E219', flexShrink: 0 }} size={16} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-3 d-flex gap-2 align-items-center" style={{ background: 'rgba(249,226,25,0.1)', border: '1px solid rgba(249,226,25,0.2)' }}>
            <FaShieldAlt style={{ color: '#F9E219', flexShrink: 0 }} size={18} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
              Your data is encrypted with industry-standard AES-256 encryption and never shared.
            </span>
          </div>
        </div>
      </Col>

      {/* Form panel */}
      <Col lg={7} xs={12} className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}
        >
          <div className="d-flex align-items-center gap-2 mb-5 d-lg-none">
            <img src="/logo.jpg" alt="AGN Logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
            <span className="fw-bold text-primary" style={{ fontSize: '0.95rem' }}>AGN Bridge Consult</span>
          </div>

          <div className="mb-5">
            <h2 className="fw-bold mb-1">Create your account</h2>
            <p className="text-muted">Free forever for core tax calculations</p>
          </div>

          {error && <Alert variant="danger" className="rounded-3 py-2 small">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Email Address</Form.Label>
              <div className="input-group rounded-3 overflow-hidden" style={{ border: '1.5px solid #e5e7eb' }}>
                <span className="input-group-text bg-white border-0 text-muted"><FaEnvelope size={14} /></span>
                <Form.Control
                  type="email" required placeholder="you@company.com"
                  className="bg-white border-0 shadow-none py-3"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Password</Form.Label>
              <div className="input-group rounded-3 overflow-hidden" style={{ border: '1.5px solid #e5e7eb' }}>
                <span className="input-group-text bg-white border-0 text-muted"><FaLock size={14} /></span>
                <Form.Control
                  type="password" required placeholder="Min. 6 characters"
                  className="bg-white border-0 shadow-none py-3"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
              {password && (
                <div className="mt-2">
                  <div className="d-flex gap-1 mb-1">
                    {[1, 2, 3].map(l => (
                      <div key={l} style={{ height: 4, flex: 1, borderRadius: 4, background: strength.level >= l ? strength.color : '#e5e7eb', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Confirm Password</Form.Label>
              <div className="input-group rounded-3 overflow-hidden" style={{ border: '1.5px solid #e5e7eb' }}>
                <span className="input-group-text bg-white border-0 text-muted"><FaLock size={14} /></span>
                <Form.Control
                  type="password" required placeholder="Re-enter your password"
                  className="bg-white border-0 shadow-none py-3"
                  value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
              {passwordConfirm && password && (
                <div className="mt-1 small" style={{ color: password === passwordConfirm ? '#10b981' : '#dc3545' }}>
                  {password === passwordConfirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
            </Form.Group>

            <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-100 rounded-pill fw-bold mb-4 shadow-sm" style={{ padding: '0.75rem' }}>
              {loading ? 'Creating Account...' : 'Create Free Account →'}
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted small">Already have an account? </span>
            <Link to="/login" className="text-primary small fw-bold text-decoration-none">Sign in</Link>
          </div>

          <div className="mt-5 pt-4 border-top text-center">
            <p className="text-muted small mb-0">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </motion.div>
      </Col>
    </div>
  );
};

export default Signup;
