import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalculator, FaDownload, FaInfoCircle, FaPlus, FaTrash, FaFilePdf } from 'react-icons/fa';
import { MdAccountBalance } from 'react-icons/md';
import { WHTEngine } from '../utils/tax-engine/whtEngine.js';
import * as XLSX from 'xlsx';

const formatRWF = (v) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(v ?? 0);

const WHT_TIPS = [
  'WHT is deducted at source by the payer and remitted to RRA by the 15th of the following month.',
  'A WHT certificate must be issued to the payee to use as a tax credit on their annual return.',
  'Double Tax Treaties (DTTs) may reduce rates — Rwanda has treaties with multiple countries.',
  'Failure to withhold makes the payer personally liable for the tax plus 10% penalty and interest.',
];

const WHTCalculator = () => {
  const [mode, setMode] = useState('single');
  const [paymentTypeId, setPaymentTypeId] = useState('dividends');
  const [grossAmount, setGrossAmount] = useState('');
  const [isTaxTreaty, setIsTaxTreaty] = useState(false);
  const [treatyRate, setTreatyRate] = useState('');
  const [period, setPeriod] = useState('');
  const [batch, setBatch] = useState([{ id: 1, paymentTypeId: 'dividends', grossAmount: 0, isTaxTreaty: false, treatyRate: null }]);

  const categories = WHTEngine.getRateCategories();

  const singleResult = useMemo(() => {
    const g = Number(grossAmount) || 0;
    if (g <= 0) return null;
    try {
      return WHTEngine.compute({ paymentTypeId, grossAmount: g, isTaxTreaty, treatyRate: isTaxTreaty ? Number(treatyRate) / 100 : null });
    } catch { return null; }
  }, [paymentTypeId, grossAmount, isTaxTreaty, treatyRate]);

  const batchResult = useMemo(() => {
    const valid = batch.filter(p => p.grossAmount > 0);
    if (!valid.length) return null;
    return WHTEngine.computeBatch(valid.map(p => ({ ...p, treatyRate: p.isTaxTreaty && p.treatyRate ? p.treatyRate / 100 : null })));
  }, [batch]);

  const addRow = () => setBatch(prev => [...prev, { id: Date.now(), paymentTypeId: 'dividends', grossAmount: 0, isTaxTreaty: false, treatyRate: null }]);
  const removeRow = (id) => setBatch(prev => prev.filter(p => p.id !== id));
  const updateRow = (id, field, value) => setBatch(prev => prev.map(p => p.id === id ? { ...p, [field]: field === 'paymentTypeId' ? value : (field === 'isTaxTreaty' ? value : Number(value) || 0) } : p));

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    if (mode === 'single' && singleResult) {
      const ws = XLSX.utils.aoa_to_sheet([
        ['AGN Bridge Consult — WHT Certificate', '', `Period: ${period || 'N/A'}`],
        [],
        ['Payment Type', singleResult.paymentType],
        ['Legal Basis', singleResult.legalBasis],
        ['Gross Amount (RWF)', singleResult.grossAmount],
        ['WHT Rate', singleResult.rateDisplay],
        ['WHT Amount (RWF)', singleResult.whtAmount],
        ['Net Payment (RWF)', singleResult.netPayment],
        ['Filing Deadline', singleResult.filingDeadline],
        ['Tax Treaty Applied', singleResult.isTaxTreaty ? 'Yes' : 'No'],
      ]);
      XLSX.utils.book_append_sheet(wb, ws, 'WHT Certificate');
    } else if (mode === 'batch' && batchResult) {
      const rows = batchResult.payments.map(p => [p.computation.paymentType, p.computation.grossAmount, p.computation.rateDisplay, p.computation.whtAmount, p.computation.netPayment]);
      const ws = XLSX.utils.aoa_to_sheet([
        ['AGN Bridge Consult — WHT Schedule', '', `Period: ${period || 'N/A'}`],
        [],
        ['Payment Type', 'Gross Amount', 'Rate', 'WHT Amount', 'Net Payment'],
        ...rows,
        [],
        ['TOTALS', batchResult.totals.grossAmount, '', batchResult.totals.whtAmount, batchResult.totals.netPayment],
      ]);
      XLSX.utils.book_append_sheet(wb, ws, 'WHT Schedule');
    }
    XLSX.writeFile(wb, `WHT_${period || 'computation'}.xlsx`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-top-offset">
      {/* Header */}
      <div className="calc-header mb-0">
        <Container>
          <Row className="align-items-center py-4">
            <Col>
              <span className="ai-badge mb-2 d-inline-flex">Articles 43–52</span>
              <h1 className="display-5 fw-bold text-white mb-2">Withholding Tax Calculator</h1>
              <p className="text-white-50 mb-0">Rwanda WHT — Dividends, Interest, Royalties, Services & More</p>
            </Col>
            <Col xs="auto" className="d-none d-md-block">
              <div className="p-3 rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                <MdAccountBalance size={36} className="text-white" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* Mode & Quick Rates Table */}
        <Row className="g-4 mb-4">
          <Col lg={8}>
            <div className="d-flex gap-2 mb-4">
              <Button variant={mode === 'single' ? 'primary' : 'outline-primary'} className="rounded-pill px-4" onClick={() => setMode('single')}>Single Payment</Button>
              <Button variant={mode === 'batch' ? 'primary' : 'outline-primary'} className="rounded-pill px-4" onClick={() => setMode('batch')}>Batch / Schedule</Button>
            </div>

            {mode === 'single' ? (
              <Card className="calc-card p-4">
                <Row className="g-3 align-items-end">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Payment Type</Form.Label>
                      <Form.Select className="rounded-3" value={paymentTypeId} onChange={e => setPaymentTypeId(e.target.value)}>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.label} — {(c.rate * 100).toFixed(0)}% ({c.article})</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Gross Payment Amount (RWF)</Form.Label>
                      <Form.Control type="number" min={0} placeholder="e.g. 1,000,000" className="rounded-3"
                        value={grossAmount} onChange={e => setGrossAmount(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold small">Period</Form.Label>
                      <Form.Control type="text" placeholder="e.g. January 2025" className="rounded-3"
                        value={period} onChange={e => setPeriod(e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Check type="switch" id="treaty-switch" label="Double Tax Treaty applies (reduced rate)"
                      checked={isTaxTreaty} onChange={e => setIsTaxTreaty(e.target.checked)} className="mb-2" />
                    {isTaxTreaty && (
                      <Form.Group>
                        <Form.Label className="fw-semibold small">Treaty Rate (%)</Form.Label>
                        <Form.Control type="number" min={0} max={100} placeholder="e.g. 10" className="rounded-3" style={{ maxWidth: 180 }}
                          value={treatyRate} onChange={e => setTreatyRate(e.target.value)} />
                      </Form.Group>
                    )}
                  </Col>
                </Row>
              </Card>
            ) : (
              <Card className="calc-card p-4">
                <div className="d-flex justify-content-between mb-3">
                  <h6 className="fw-bold mb-0">Payment Schedule</h6>
                  <Button size="sm" variant="outline-primary" className="rounded-pill" onClick={addRow}><FaPlus className="me-1" />Add Row</Button>
                </div>
                <Table responsive size="sm" className="align-middle">
                  <thead className="table-light">
                    <tr><th>Payment Type</th><th>Gross (RWF)</th><th>Treaty?</th><th>WHT</th><th>Net</th><th></th></tr>
                  </thead>
                  <tbody>
                    {batch.map(row => {
                      let res = null;
                      try { res = row.grossAmount > 0 ? WHTEngine.compute({ ...row, treatyRate: row.isTaxTreaty && row.treatyRate ? row.treatyRate / 100 : null }) : null; } catch {}
                      return (
                        <tr key={row.id}>
                          <td>
                            <Form.Select size="sm" value={row.paymentTypeId} onChange={e => updateRow(row.id, 'paymentTypeId', e.target.value)}>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.label} ({(c.rate*100).toFixed(0)}%)</option>)}
                            </Form.Select>
                          </td>
                          <td><Form.Control size="sm" type="number" min={0} value={row.grossAmount || ''} onChange={e => updateRow(row.id, 'grossAmount', e.target.value)} /></td>
                          <td><Form.Check type="switch" checked={row.isTaxTreaty} onChange={e => updateRow(row.id, 'isTaxTreaty', e.target.checked)} /></td>
                          <td className="text-danger fw-semibold small">{res ? formatRWF(res.whtAmount) : '—'}</td>
                          <td className="text-primary fw-semibold small">{res ? formatRWF(res.netPayment) : '—'}</td>
                          <td><Button variant="link" className="text-danger p-0" onClick={() => removeRow(row.id)}><FaTrash size={12} /></Button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {batchResult && (
                    <tfoot className="table-dark fw-bold">
                      <tr><td>TOTALS</td><td>{formatRWF(batchResult.totals.grossAmount)}</td><td></td>
                        <td className="text-danger">{formatRWF(batchResult.totals.whtAmount)}</td>
                        <td className="text-success">{formatRWF(batchResult.totals.netPayment)}</td><td></td></tr>
                    </tfoot>
                  )}
                </Table>
              </Card>
            )}

            {/* Export */}
            <Button variant="outline-primary" className="rounded-pill mt-3 me-2" onClick={exportExcel} disabled={!singleResult && !batchResult}>
              <FaDownload className="me-2" /> Export WHT Schedule
            </Button>
          </Col>

          <Col lg={4}>
            {/* Single result */}
            {singleResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="result-highlight mb-4">
                  <div className="text-white-50 small fw-semibold text-uppercase ls-2 mb-2">WHT to Withhold</div>
                  <div className="result-amount text-white mb-1">{formatRWF(singleResult.whtAmount)}</div>
                  <div className="text-white-50 small">Rate: {singleResult.rateDisplay} | {singleResult.legalBasis}</div>
                </div>
                <Card className="calc-card p-3 mb-3">
                  <Table size="sm" className="mb-0">
                    <tbody>
                      <tr><td className="text-muted small">Payment Type</td><td className="text-end small fw-medium">{singleResult.paymentType}</td></tr>
                      <tr><td className="text-muted small">Gross Amount</td><td className="text-end small fw-medium">{formatRWF(singleResult.grossAmount)}</td></tr>
                      <tr><td className="text-muted small">WHT Rate</td><td className="text-end small"><Badge bg={singleResult.isTaxTreaty ? 'info' : 'danger'}>{singleResult.rateDisplay}</Badge></td></tr>
                      <tr><td className="text-muted small fw-semibold">WHT Amount</td><td className="text-end fw-bold text-danger">{formatRWF(singleResult.whtAmount)}</td></tr>
                      <tr className="table-success fw-bold"><td>Net Payment</td><td className="text-end">{formatRWF(singleResult.netPayment)}</td></tr>
                    </tbody>
                  </Table>
                </Card>
                <Alert variant="warning" className="small py-2">
                  <FaInfoCircle className="me-1" /><strong>Remit by:</strong> {singleResult.filingDeadline} on the RRA Portal.
                  Issue WHT certificate to the recipient within 30 days.
                </Alert>
              </motion.div>
            )}

            {/* WHT Rates reference */}
            <Card className="calc-card p-3">
              <h6 className="fw-bold mb-3">Rwanda WHT Rate Table</h6>
              <Table size="sm" className="mb-0">
                <thead><tr><th className="small">Payment</th><th className="small text-end">Rate</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td className="small text-muted">{c.label}</td>
                      <td className="text-end"><Badge bg="secondary">{(c.rate * 100).toFixed(0)}%</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            {/* Tips */}
            <Card className="calc-card mt-3 p-3 bg-light">
              <h6 className="fw-bold mb-2">Key Rules</h6>
              {WHT_TIPS.map((t, i) => (
                <div key={i} className="d-flex gap-2 mb-2 small text-muted">
                  <span className="text-primary fw-bold">•</span><span>{t}</span>
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default WHTCalculator;
