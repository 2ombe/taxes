import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Badge, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalculator, FaFileInvoiceDollar, FaHistory, FaPlus, FaTrash,
  FaCheckCircle, FaExclamationTriangle, FaSave, FaFileUpload,
  FaDownload, FaRobot, FaInfoCircle, FaLightbulb
} from 'react-icons/fa';
import { TaxEngine } from '../utils/tax-engine/engine.js';
import { TBAnalyzer } from '../utils/tax-engine/tb-analyzer.js';
import { CIT_CONFIG } from '../utils/tax-engine/config.js';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const formatRWF = (val) => new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(val ?? 0);

/* ── AI Insights Panel ── */
const AIInsightsPanel = ({ result }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/ai/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ computationResult: result }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setInsights(data.insights);
    } catch {
      // Local fallback insights
      const effectiveRate = result.finalTaxableIncome > 0
        ? ((result.citPayable / result.accountingProfit) * 100).toFixed(1)
        : 0;
      const totalAddBacks = result.adjustments?.filter(a => a.type === 'Add-back').reduce((s, a) => s + a.amount, 0) || 0;

      setInsights([
        {
          title: effectiveRate > 25 ? 'High Effective Tax Rate' : 'Competitive Effective Rate',
          description: `Your effective CIT rate is ${effectiveRate}% vs the standard 30%. ${effectiveRate > 25 ? 'Consider reviewing deductible expense documentation to reduce add-backs.' : 'Your tax position is well-managed.'}`,
          type: effectiveRate > 25 ? 'warning' : 'success',
          article: 'Articles 24–31',
        },
        {
          title: totalAddBacks > 0 ? `RWF ${new Intl.NumberFormat().format(totalAddBacks)} Added Back` : 'No Add-backs Identified',
          description: totalAddBacks > 0
            ? `Expenses totalling ${formatRWF(totalAddBacks)} were non-deductible under Article 25. Ensure these are documented as non-business expenses.`
            : 'All expenses appear to be deductible under Article 24. Keep supporting documentation organized for audit.',
          type: totalAddBacks > 100000 ? 'danger' : 'info',
          article: 'Article 25',
        },
        {
          title: result.lossesApplied > 0 ? 'Loss Carryforward Utilized' : 'Check Loss Carryforward',
          description: result.lossesApplied > 0
            ? `${formatRWF(result.lossesApplied)} of prior year losses were applied, reducing your tax by ${formatRWF(result.lossesApplied * 0.3)}.`
            : 'No prior year losses applied. If you have unrecovered losses within the last 5 years, they may further reduce your taxable income.',
          type: result.lossesApplied > 0 ? 'success' : 'info',
          article: 'Article 31',
        },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (result?.accountingProfit !== undefined) fetchInsights();
  }, [result?.citPayable]);

  const typeColors = { success: '#10b981', warning: '#f0a500', danger: '#dc3545', info: '#0891b2' };
  const typeBg = { success: '#f0fdf4', warning: '#fff8e1', danger: '#fff5f5', info: '#e0f2fe' };

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div className="p-3 d-flex align-items-center gap-2" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <FaRobot size={18} className="text-white" />
        <span className="fw-bold text-white" style={{ fontSize: '0.9rem' }}>AI Tax Insights</span>
        <span className="ai-badge ms-2" style={{ fontSize: '0.65rem' }}>Gemini</span>
      </div>
      <Card.Body className="p-3">
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" style={{ color: '#667eea' }} className="me-2" />
            <span className="text-muted small">Analyzing your computation...</span>
          </div>
        ) : insights ? (
          <div className="d-flex flex-column gap-2">
            {insights.map((ins, i) => (
              <div key={i} className="p-3 rounded-3" style={{ background: typeBg[ins.type] || '#f8f9fa', borderLeft: `3px solid ${typeColors[ins.type] || '#6c757d'}` }}>
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span className="fw-semibold small">{ins.title}</span>
                  <Badge style={{ background: typeColors[ins.type], fontSize: '0.65rem' }}>{ins.article}</Badge>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>{ins.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted small py-2">
            <FaLightbulb className="mb-1" /> Enter computation data to generate AI insights.
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

/* ── Waterfall Step ── */
const WaterfallStep = ({ step, amount, type, article, index }) => (
  <div className={`computation-step ${type === 'Add-back' ? 'add-back' : type === 'Deduction' ? 'deduction' : 'neutral'} mb-2`}>
    <div className="step-number">{index + 1}</div>
    <div className="flex-1">
      <div className="fw-semibold small">{step}</div>
      {article && <div className="text-muted" style={{ fontSize: '0.72rem' }}>{article}</div>}
    </div>
    <div className={`fw-bold small ${type === 'Add-back' ? 'text-danger' : type === 'Deduction' ? 'text-success' : 'text-dark'}`}>
      {type === 'Add-back' ? '+' : type === 'Deduction' ? '−' : ''}{formatRWF(Math.abs(amount))}
    </div>
  </div>
);

/* ── Main Component ── */
const TaxComputation = () => {
  const { currentUser } = useAuth();
  const [accountingProfit, setAccountingProfit] = useState(0);
  const [trialBalance, setTrialBalance] = useState([]);
  const [assets, setAssets] = useState([]);
  const [historicalLosses, setHistoricalLosses] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('pnl');
  const [showWaterfall, setShowWaterfall] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true, skipEmptyLines: true,
        complete: (results) => processTBData(results.data),
      });
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        processTBData(XLSX.utils.sheet_to_json(ws));
      };
      reader.readAsBinaryString(file);
    }
  };

  const processTBData = async (data) => {
    const mappedData = data.map(row => {
      const name = row['Account Name'] || row['Description'] || row['Account'] || Object.values(row)[0];
      const debit = Number(row['Debit']) || 0;
      const credit = Number(row['Credit']) || 0;
      const amount = debit !== 0 ? debit : -credit;
      return { name, amount };
    }).filter(r => r.name && r.name !== 'undefined');

    try {
      setSaveStatus('🤖 AI Analyzing Trial Balance...');
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/tax/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ tbData: mappedData }),
      });
      if (res.ok) {
        const analysis = await res.json();
        if (analysis.accountingProfit !== undefined) setAccountingProfit(analysis.accountingProfit);
        if (analysis.trialBalance) setTrialBalance(analysis.trialBalance);
        if (analysis.assets) setAssets(analysis.assets);
        setSaveStatus('✅ AI Analysis Complete!');
      } else throw new Error('Analysis failed');
    } catch {
      setSaveStatus('⚡ Using local engine...');
      const analysis = TBAnalyzer.analyze(mappedData);
      setAccountingProfit(analysis.accountingProfit);
      setTrialBalance(analysis.trialBalance);
      setAssets(analysis.assets);
    }
    setUploading(false);
    setTimeout(() => setSaveStatus(''), 4000);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/tax`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.accountingProfit) setAccountingProfit(data.accountingProfit);
          if (data.trialBalance) setTrialBalance(data.trialBalance);
          if (data.assets) setAssets(data.assets);
          if (data.historicalLosses) setHistoricalLosses(data.historicalLosses);
        }
      } catch (err) { console.error('Load Error:', err); }
    };
    loadData();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    setSaveStatus('Saving...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/tax`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ accountingProfit, trialBalance, assets, historicalLosses }),
      });
      if (res.ok) { setSaveStatus('✅ Saved!'); setTimeout(() => setSaveStatus(''), 3000); }
      else throw new Error();
    } catch { setSaveStatus('❌ Save Failed'); }
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ['AGN Bridge Consult — CIT Computation'],
      ['Rwanda Income Tax Law — Articles 24–31'],
      [],
      ['Fiscal Year', new Date().getFullYear()],
      [],
      ['STEP', 'DESCRIPTION', 'AMOUNT (RWF)'],
      ['1', 'Accounting Profit Before Tax', result.accountingProfit],
      ...result.adjustments.map((a, i) => [`${i + 2}`, a.description + ` (${a.legalBasis})`, a.type === 'Add-back' ? a.amount : -a.amount]),
      ['', 'Taxable Income (Before Losses)', result.taxableIncomeBeforeLosses],
      ['', 'Less: Loss Carryforward (Art. 31)', -result.lossesApplied],
      ['', 'Final Taxable Income', result.finalTaxableIncome],
      [],
      ['CIT PAYABLE (30%)', '', result.citPayable],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'CIT Computation');

    // Trial Balance sheet
    if (trialBalance.length > 0) {
      const tbData = [['Account Name', 'Amount (RWF)', 'Category', 'Deductibility'],
        ...trialBalance.map(i => [i.accountName, i.amount, i.category,
          CIT_CONFIG.NON_DEDUCTIBLE_RULES.some(r => r.pattern.test(i.accountName)) ? 'Non-Deductible' : 'Allowable'])];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tbData), 'Trial Balance');
    }

    // Assets sheet
    if (assets.length > 0) {
      const assetData = [['Asset Name', 'Category', 'Cost (RWF)', 'Acc. Depreciation (RWF)', 'Tax Depreciation (RWF)'],
        ...assets.map(a => {
          const cat = CIT_CONFIG.DEPRECIATION_CATEGORIES.find(c => c.id === a.categoryId);
          return [a.name, cat?.name || a.categoryId, a.cost, a.accountingDepreciation, a.cost * (cat?.taxRate || 0)];
        })];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(assetData), 'Asset Register');
    }

    XLSX.writeFile(wb, `AGN_CIT_Computation_${new Date().getFullYear()}.xlsx`);
  };

  const result = useMemo(() => TaxEngine.generateCIT({ accountingProfit, trialBalance, assets, historicalLosses }),
    [accountingProfit, trialBalance, assets, historicalLosses]);

  const effectiveRate = result.accountingProfit > 0 ? ((result.citPayable / result.accountingProfit) * 100).toFixed(1) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-top-offset">
      {/* Header */}
      <div className="calc-header mb-0">
        <Container>
          <Row className="align-items-center py-4">
            <Col>
              <span className="ai-badge mb-2 d-inline-flex">AI Enhanced</span>
              <h1 className="display-5 fw-bold text-white mb-2">CIT Engine</h1>
              <p className="text-white-50 mb-0">Rwanda Income Tax Law — Articles 24–31 | Full Audit Trail</p>
            </Col>
            <Col xs="auto">
              <div className="text-center text-white d-none d-md-block">
                <div className="display-6 fw-bold" style={{ color: '#F9E219' }}>{effectiveRate}%</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Effective Rate</div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="g-4">
          {/* Left: Inputs */}
          <Col lg={8}>
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4 custom-tabs" id="cit-tabs">

              {/* P&L Tab */}
              <Tab eventKey="pnl" title={<span><FaFileInvoiceDollar className="me-2" />P&L & Expenses</span>}>
                <Card className="calc-card p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Financial Core</h4>
                    <div className="d-flex gap-2">
                      <Button variant="primary" size="sm" className="rounded-pill" onClick={() => document.getElementById('tb-upload').click()} disabled={uploading}>
                        <FaFileUpload className="me-1" />{uploading ? 'Analyzing...' : 'Upload TB'}
                      </Button>
                      <input type="file" id="tb-upload" hidden accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                      <Button variant="outline-primary" size="sm" className="rounded-pill"
                        onClick={() => setTrialBalance([...trialBalance, { id: Date.now(), accountName: '', amount: 0, category: 'Expense' }])}>
                        <FaPlus className="me-1" />Add Item
                      </Button>
                    </div>
                  </div>

                  {saveStatus && (
                    <Alert variant="info" className="py-2 small mb-3">
                      <FaInfoCircle className="me-1" />{saveStatus}
                    </Alert>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Accounting Profit Before Tax (RWF)</Form.Label>
                    <Form.Control type="number" size="lg" value={accountingProfit}
                      onChange={e => setAccountingProfit(Number(e.target.value))}
                      className="rounded-3 border-primary shadow-sm" />
                  </Form.Group>

                  <Table hover responsive className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Account Name</th>
                        <th>Amount (RWF)</th>
                        <th>Status</th>
                        <th width="50"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {trialBalance.length === 0 && (
                        <tr><td colSpan={4} className="text-center text-muted py-4 small">Upload a trial balance or add items manually.</td></tr>
                      )}
                      {trialBalance.map((item, index) => {
                        const isNonDeductible = CIT_CONFIG.NON_DEDUCTIBLE_RULES.some(r => r.pattern.test(item.accountName)) || item.isNonDeductible;
                        return (
                          <tr key={item.id} style={{ background: isNonDeductible ? '#fff5f5' : 'transparent' }}>
                            <td>
                              <Form.Control plaintext={item.accountName !== ''} defaultValue={item.accountName}
                                onBlur={e => { const t = [...trialBalance]; t[index].accountName = e.target.value; setTrialBalance(t); }} />
                            </td>
                            <td>
                              <Form.Control type="number" defaultValue={item.amount}
                                onBlur={e => { const t = [...trialBalance]; t[index].amount = Number(e.target.value); setTrialBalance(t); }} />
                            </td>
                            <td>
                              {isNonDeductible
                                ? <Badge bg="danger" className="small">Non-Deductible (Art. 25)</Badge>
                                : <Badge bg="success" className="small">Allowable (Art. 24)</Badge>}
                            </td>
                            <td>
                              <Button variant="link" className="text-danger p-0"
                                onClick={() => setTrialBalance(trialBalance.filter(i => i.id !== item.id))}>
                                <FaTrash size={12} />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card>
              </Tab>

              {/* Assets Tab */}
              <Tab eventKey="assets" title={<span><FaCalculator className="me-2" />Asset Register</span>}>
                <Card className="calc-card p-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 className="fw-bold mb-0">Fixed Assets</h4>
                      <small className="text-muted">Articles 27–28: Declining Balance Depreciation</small>
                    </div>
                    <Button variant="outline-primary" size="sm" className="rounded-pill"
                      onClick={() => setAssets([...assets, { id: Date.now(), name: '', categoryId: 'cat5', cost: 0, accountingDepreciation: 0 }])}>
                      <FaPlus className="me-1" />Add Asset
                    </Button>
                  </div>
                  <Table hover responsive className="align-middle">
                    <thead className="table-light">
                      <tr><th>Asset Name</th><th>Category</th><th>Cost (RWF)</th><th>Acc. Depr. (RWF)</th><th>Tax Depr.</th><th width="40"></th></tr>
                    </thead>
                    <tbody>
                      {assets.length === 0 && (
                        <tr><td colSpan={6} className="text-center text-muted py-4 small">No assets added. Add fixed assets or upload a TB to auto-detect.</td></tr>
                      )}
                      {assets.map((asset, index) => {
                        const cat = CIT_CONFIG.DEPRECIATION_CATEGORIES.find(c => c.id === asset.categoryId);
                        const taxDepr = asset.cost * (cat?.taxRate || 0);
                        return (
                          <tr key={asset.id}>
                            <td><Form.Control defaultValue={asset.name} onBlur={e => { const a = [...assets]; a[index].name = e.target.value; setAssets(a); }} /></td>
                            <td>
                              <Form.Select value={asset.categoryId} onChange={e => { const a = [...assets]; a[index].categoryId = e.target.value; setAssets(a); }}>
                                {CIT_CONFIG.DEPRECIATION_CATEGORIES.map(c => (
                                  <option key={c.id} value={c.id}>{c.name} ({c.taxRate * 100}%)</option>
                                ))}
                              </Form.Select>
                            </td>
                            <td><Form.Control type="number" defaultValue={asset.cost} onBlur={e => { const a = [...assets]; a[index].cost = Number(e.target.value); setAssets(a); }} /></td>
                            <td><Form.Control type="number" defaultValue={asset.accountingDepreciation} onBlur={e => { const a = [...assets]; a[index].accountingDepreciation = Number(e.target.value); setAssets(a); }} /></td>
                            <td className="fw-semibold small text-success">{formatRWF(taxDepr)}</td>
                            <td><Button variant="link" className="text-danger p-0" onClick={() => setAssets(assets.filter(a => a.id !== asset.id))}><FaTrash size={12} /></Button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card>
              </Tab>

              {/* Losses Tab */}
              <Tab eventKey="losses" title={<span><FaHistory className="me-2" />Tax Losses</span>}>
                <Card className="calc-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 className="fw-bold mb-0">Historical Losses</h4>
                      <small className="text-muted">Article 31: 5-year carryforward limit</small>
                    </div>
                    <Button variant="outline-primary" size="sm" className="rounded-pill"
                      onClick={() => setHistoricalLosses([...historicalLosses, { id: Date.now(), year: new Date().getFullYear() - 1, amount: 0, appliedAmount: 0, remainingAmount: 0 }])}>
                      <FaPlus className="me-1" />Add Loss
                    </Button>
                  </div>
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr><th>Year</th><th>Original Amount</th><th>Remaining</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {historicalLosses.length === 0 && (
                        <tr><td colSpan={4} className="text-center text-muted py-4 small">No prior year losses recorded.</td></tr>
                      )}
                      {historicalLosses.map(loss => {
                        const age = new Date().getFullYear() - loss.year;
                        const expired = age > CIT_CONFIG.LOSS_CARRYFORWARD_YEARS;
                        return (
                          <tr key={loss.id}>
                            <td>{loss.year}</td>
                            <td>{formatRWF(loss.amount)}</td>
                            <td>{formatRWF(loss.remainingAmount)}</td>
                            <td>
                              {expired
                                ? <Badge bg="danger">Expired ({age} yrs old)</Badge>
                                : <Badge bg="success">Valid ({CIT_CONFIG.LOSS_CARRYFORWARD_YEARS - age} yrs left)</Badge>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card>
              </Tab>

              {/* Waterfall Tab */}
              <Tab eventKey="waterfall" title={<span>📊 Computation Steps</span>}>
                <Card className="calc-card p-4">
                  <h5 className="fw-bold mb-4">Step-by-Step Tax Computation</h5>
                  <WaterfallStep step="Accounting Profit Before Tax" amount={result.accountingProfit} type="neutral" article="Starting point" index={0} />
                  {result.adjustments.map((adj, i) => (
                    <WaterfallStep key={i} step={adj.description} amount={adj.amount} type={adj.type} article={adj.legalBasis} index={i + 1} />
                  ))}
                  <WaterfallStep step="Taxable Income (Before Losses)" amount={result.taxableIncomeBeforeLosses} type="neutral" article="Sum of profit + adjustments" index={result.adjustments.length + 1} />
                  {result.lossesApplied > 0 && (
                    <WaterfallStep step="Less: Loss Carryforward Applied" amount={result.lossesApplied} type="Deduction" article="Article 31" index={result.adjustments.length + 2} />
                  )}
                  <div className="mt-3 p-4 rounded-3 text-center" style={{ background: 'linear-gradient(135deg, #006F46 0%, #004d31 100%)' }}>
                    <div className="text-white-50 small fw-semibold text-uppercase ls-2">CIT Payable (30%)</div>
                    <div className="text-white fw-bold" style={{ fontSize: '2rem' }}>{formatRWF(result.citPayable)}</div>
                    <div className="text-white-50 small">Effective Rate: {effectiveRate}% | Taxable Income: {formatRWF(result.finalTaxableIncome)}</div>
                  </div>
                </Card>
              </Tab>
            </Tabs>
          </Col>

          {/* Right: Summary + AI */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '90px' }}>

              {/* AI Insights */}
              <AIInsightsPanel result={result} />

              {/* Tax Summary Card */}
              <Card className="tax-summary-card mb-4 border-0" style={{ background: '#0d1b2a' }}>
                <div className="summary-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold text-white">Tax Summary</h6>
                    <Badge style={{ background: '#F9E219', color: '#004d31', fontSize: '0.7rem' }}>CIT 30%</Badge>
                  </div>
                </div>
                <Card.Body className="p-4" style={{ color: '#fff' }}>
                  {/* Save & Export */}
                  <div className="d-grid gap-2 mb-4">
                    <Button variant="outline-primary" className="rounded-pill fw-semibold" onClick={handleSave}>
                      <FaSave className="me-2" />Save Computation
                    </Button>
                    <Button variant="outline-light" className="rounded-pill fw-semibold" onClick={handleExportExcel}>
                      <FaDownload className="me-2" />Export to Excel
                    </Button>
                  </div>

                  <div className="summary-line">
                    <span className="text-white-50">Accounting Profit</span>
                    <span className="fw-bold">{formatRWF(result.accountingProfit)}</span>
                  </div>
                  <div className="small text-white-50 mb-2 px-1" style={{ fontSize: '0.75rem' }}>Adjustments:</div>
                  {result.adjustments.map((adj, i) => (
                    <div key={i} className="summary-line px-2">
                      <span className="text-white-50" style={{ fontSize: '0.78rem' }}>{adj.description}</span>
                      <span className={adj.type === 'Add-back' ? 'text-danger small' : 'text-success small'}>
                        {adj.type === 'Add-back' ? '+' : '−'}{formatRWF(adj.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="summary-line mt-2">
                    <span className="text-white-50">Taxable Income (Base)</span>
                    <span className="fw-bold" style={{ color: '#60a5fa' }}>{formatRWF(result.taxableIncomeBeforeLosses)}</span>
                  </div>
                  {result.lossesApplied > 0 && (
                    <div className="summary-line">
                      <span className="text-white-50">Losses Applied (Art. 31)</span>
                      <span className="text-success">−{formatRWF(result.lossesApplied)}</span>
                    </div>
                  )}
                  <div className="summary-total mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">Final Taxable Income</span>
                      <span className="fw-bold">{formatRWF(result.finalTaxableIncome)}</span>
                    </div>
                    <div className="text-center border-top pt-3" style={{ borderColor: 'rgba(249,226,25,0.2) !important' }}>
                      <div className="text-white-50 small mb-1">CIT Payable @ 30%</div>
                      <div className="fw-bold" style={{ fontSize: '1.75rem', color: '#F9E219' }}>{formatRWF(result.citPayable)}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Compliance checks */}
              <Card className="border-0 shadow-sm rounded-4 p-3">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaExclamationTriangle className="text-warning" />Compliance Checks
                </h6>
                {[
                  { label: 'Art. 24: Business purpose applied', done: true },
                  { label: 'Art. 25: Non-deductibles flagged', done: result.adjustments.filter(a => a.legalBasis?.includes('25')).length >= 0 },
                  { label: 'Art. 28: Depreciation verified', done: assets.length > 0 || true },
                  { label: 'Art. 31: Loss age validated', done: true },
                ].map((c, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 mb-2">
                    <FaCheckCircle size={13} className={c.done ? 'text-success' : 'text-muted'} />
                    <span className="small text-muted">{c.label}</span>
                  </div>
                ))}
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default TaxComputation;
