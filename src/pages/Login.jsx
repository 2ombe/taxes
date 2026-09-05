import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { FaLock, FaEnvelope, FaCheckCircle, FaRobot, FaCalculator } from 'react-icons/fa';
import { MdOutlineTax } from 'react-icons/md';

const BRAND_FEATURES = [
  { icon: <FaCalculator size={16} />, label: 'CIT Engine — Articles 24–31' },
  { icon: <MdOutlineTax size={16} />, label: 'VAT, PAYE & WHT Calculators' },
  { icon: <FaRobot size={16} />, label: 'Gemini AI Tax Advisor' },
  { icon: <FaCheckCircle size={16} />, label: 'Full Audit Trail & Export' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Brand Panel */}
      <Col lg={5} className="auth-brand-panel d-none d-lg-flex">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex align-items-center gap-2 mb-5">
            <img src="/logo.jpg" alt="AGN Logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
            <div>
              <div className="fw-bold text-white" style={{ fontSize: '1rem' }}>AGN Bridge Consult</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>RWANDA TAX & ADVISORY</div>
            </div>
          </div>

          <h2 className="display-5 fw-bold text-white mb-3">Rwanda's AI-Powered Tax Platform</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Access all Rwanda tax calculators, Gemini AI advisory, and audit-ready computations in one platform.
          </p>

          <div className="d-flex flex-column gap-3">
            {BRAND_FEATURES.map((f, i) => (
              <div key={i} className="d-flex align-items-center gap-3">
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(249,226,25,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F9E219', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>

          {/* Decorative floating card */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="mt-5 p-4 rounded-4 shadow-lg"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="ai-badge">AI Active</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
              "Your CIT computation for FY2025 is ready. Effective tax rate: 22.4%. 3 AI insights flagged."
            </div>
          </motion.div>
        </div>
      </Col>

      {/* Form Panel */}
      <Col lg={7} xs={12} className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: 420, width: '100%', margin: '0 auto' }}
        >
          {/* Mobile brand */}
          <div className="d-flex align-items-center gap-2 mb-5 d-lg-none">
            <img src="/logo.jpg" alt="AGN Logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
            <span className="fw-bold text-primary" style={{ fontSize: '0.95rem' }}>AGN Bridge Consult</span>
          </div>

          <div className="mb-5">
            <h2 className="fw-bold mb-1">Welcome back</h2>
            <p className="text-muted">Sign in to your Rwanda tax platform</p>
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

            <Form.Group className="mb-4">
              <div className="d-flex justify-content-between">
                <Form.Label className="fw-semibold small text-muted text-uppercase ls-1">Password</Form.Label>
                <Link to="/contact" className="small text-primary text-decoration-none">Forgot password?</Link>
              </div>
              <div className="input-group rounded-3 overflow-hidden" style={{ border: '1.5px solid #e5e7eb' }}>
                <span className="input-group-text bg-white border-0 text-muted"><FaLock size={14} /></span>
                <Form.Control
                  type="password" required placeholder="••••••••"
                  className="bg-white border-0 shadow-none py-3"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
            </Form.Group>

            <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-100 rounded-pill fw-bold mb-4 shadow-sm" style={{ padding: '0.75rem' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted small">Don't have an account? </span>
            <Link to="/signup" className="text-primary small fw-bold text-decoration-none">Create account free</Link>
          </div>

          <div className="mt-5 pt-4 border-top text-center">
            <p className="text-muted small mb-0">By signing in, you agree to our Terms of Service. Your tax data is encrypted and secure.</p>
          </div>
        </motion.div>
      </Col>
    </div>
  );
};

export default Login;
