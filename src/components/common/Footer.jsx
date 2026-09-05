import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const FOOTER_LINKS = {
  Services: [
    { label: 'Accounting & Tax', to: '/services' },
    { label: 'Management Consulting', to: '/services' },
    { label: 'CIT Engine', to: '/tax-engine' },
    { label: 'VAT Calculator', to: '/vat' },
    { label: 'PAYE Calculator', to: '/paye' },
    { label: 'WHT Calculator', to: '/wht' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Strategy', to: '/strategy' },
    { label: 'Contact', to: '/contact' },
    { label: 'Login', to: '/login' },
    { label: 'Get Started', to: '/signup' },
  ],
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer pt-5 pb-3 mt-5">
      <Container>
        <Row className="g-4 pb-4">
          {/* Brand Column */}
          <Col lg={4}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src="/logo.jpg" alt="AGN Logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
              <div>
                <div className="footer-brand" style={{ fontSize: '1rem' }}>AGN Bridge Consult</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>RWANDA TAX & ADVISORY</div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
              Rwanda's leading AI-powered tax computation and investment advisory platform. Bridging global capital with African opportunities.
            </p>
            <div className="d-flex gap-2 mt-3">
              {[
                { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
                { icon: <FaTwitter />, href: '#', label: 'Twitter' },
                { icon: <FaFacebook />, href: '#', label: 'Facebook' },
                { icon: <FaWhatsapp />, href: 'https://wa.me/250788612650', label: 'WhatsApp' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="social-icon text-white" title={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <Col md={3} key={heading}>
              <h6 className="text-white fw-bold mb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>{heading}</h6>
              <ul className="list-unstyled">
                {links.map(l => (
                  <li key={l.label} className="mb-2">
                    <Link to={l.to} style={{ fontSize: '0.875rem' }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </Col>
          ))}

          {/* Contact */}
          <Col md={2}>
            <h6 className="text-white fw-bold mb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>Contact</h6>
            <div className="d-flex flex-column gap-2" style={{ fontSize: '0.8rem' }}>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="d-flex align-items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-secondary flex-shrink-0" /><span>Kigali, Rwanda</span>
              </a>
              <a href="mailto:info@agnbridge.com" className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-secondary flex-shrink-0" /><span>info@agnbridge.com</span>
              </a>
              <a href="tel:+250788612650" className="d-flex align-items-center gap-2">
                <FaPhone className="text-secondary flex-shrink-0" /><span>+250 788 612 650</span>
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom bar */}
        <div className="border-top pt-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
          <p className="mb-0" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            © {year} AGN Bridge Consult Ltd. All rights reserved. | Kigali, Rwanda
          </p>
          <div className="d-flex gap-3" style={{ fontSize: '0.8rem' }}>
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
