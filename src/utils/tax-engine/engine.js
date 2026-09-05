import { CIT_CONFIG } from './config.js';

export class TaxEngine {
  /**
   * Article 24 & 25: Deductible and Non-Deductible Expenses
   * @param {import('./types').TrialBalanceItem[]} items 
   * @returns {import('./types').TaxAdjustment[]}
   */
  static calculateExpenseAdjustments(items) {
    const adjustments = [];
    
    items.forEach(item => {
      if (item.category === 'Expense') {
        // Check against non-deductible rules
        const rule = CIT_CONFIG.NON_DEDUCTIBLE_RULES.find(r => r.pattern.test(item.accountName));
        
        if (rule || item.isNonDeductible) {
          adjustments.push({
            description: `Add-back: ${item.accountName} (${rule?.reason || 'Non-deductible'})`,
            amount: item.amount,
            type: 'Add-back',
            legalBasis: rule?.article || 'Article 25'
          });
        }
      }
    });

    return adjustments;
  }

  /**
   * Article 27 & 28: Depreciation
   * @param {import('./types').FixedAsset[]} assets 
   * @returns {import('./types').TaxAdjustment[]}
   */
  static calculateDepreciationAdjustments(assets) {
    const adjustments = [];
    
    assets.forEach(asset => {
      const category = CIT_CONFIG.DEPRECIATION_CATEGORIES.find(c => c.id === asset.categoryId);
      if (!category) return;

      const taxDepreciation = asset.cost * category.taxRate;
      const difference = asset.accountingDepreciation - taxDepreciation;

      if (difference > 0) {
        adjustments.push({
          description: `Excess Depreciation: ${asset.name}`,
          amount: Math.abs(difference),
          type: 'Add-back',
          legalBasis: 'Article 28'
        });
      } else if (difference < 0) {
        adjustments.push({
          description: `Tax Depreciation Claim: ${asset.name}`,
          amount: Math.abs(difference),
          type: 'Deduction',
          legalBasis: 'Article 27'
        });
      }
    });

    return adjustments;
  }

  /**
   * Article 31: Loss Carryforward
   * @param {number} currentTaxableIncome 
   * @param {import('./types').TaxLoss[]} historicalLosses 
   * @returns {{ appliedLosses: number, remainingLosses: import('./types').TaxLoss[] }}
   */
  static applyLossCarryforward(currentTaxableIncome, historicalLosses) {
    let remainingIncome = currentTaxableIncome;
    let totalApplied = 0;
    const currentYear = new Date().getFullYear();

    const updatedLosses = historicalLosses.map(loss => {
      const isExpired = (currentYear - loss.year) > CIT_CONFIG.LOSS_CARRYFORWARD_YEARS;
      
      if (!isExpired && remainingIncome > 0 && loss.remainingAmount > 0) {
        const canApply = Math.min(remainingIncome, loss.remainingAmount);
        remainingIncome -= canApply;
        totalApplied += canApply;
        
        return {
          ...loss,
          appliedAmount: loss.appliedAmount + canApply,
          remainingAmount: loss.remainingAmount - canApply,
          isExpired
        };
      }
      
      return { ...loss, isExpired };
    });

    return { appliedLosses: totalApplied, remainingLosses: updatedLosses };
  }

  /**
   * Main Computation Entry Point
   * @param {Object} inputs
   * @param {number} inputs.accountingProfit
   * @param {import('./types').TrialBalanceItem[]} inputs.trialBalance
   * @param {import('./types').FixedAsset[]} inputs.assets
   * @param {import('./types').TaxLoss[]} inputs.historicalLosses
   * @returns {import('./types').ComputationResult}
   */
  static generateCIT(inputs) {
    const { accountingProfit, trialBalance, assets, historicalLosses } = inputs;

    const expenseAdjustments = this.calculateExpenseAdjustments(trialBalance);
    const depreciationAdjustments = this.calculateDepreciationAdjustments(assets);
    
    const allAdjustments = [...expenseAdjustments, ...depreciationAdjustments];
    
    const netAdjustments = allAdjustments.reduce((acc, adj) => {
      return adj.type === 'Add-back' ? acc + adj.amount : acc - adj.amount;
    }, 0);

    const taxableIncomeBeforeLosses = Math.max(0, accountingProfit + netAdjustments);
    
    const { appliedLosses } = this.applyLossCarryforward(taxableIncomeBeforeLosses, historicalLosses);
    
    const finalTaxableIncome = Math.max(0, taxableIncomeBeforeLosses - appliedLosses);
    const citPayable = finalTaxableIncome * CIT_CONFIG.TAX_RATE;

    return {
      accountingProfit,
      adjustments: allAdjustments,
      taxableIncomeBeforeLosses,
      lossesApplied: appliedLosses,
      finalTaxableIncome,
      citPayable
    };
  }
}
