import React from 'react';
import { Container, Row, Col, Card, Accordion, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalculator, FaBriefcase, FaServer, FaFlask, FaBuilding, FaRobot, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <FaCalculator size={28} />,
    title: 'Accounting, Tax & Auditing',
    description: 'Comprehensive financial compliance, computation, and advisory services — now AI-powered.',
    color: '#006F46', bg: '#e8f5ee',
    items: [
      'Accounting & Bookkeeping: IFRS-compliant financial statements',
      'Tax Consultancy: Advisory, compliance, and CIT optimization',
      'External & Internal Audits: Risk-based auditing and compliance',
      'Payroll & Statutory Compliance: PAYE, RSSB setup and administration',
    ]
  },
  {
    icon: <FaRobot size={28} />,
    title: 'AI-Powered Tax Calculators',
    description: 'Rwanda\'s most accurate AI-driven tax computation platform, available 24/7.',
    color: '#7c3aed', bg: '#f5f3ff',
    badge: 'New',
    items: [
      'CIT Engine: Articles 24–31, trial balance upload, audit trail',
      'VAT Calculator: 18% standard rate, apportionment, RRA return',
      'PAYE Calculator: 2025 bands, RSSB, payroll run mode',
      'WHT Calculator: All 9 categories, treaty-rate support',
    ],
    link: '/vat',
    linkLabel: 'Try Free Calculators',
  },
  {
    icon: <FaBriefcase size={28} />,
    title: 'Management Consulting',
    description: 'Improving performance, managing risk, and navigating change in Rwanda\'s business landscape.',
    color: '#0284c7', bg: '#e0f2fe',
    items: [
      'Business Strategy Development: Market entry and feasibility',
      'Organizational Design & Restructuring',
      'Performance Improvement: Operational audits and cost optimization',
      'Investor Advisory Services: Guidance for foreign investors',
    ]
  },
  {
    icon: <FaServer size={28} />,
    title: 'Technical & Financial Services',
    description: 'Integrated solutions for infrastructure, project finance, and investment.',
    color: '#d97706', bg: '#fff3cd',
    items: [
      'Project Feasibility & Financial Modeling: Bankable business plans',
      'Procurement Support & Due Diligence: Tendering and vetting',
      'Financial Statement Preparation: IAS/IFRS compliant',
    ]
  },
  {
    icon: <FaFlask size={28} />,
    title: 'Research & Development',
    description: 'Services rooted in data, innovation, and measurable impact.',
    color: '#be185d', bg: '#fce7f3',
    items: [
      'Market & Policy Research: In-depth studies and forecasts',
      'Social & Impact Research: Surveys and evaluations for NGOs',
      'Innovation Advisory: Tech adoption and R&D incentives',
    ]
  },
  {
    icon: <FaBuilding size={28} />,
    title: 'Corporate Support Services',
    description: 'Managing back-office and compliance functions so you focus on growth.',
    color: '#0891b2', bg: '#e0f2fe',
    items: [
      'Company Registration & Legal Setup',
      'Secretarial Services: Board management and filings',
      'HR & Payroll Solutions: Recruitment and contracts',
      'Office & Local Representation Services',
    ]
  },
];

const Services = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="services-page page-top-offset">
      {/* Header */}
      <div className="calc-header">
        <Container className="py-4">
          <div className="text-center">
            <span className="ai-badge mb-3 d-inline-flex">What We Do</span>
            <h1 className="display-4 fw-bold text-white mb-3">Our Services</h1>
            <p className="lead text-white-50 mx-auto" style={{ maxWidth: 600 }}>
              Expert legal, financial, technical, and AI-powered tax services for investors across Rwanda and East Africa.
            </p>
          </div>
        </Container>
      </div>

      <Container className="section-padding">
        <Row className="g-4">
          {services.map((service, index) => (
            <Col lg={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden card-hover">
                  <Card.Header className="bg-white border-0 p-4 pb-0">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="service-icon-box" style={{ background: service.bg, color: service.color }}>
                        {service.icon}
                      </div>
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <h5 className="fw-bold mb-0">{service.title}</h5>
                          {service.badge && <Badge bg="primary" className="rounded-pill" style={{ fontSize: '0.65rem' }}>{service.badge}</Badge>}
                        </div>
                        <p className="text-muted mb-0 small mt-1">{service.description}</p>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4 pt-2">
                    <Accordion flush>
                      <Accordion.Item eventKey="0" className="border-0">
                        <Accordion.Header className="p-0">
                          <span className="text-primary small fw-semibold">View Detailed Services</span>
                        </Accordion.Header>
                        <Accordion.Body className="px-0 pt-2">
                          <ul className="list-unstyled mb-0">
                            {service.items.map((item, idx) => (
                              <li key={idx} className="mb-2 d-flex align-items-start gap-2">
                                <FaCheckCircle size={13} className="mt-1 flex-shrink-0" style={{ color: service.color }} />
                                <span className="small text-muted">{item}</span>
                              </li>
                            ))}
                          </ul>
                          {service.link && (
                            <Link to={service.link} className="d-inline-flex align-items-center gap-1 mt-3 fw-semibold small" style={{ color: service.color }}>
                              {service.linkLabel} <FaArrowRight size={11} />
                            </Link>
                          )}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* CTA */}
        <div className="text-center mt-5 pt-3">
          <h4 className="fw-bold mb-3">Ready to experience Rwanda's best tax platform?</h4>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/signup" className="btn btn-primary rounded-pill px-5 fw-bold">Get Started Free</Link>
            <Link to="/contact" className="btn btn-outline-primary rounded-pill px-5">Contact an Expert</Link>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default Services;
