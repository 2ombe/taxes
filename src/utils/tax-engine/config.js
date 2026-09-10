export const CIT_CONFIG = {
  TAX_RATE: 0.30, // Standard 30% CIT rate in Rwanda
  LOSS_CARRYFORWARD_YEARS: 5, // Article 31: 5-year limit

  DEPRECIATION_CATEGORIES: [
    { id: 'cat1', name: 'Land & Buildings', taxRate: 0.05, article: 'Article 28(1)' },
    { id: 'cat2', name: 'Furniture & Equipment', taxRate: 0.10, article: 'Article 28(2)' },
    { id: 'cat3', name: 'Heavy Machinery & Vehicles', taxRate: 0.25, article: 'Article 28(3)' },
    { id: 'cat4', name: 'Computers & Software', taxRate: 0.50, article: 'Article 28(4)' },
    { id: 'cat5', name: 'Other Assets (General)', taxRate: 0.20, article: 'Article 28(5)' },
  ],

  NON_DEDUCTIBLE_RULES: [
    { pattern: /fines|penalties|penalty/i, reason: 'Fines and penalties', article: 'Article 25(1)' },
    { pattern: /donation|charity/i, reason: 'Non-qualifying donations', article: 'Article 25(2)' },
    { pattern: /personal|director.*expense|private/i, reason: 'Personal or private expenses', article: 'Article 25(3)' },
    { pattern: /entertainment|hospitality/i, reason: 'Entertainment expenses beyond allowable limits', article: 'Article 25(4)' },
    { pattern: /provision|contingency/i, reason: 'General provisions (not realized)', article: 'Article 25(5)' },
  ],
};

export const VAT_CONFIG = {
  STANDARD_RATE: 0.18,   // 18% Rwanda VAT
  ZERO_RATE: 0,          // 0% exports
  THRESHOLD: 20000000,   // RWF 20M annual turnover for mandatory registration

  EXEMPT_CATEGORIES: [
    'Financial services',
    'Medical and health services',
    'Educational services',
    'Agricultural products (basic)',
    'Land and building sales',
  ],

  ZERO_RATED: [
    'Export of goods',
    'International transport',
    'Diplomatic supplies',
  ],
};

export const PAYE_CONFIG = {
  // Rwanda PAYE monthly bands (2025) — Income Tax Law
  MONTHLY_BANDS: [
    { min: 0,       max: 60000,    rate: 0,    description: '0% — Up to RWF 60,000' },
    { min: 60001,   max: 100000,   rate: 0.20, description: '20% — RWF 60,001 to RWF 100,000' },
    { min: 100001,  max: Infinity, rate: 0.30, description: '30% — Above RWF 100,000' },
  ],
  // Rwanda Social Security (RSSB)
  RSSB_EMPLOYEE_RATE: 0.05,    // 5% employee contribution
  RSSB_EMPLOYER_RATE: 0.05,    // 5% employer contribution
  MATERNITY_FUND_RATE: 0.006,  // 0.6% employer
  CBHI_RATE: 0.005,            // 0.5% Community Based Health Insurance (employee)
};

export const WHT_CONFIG = {
  RATES: [
    { id: 'dividends',     label: 'Dividends',                          rate: 0.15, article: 'Article 48' },
    { id: 'interest',      label: 'Interest (banks/financial)',          rate: 0.15, article: 'Article 47' },
    { id: 'royalties',     label: 'Royalties',                          rate: 0.15, article: 'Article 46' },
    { id: 'services_nr',   label: 'Services to Non-Residents',          rate: 0.15, article: 'Article 50' },
    { id: 'mgmt_fees',     label: 'Management Fees (non-resident)',      rate: 0.15, article: 'Article 49' },
    { id: 'rent',          label: 'Rental income',                      rate: 0.15, article: 'Article 45' },
    { id: 'services_res',  label: 'Services (resident individual)',      rate: 0.03, article: 'Article 44' },
    { id: 'imports',       label: 'Imports (CIF value)',                 rate: 0.05, article: 'Article 43' },
    { id: 'lottery',       label: 'Lottery / Gambling winnings',        rate: 0.15, article: 'Article 52' },
  ],
};
