/**
 * @typedef {Object} TrialBalanceItem
 * @property {string} accountCode
 * @property {string} accountName
 * @property {number} amount
 * @property {'Income' | 'Expense' | 'Asset' | 'Liability' | 'Equity'} category
 * @property {boolean} isNonDeductible - Initially flagged if mapped to non-deductible category
 */

/**
 * @typedef {Object} TaxAdjustment
 * @property {string} description
 * @property {number} amount
 * @property {'Add-back' | 'Deduction'} type
 * @property {string} legalBasis - Article reference (e.g., "Article 25")
 */

/**
 * @typedef {Object} AssetCategory
 * @property {string} id
 * @property {string} name
 * @property {number} taxRate - Annual depreciation rate (%)
 */

/**
 * @typedef {Object} FixedAsset
 * @property {string} id
 * @property {string} name
 * @property {string} categoryId
 * @property {number} cost
 * @property {number} accountingDepreciation
 * @property {number} taxDepreciationBroughtForward
 * @property {string} purchaseDate
 */

/**
 * @typedef {Object} TaxLoss
 * @property {number} year
 * @property {number} amount
 * @property {number} appliedAmount
 * @property {number} remainingAmount
 * @property {boolean} isExpired
 */

/**
 * @typedef {Object} ComputationResult
 * @property {number} accountingProfit
 * @property {TaxAdjustment[]} adjustments
 * @property {number} taxableIncomeBeforeLosses
 * @property {number} lossesApplied
 * @property {number} finalTaxableIncome
 * @property {number} citPayable
 */
export {};
