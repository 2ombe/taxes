import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaCalculator, FaChartLine, FaUser, FaFileInvoiceDollar,
  FaHistory, FaBell, FaRobot, FaArrowRight, FaCheckCircle
} from 'react-icons/fa';
import { MdOutlineTax, MdAccountBalance } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import TaxCalendar from '../components/common/TaxCalendar';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const formatRWF = (v) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(v ?? 0);

// Tax Health Score Ring
const HealthScoreRing = ({ score, color = '#006F46' }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'At Risk';
  const ringColor = score >= 80 ? '#10b981' : score >= 60 ? '#f0a500' : score >= 40 ? '#f0a500' : '#dc3545';

  return (
    <div className="health-score-ring" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke={ringColor} strokeWidth="12"
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="score-text">
        <div className="score-number fw-extrabold" style={{ color: ringColor }}>{score}</div>
        <div className="score-label text-muted">{label}</div>
      </div>
    </div>
  );
};

const SHORTCUT_TILES = [
  { to: '/tax-engine', icon: <FaCalculator size={28} />, label: 'CIT Engine', sub: 'Corporate Income Tax', bg: '#e8f5ee', color: '#006F46' },
  { to: '/vat', icon: <MdOutlineTax size={28} />, label: 'VAT Calculator', sub: '18% Rwanda VAT', bg: '#fff3cd', color: '#d97706' },
  { to: '/paye', icon: <FaUser size={28} />, label: 'PAYE Calculator', sub: '2025 Tax Bands', bg: '#e0f2fe', color: '#0284c7' },
  { to: '/wht', icon: <MdAccountBalance size={28} />, label: 'WHT Calculator', sub: 'Art. 43–52 Rates', bg: '#fce7f3', color: '#be185d' },
];

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [healthScore] = useState(72); // Demo score — in prod, computed from computation data

  const today = new Date();
  const timeOfDay = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/tax`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setTaxData(await res.json());
      } catch { /* no data yet */ }
      setLoading(false);
    };
    if (currentUser) loadData();
    else setLoading(false);
  }, [currentUser]);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="dashboard-page page-top-offset pb-5" variants={containerVariants} initial="hidden" animate="visible">
      <Container className="py-4">

        {/* Welcome Banner */}
        <motion.div variants={itemVariants} className="mb-4">
          <div className="rounded-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #006F46 0%, #004d31 100%)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(249,226,25,0.08)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
            <div className="p-4 position-relative">
              <Row className="align-items-center">
                <Col>
                  <span className="ai-badge mb-2 d-inline-flex">Dashboard</span>
                  <h2 className="text-white fw-bold mb-1">
                    {timeOfDay}, {currentUser?.email?.split('@')[0] || 'User'} 👋
                  </h2>
                  <p className="text-white-50 mb-3">
                    {today.toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="feature-chip"><FaCheckCircle size={10} /> CIT Engine Active</span>
                    <span className="feature-chip"><FaCheckCircle size={10} /> AI Advisor Ready</span>
                    <span className="feature-chip"><FaCheckCircle size={10} /> 4 Tax Calculators</span>
                  </div>
                </Col>
                <Col xs="auto" className="d-none d-md-block">
                  <div className="text-center text-white">
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, marginBottom: 8 }}>Tax Health Score</div>
                    <HealthScoreRing score={healthScore} />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </motion.div>

        <Row className="g-4">
          <Col lg={8}>
            {/* Quick Stats */}
            {taxData && (
              <motion.div variants={itemVariants} className="mb-4">
                <Row className="g-3">
                  {[
                    { label: 'Accounting Profit', value: formatRWF(taxData.accountingProfit || 0), icon: <FaChartLine />, bg: '#e8f5ee', color: '#006F46' },
                    { label: 'TB Items', value: `${(taxData.trialBalance || []).length} accounts`, icon: <FaFileInvoiceDollar />, bg: '#e0f2fe', color: '#0284c7' },
                    { label: 'Fixed Assets', value: `${(taxData.assets || []).length} assets`, icon: <MdAccountBalance />, bg: '#fff3cd', color: '#d97706' },
                  ].map((s, i) => (
                    <Col md={4} key={i}>
                      <Card className="stat-card border-0 p-3">
                        <div className="d-flex align-items-start gap-3">
                          <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                          <div>
                            <div className="stat-number" style={{ color: s.color, fontSize: '1.3rem' }}>{s.value}</div>
                            <div className="text-muted small">{s.label}</div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </motion.div>
            )}

            {/* Tax Calculators Grid */}
            <motion.div variants={itemVariants} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Tax Calculators</h5>
                <Badge bg="primary" className="rounded-pill">4 Available</Badge>
              </div>
              <Row className="g-3">
                {SHORTCUT_TILES.map((tile, i) => (
                  <Col md={6} key={i}>
                    <Link to={tile.to} className="shortcut-tile card border-0 shadow-sm" style={{ background: '#fff' }}>
                      <div className="tile-icon" style={{ background: tile.bg, color: tile.color }}>{tile.icon}</div>
                      <div className="text-start w-100">
                        <div className="tile-label">{tile.label}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem' }}>{tile.sub}</div>
                      </div>
                      <FaArrowRight size={14} className="text-muted ms-auto" />
                    </Link>
                  </Col>
                ))}
              </Row>
            </motion.div>

            {/* AI Advisor CTA */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 rounded-4 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Card.Body className="p-4 text-white">
                  <Row className="align-items-center">
                    <Col>
                      <span className="ai-badge mb-2 d-inline-flex">Gemini AI</span>
                      <h5 className="fw-bold text-white mb-1">Ask Your AI Tax Advisor</h5>
                      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: 0 }}>
                        Get instant answers on Rwanda CIT, VAT, PAYE, WHT and deductibility. Powered by Google Gemini.
                      </p>
                    </Col>
                    <Col xs="auto">
                      <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaRobot size={30} />
                      </div>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    {['What is deductible?', 'VAT threshold?', 'PAYE 2025 bands?'].map((q, i) => (
                      <span key={i} className="feature-chip" style={{ cursor: 'default', fontSize: '0.75rem' }}>{q}</span>
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: 12, marginBottom: 0 }}>
                    👉 Click the purple robot button (bottom-right) to start chatting
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={4}>
            {/* Tax Calendar */}
            <motion.div variants={itemVariants} className="mb-4">
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <TaxCalendar compact />
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="mb-4">
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaHistory className="text-primary" /> Quick Actions
                </h6>
                <div className="d-grid gap-2">
                  <Button as={Link} to="/tax-engine" variant="primary" className="rounded-pill text-start d-flex align-items-center gap-2">
                    <FaCalculator /> Open CIT Engine
                  </Button>
                  <Button as={Link} to="/vat" variant="outline-primary" className="rounded-pill text-start d-flex align-items-center gap-2">
                    <MdOutlineTax /> VAT Return
                  </Button>
                  <Button as={Link} to="/paye" variant="outline-secondary" className="rounded-pill text-start d-flex align-items-center gap-2">
                    <FaUser /> PAYE Calculation
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Compliance Checklist */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaBell className="text-warning" /> Compliance Checklist
                </h6>
                {[
                  { label: 'VAT Return Filed', done: false },
                  { label: 'PAYE Remitted to RRA', done: false },
                  { label: 'WHT Certificate Issued', done: false },
                  { label: 'CIT Computation Saved', done: !!taxData?.accountingProfit },
                  { label: 'Financial Statements Prepared', done: false },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 mb-2">
                    <FaCheckCircle size={14} className={item.done ? 'text-success' : 'text-muted'} />
                    <span className={`small ${item.done ? 'text-dark fw-medium' : 'text-muted'}`}>{item.label}</span>
                    {item.done && <Badge bg="success" className="ms-auto" style={{ fontSize: '0.65rem' }}>Done</Badge>}
                  </div>
                ))}
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
