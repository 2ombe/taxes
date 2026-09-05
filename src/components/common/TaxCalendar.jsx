import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';

const CURRENT_MONTH = new Date().getMonth(); // 0-indexed

// Rwanda RRA key tax deadlines
const DEADLINES = [
  { day: 15, type: 'VAT', label: 'VAT Monthly Return', frequency: 'Monthly', color: 'upcoming', urgency: 'info' },
  { day: 15, type: 'PAYE', label: 'PAYE & RSSB Remittance', frequency: 'Monthly', color: 'upcoming', urgency: 'info' },
  { day: 15, type: 'WHT', label: 'Withholding Tax Return', frequency: 'Monthly', color: 'upcoming', urgency: 'info' },
  { day: 31, type: 'CIT', label: 'CIT Advance Payment (Q1)', frequency: 'Quarterly (Mar)', color: 'warning', urgency: 'warning' },
  { day: 30, type: 'CIT', label: 'CIT Annual Return', frequency: 'Annual (Jun 30)', color: 'upcoming', urgency: 'info' },
  { day: 31, type: 'FS', label: 'Financial Statements to RDB', frequency: 'Annual (Dec 31)', color: 'warning', urgency: 'warning' },
];

const MONTHLY_DEADLINES = [
  { day: 15, label: 'VAT Return', type: 'VAT', urgency: 'info' },
  { day: 15, label: 'PAYE Remittance', type: 'PAYE', urgency: 'info' },
  { day: 15, label: 'WHT Return', type: 'WHT', urgency: 'info' },
];

const today = new Date().getDate();
const getUrgency = (day) => {
  const diff = day - today;
  if (diff < 0) return 'expired';
  if (diff <= 3) return 'urgent';
  if (diff <= 7) return 'warning';
  return 'upcoming';
};

const TaxCalendar = ({ compact = false }) => {
  const now = new Date();
  const monthName = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();

  const monthlyItems = MONTHLY_DEADLINES.map(d => ({
    ...d,
    urgency: getUrgency(d.day),
    date: `${d.day} ${monthName}`,
  }));

  if (compact) {
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <FaCalendarAlt className="text-primary" />
          <span className="fw-semibold">Tax Deadlines — {monthName} {year}</span>
        </div>
        {monthlyItems.map((item, i) => (
          <div key={i} className="deadline-item mb-1">
            <div className={`deadline-date ${item.urgency === 'urgent' ? 'urgent' : item.urgency === 'warning' ? 'warning' : ''}`}>
              {item.day}<br /><small style={{ fontSize: '0.6rem' }}>{monthName.slice(0, 3)}</small>
            </div>
            <div className="flex-1">
              <div className="fw-medium small">{item.label}</div>
              <div>
                <Badge bg={item.urgency === 'urgent' ? 'danger' : item.urgency === 'warning' ? 'warning' : 'success'} className="small" style={{ fontSize: '0.68rem' }}>
                  {item.type}
                </Badge>
                {item.urgency === 'urgent' && <span className="ms-2 text-danger small fw-bold"><FaExclamationTriangle size={10} className="me-1" />Due soon!</span>}
              </div>
            </div>
          </div>
        ))}

        <div className="border-top mt-3 pt-3">
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
            <strong>Annual Deadlines:</strong><br />
            📅 CIT Annual Return: 30 June<br />
            📅 Audited FS to RDB: 31 December<br />
            📅 CIT Advance Payments: Quarterly (Mar, Jun, Sep, Dec)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tax-calendar">
      <h5 className="fw-bold mb-1">{monthName} {year} — Tax Calendar</h5>
      <p className="text-muted small mb-4">Key RRA filing deadlines for {monthName}.</p>
      {monthlyItems.map((item, i) => (
        <div key={i} className="deadline-item border rounded-3 mb-2 bg-white">
          <div className={`deadline-date ${item.urgency === 'urgent' ? 'urgent' : item.urgency === 'warning' ? 'warning' : ''}`}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>{item.day}</div>
            <div style={{ fontSize: '0.6rem', opacity: 0.85 }}>{monthName.slice(0, 3).toUpperCase()}</div>
          </div>
          <div className="flex-1">
            <div className="fw-semibold small">{item.label}</div>
            <div className="text-muted" style={{ fontSize: '0.75rem' }}>File on RRA e-tax portal</div>
          </div>
          <Badge bg={item.urgency === 'urgent' ? 'danger' : 'primary'}>{item.type}</Badge>
        </div>
      ))}
    </div>
  );
};

export default TaxCalendar;
