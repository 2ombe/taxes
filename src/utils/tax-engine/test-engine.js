import { TaxEngine } from './engine.js';

const mockInputs = {
  accountingProfit: 1000000,
  trialBalance: [
    { accountName: 'Staff Salaries', amount: 500000, category: 'Expense', isNonDeductible: false },
    { accountName: 'Personal Travel', amount: 50000, category: 'Expense', isNonDeductible: true },
    { accountName: 'Traffic Fine', amount: 10000, category: 'Expense', isNonDeductible: false }, // Should be caught by regex
    { accountName: 'Office Rent', amount: 120000, category: 'Expense', isNonDeductible: false },
  ],
  assets: [
    { name: 'Server Rack', categoryId: 'cat4', cost: 200000, accountingDepreciation: 40000 }, // Tax rate 50% = 100000. Under-depreciated by 60k
    { name: 'Office Car', categoryId: 'cat3', cost: 500000, accountingDepreciation: 150000 }, // Tax rate 25% = 125000. Over-depreciated by 25k
  ],
  historicalLosses: [
    { year: 2023, amount: 200000, appliedAmount: 0, remainingAmount: 200000 },
  ]
};

const result = TaxEngine.generateCIT(mockInputs);

console.log('--- CIT Computation Result ---');
console.log(`Accounting Profit: ${result.accountingProfit}`);
console.log('Adjustments:');
result.adjustments.forEach(adj => {
  console.log(`  - ${adj.description}: ${adj.type === 'Add-back' ? '+' : '-'}${adj.amount} (${adj.legalBasis})`);
});
console.log(`Taxable Income Before Losses: ${result.taxableIncomeBeforeLosses}`);
console.log(`Losses Applied: ${result.lossesApplied}`);
console.log(`Final Taxable Income: ${result.finalTaxableIncome}`);
console.log(`CIT Payable (30%): ${result.citPayable}`);
