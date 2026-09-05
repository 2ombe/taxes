import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaFlagCheckered, FaRocket, FaChartBar, FaGlobe, FaRobot, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Strategy = () => {
    const timeline = [
        { year: '2025', title: 'Foundation & AI Tax Launch', desc: 'Company formation, website launch, rollout of Rwanda AI Tax Platform (CIT, VAT, PAYE, WHT).', icon: <FaRocket /> },
        { year: '2026', title: 'Regional Expansion', desc: '10+ international clients, opening Nairobi desk, cross-border EAC tax integration.', icon: <FaChartBar /> },
        { year: '2027', title: 'Digital Growth', desc: 'Launch digital "Investor Gateway" with automated RDB company setup and RRA e-tax API filing.', icon: <FaGlobe /> },
        { year: '2028', title: 'Pan-African Scale', desc: 'Expand advisory services into Ghana and Kenya, host the inaugural Kigali Foreign Investment Summit.', icon: <FaGlobe /> },
        { year: '2029', title: 'Enterprise Advisory', desc: '20+ specialized tax and legal consultants, serving Tier-1 international and regional corporates.', icon: <FaChartBar /> },
        { year: '2030', title: 'Market Leader', desc: 'Recognized as the #1 AI-powered tax & investment advisory firm across East and Central Africa.', icon: <FaFlagCheckered /> },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="strategy-page page-top-offset">
            {/* Header */}
            <div className="calc-header">
                <Container className="py-4">
                    <div className="text-center">
                        <span className="ai-badge mb-3 d-inline-flex">Strategic Blueprint</span>
                        <h1 className="display-4 fw-bold text-white mb-3">Our Strategy & Roadmap</h1>
                        <p className="lead text-white-50 mx-auto" style={{ maxWidth: '650px' }}>
                            A 5-year vision (2025–2030) combining deep Rwanda tax law expertise, AI automation, and investment gateways.
                        </p>
                    </div>
                </Container>
            </div>

            <Container className="section-padding">
                {/* Timeline */}
                <div className="position-relative py-5">
                    <div className="position-absolute start-50 top-0 bottom-0 border-start border-2 border-primary opacity-25 d-none d-md-block"></div>
                    {timeline.map((item, index) => (
                        <Row key={index} className={`mb-5 align-items-center ${index % 2 === 0 ? '' : 'flex-md-row-reverse'}`}>
                            <Col md={5} className={`text-center ${index % 2 === 0 ? 'text-md-end' : 'text-md-start'}`}>
                                <Badge bg="primary" className="mb-2">{item.year}</Badge>
                                <h4 className="fw-bold">{item.title}</h4>
                                <p className="text-muted">{item.desc}</p>
                            </Col>
                            <Col md={2} className="text-center position-relative">
                                <div className="bg-secondary text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto shadow" style={{ width: '60px', height: '60px', zIndex: 10, position: 'relative' }}>
                                    {item.icon}
                                </div>
                            </Col>
                            <Col md={5}></Col>
                        </Row>
                    ))}
                </div>

                {/* Market Opportunity */}
                <Card className="bg-light border-0 rounded-4 p-5 mb-5 shadow-sm">
                    <Row className="align-items-center g-4">
                        <Col lg={6}>
                            <h3 className="fw-bold mb-3">The Rwanda Advantage & Market Opportunity</h3>
                            <p className="text-muted">
                                Rwanda is Africa’s premiere destination for ease of doing business. With rapid digitization, progressive economic zones (KIFC), and East African Community integration, international investment continues to surge.
                            </p>
                            <p className="fw-medium text-primary">
                                AGN Bridge Consult bridges the compliance and analytical gap with real-time AI modeling, minimizing regulatory penalties and maximizing corporate efficiency.
                            </p>
                            <div className="d-flex gap-2 mt-4">
                                <Link to="/tax-engine" className="btn btn-primary rounded-pill px-4">Open CIT Engine</Link>
                                <Link to="/vat" className="btn btn-outline-primary rounded-pill px-4">Try VAT Calculator</Link>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="bg-white p-4 rounded-4 shadow-sm">
                                <h5 className="fw-bold mb-3">Execution Phases</h5>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1 small fw-semibold">
                                        <span>Phase 1: Foundation & AI Tax Suite</span>
                                        <span>2025</span>
                                    </div>
                                    <ProgressBar variant="success" now={100} style={{ height: '8px' }} />
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1 small fw-semibold">
                                        <span>Phase 2: Regional Desks (Nairobi, Kampala)</span>
                                        <span>2026–2027</span>
                                    </div>
                                    <ProgressBar variant="warning" now={50} style={{ height: '8px' }} />
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1 small fw-semibold">
                                        <span>Phase 3: Pan-African Platform Scale</span>
                                        <span>2028–2030</span>
                                    </div>
                                    <ProgressBar variant="info" now={25} style={{ height: '8px' }} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* SWOT Analysis */}
                <div className="text-center mb-4">
                    <h3 className="fw-bold display-6">Strategic Position (SWOT)</h3>
                    <p className="text-muted">How AGN positions itself to lead the market</p>
                </div>
                <Row className="g-4">
                    <Col md={6}>
                        <Card className="h-100 border-0 shadow-sm border-start border-5 border-success rounded-4 p-3 card-hover">
                            <Card.Body>
                                <h5 className="fw-bold text-success mb-3">Strengths</h5>
                                <ul className="list-unstyled text-muted d-flex flex-column gap-2">
                                    <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-success" /> Proprietary Rwanda AI Tax Engine (CIT, VAT, PAYE, WHT)</li>
                                    <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-success" /> Ground-level Kigali presence and direct RRA experience</li>
                                    <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-success" /> Strict compliance with Rwanda Income Tax Law Articles 24–31</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="h-100 border-0 shadow-sm border-start border-5 border-info rounded-4 p-3 card-hover">
                            <Card.Body>
                                <h5 className="fw-bold text-info mb-3">Opportunities</h5>
                                <ul className="list-unstyled text-muted d-flex flex-column gap-2">
                                    <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-info" /> Surging foreign direct investment entering Kigali</li>
                                    <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-info" /> Corporate demand for automated, audit-proof tax documentation</li>
                                    <li className="d-flex align-items-center gap-2"><FaCheckCircle className="text-info" /> Integration of Gemini AI for real-time statutory advisory</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default Strategy;
