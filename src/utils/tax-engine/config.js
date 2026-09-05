import { CIT_CONFIG } from './config.js';

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

export { CIT_CONFIG };
