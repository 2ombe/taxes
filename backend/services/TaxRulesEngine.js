/**
 * Rwanda Tax Rules Engine
 * Implements:
 * - Articles 24-31: Corporate Income Tax (CIT) & Loss Carryforward
 * - Value Added Tax (VAT) - 18% standard, pro-rata input apportionment
 * - PAYE (Pay As You Earn) - 2025 Progressive Monthly Bands & RSSB/CBHI deductions
 * - Withholding Tax (WHT) - Articles 43-52
 */
class TaxRulesEngine {
    constructor(taxCategories, assetCategories) {
        this.taxCategories = taxCategories || [];
        this.assetCategories = assetCategories || [];
    }

    // Article 24 & 25 - Expenses Processing
    processExpense(item) {
        let adjustment = 0;
        let treatment = 'DEDUCTIBLE';
        let article = 'Article 24';

        // Article 24: General business deductibility
        if (item.isBusinessRelated === false || item.hasSupportDocument === false) {
            treatment = 'NON_DEDUCTIBLE';
            adjustment = item.amount;
            article = 'Article 24 (Lack of business proof)';
        }

        // Article 25: Specific non-deductible items (Fines, Personal, etc)
        const categoryMatch = this.taxCategories.find(c => 
            item.accountName && item.accountName.toLowerCase().includes(c.name.toLowerCase())
        );

        if (categoryMatch && !categoryMatch.isDeductible) {
            treatment = 'NON_DEDUCTIBLE';
            adjustment = item.amount;
            article = categoryMatch.articleReference || 'Article 25';
        }

        return {
            ...item,
            taxTreatment: treatment,
            articleReference: article,
            adjustmentAmount: adjustment
        };
    }

    // Articles 27 & 28 - Depreciation Processing
    processAsset(assetItem) {
        const category = this.assetCategories.find(c => c.categoryId === assetItem.categoryId);
        const taxRate = category ? category.taxDepreciationRate : 0;
        
        const taxDepreciation = (assetItem.cost || 0) * taxRate;
        const diff = (assetItem.accountingDepreciation || 0) - taxDepreciation;

        return {
            ...assetItem,
            taxDepreciation,
            adjustmentAmount: diff > 0 ? diff : 0, // Add-back if accounting > tax
            deductionAmount: diff < 0 ? Math.abs(diff) : 0 // Deduction if tax > accounting
        };
    }

    // Article 30 - Bad Debts
    processBadDebt(debt) {
        let treatment = 'NON_DEDUCTIBLE';
        let adjustment = debt.amount || 0;

        if (debt.isWrittenOffInAccounts && debt.hasRecoveryProof) {
            treatment = 'DEDUCTIBLE';
            adjustment = 0; // Allowed deduction
        }

        return {
            ...debt,
            taxTreatment: treatment,
            adjustmentAmount: adjustment
        };
    }

    // CIT Final Computation Flow (Articles 24-31)
    computeTax(accountingProfit = 0, processedItems = [], processedAssets = [], priorLosses = []) {
        let addBacks = 0;
        let deductions = 0;

        processedItems.forEach(item => {
            if (item.taxTreatment === 'NON_DEDUCTIBLE') addBacks += (item.adjustmentAmount || 0);
        });

        processedAssets.forEach(asset => {
            addBacks += (asset.adjustmentAmount || 0);
            deductions += (asset.deductionAmount || 0);
        });

        const taxableIncomeBeforeLosses = accountingProfit + addBacks - deductions;
        
        // Article 31 - Loss Carryforward (Limit 5 years in Rwanda)
        let lossesApplied = 0;
        priorLosses.forEach(loss => {
            if (loss.age <= 5 && taxableIncomeBeforeLosses > lossesApplied) {
                const available = (loss.amount || 0) - (loss.appliedAmount || 0);
                const needed = taxableIncomeBeforeLosses - lossesApplied;
                lossesApplied += Math.min(available, needed);
            }
        });

        const finalTaxableIncome = Math.max(0, taxableIncomeBeforeLosses - lossesApplied);
        const citPayable = finalTaxableIncome * 0.30; // 30% Rwanda CIT rate

        return {
            accountingProfit,
            addBacks,
            deductions,
            taxableIncomeBeforeLosses,
            lossesApplied,
            finalTaxableIncome,
            citPayable
        };
    }

