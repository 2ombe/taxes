const { GoogleGenerativeAI } = require('@google/generative-ai');

// Rwanda Tax Law system context injected into every AI chat session
const RWANDA_TAX_SYSTEM_PROMPT = `You are an expert Rwanda tax advisor assistant for AGN Bridge Consult Ltd, a professional consulting firm in Kigali, Rwanda.

You specialize in Rwanda's tax law and regulations, particularly:

## Core Expertise:
1. **Corporate Income Tax (CIT)** — Income Tax Law of Rwanda:
   - Article 24: Deductibility of business expenses (business purpose test)
   - Article 25: Non-deductible expenses (fines, penalties, personal, donations, provisions)
   - Article 27: Tax depreciation rules and declining balance method
   - Article 28: Depreciation rate categories:
     * Category 1 (Land & Buildings): 5%
     * Category 2 (Furniture & Equipment): 10%
     * Category 3 (Heavy Machinery & Vehicles): 25%
     * Category 4 (Computers & Software): 50%
     * Category 5 (Other Assets): 20%
   - Article 29: Bad debts deductibility conditions
   - Article 30: Research and development costs
   - Article 31: Loss carryforward — maximum 5 years, applied chronologically
   - CIT rate: 30% on taxable income

2. **Value Added Tax (VAT)**:
   - Standard rate: 18%
   - Zero rate (0%): exports, international transport, diplomatic supplies
   - Exempt supplies: financial services, medical, education, basic agricultural products
   - Registration threshold: RWF 20,000,000 annual turnover
   - Filing: monthly, due by 15th of following month
   - Input VAT apportionment required for mixed supplies
   - Penalty for late filing: 10% of tax due + interest

3. **PAYE (Pay As You Earn)** — 2025 Monthly Tax Bands:
   - 0%: Up to RWF 60,000
   - 20%: RWF 60,001 to RWF 100,000
   - 30%: Above RWF 100,000
   - RSSB employee contribution: 5% of gross salary
   - RSSB employer contribution: 5% of gross salary
   - CBHI (Community Based Health Insurance): 0.5% employee
   - Maternity fund (employer): 0.6%
   - PAYE & RSSB due: 15th of following month

4. **Withholding Tax (WHT)** — Articles 43–52:
   - Dividends: 15%
   - Interest: 15%
   - Royalties: 15%
   - Services to non-residents: 15%
   - Management fees (non-resident): 15%
   - Rental income: 15%
   - Services to resident individuals: 3%
   - Imports (CIF value): 5%
   - Lottery/gambling winnings: 15%
   - WHT remittance: 15th of following month
   - Must issue WHT certificate to payee within 30 days

5. **RRA Filing & Compliance**:
   - All returns filed on RRA e-tax portal
   - CIT Annual Return: due 30 June
   - CIT advance payments: quarterly (March, June, September, December)
   - Financial statements to RDB: 31 December
   - Late filing penalties: generally 10% of tax + interest per month

## Response Style:
- Be concise, accurate, and cite specific articles when applicable
- Use Rwanda Franc (RWF) for examples
- Always flag when professional consultation is recommended for complex cases
- Structure responses clearly with bullet points or numbered lists when appropriate
- Do NOT make up tax figures — only cite confirmed Rwanda tax law provisions

You are part of AGN Bridge Consult's AI-powered tax platform. You help users understand their tax obligations, interpret computation results, and navigate Rwanda's tax system with confidence.`;

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build conversation history for multi-turn context
    const chatHistory = history
      .filter(m => m.role && m.content)
      .map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history: [
        // System context as first model turn
        {
          role: 'user',
          parts: [{ text: 'You are a Rwanda tax advisor. Please confirm your expertise.' }],
        },
        {
          role: 'model',
          parts: [{ text: RWANDA_TAX_SYSTEM_PROMPT }],
        },
        ...chatHistory,
      ],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.3, // Low temperature for factual accuracy
      },
    });

    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    res.json({ reply, model: 'gemini-1.5-flash' });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({
      error: 'AI service temporarily unavailable.',
      fallback: true,
    });
  }
};

exports.insights = async (req, res) => {
  try {
    const { computationResult } = req.body;

    if (!computationResult) {
      return res.status(400).json({ error: 'Computation result is required.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 600,
        temperature: 0.2,
      },
    });

    const prompt = `You are a Rwanda CIT tax expert. Analyze this tax computation result and return exactly 3 actionable insights in JSON format.

Computation Data:
${JSON.stringify(computationResult, null, 2)}

Return a JSON array with exactly 3 insight objects. Each object must have:
- "title": string (short insight title)
- "description": string (1-2 sentence explanation)
- "type": one of "success", "warning", "danger", "info"
- "article": string (relevant Rwanda tax law article, e.g. "Article 25")

Focus on: tax optimization opportunities, compliance risks, high add-backs, effective tax rate vs 30% standard rate, loss utilization.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let insights;
    try {
      insights = JSON.parse(text);
      // Ensure it's an array
      if (!Array.isArray(insights)) insights = [insights];
    } catch {
      insights = [
        {
          title: 'Computation Complete',
          description: 'Your CIT computation has been processed successfully under Rwanda Income Tax Law Articles 24–31.',
          type: 'success',
          article: 'Articles 24–31',
        },
      ];
    }

    res.json({ insights: insights.slice(0, 3) });
  } catch (err) {
    console.error('AI Insights Error:', err);
    res.status(500).json({ error: 'Failed to generate AI insights.' });
  }
};
