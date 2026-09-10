import React, { useRef } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FaGlobeAfrica, FaHandshake, FaChartLine, FaCalculator,
  FaCheckCircle, FaArrowRight, FaRobot, FaShieldAlt, FaStar,
  FaCoins, FaUniversity
} from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
};

const TAX_FEATURES = [
  { icon: <FaCalculator size={26} />, title: 'CIT Engine', desc: 'Articles 24–31 applied automatically. Upload your trial balance and get a full computation in seconds.', to: '/tax-engine', color: '#006F46', bg: '#e8f5ee', badge: 'Core Feature' },
  { icon: <FaCoins size={26} />, title: 'VAT Calculator', desc: '18% standard rate. Zero-rated exports. Exempt supply apportionment. Full RRA return breakdown.', to: '/vat', color: '#d97706', bg: '#fff3cd', badge: 'Free' },
  { icon: <FaChartLine size={26} />, title: 'PAYE Calculator', desc: '2025 monthly tax bands with RSSB, CBHI deductions. Single employee or full payroll run.', to: '/paye', color: '#0284c7', bg: '#e0f2fe', badge: 'Free' },
  { icon: <FaUniversity size={26} />, title: 'WHT Calculator', desc: 'All 9 WHT categories — dividends, interest, royalties, services. Treaty-rate support included.', to: '/wht', color: '#be185d', bg: '#fce7f3', badge: 'Free' },
];

const STATS = [
  { num: '30%', label: 'Rwanda CIT Rate', sub: 'Precisely applied' },
  { num: '4+', label: 'Tax Types', sub: 'CIT, VAT, PAYE, WHT' },
  { num: 'AI', label: 'Gemini Powered', sub: 'Google Gemini Pro' },
  { num: '5yr', label: 'Loss Carryforward', sub: 'Art. 31 applied' },
];

const WHY_AGN = [
  { icon: <FaShieldAlt />, title: 'Legal Accuracy', desc: 'Every computation cites the specific Rwanda Income Tax Law article — Articles 24 through 31 — for full audit transparency.' },
  { icon: <FaRobot />, title: 'AI-Powered', desc: 'Upload a trial balance and Gemini AI automatically categorizes income, expenses, and assets into the correct tax treatment.' },
  { icon: <FaHandshake />, title: 'Trusted Locally', desc: 'Founded in Kigali by a Rwanda-trained professional. We know the RRA, the e-tax portal, and local compliance requirements.' },
  { icon: <FaGlobeAfrica />, title: 'Africa-Ready', desc: 'Serving local and international investors. Aligned with IFRS, East African Community standards, and double tax treaties.' },
];

const TESTIMONIALS = [
  { name: 'Jean-Pierre Nkurunziza', role: 'CFO, Kigali Real Estate Ltd', text: 'AGN\'s CIT engine saved us weeks of manual computation. The AI analysis of our trial balance was surprisingly accurate.', stars: 5 },
  { name: 'Sophie Uwimana', role: 'CEO, TechStart Rwanda', text: 'Finally a platform that understands Rwanda tax law deeply. The PAYE calculator alone is worth it for our HR team.', stars: 5 },
  { name: 'David Chen', role: 'Regional Director, Pan-Africa Ventures', text: 'As a foreign investor, the AI advisor helped us understand WHT obligations in minutes rather than hiring a consultant.', stars: 5 },
];

