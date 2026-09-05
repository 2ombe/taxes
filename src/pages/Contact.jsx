import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaWhatsapp, FaCheckCircle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const Contact = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      // Send to backend or fallback to mailto
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      } else throw new Error();
    } catch {
      // Fallback: open mailto
      const body = encodeURIComponent(`Name: ${form.firstName} ${form.lastName}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`mailto:info@agnbridge.com?subject=${encodeURIComponent(form.subject)}&body=${body}`);
      setStatus('success');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="contact-page page-top-offset">
      {/* Header */}
      <div className="calc-header">
        <Container className="py-4">
          <div className="text-center">
            <span className="ai-badge mb-3 d-inline-flex">Get in Touch</span>
            <h1 className="display-4 fw-bold text-white mb-3">Contact Us</h1>
            <p className="lead text-white-50 mx-auto" style={{ maxWidth: 500 }}>
              Ready to explore opportunities in Africa? We are here to guide you every step of the way.
            </p>
          </div>
        </Container>
      </div>

      <Container className="section-padding">
        <Row className="g-5 align-items-start">
          <Col lg={5}>
            <h4 className="fw-bold mb-4">Let's Connect</h4>
            <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>
              Whether you need help with Rwanda tax compliance, investment advisory, or want to explore our AI-powered platform — our team in Kigali is ready to help.
            </p>

            <div className="d-flex flex-column gap-3 mb-4">
              {[
                { icon: <FaMapMarkerAlt size={20} />, label: 'Our Location', value: 'Kigali, Rwanda', href: 'https://maps.google.com/?q=Kigali,Rwanda', color: '#006F46' },
                { icon: <FaEnvelope size={20} />, label: 'Email Us', value: 'info@agnbridge.com', href: 'mailto:info@agnbridge.com', color: '#0284c7' },
                { icon: <FaPhone size={20} />, label: 'Call Us', value: '+250 788 612 650', href: 'tel:+250788612650', color: '#d97706' },
                { icon: <FaWhatsapp size={20} />, label: 'WhatsApp', value: 'Chat with us now', href: 'https://wa.me/250788612650', color: '#25D366' },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="text-decoration-none">
                  <Card className="border-0 shadow-sm rounded-4 p-3 card-hover">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${c.color}15`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {c.icon}
                      </div>
                      <div>
                        <div className="fw-semibold small text-dark">{c.label}</div>
                        <div className="text-muted small">{c.value}</div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>

            <Card className="border-0 rounded-4 p-4" style={{ background: 'linear-gradient(135deg, #006F46 0%, #004d31 100%)' }}>
              <h6 className="fw-bold text-white mb-2">Office Hours</h6>
              <div className="d-flex flex-column gap-1" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' }}>
                <div>Mon – Fri: 8:00 AM – 6:00 PM (EAT)</div>
                <div>Saturday: 9:00 AM – 2:00 PM (EAT)</div>
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>AI Advisor available 24/7</div>
              </div>
            </Card>
          </Col>

          <Col lg={7}>
            <Card className="border-0 shadow rounded-4 p-4 p-md-5">
              <h4 className="fw-bold mb-4">Send Us a Message</h4>

              {status === 'success' && (
                <Alert variant="success" className="rounded-3 d-flex align-items-center gap-2">
                  <FaCheckCircle /> Your message has been sent! We'll respond within 24 hours.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">First Name</Form.Label>
                      <Form.Control type="text" name="firstName" placeholder="Jean-Pierre" className="rounded-3 py-3 bg-light border-0"
                        value={form.firstName} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Last Name</Form.Label>
                      <Form.Control type="text" name="lastName" placeholder="Nkurunziza" className="rounded-3 py-3 bg-light border-0"
                        value={form.lastName} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Email Address</Form.Label>
                      <Form.Control type="email" name="email" placeholder="you@company.com" className="rounded-3 py-3 bg-light border-0"
                        value={form.email} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Subject</Form.Label>
                      <Form.Select name="subject" className="rounded-3 py-3 bg-light border-0"
                        value={form.subject} onChange={handleChange} required>
                        <option value="">Select a topic...</option>
                        <option>CIT Tax Computation</option>
                        <option>VAT Advisory</option>
                        <option>PAYE & Payroll</option>
                        <option>Investment Advisory</option>
                        <option>Audit Services</option>
                        <option>General Inquiry</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Message</Form.Label>
                      <Form.Control as="textarea" rows={5} name="message" placeholder="How can we help you?" className="rounded-3 bg-light border-0"
                        value={form.message} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Button type="submit" variant="primary" size="lg" className="w-100 rounded-pill fw-bold mt-2" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message →'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default Contact;
