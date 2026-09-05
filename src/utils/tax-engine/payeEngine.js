import { PAYE_CONFIG } from './config.js';

/**
 * Rwanda PAYE Engine — Income Tax Law (2025)
 * Monthly progressive bands + RSSB + CBHI deductions
 */
export class PAYEEngine {
  /**
   * Compute monthly PAYE for an employee
   * @param {Object} inputs
   * @param {number} inputs.grossSalary         - Monthly gross salary (RWF)
   * @param {number} inputs.cashAllowances      - Taxable cash allowances (RWF)
   * @param {number} inputs.nonCashBenefits     - Non-cash benefits (RWF)
   * @param {boolean} inputs.includeRSSB        - Whether to include RSSB deductions
   * @returns {Object} Full PAYE computation
   */
  static computeMonthly({ grossSalary = 0, cashAllowances = 0, nonCashBenefits = 0, includeRSSB = true }) {
    // Total taxable employment income
    const totalTaxableIncome = grossSalary + cashAllowances + nonCashBenefits;

    // RSSB deductions (reduce taxable income)
    const rssbEmployee = includeRSSB ? grossSalary * PAYE_CONFIG.RSSB_EMPLOYEE_RATE : 0;
    const cbhi = includeRSSB ? grossSalary * PAYE_CONFIG.CBHI_RATE : 0;

    // Income subject to PAYE (after RSSB employee contribution is deducted)
    const assessableIncome = Math.max(0, totalTaxableIncome - rssbEmployee - cbhi);

    // Progressive PAYE computation
    const bands = this._computeBands(assessableIncome);
    const payeTax = bands.reduce((sum, b) => sum + b.tax, 0);

    // Employer costs
    const rssbEmployer = includeRSSB ? grossSalary * PAYE_CONFIG.RSSB_EMPLOYER_RATE : 0;
    const maternityFund = includeRSSB ? grossSalary * PAYE_CONFIG.MATERNITY_FUND_RATE : 0;

    // Net salary
    const totalDeductions = rssbEmployee + cbhi + payeTax;
    const netSalary = Math.max(0, totalTaxableIncome - totalDeductions);
    const totalEmployerCost = grossSalary + rssbEmployer + maternityFund;

    // Effective tax rate
    const effectiveRate = assessableIncome > 0 ? (payeTax / assessableIncome) * 100 : 0;

    return {
      // Inputs
      grossSalary,
      cashAllowances,
      nonCashBenefits,
      totalTaxableIncome,

      // Deductions
      rssbEmployee,
      cbhi,
      assessableIncome,

      // Tax bands breakdown
      bands,
      payeTax,
      effectiveRate: Math.round(effectiveRate * 100) / 100,

      // Employer costs
      rssbEmployer,
      maternityFund,
      totalEmployerCost,

      // Final
      totalDeductions,
      netSalary,

      // Annual equivalents
      annual: {
        grossSalary: grossSalary * 12,
        payeTax: payeTax * 12,
        netSalary: netSalary * 12,
        totalEmployerCost: totalEmployerCost * 12,
      },
    };
  }

  /** Compute PAYE across multiple employees (payroll run) */
  static computePayroll(employees) {
    const results = employees.map(emp => ({
      ...emp,
      computation: this.computeMonthly(emp),
    }));

    const totals = results.reduce((acc, emp) => ({
      grossSalary:       acc.grossSalary + emp.computation.grossSalary,
      payeTax:           acc.payeTax + emp.computation.payeTax,
      rssbEmployee:      acc.rssbEmployee + emp.computation.rssbEmployee,
      rssbEmployer:      acc.rssbEmployer + emp.computation.rssbEmployer,
      netSalary:         acc.netSalary + emp.computation.netSalary,
      totalEmployerCost: acc.totalEmployerCost + emp.computation.totalEmployerCost,
    }), { grossSalary: 0, payeTax: 0, rssbEmployee: 0, rssbEmployer: 0, netSalary: 0, totalEmployerCost: 0 });

    return { employees: results, totals };
  }

  /** Progressive band breakdown */
  static _computeBands(assessableIncome) {
    const bands = [];
    let remaining = assessableIncome;

    for (const band of PAYE_CONFIG.MONTHLY_BANDS) {
      if (remaining <= 0) break;
      const bandWidth = band.max === Infinity ? remaining : Math.min(remaining, band.max - band.min);
      const taxableInBand = Math.min(remaining, bandWidth);
      const tax = taxableInBand * band.rate;

      bands.push({
        description: band.description,
        from: band.min,
        to: band.max,
        rate: band.rate,
        taxableAmount: Math.max(0, Math.min(assessableIncome - band.min, band.max === Infinity ? assessableIncome : band.max - band.min)),
        tax: Math.round(Math.max(0, Math.min(assessableIncome - band.min, band.max === Infinity ? remaining : band.max - band.min) * band.rate)),
      });

      remaining -= bandWidth;
    }

    // Recalculate cleanly
    return PAYE_CONFIG.MONTHLY_BANDS.map(band => {
      const from = band.min;
      const to = band.max === Infinity ? assessableIncome : band.max;
      const taxableAmount = Math.max(0, Math.min(assessableIncome, to) - from);
      const tax = Math.round(taxableAmount * band.rate);
      return {
        description: band.description,
        from,
        to: band.max,
        rate: band.rate,
        rateDisplay: `${band.rate * 100}%`,
        taxableAmount,
        tax,
      };
    }).filter(b => b.taxableAmount > 0 || b.from === 0);
  }
}