    // Value Added Tax (VAT) Law — 18% standard rate
    computeVAT({ taxableSales = 0, zeroRatedSales = 0, exemptSales = 0, taxableInputs = 0, capitalGoods = 0, openingCredit = 0 }) {
        const totalSales = taxableSales + zeroRatedSales + exemptSales;
        const outputVAT = taxableSales * 0.18;
        const taxableRatio = totalSales > 0 ? (taxableSales + zeroRatedSales) / totalSales : 1;
        const totalInputVAT = (taxableInputs + capitalGoods) * 0.18;
        const deductibleInputVAT = totalInputVAT * taxableRatio;
        const netVATBeforeCredit = outputVAT - deductibleInputVAT;
        const netVAT = netVATBeforeCredit - openingCredit;

        return {
            taxableSales,
            zeroRatedSales,
            exemptSales,
            totalSales,
            taxableRatio: Math.round(taxableRatio * 10000) / 100,
            outputVAT,
            totalInputVAT,
            deductibleInputVAT,
            netVAT,
            vatPayable: Math.max(0, netVAT),
            vatRefund: Math.max(0, -netVAT),
            filingDeadline: '15th of the following month'
        };
    }

    // PAYE (Pay As You Earn) — Rwanda 2025 Monthly progressive bands & RSSB/CBHI
    computePAYE({ grossSalary = 0, cashAllowances = 0, nonCashBenefits = 0, includeRSSB = true }) {
        const totalTaxable = grossSalary + cashAllowances + nonCashBenefits;
        const rssbEmployee = includeRSSB ? grossSalary * 0.05 : 0;
        const cbhi = includeRSSB ? grossSalary * 0.005 : 0;
        const assessable = Math.max(0, totalTaxable - rssbEmployee - cbhi);

        // Bands: 0% <= 60k, 20% (60,001 - 100k), 30% > 100k
        let payeTax = 0;
        if (assessable > 100000) {
            payeTax = (40000 * 0.20) + ((assessable - 100000) * 0.30);
        } else if (assessable > 60000) {
            payeTax = (assessable - 60000) * 0.20;
        }

        const rssbEmployer = includeRSSB ? grossSalary * 0.05 : 0;
        const maternity = includeRSSB ? grossSalary * 0.006 : 0;
        const totalEmployerCost = grossSalary + rssbEmployer + maternity;
        const netSalary = Math.max(0, totalTaxable - (rssbEmployee + cbhi + payeTax));

        return {
            grossSalary,
            totalTaxable,
            rssbEmployee,
            cbhi,
            assessable,
            payeTax: Math.round(payeTax),
            netSalary: Math.round(netSalary),
            totalEmployerCost: Math.round(totalEmployerCost),
            effectiveRate: assessable > 0 ? ((payeTax / assessable) * 100).toFixed(1) : '0.0'
        };
    }

    // Withholding Tax (WHT) — Articles 43-52
    computeWHT({ paymentType = 'dividends', grossAmount = 0, customRate = null }) {
        const standardRates = {
            dividends: 0.15,
            interest: 0.15,
            royalties: 0.15,
            services_nr: 0.15,
            mgmt_fees: 0.15,
            rent: 0.15,
            services_res: 0.03,
            imports: 0.05,
            lottery: 0.15
        };

        const rate = customRate !== null ? customRate : (standardRates[paymentType] || 0.15);
        const whtAmount = grossAmount * rate;
        const netPayment = grossAmount - whtAmount;

        return {
            paymentType,
            grossAmount,
            rate,
            ratePercent: `${(rate * 100).toFixed(0)}%`,
            whtAmount: Math.round(whtAmount),
            netPayment: Math.round(netPayment),
            remitBy: '15th of the following month'
        };
    }
}

module.exports = TaxRulesEngine;
