import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalculator, FaInfoCircle, FaFileDownload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdOutlineTax, MdPercent } from 'react-icons/md';
import { VATEngine, VAT_CONFIG } from '../utils/tax-engine/vatEngine.js';
import * as XLSX from 'xlsx';

const formatRWF = (v) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(v ?? 0);

const VAT_TIPS = [
  { icon: '📋', title: 'Registration Threshold', text: 'Any business with annual turnover ≥ RWF 20 million MUST register for VAT with RRA.' },
  { icon: '📅', title: 'Filing Deadline', text: 'VAT returns are filed monthly by the 15th of the following month. Late filing attracts 10% penalty on tax due.' },
  { icon: '📦', title: 'Zero-Rated vs Exempt', text: 'Zero-rated (exports) allow input VAT claims. Exempt supplies do NOT — input VAT on exempt is a cost.' },
  { icon: '💡', title: 'Input VAT Apportionment', text: 'If you make both taxable and exempt supplies, input VAT is apportioned using the taxable/total revenue ratio.' },
];

const VATCalculator = () => {
  const [inputs, setInputs] = useState({ taxableSales: 0, zeroRatedSales: 0, exemptSales: 0, taxableInputs: 0, capitalGoods: 0, openingVATCredit: 0 });
  const [result, setResult] = useState(null);
  const [period, setPeriod] = useState('');

  const setField = (field, value) => setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));

  const compute = () => setResult(VATEngine.compute(inputs));

  const exportExcel = () => {
    if (!result) return;
    const lines = VATEngine.getReturnLines(result);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['AGN Bridge Consult — VAT Return', '', `Period: ${period || 'N/A'}`],
      [],
      ['Box', 'Description', 'Amount (RWF)'],
      ...lines.map((l, i) => [`Box ${i + 1}`, l.label, l.amount]),
      [],
      ['VAT PAYABLE', '', result.vatPayable],
      ['VAT REFUNDABLE', '', result.vatRefund],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'VAT Return');
    XLSX.writeFile(wb, `VAT_Return_${period || 'period'}.xlsx`);
  };

  const inputFields = [
    { key: 'taxableSales',    label: 'Standard-Rated Sales (18%)',   hint: 'Sales subject to 18% VAT' },
    { key: 'zeroRatedSales',  label: 'Zero-Rated Sales (Exports)',   hint: 'Export sales at 0% VAT' },
    { key: 'exemptSales',     label: 'Exempt Sales',                 hint: 'VAT-exempt supplies' },
    { key: 'taxableInputs',   label: 'Taxable Purchases',            hint: 'Purchases on which you paid VAT' },
    { key: 'capitalGoods',    label: 'Capital Goods Purchased',      hint: 'Fixed assets acquired this period' },
    { key: 'openingVATCredit',label: 'VAT Credit b/f (if any)',      hint: 'Prior period refund not yet received' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-top-offset">
      {/* Header */}
      <div className="calc-header mb-0">
        <Container>
          <Row className="align-items-center py-4">
            <Col>
              <span className="ai-badge mb-2 d-inline-flex">AI Enhanced</span>
              <h1 className="display-5 fw-bold text-white mb-2">VAT Calculator</h1>
              <p className="text-white-50 mb-0">Rwanda Value Added Tax — 18% Standard Rate</p>
            </Col>
            <Col xs="auto" className="d-none d-md-block">
              <div className="p-3 rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                <MdOutlineTax size={40} className="text-white" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4">
          {/* Input Column */}
          <Col lg={7}>
            <Card className="calc-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">VAT Return Inputs</h4>
                <Form.Control type="text" placeholder="e.g., January 2025" style={{ width: 200 }} className="rounded-pill"
                  value={period} onChange={e => setPeriod(e.target.value)} />
              </div>

              <Row className="g-3 mb-4">
                {inputFields.map(f => (
                  <Col md={6} key={f.key}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">{f.label}</Form.Label>
                      <Form.Control type="number" min={0} placeholder="0" className="rounded-3"
                        value={inputs[f.key] || ''} onChange={e => setField(f.key, e.target.value)} />
                      <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>{f.hint}</Form.Text>
                    </Form.Group>
                  </Col>
                ))}
              </Row>

              <Button variant="primary" size="lg" className="w-100 rounded-pill fw-bold" onClick={compute}>
                <FaCalculator className="me-2" /> Compute VAT Return
              </Button>
            </Card>

            {/* Tips */}
            <Row className="g-3 mt-2">
              {VAT_TIPS.map((t, i) => (
                <Col md={6} key={i}>
                  <Card className="border-0 shadow-sm h-100 p-3 rounded-3">
                    <div className="d-flex gap-2 align-items-start">
                      <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                      <div>
                        <div className="fw-semibold small mb-1">{t.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>{t.text}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Results Column */}
          <Col lg={5}>
            <div className="sticky-top" style={{ top: '90px' }}>
              {result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Main result */}
                  <div className={`result-highlight mb-4 ${result.vatPayable > 0 ? '' : 'bg-success'}`}
                    style={{ background: result.vatPayable > 0 ? 'linear-gradient(135deg, #006F46 0%, #004d31 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <div className="d-flex align-items-center gap-2 mb-3 justify-content-center">
                      {result.vatPayable > 0
                        ? <FaTimesCircle className="text-warning" />
                        : <FaCheckCircle className="text-white" />}
                      <span className="text-white-50 fw-semibold small text-uppercase ls-2">
                        {result.position === 'PAYABLE' ? 'VAT Payable to RRA' : result.position === 'REFUNDABLE' ? 'VAT Refund Due' : 'Nil VAT'}
                      </span>
                    </div>
                    <div className="result-amount text-white mb-1">
                      {result.position === 'PAYABLE' ? formatRWF(result.vatPayable) : formatRWF(result.vatRefund)}
                    </div>
                    <div className="text-white-50 small">Standard Rate: {result.standardRate}% | Period: {period || 'N/A'}</div>
                  </div>

                  {/* Breakdown table */}
                  <Card className="calc-card p-3 mb-3">
                    <h6 className="fw-bold mb-3">Return Breakdown</h6>
                    <Table size="sm" className="mb-0">
                      <tbody>
                        <tr className="table-light"><td className="fw-semibold small" colSpan={2}>SALES</td></tr>
                        <tr><td className="text-muted small">Standard-Rated Sales</td><td className="text-end small fw-medium">{formatRWF(result.taxableSales)}</td></tr>
                        <tr><td className="text-muted small">Zero-Rated Sales</td><td className="text-end small fw-medium">{formatRWF(result.zeroRatedSales)}</td></tr>
                        <tr><td className="text-muted small">Exempt Sales</td><td className="text-end small fw-medium">{formatRWF(result.exemptSales)}</td></tr>
                        <tr className="fw-semibold"><td className="small">Output VAT (18%)</td><td className="text-end small text-danger">{formatRWF(result.outputVAT)}</td></tr>

                        <tr className="table-light"><td className="fw-semibold small" colSpan={2}>INPUT VAT</td></tr>
                        <tr><td className="text-muted small">Taxable Ratio</td><td className="text-end small"><Badge bg="primary">{result.taxableRatio}%</Badge></td></tr>
                        <tr><td className="text-muted small">Total Input VAT</td><td className="text-end small">{formatRWF(result.inputVATTotal)}</td></tr>
                        <tr className="fw-semibold"><td className="small">Deductible Input VAT</td><td className="text-end small text-success">{formatRWF(result.deductibleInputVAT)}</td></tr>
                        {result.nonDeductibleInputVAT > 0 && (
                          <tr><td className="text-muted small">Non-Deductible (Exempt)</td><td className="text-end small text-danger">{formatRWF(result.nonDeductibleInputVAT)}</td></tr>
                        )}

                        <tr className="table-light"><td className="fw-semibold small" colSpan={2}>NET POSITION</td></tr>
                        {result.openingVATCredit > 0 && (
                          <tr><td className="text-muted small">Credit b/f</td><td className="text-end small text-success">{formatRWF(result.openingVATCredit)}</td></tr>
                        )}
                        <tr className="fw-bold fs-6">
                          <td>{result.position === 'PAYABLE' ? 'VAT Payable' : 'VAT Refund'}</td>
                          <td className={`text-end ${result.position === 'PAYABLE' ? 'text-danger' : 'text-success'}`}>
                            {result.position === 'PAYABLE' ? formatRWF(result.vatPayable) : formatRWF(result.vatRefund)}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card>

                  <Alert variant="info" className="small py-2">
                    <FaInfoCircle className="me-1" />
                    <strong>Filing Deadline:</strong> {result.filingDeadline}. Non-filing: 10% penalty on tax due + interest.
                  </Alert>

                  <Button variant="outline-primary" className="w-100 rounded-pill" onClick={exportExcel}>
                    <FaFileDownload className="me-2" /> Download Excel Return
                  </Button>
                </motion.div>
              ) : (
                <Card className="calc-card p-5 text-center">
                  <div className="mb-3 text-muted" style={{ fontSize: '3rem' }}>📊</div>
                  <h5 className="fw-bold">VAT Return Result</h5>
                  <p className="text-muted small">Fill in your figures and click <strong>Compute VAT Return</strong> to see your VAT position.</p>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default VATCalculator;
