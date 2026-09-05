const TaxData = require('../models/TaxData');
const TaxComputation = require('../models/TaxComputation');
const TaxRulesEngine = require('../services/TaxRulesEngine');
const ExcelGenerator = require('../services/ExcelGenerator');
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

exports.getTaxData = async (req, res) => {
    try {
        const taxData = await TaxData.findOne({ userId: req.user.id });
        if (!taxData) return res.status(404).json({ message: 'No tax records found for this user.' });
        res.json(taxData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.saveTaxData = async (req, res) => {
    try {
        const { accountingProfit, trialBalance, assets, historicalLosses } = req.body;
        const taxData = await TaxData.findOneAndUpdate(
            { userId: req.user.id },
            { accountingProfit, trialBalance, assets, historicalLosses, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json(taxData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.analyzeTB = async (req, res) => {
    try {
        const { tbData } = req.body;
        if (!tbData || !Array.isArray(tbData)) {
            return res.status(400).json({ message: "Invalid trial balance data provided." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // We use gemini-1.5-pro for complex reasoning
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        accountingProfit: { type: SchemaType.NUMBER, description: "Total Accounting Profit calculated based on income minus expenses." },
                        trialBalance: {
                            type: SchemaType.ARRAY,
                            description: "The list of operating expenses formatted for tax engine.",
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING, description: "Unique identifier for the item." },
                                    accountName: { type: SchemaType.STRING, description: "Name of the account." },
                                    amount: { type: SchemaType.NUMBER, description: "Amount for the expense." },
                                    category: { type: SchemaType.STRING, description: "Category of the expense (e.g. 'Expense')." }
                                },
                                required: ["id", "accountName", "amount", "category"]
                            }
                        },
                        assets: {
                            type: SchemaType.ARRAY,
                            description: "Extracted fixed assets from the trial balance data.",
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    id: { type: SchemaType.STRING, description: "Unique identifier for the asset." },
                                    name: { type: SchemaType.STRING, description: "Name of the asset." },
                                    categoryId: { type: SchemaType.STRING, description: "Category ID based on Rwandan CIT rules (cat1=Land & Buildings, cat2=Furniture & Equipment, cat3=Vehicles & Heavy Machinery, cat4=Computers & Software, cat5=Other Assets)." },
                                    cost: { type: SchemaType.NUMBER, description: "Cost of the asset." },
                                    accountingDepreciation: { type: SchemaType.NUMBER, description: "Accumulated accounting depreciation." }
                                },
                                required: ["id", "name", "categoryId", "cost", "accountingDepreciation"]
                            }
                        }
                    },
                    required: ["accountingProfit", "trialBalance", "assets"]
                }
            }
        });

        const prompt = `You are an expert tax accountant reviewing financial records for a Rwandan company. Review the following Trial Balance data:
        1. Calculate the 'accountingProfit' (Total Income minus Total Expenses).
        2. Extract operating expenses and map them into the 'trialBalance' array. Give each an ID. Make sure to identify potentially non-deductible items.
        3. Extract fixed assets (computers, vehicles, furniture, buildings) into the 'assets' array and assign correct depreciation categoryIds (cat1, cat2, cat3, cat4, cat5). Provide IDs.
        
        Trial Balance Data:
        ${JSON.stringify(tbData)}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const analysis = JSON.parse(responseText);

        res.json(analysis);

    } catch (err) {
        console.error("Gemini Analysis Error:", err);
        res.status(500).json({ error: "Failed to analyze data with Gemini." });
    }
};

exports.computeTax = async (req, res) => {
    try {
        const { fiscalYear, accountingProfit, items, assets, losses } = req.body;
        
        // In a full implementation, categories would be loaded from MongoDB here
        const engine = new TaxRulesEngine([], []); 
        
        const processedItems = items ? items.map(i => engine.processExpense(i)) : [];
        const processedAssets = assets ? assets.map(a => engine.processAsset(a)) : [];
        
        const result = engine.computeTax(accountingProfit || 0, processedItems, processedAssets, losses || []);
        
        // Save the deterministic computation to the persistent Normalized Ledger
        const ledger = await TaxComputation.findOneAndUpdate(
            { userId: req.user.id, fiscalYear },
            { 
               accountingProfit: result.accountingProfit,
               taxableIncome: result.finalTaxableIncome,
               citPayable: result.citPayable,
               $push: { auditTrail: { action: 'System Computed Final CIT', legalBasis: 'Articles 24-31 strict application' } }
            },
            { upsert: true, new: true }
        );

        res.json({ taxResult: result, computationRecord: ledger });
    } catch (err) {
        console.error("Computation Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.exportExcel = async (req, res) => {
    try {
        const { fiscalYear } = req.query;
        const ledger = await TaxComputation.findOne({ userId: req.user.id, fiscalYear });
        
        if (!ledger) return res.status(404).json({ message: "No computation found." });

        // Build the computation object for excel mapping
        const exportData = {
           accountingProfit: ledger.accountingProfit,
           addBacks: ledger.taxableIncome - ledger.accountingProfit, // simplified
           deductions: 0,
           taxableIncomeBeforeLosses: ledger.taxableIncome,
           lossesApplied: 0,
           finalTaxableIncome: ledger.taxableIncome,
           citPayable: ledger.citPayable,
           assets: [] // In a real app, populate from DB related asset models
        };

        const workbook = await ExcelGenerator.generateCITReport(exportData);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=CIT_Computation_${fiscalYear}.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Excel Export Error:", err);
        res.status(500).json({ error: err.message });
    }
};
