import { WHT_CONFIG } from './config.js';

/**
 * Rwanda Withholding Tax Engine
 * Income Tax Law — Articles 43-52
 */
export class WHTEngine {
  /**
   * Compute WHT for a single payment
   * @param {Object} inputs
   * @param {string} inputs.paymentTypeId  - WHT rate category ID from WHT_CONFIG
   * @param {number} inputs.grossAmount    - Gross payment amount (RWF)
   * @param {boolean} inputs.isTaxTreaty  - Is the payee covered by a double tax treaty?
   * @param {number} inputs.treatyRate    - Reduced treaty rate (if applicable)
   * @returns {Object} WHT computation
   */
  static compute({ paymentTypeId, grossAmount = 0, isTaxTreaty = false, treatyRate = null }) {
    const rateConfig = WHT_CONFIG.RATES.find(r => r.id === paymentTypeId);
    if (!rateConfig) throw new Error(`Unknown WHT payment type: ${paymentTypeId}`);

    const applicableRate = isTaxTreaty && treatyRate !== null ? treatyRate : rateConfig.rate;
    const whtAmount = grossAmount * applicableRate;
    const netPayment = grossAmount - whtAmount;

    return {
      paymentType: rateConfig.label,
      legalBasis: rateConfig.article,
      grossAmount,
      standardRate: rateConfig.rate,
      applicableRate,
      isTaxTreaty,
      treatyRate,
      whtAmount,
      netPayment,
      rateDisplay: `${applicableRate * 100}%`,
      filingDeadline: '15th of following month',
    };
  }

  /**
   * Compute WHT for multiple payments in a period
   */
  static computeBatch(payments) {
    const results = payments.map(p => ({
      ...p,
      computation: this.compute(p),
    }));

    const totals = results.reduce((acc, p) => ({
      grossAmount: acc.grossAmount + p.computation.grossAmount,
      whtAmount:   acc.whtAmount   + p.computation.whtAmount,
      netPayment:  acc.netPayment  + p.computation.netPayment,
    }), { grossAmount: 0, whtAmount: 0, netPayment: 0 });

    return { payments: results, totals };
  }

  /** Get all available WHT rate categories */
  static getRateCategories() {
    return WHT_CONFIG.RATES;
  }

  /**
   * Check if WHT is applicable — some payments below a threshold may be exempt.
   * Rwanda general rule: WHT applies from first shilling for listed categories.
   */
  static isApplicable(paymentTypeId, grossAmount) {
    const rateConfig = WHT_CONFIG.RATES.find(r => r.id === paymentTypeId);
    return rateConfig ? grossAmount > 0 : false;
  }
}