const Home = () => {
  return (
    <div className="home-page">

      {/* ── HERO SECTION ── */}
      <section className="hero-gradient d-flex align-items-center" style={{ minHeight: '92vh', paddingTop: '80px' }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div variants={stagger} initial="hidden" animate="visible">
                <motion.div variants={fadeUp}>
                  <Badge className="mb-3 px-3 py-2 rounded-pill" style={{ background: 'rgba(249,226,25,0.15)', color: '#F9E219', border: '1px solid rgba(249,226,25,0.3)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                    🇷🇼 RWANDA'S AI TAX PLATFORM
                  </Badge>
                </motion.div>
                <motion.h1 variants={fadeUp} className="display-3 fw-bold text-white mb-4" style={{ lineHeight: 1.1 }}>
                  Rwanda Tax Compliance,{' '}
                  <span style={{ color: '#F9E219' }}>Powered by AI.</span>
                </motion.h1>
                <motion.p variants={fadeUp} className="lead mb-4" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem' }}>
                  AGN Bridge Consult brings you Rwanda's most comprehensive tax computation platform — CIT Articles 24–31, VAT (18%), PAYE, WHT, and an AI advisor that knows Rwanda tax law inside out.
                </motion.p>
                <motion.div variants={fadeUp} className="d-flex flex-wrap gap-3 mb-4">
                  <Link to="/signup">
                    <Button variant="custom" size="lg" className="rounded-pill px-5 fw-bold shadow">
                      Start Computing Free
                    </Button>
                  </Link>
                  <Link to="/vat">
                    <Button variant="outline-light" size="lg" className="rounded-pill px-5">
                      Try VAT Calculator
                    </Button>
                  </Link>
                </motion.div>
                <motion.div variants={fadeUp} className="d-flex flex-wrap gap-2">
                  {['Articles 24–31 CIT', 'VAT 18%', 'PAYE 2025 Bands', 'WHT Rates', 'AI Analysis'].map((f, i) => (
                    <span key={i} className="feature-chip"><FaCheckCircle size={9} className="me-1" />{f}</span>
                  ))}
                </motion.div>
              </motion.div>
            </Col>

            <Col lg={6} className="d-none d-lg-block">
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
                {/* Floating cards demo */}
                <div style={{ position: 'relative', height: 400 }}>
                  {/* Main card */}
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    style={{ position: 'absolute', top: 20, left: 0, right: 0, zIndex: 2 }}>
                    <div className="glass rounded-4 p-4 shadow-lg">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="ai-badge">AI Computing</span>
                        <span className="text-muted small ms-auto">CIT 2025</span>
                      </div>
                      <div className="mb-3">
                        <div className="text-muted small mb-1">Accounting Profit</div>
                        <div className="fw-bold" style={{ color: '#006F46', fontSize: '1.4rem' }}>RWF 85,000,000</div>
                      </div>
                      <div className="d-flex justify-content-between mb-1 small">
                        <span className="text-muted">Add-backs (Art. 25)</span>
                        <span className="text-danger fw-semibold">+ RWF 4,200,000</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3 small">
                        <span className="text-muted">Tax Depreciation (Art. 28)</span>
                        <span className="text-success fw-semibold">− RWF 1,800,000</span>
                      </div>
                      <div className="rounded-3 p-3 text-center" style={{ background: '#006F46' }}>
                        <div className="text-white-50 small">CIT Payable (30%)</div>
                        <div className="text-white fw-bold fs-4">RWF 26,220,000</div>
                      </div>
                    </div>
                  </motion.div>
                  {/* Small badge cards */}
                  <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                    style={{ position: 'absolute', bottom: 80, left: -20, zIndex: 3 }}>
                    <div className="glass rounded-3 px-3 py-2 shadow-sm d-flex align-items-center gap-2">
                      <FaRobot style={{ color: '#764ba2' }} />
                      <div>
                        <div className="fw-semibold" style={{ fontSize: '0.75rem' }}>AI Analysis Complete</div>
                        <div className="text-muted" style={{ fontSize: '0.65rem' }}>3 insights generated</div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 1 }}
                    style={{ position: 'absolute', bottom: 60, right: -10, zIndex: 3 }}>
                    <div className="glass rounded-3 px-3 py-2 shadow-sm">
                      <div className="fw-semibold" style={{ fontSize: '0.75rem', color: '#006F46' }}>🇷🇼 RRA Compliant</div>
                      <div className="text-muted" style={{ fontSize: '0.65rem' }}>All articles applied</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-4 bg-white border-bottom">
        <Container>
          <AnimatedSection>
            <Row className="g-4 text-center">
              {STATS.map((s, i) => (
                <Col xs={6} md={3} key={i}>
                  <motion.div variants={fadeUp}>
                    <div className="counter-number">{s.num}</div>
                    <div className="fw-semibold text-dark">{s.label}</div>
                    <div className="text-muted small">{s.sub}</div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── TAX TOOLS SHOWCASE ── */}
      <section className="section-padding bg-light">
        <Container>
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-5">
              <Badge className="mb-3 px-3 py-2 rounded-pill" bg="primary">Tax Calculators</Badge>
              <h2 className="fw-bold display-5 mb-3">Every Rwanda Tax, Computed Instantly</h2>
              <p className="lead text-muted mx-auto" style={{ maxWidth: 600 }}>
                From corporate income tax to VAT, PAYE, and withholding tax — all powered by Rwanda's Income Tax Law and Gemini AI.
              </p>
            </motion.div>
            <Row className="g-4">
              {TAX_FEATURES.map((f, i) => (
                <Col md={6} xl={3} key={i}>
                  <motion.div variants={fadeUp}>
                    <Link to={f.to} className="text-decoration-none">
                      <Card className="h-100 border-0 shadow-sm card-hover rounded-4 p-4">
                        <div className="service-icon-box mb-3" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h5 className="fw-bold mb-0">{f.title}</h5>
                          <Badge bg="light" text="dark" style={{ fontSize: '0.7rem' }}>{f.badge}</Badge>
                        </div>
                        <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>{f.desc}</p>
                        <div className="d-flex align-items-center text-primary fw-semibold small mt-auto">
                          Open Calculator <FaArrowRight className="ms-2" size={12} />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── AI ADVISOR HIGHLIGHT ── */}
      <section className="section-padding" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2f4a 100%)' }}>
        <Container>
          <AnimatedSection>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <motion.div variants={fadeUp}>
                  <span className="ai-badge mb-3 d-inline-flex">Gemini AI</span>
                  <h2 className="fw-bold text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                    Your Personal Rwanda Tax Advisor, Available 24/7
                  </h2>
                  <p className="mb-4" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.8 }}>
                    Our AI Advisor is trained on Rwanda's Income Tax Law, VAT Act, and RRA guidelines. Ask anything — from "What's deductible under Article 24?" to "How do I compute PAYE for a salary of RWF 500,000?" — and get instant, accurate answers.
                  </p>
                  <div className="d-flex flex-column gap-2">
                    {['Articles 24–31 CIT deductibility explained', 'VAT registration & filing obligations', 'PAYE bands and RSSB deductions 2025', 'WHT obligations and certificate issuance'].map((item, i) => (
                      <div key={i} className="d-flex align-items-center gap-2">
                        <FaCheckCircle style={{ color: '#F9E219', flexShrink: 0 }} size={14} />
                        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-3" style={{ background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.3)' }}>
                    <div className="text-white small"><FaRobot className="me-2" style={{ color: '#a78bfa' }} />
                      Click the <strong style={{ color: '#a78bfa' }}>purple robot button</strong> at the bottom right to start chatting with your AI Tax Advisor.
                    </div>
                  </div>
                </motion.div>
              </Col>
              <Col lg={6}>
                <motion.div variants={fadeUp}>
                  {/* Mock chat UI */}
                  <div className="rounded-4 overflow-hidden shadow-xl" style={{ background: '#1e2a3a', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaRobot color="white" size={16} />
                      </div>
                      <div>
                        <div className="fw-semibold text-white" style={{ fontSize: '0.85rem' }}>AGN Tax AI Advisor</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>Rwanda Tax Law Expert • Powered by Gemini</div>
                      </div>
                      <div className="ms-auto d-flex gap-1">
                        {[0, 0.3, 0.6].map((d, i) => (
                          <motion.div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }}
                            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: d }} />
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 220 }}>
                      {[
                        { role: 'user', text: 'What expenses are deductible under Article 24?' },
                        { role: 'ai', text: 'Under Article 24, expenses are deductible if they are:\n• Incurred wholly for business purposes\n• Supported by documentation\n• Not excluded by Article 25 (fines, penalties, personal expenses)\n\nKey non-deductibles under Art. 25 include: fines, donations, and provisions.' },
                        { role: 'user', text: 'When is the CIT return due?' },
                        { role: 'ai', text: '📅 The CIT Annual Return is due by 30 June each year for the preceding fiscal year. Advance payments are due quarterly.' },
                      ].map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '82%', padding: '8px 12px', borderRadius: m.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                            background: m.role === 'user' ? '#006F46' : 'rgba(255,255,255,0.07)',
                            color: '#fff', fontSize: '0.78rem', lineHeight: 1.5,
                            border: m.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                            whiteSpace: 'pre-line',
                          }}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem 1rem', display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '8px 14px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                        Ask about Rwanda tax law...
                      </div>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <FaArrowRight color="white" size={13} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── WHY CHOOSE AGN ── */}
      <section className="section-padding bg-white">
        <Container>
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-5">
              <h6 className="text-primary fw-bold text-uppercase ls-2 mb-2">Why Choose AGN</h6>
              <h2 className="fw-bold display-5">Built for Rwanda. Built for the World.</h2>
            </motion.div>
            <Row className="g-4">
              {WHY_AGN.map((w, i) => (
                <Col md={6} lg={3} key={i}>
                  <motion.div variants={fadeUp}>
                    <Card className="h-100 border-0 shadow-sm card-hover rounded-4 p-4 text-center">
                      <div className="service-icon-box mx-auto mb-3" style={{ fontSize: '1.5rem', color: '#006F46', background: '#e8f5ee' }}>{w.icon}</div>
                      <h5 className="fw-bold mb-2">{w.title}</h5>
                      <p className="text-muted small" style={{ lineHeight: 1.7 }}>{w.desc}</p>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-padding" style={{ background: '#f8fafb' }}>
        <Container>
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center mb-5">
              <h6 className="text-primary fw-bold text-uppercase ls-2 mb-2">Client Reviews</h6>
              <h2 className="fw-bold display-5">Trusted by Rwanda's Businesses</h2>
            </motion.div>
            <Row className="g-4">
              {TESTIMONIALS.map((t, i) => (
                <Col md={4} key={i}>
                  <motion.div variants={fadeUp}>
                    <Card className="h-100 border-0 shadow-sm rounded-4 p-4">
                      <div className="d-flex gap-1 mb-3">
                        {Array(t.stars).fill(0).map((_, j) => <FaStar key={j} size={14} style={{ color: '#F9E219' }} />)}
                      </div>
                      <p className="text-muted mb-4" style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>"{t.text}"</p>
                      <div className="d-flex align-items-center gap-3 mt-auto">
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006F46', fontWeight: 700, fontSize: '1rem' }}>
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>{t.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{t.role}</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="section-padding hero-gradient">
        <Container>
          <AnimatedSection>
            <motion.div variants={fadeUp} className="text-center">
              <h2 className="fw-bold display-4 text-white mb-4">Ready to Simplify Rwanda Tax Compliance?</h2>
              <p className="lead mb-5" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '0 auto 2rem' }}>
                Join businesses across Rwanda using AGN's AI-powered platform for accurate, transparent, and audit-ready tax computations.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/signup">
                  <Button variant="custom" size="lg" className="rounded-pill px-5 fw-bold shadow">Get Started Free</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline-light" size="lg" className="rounded-pill px-5">Talk to an Expert</Button>
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </Container>
      </section>

    </div>
  );
};

export default Home;
