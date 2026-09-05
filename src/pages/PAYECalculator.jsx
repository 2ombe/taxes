import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalculator, FaDownload, FaUserTie, FaInfoCircle, FaPlus, FaTrash } from 'react-icons/fa';
import { PAYEEngine } from '../utils/tax-engine/payeEngine.js';
import * as XLSX from 'xlsx';

const formatRWF = (v) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(v ?? 0);

const BAND_COLORS = ['#10b981', '#f0a500', '#dc3545'];

const PAYECalculator = () => {
  const [mode, setMode] = useState('single'); // 'single' | 'payroll'
  const [grossSalary, setGrossSalary] = useState('');
  const [cashAllowances, setCashAllowances] = useState('');
  const [nonCashBenefits, setNonCashBenefits] = useState('');
  const [includeRSSB, setIncludeRSSB] = useState(true);
  const [employees, setEmployees] = useState([
    { id: 1, name: '', grossSalary: 0, cashAllowances: 0, nonCashBenefits: 0, includeRSSB: true }
  ]);

  const singleResult = useMemo(() => {
    const g = Number(grossSalary) || 0;
    if (g <= 0) return null;
    return PAYEEngine.computeMonthly({ grossSalary: g, cashAllowances: Number(cashAllowances) || 0, nonCashBenefits: Number(nonCashBenefits) || 0, includeRSSB });
  }, [grossSalary, cashAllowances, nonCashBenefits, includeRSSB]);

  const payrollResult = useMemo(() => {
    const valid = employees.filter(e => e.grossSalary > 0);
    if (!valid.length) return null;
    return PAYEEngine.computePayroll(valid);
  }, [employees]);

  const addEmployee = () => setEmployees(prev => [...prev, { id: Date.now(), name: '', grossSalary: 0, cashAllowances: 0, nonCashBenefits: 0, includeRSSB: true }]);
  const removeEmployee = (id) => setEmployees(prev => prev.filter(e => e.id !== id));
  const updateEmployee = (id, field, value) => setEmployees(prev => prev.map(e => e.id === id ? { ...e, [field]: field === 'name' ? value : Number(value) || 0 } : e));

  const exportExcel = () => {
    if (!singleResult && !payrollResult) return;
    const wb = XLSX.utils.book_new();
    if (singleResult) {
      const ws = XLSX.utils.aoa_to_sheet([
        ['AGN Bridge Consult — PAYE Computation'],
        [],
        ['INCOME', 'RWF'],
        ['Gross Salary', singleResult.grossSalary],
        ['Cash Allowances', singleResult.cashAllowances],
        ['Non-Cash Benefits', singleResult.nonCashBenefits],
        ['Total Taxable Income', singleResult.totalTaxableIncome],
        [],
        ['DEDUCTIONS', 'RWF'],
        ['RSSB (Employee 5%)', singleResult.rssbEmployee],
        ['CBHI (0.5%)', singleResult.cbhi],
        ['Assessable Income', singleResult.assessableIncome],
        [],
        ['PAYE TAX', 'RWF'],
        ...singleResult.bands.map(b => [b.description, b.tax]),
        ['Total PAYE', singleResult.payeTax],
        ['Effective Rate', `${singleResult.effectiveRate}%`],
        [],
        ['NET', 'RWF'],
        ['Net Salary', singleResult.netSalary],
        ['Total Employer Cost', singleResult.totalEmployerCost],
      ]);
      XLSX.utils.book_append_sheet(wb, ws, 'PAYE Single');
    }
    XLSX.writeFile(wb, 'PAYE_Computation.xlsx');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-top-offset">
      {/* Header */}
      <div className="calc-header mb-0">
        <Container>
          <Row className="align-items-center py-4">
            <Col>
              <span className="ai-badge mb-2 d-inline-flex">2025 Tax Bands</span>
              <h1 className="display-5 fw-bold text-white mb-2">PAYE Calculator</h1>
              <p className="text-white-50 mb-0">Pay As You Earn — Rwanda Income Tax Law (Monthly Computation)</p>
            </Col>
            <Col xs="auto" className="d-none d-md-block">
              <div className="p-3 rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                <FaUserTie size={36} className="text-white" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* Mode Switcher */}
        <div className="d-flex gap-2 mb-4">
          <Button variant={mode === 'single' ? 'primary' : 'outline-primary'} className="rounded-pill px-4" onClick={() => setMode('single')}>
            Single Employee
          </Button>
          <Button variant={mode === 'payroll' ? 'primary' : 'outline-primary'} className="rounded-pill px-4" onClick={() => setMode('payroll')}>
            Payroll Run
          </Button>
        </div>

        {mode === 'single' ? (
          <Row className="g-4">
            <Col lg={5}>
              <Card className="calc-card p-4">
                <h5 className="fw-bold mb-4">Employee Details</h5>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Monthly Gross Salary (RWF)</Form.Label>
                  <Form.Control type="number" min={0} placeholder="e.g. 500000" className="rounded-3"
                    value={grossSalary} onChange={e => setGrossSalary(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Taxable Cash Allowances (RWF)</Form.Label>
                  <Form.Control type="number" min={0} placeholder="0" className="rounded-3"
                    value={cashAllowances} onChange={e => setCashAllowances(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Non-Cash Benefits (RWF)</Form.Label>
                  <Form.Control type="number" min={0} placeholder="0" className="rounded-3"
                    value={nonCashBenefits} onChange={e => setNonCashBenefits(e.target.value)} />
                </Form.Group>
                <Form.Check type="switch" id="rssb-switch" label="Include RSSB & CBHI Deductions"
                  checked={includeRSSB} onChange={e => setIncludeRSSB(e.target.checked)} className="mb-4" />

                {/* Rwanda tax bands reference */}
                <div className="bg-light rounded-3 p-3">
                  <div className="fw-semibold small mb-2">2025 Tax Bands (Monthly)</div>
                  {[{ label: '0%', range: 'Up to RWF 60,000', color: BAND_COLORS[0] },
                    { label: '20%', range: 'RWF 60,001 – 100,000', color: BAND_COLORS[1] },
                    { label: '30%', range: 'Above RWF 100,000', color: BAND_COLORS[2] }].map((b, i) => (
                    <div key={i} className="d-flex align-items-center gap-2 mb-1">
                      <Badge style={{ background: b.color, minWidth: 36 }}>{b.label}</Badge>
                      <span className="text-muted small">{b.range}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col lg={7}>
              {singleResult ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Summary card */}
                  <Row className="g-3 mb-4">
                    {[
                      { label: 'PAYE Tax', value: singleResult.payeTax, color: '#dc3545' },
                      { label: 'Net Salary', value: singleResult.netSalary, color: '#006F46' },
                      { label: 'Employer Cost', value: singleResult.totalEmployerCost, color: '#f0a500' },
                    ].map((s, i) => (
                      <Col md={4} key={i}>
                        <Card className="border-0 text-center p-3 shadow-sm rounded-3">
                          <div className="fw-bold" style={{ color: s.color, fontSize: '1.2rem' }}>{formatRWF(s.value)}</div>
                          <div className="text-muted small mt-1">{s.label}</div>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {/* Tax band breakdown */}
                  <Card className="calc-card p-4 mb-3">
                    <h6 className="fw-bold mb-3">Progressive Tax Band Breakdown</h6>
                    {singleResult.bands.map((band, i) => (
                      <div key={i} className="mb-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-muted">{band.description}</span>
                          <span className="fw-semibold">{formatRWF(band.tax)}</span>
                        </div>
                        <ProgressBar now={singleResult.assessableIncome > 0 ? (band.taxableAmount / singleResult.assessableIncome) * 100 : 0}
                          style={{ height: 8, backgroundColor: '#e9ecef' }}
                          variant={i === 0 ? 'success' : i === 1 ? 'warning' : 'danger'} />
                      </div>
                    ))}
                    <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                      <span>Total PAYE</span>
                      <span className="text-danger">{formatRWF(singleResult.payeTax)}</span>
                    </div>
                    <div className="text-muted small mt-1">Effective Rate: <strong>{singleResult.effectiveRate}%</strong></div>
                  </Card>

                  {/* Full deduction table */}
                  <Card className="calc-card p-4 mb-3">
                    <h6 className="fw-bold mb-3">Monthly Payslip Summary</h6>
                    <Table size="sm" className="mb-0">
                      <tbody>
                        <tr className="table-success"><td className="fw-semibold">Gross Salary</td><td className="text-end fw-bold">{formatRWF(singleResult.grossSalary)}</td></tr>
                        <tr><td className="text-muted small">+ Cash Allowances</td><td className="text-end small">{formatRWF(singleResult.cashAllowances)}</td></tr>
                        <tr className="fw-semibold"><td>Total Taxable Income</td><td className="text-end">{formatRWF(singleResult.totalTaxableIncome)}</td></tr>
                        <tr><td className="text-muted small">— RSSB Employee (5%)</td><td className="text-end small text-danger">{formatRWF(singleResult.rssbEmployee)}</td></tr>
                        <tr><td className="text-muted small">— CBHI (0.5%)</td><td className="text-end small text-danger">{formatRWF(singleResult.cbhi)}</td></tr>
                        <tr><td className="text-muted small">= Assessable Income</td><td className="text-end small">{formatRWF(singleResult.assessableIncome)}</td></tr>
                        <tr><td className="text-muted small">— PAYE Tax</td><td className="text-end small text-danger">{formatRWF(singleResult.payeTax)}</td></tr>
                        <tr className="table-primary fw-bold"><td>NET SALARY</td><td className="text-end text-primary">{formatRWF(singleResult.netSalary)}</td></tr>
                        <tr className="table-light"><td className="text-muted small">Employer RSSB (5%)</td><td className="text-end small">{formatRWF(singleResult.rssbEmployer)}</td></tr>
                        <tr className="fw-semibold"><td className="small">Total Cost to Employer</td><td className="text-end small text-warning">{formatRWF(singleResult.totalEmployerCost)}</td></tr>
                      </tbody>
                    </Table>
                  </Card>

                  <Card className="calc-card p-3 mb-3 bg-light">
                    <h6 className="fw-bold mb-2">Annual Projection</h6>
                    <Row className="g-2">
                      {[['Annual Gross', singleResult.annual.grossSalary], ['Annual PAYE', singleResult.annual.payeTax], ['Annual Net', singleResult.annual.netSalary]].map(([l, v], i) => (
                        <Col md={4} key={i}><div className="text-muted small">{l}</div><div className="fw-bold small">{formatRWF(v)}</div></Col>
                      ))}
                    </Row>
                  </Card>

                  <Button variant="outline-primary" className="w-100 rounded-pill" onClick={exportExcel}>
                    <FaDownload className="me-2" /> Export Payslip to Excel
                  </Button>
                </motion.div>
              ) : (
                <Card className="calc-card p-5 text-center h-100 d-flex align-items-center justify-content-center">
                  <div style={{ fontSize: '3rem' }} className="mb-3">👤</div>
                  <h5 className="fw-bold">PAYE Computation</h5>
                  <p className="text-muted small">Enter monthly gross salary to see the full tax breakdown including RSSB, CBHI, and net salary.</p>
                </Card>
              )}
            </Col>
          </Row>
        ) : (
          /* Payroll Mode */
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Payroll Run</h5>
              <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={addEmployee}>
                <FaPlus className="me-1" /> Add Employee
              </Button>
            </div>
            <Card className="calc-card p-3 mb-4">
              <Table responsive className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Employee Name</th>
                    <th>Gross Salary (RWF)</th>
                    <th>Allowances (RWF)</th>
                    <th>PAYE</th>
                    <th>Net Salary</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => {
                    const res = emp.grossSalary > 0 ? PAYEEngine.computeMonthly(emp) : null;
                    return (
                      <tr key={emp.id}>
                        <td><Form.Control size="sm" placeholder="Name" value={emp.name} onChange={e => updateEmployee(emp.id, 'name', e.target.value)} /></td>
                        <td><Form.Control size="sm" type="number" min={0} placeholder="0" value={emp.grossSalary || ''} onChange={e => updateEmployee(emp.id, 'grossSalary', e.target.value)} /></td>
                        <td><Form.Control size="sm" type="number" min={0} placeholder="0" value={emp.cashAllowances || ''} onChange={e => updateEmployee(emp.id, 'cashAllowances', e.target.value)} /></td>
                        <td className="fw-semibold text-danger small">{res ? formatRWF(res.payeTax) : '—'}</td>
                        <td className="fw-semibold text-primary small">{res ? formatRWF(res.netSalary) : '—'}</td>
                        <td><Button variant="link" className="text-danger p-0" onClick={() => removeEmployee(emp.id)}><FaTrash size={12} /></Button></td>
                      </tr>
                    );
                  })}
                </tbody>
                {payrollResult && (
                  <tfoot className="table-dark fw-bold">
                    <tr>
                      <td>TOTALS</td>
                      <td>{formatRWF(payrollResult.totals.grossSalary)}</td>
                      <td>—</td>
                      <td className="text-danger">{formatRWF(payrollResult.totals.payeTax)}</td>
                      <td className="text-success">{formatRWF(payrollResult.totals.netSalary)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </Table>
            </Card>
            {payrollResult && (
              <Alert variant="success">
                <strong>Total PAYE to Remit to RRA:</strong> {formatRWF(payrollResult.totals.payeTax)} &nbsp;|&nbsp;
                <strong>Total RSSB to Remit:</strong> {formatRWF(payrollResult.totals.rssbEmployee + payrollResult.totals.rssbEmployer)}
                <div className="small mt-1"><FaInfoCircle className="me-1" />File PAYE return on RRA Portal by 15th of following month.</div>
              </Alert>
            )}
            <Button variant="outline-primary" className="rounded-pill" onClick={exportExcel} disabled={!payrollResult}>
              <FaDownload className="me-2" /> Export Payroll to Excel
            </Button>
          </div>
        )}
      </Container>
    </motion.div>
  );
};

export default PAYECalculator;
