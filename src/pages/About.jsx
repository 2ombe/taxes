import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaGlobeAfrica, FaHandshake, FaLightbulb, FaShieldAlt, FaRocket, FaStar } from 'react-icons/fa';

const CORE_VALUES = [
  { icon: <FaShieldAlt />, label: 'Trust', desc: 'We build relationships on transparency and integrity.' },
  { icon: <FaStar />, label: 'Professionalism', desc: 'International standards in every engagement.' },
  { icon: <FaGlobeAfrica />, label: 'Global Outlook', desc: 'Local delivery, global expectations.' },
  { icon: <FaLightbulb />, label: 'Innovation', desc: 'AI-powered tools for the future of consulting.' },
  { icon: <FaHandshake />, label: 'Partnership', desc: 'We succeed when our clients succeed.' },
];

const About = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="about-page page-top-offset">
      {/* Header */}
      <div className="calc-header">
        <Container className="py-4">
          <div className="text-center">
            <span className="ai-badge mb-3 d-inline-flex">Who We Are</span>
            <h1 className="display-4 fw-bold text-white mb-3">About AGN Bridge Consult</h1>
            <p className="lead text-white-50 mx-auto" style={{ maxWidth: 600 }}>
              Bridging global capital with African opportunities through expert advisory, AI-powered tools, and deep local knowledge.
            </p>
          </div>
        </Container>
      </div>

      <Container className="section-padding">
        {/* Company Overview */}
        <Row className="align-items-center mb-5 pb-5 g-5">
          <Col lg={6}>
            <div className="divider-green mb-3"></div>
            <h2 className="display-5 fw-bold mb-4">Company Overview</h2>
            <p className="lead text-dark mb-3">
              AGN Bridge Consult Ltd is a Rwanda-based multidisciplinary consulting firm founded by Nzabintwali Gentil Arsene.
            </p>
            <p className="text-muted text-justify" style={{ lineHeight: 1.9 }}>
              Our mission is to bridge global capital and expertise with emerging opportunities in Africa. We support foreign and local investors with expert legal, financial, technical, and market entry services. Headquartered in Kigali, Rwanda — Africa's fastest-growing investment hub — we provide advisory services aligned with international standards (ISIC) and Rwanda's regulatory environment.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.9 }}>
              In 2025, we launched Rwanda's first AI-powered tax computation platform, combining Gemini AI with deep Rwanda tax law expertise to deliver instant, audit-ready CIT, VAT, PAYE, and WHT computations for businesses across East Africa.
            </p>
          </Col>
          <Col lg={6}>
            <div className="glass-dark p-5 rounded-4 shadow text-center">
              <div className="mb-4">
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(249,226,25,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2.5rem' }}>
                  🇷🇼
                </div>
                <h3 className="text-white mb-1">Founded by</h3>
                <h2 className="text-secondary fw-bold">Nzabintwali Gentil Arsene</h2>
                <div className="divider-green mx-auto my-3"></div>
                <p className="text-white-50 mb-0">Managing Director</p>
                <p className="text-white-50 small">Kigali, Rwanda</p>
              </div>
              <Row className="g-3 mt-2">
                {[{ num: '2025', label: 'Founded' }, { num: '5+', label: 'Services' }, { num: 'AI', label: 'Powered' }].map((s, i) => (
                  <Col xs={4} key={i}>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.75rem' }}>
                      <div className="text-secondary fw-bold fs-5">{s.num}</div>
                      <div className="text-white-50 small">{s.label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>

        {/* Vision & Mission */}
        <Row className="g-4 mb-5 pb-5">
          <Col md={6}>
            <Card className="h-100 border-0 rounded-4 overflow-hidden shadow-sm" style={{ background: '#f8fafb' }}>
              <Card.Body className="p-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e8f5ee', color: '#006F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🎯</div>
                  <h3 className="text-primary fw-bold mb-0">Our Vision</h3>
                </div>
                <p className="fs-5 text-dark" style={{ lineHeight: 1.8 }}>
                  To be Africa's most trusted advisor for global investors seeking opportunities in Rwanda and East Africa.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 rounded-4 overflow-hidden shadow-sm bg-primary text-white">
              <Card.Body className="p-5">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(249,226,25,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🚀</div>
                  <h3 className="text-secondary fw-bold mb-0">Our Mission</h3>
                </div>
                <p className="fs-5" style={{ lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                  To deliver expert consulting solutions — powered by AI and deep local expertise — that align global vision with local excellence.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Core Values */}
        <div className="text-center mb-5">
          <div className="divider-green mx-auto mb-3"></div>
          <h2 className="fw-bold">Our Core Values</h2>
          <p className="text-muted">The principles that guide every engagement</p>
        </div>
        <Row className="justify-content-center g-4 mb-5">
          {CORE_VALUES.map((value, idx) => (
            <Col key={idx} md={4} lg={2} className="text-center">
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                <Card className="border-0 shadow-sm rounded-4 p-3 h-100 card-hover">
                  <div className="service-icon-box mx-auto mb-3" style={{ background: '#e8f5ee', color: '#006F46', fontSize: '1.2rem' }}>
                    {value.icon}
                  </div>
                  <h6 className="fw-bold mb-1">{value.label}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{value.desc}</p>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* AI Platform Highlight */}
        <Card className="border-0 rounded-4 overflow-hidden shadow-sm" style={{ background: 'linear-gradient(135deg, #0d1b2a 0%, #1a2f4a 100%)' }}>
          <Card.Body className="p-5">
            <Row className="align-items-center">
              <Col lg={8}>
                <span className="ai-badge mb-3 d-inline-flex">2025 Innovation</span>
                <h3 className="fw-bold text-white mb-3">Rwanda's First AI Tax Platform</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                  In 2025, AGN Bridge Consult launched the most advanced tax computation platform in Rwanda — integrating Google Gemini AI with Rwanda's Income Tax Law to automate CIT Articles 24–31, VAT, PAYE, and WHT computations for businesses of every size.
                </p>
              </Col>
              <Col lg={4} className="text-center">
                <div style={{ fontSize: '4rem' }}>🤖</div>
                <div className="fw-bold text-white mt-2">Powered by Gemini AI</div>
                <div className="text-white-50 small">Google DeepMind</div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </motion.div>
  );
};

export default About;
