import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaUser, FaTachometerAlt, FaChevronDown, FaFileInvoiceDollar, FaUniversity } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const TAX_TOOLS = [
  { to: '/tax-engine', label: 'CIT Engine', sub: 'Corporate Income Tax', icon: '🧮' },
  { to: '/vat', label: 'VAT Calculator', sub: '18% Rwanda VAT', icon: '📊' },
  { to: '/paye', label: 'PAYE Calculator', sub: '2025 Tax Bands', icon: '👤' },
  { to: '/wht', label: 'WHT Calculator', sub: 'Withholding Tax', icon: '🏦' },
];

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => { setExpanded(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const isTaxActive = ['/tax-engine', '/vat', '/paye', '/wht'].includes(location.pathname);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={setExpanded}
      className={`py-3 transition-all ${scrolled || expanded ? 'glass shadow-sm' : 'bg-transparent'}`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <img src="/logo.jpg" alt="AGN Logo" className="navbar-brand-logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
          <div>
            <div className="fw-bold text-primary" style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>AGN Bridge Consult</div>
            <div className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>RWANDA TAX & ADVISORY</div>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="border-0">
          <FaBars className="text-primary" />
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-1">
            {/* Main nav items */}
            <Nav.Link as={Link} to="/" className={`fw-medium px-3 rounded-3 ${isActive('/') ? 'text-primary bg-light' : ''}`}>Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className={`fw-medium px-3 rounded-3 ${isActive('/about') ? 'text-primary bg-light' : ''}`}>About</Nav.Link>
            <Nav.Link as={Link} to="/services" className={`fw-medium px-3 rounded-3 ${isActive('/services') ? 'text-primary bg-light' : ''}`}>Services</Nav.Link>
            <Nav.Link as={Link} to="/strategy" className={`fw-medium px-3 rounded-3 ${isActive('/strategy') ? 'text-primary bg-light' : ''}`}>Strategy</Nav.Link>

            {/* Tax Tools Dropdown — always visible */}
            <NavDropdown
              title={
                <span className={`fw-medium ${isTaxActive ? 'text-primary' : ''}`}>
                  Tax Tools {isTaxActive && <span className="ms-1" style={{ fontSize: '0.6rem', background: '#006F46', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>ACTIVE</span>}
                </span>
              }
              id="tax-tools-dropdown"
              className="fw-medium"
            >
              {TAX_TOOLS.map(tool => (
                <NavDropdown.Item key={tool.to} as={Link} to={tool.to} className={isActive(tool.to) ? 'text-primary' : ''}>
                  <span className="me-2">{tool.icon}</span>
                  <div className="d-inline-block">
                    <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>{tool.label}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{tool.sub}</div>
                  </div>
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            {/* Authenticated routes */}
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className={`fw-medium px-3 rounded-3 d-flex align-items-center gap-1 ${isActive('/dashboard') ? 'text-primary bg-light' : ''}`}>
                  <FaTachometerAlt size={14} /> Dashboard
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="fw-medium px-3 text-danger" style={{ cursor: 'pointer' }}>
                  <FaSignOutAlt className="me-1" /> Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="fw-medium px-3 rounded-3 d-flex align-items-center gap-1">
                <FaUser size={13} /> Login
              </Nav.Link>
            )}

            {/* CTA Button */}
            <Nav.Link as={Link} to="/contact" className="ms-2">
              <Button variant="custom" size="sm" className="rounded-pill px-4 fw-semibold">Contact Us</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
