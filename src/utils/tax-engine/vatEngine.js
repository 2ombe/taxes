import { VAT_CONFIG } from './config.js';

/**
 * Rwanda VAT Engine (Value Added Tax Law)
 * Standard rate: 18% | Zero rate: 0% (exports) | Exempt: various
 */
export class VATEngine {
  /**
   * Compute VAT for a business period
   * @param {Object} inputs
   * @param {number} inputs.taxableSales        - Standard-rated taxable sales (RWF)
   * @param {number} inputs.zeroRatedSales      - Export / zero-rated sales (RWF)
   * @param {number} inputs.exemptSales         - Exempt sales (RWF)
   * @param {number} inputs.taxableInputs       - Taxable purchases (RWF)
   * @param {number} inputs.capitalGoods        - Capital goods purchased (RWF)
   * @param {number} inputs.openingVATCredit    - VAT credit brought forward (RWF)
   * @returns {Object} Full VAT computation result
   */
  static compute({ taxableSales = 0, zeroRatedSales = 0, exemptSales = 0, taxableInputs = 0, capitalGoods = 0, openingVATCredit = 0 }) {
    const totalRevenue = taxableSales + zeroRatedSales + exemptSales;

    // Output VAT (18% on standard-rated only)
    const outputVAT = taxableSales * VAT_CONFIG.STANDARD_RATE;

    // Input VAT deductible (apportionment if exempt sales exist)
    const taxableRatio = totalRevenue > 0 ? (taxableSales + zeroRatedSales) / totalRevenue : 1;
    const inputVATTotal = (taxableInputs + capitalGoods) * VAT_CONFIG.STANDARD_RATE;
    const deductibleInputVAT = inputVATTotal * taxableRatio;

    // Net VAT position
    const netVATBeforeCredit = outputVAT - deductibleInputVAT;
    const netVAT = netVATBeforeCredit - openingVATCredit;

    const vatPayable   = Math.max(0, netVAT);
    const vatRefund    = Math.max(0, -netVAT);

    // RRA Filing date info
    const now = new Date();
    const filingMonth = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
    const filingYear  = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    const filingDeadline = `15th of month following the period`;

    return {
      // Inputs summary
      taxableSales,
      zeroRatedSales,
      exemptSales,
      totalRevenue,
      taxableRatio: Math.round(taxableRatio * 10000) / 100, // as percentage

      // Calculations
      outputVAT,
      inputVATTotal,
      taxableInputsInputVAT: taxableInputs * VAT_CONFIG.STANDARD_RATE,
      capitalGoodsInputVAT: capitalGoods * VAT_CONFIG.STANDARD_RATE,
      deductibleInputVAT,
      nonDeductibleInputVAT: inputVATTotal - deductibleInputVAT,
      netVATBeforeCredit,
      openingVATCredit,
      netVAT,

      // Payable / Refund
      vatPayable,
      vatRefund,
      position: vatPayable > 0 ? 'PAYABLE' : vatRefund > 0 ? 'REFUNDABLE' : 'NIL',

      // Meta
      standardRate: VAT_CONFIG.STANDARD_RATE * 100,
      filingDeadline,
    };
  }

  /**
   * Quick VAT check — is a business above the VAT threshold?
   */
  static isRegistrationRequired(annualTurnover) {
    return annualTurnover >= VAT_CONFIG.THRESHOLD;
  }

  /** Format VAT return lines for display */
  static getReturnLines(result) {
    return [
      { label: 'Box 1: Standard-Rated Sales',        amount: result.taxableSales,          isInput: false },
      { label: 'Box 2: Zero-Rated Sales (Exports)',   amount: result.zeroRatedSales,        isInput: false },
      { label: 'Box 3: Exempt Sales',                 amount: result.exemptSales,           isInput: false },
      { label: 'Box 4: Total Revenue',                amount: result.totalRevenue,          isInput: false, bold: true },
      { label: 'Box 5: Output VAT (18% × Box 1)',     amount: result.outputVAT,            isInput: false, highlight: 'tax' },
      { label: 'Box 6: Total Purchases (Taxable)',    amount: result.taxableInputs ?? 0,   isInput: true },
      { label: 'Box 7: Input VAT on Purchases',       amount: result.taxableInputsInputVAT ?? 0, isInput: true, highlight: 'credit' },
      { label: 'Box 8: Capital Goods Input VAT',      amount: result.capitalGoodsInputVAT ?? 0, isInput: true, highlight: 'credit' },
      { label: 'Box 9: Deductible Input VAT',         amount: result.deductibleInputVAT,   isInput: true, highlight: 'credit', bold: true },
      { label: 'Box 10: VAT Credit b/f',              amount: result.openingVATCredit,     isInput: true, highlight: 'credit' },
      { label: 'Box 11: Net VAT Payable / (Refund)',  amount: result.netVAT,               bold: true, highlight: result.netVAT >= 0 ? 'payable' : 'refund' },
    ];
  }
}
