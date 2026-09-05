import { CIT_CONFIG } from './config.js';

export class TBAnalyzer {
  /**
   * Analyzes raw TB data and categorizes it
   * @param {Array<{name: string, amount: number}>} rows 
   * @returns {Object} { accountingProfit, trialBalance, assets }
   */
  static analyze(rows) {
    let incomeTotal = 0;
    let expenseTotal = 0;
    const tbItems = [];
    const assets = [];
    const deprRows = [];

    rows.forEach(row => {
      const name = row.name.trim();
      const amount = Number(row.amount) || 0;
      if (amount === 0) return;

      const lowerName = name.toLowerCase();

      // 1. Identify Income
      if (CIT_CONFIG.TB_KEYWORDS.INCOME.test(lowerName)) {
        incomeTotal += Math.abs(amount);
      } 
      // 2. Identify Expenses
      else if (CIT_CONFIG.TB_KEYWORDS.EXPENSE.test(lowerName)) {
        expenseTotal += Math.abs(amount);
        
        // Track depreciation rows separately to link to assets later
        if (CIT_CONFIG.TB_KEYWORDS.DEPRECIATION.test(lowerName)) {
          deprRows.push({ name, amount: Math.abs(amount) });
        }

        tbItems.push({
          id: `tb-${Math.random().toString(36).substr(2, 9)}`,
          accountName: name,
          amount: Math.abs(amount),
          category: 'Expense'
        });
      }
      // 3. Identify Assets
      else if (CIT_CONFIG.TB_KEYWORDS.ASSET.test(lowerName)) {
        const mapping = CIT_CONFIG.ASSET_MAPPING.find(m => m.pattern.test(lowerName));
        assets.push({
          id: `ast-${Math.random().toString(36).substr(2, 9)}`,
          name: name,
          categoryId: mapping ? mapping.categoryId : 'cat5',
          cost: Math.abs(amount),
          accountingDepreciation: 0 // Will be matched next
        });
      }
    });

    // 4. Heuristic: Link Depreciation to Assets
    // For simplicity, we split total depreciation across assets proportionally to cost
    // if we can't find specific name matches.
    const totalAccDepr = deprRows.reduce((sum, r) => sum + r.amount, 0);
    const totalAssetCost = assets.reduce((sum, a) => sum + a.cost, 0);

    if (totalAccDepr > 0 && totalAssetCost > 0) {
      assets.forEach(asset => {
        asset.accountingDepreciation = (asset.cost / totalAssetCost) * totalAccDepr;
      });
    }

    return {
      accountingProfit: incomeTotal - expenseTotal,
      trialBalance: tbItems,
      assets: assets
    };
  }
}
