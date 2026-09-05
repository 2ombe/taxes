const ExcelJS = require('exceljs');

class ExcelGenerator {
    static async generateCITReport(computationData) {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'AGN Bridge Consult CIT Platform';
        workbook.created = new Date();

        // Sheet 1: Main Computation
        const mainSheet = workbook.addWorksheet('CIT Computation');
        mainSheet.columns = [
            { header: 'Item', key: 'item', width: 40 },
            { header: 'Amount (RWF)', key: 'amount', width: 25 },
            { header: 'Reference', key: 'ref', width: 20 }
        ];

        mainSheet.addRow({ item: 'Accounting Profit Before Tax', amount: computationData.accountingProfit, ref: 'P&L' });
        mainSheet.addRow({ item: 'Add: Non-Deductible Expenses', amount: computationData.addBacks, ref: 'Article 25' });
        mainSheet.addRow({ item: 'Less: Allowable Deductions', amount: -computationData.deductions, ref: 'Article 24/27' });
        mainSheet.addRow({ item: 'Taxable Income Before Losses', amount: computationData.taxableIncomeBeforeLosses, ref: '' });
        mainSheet.addRow({ item: 'Less: Loss Carryforward', amount: -computationData.lossesApplied, ref: 'Article 31' });
        mainSheet.addRow({ item: 'Final Taxable Income', amount: computationData.finalTaxableIncome, ref: '' });
        mainSheet.addRow({ item: 'CIT Payable (30%)', amount: computationData.citPayable, ref: '' });

        // Highlight Important Rows
        mainSheet.getRow(1).font = { bold: true };
        mainSheet.getRow(7).font = { bold: true, color: { argb: 'FFFF0000' } }; // Red for Final Taxable Income
        mainSheet.getRow(8).font = { bold: true, size: 14 }; // CIT Payable

        // Sheet 2: Depreciation Schedule
        const deprSheet = workbook.addWorksheet('Depreciation Schedule');
        deprSheet.columns = [
            { header: 'Asset Name', key: 'name', width: 30 },
            { header: 'Category', key: 'cat', width: 15 },
            { header: 'Cost', key: 'cost', width: 20 },
            { header: 'Tax Depreciation', key: 'taxDepr', width: 20 },
            { header: 'Acc. Depreciation', key: 'accDepr', width: 20 },
            { header: 'Adjustment', key: 'adj', width: 20 },
        ];
        
        if (computationData.assets) {
            computationData.assets.forEach(asset => {
                deprSheet.addRow({
                    name: asset.assetName || asset.name,
                    cat: asset.categoryId,
                    cost: asset.cost,
                    taxDepr: asset.taxDepreciation,
                    accDepr: asset.accountingDepreciation,
                    adj: asset.adjustmentAmount || -asset.deductionAmount
                });
            });
        }
        deprSheet.getRow(1).font = { bold: true };

        return workbook;
    }
}

module.exports = ExcelGenerator;
