import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/ai/debug?check=true
// Returns whether GROQ_API_KEY is configured and (optionally) whether the Groq API is reachable.
router.get('/debug', async (req, res) => {
  const groqConfigured = !!process.env.GROQ_API_KEY;
  const performCheck = req.query.check === 'true';

  const result: any = {
    groqConfigured,
    checkPerformed: performCheck,
    groqStatus: groqConfigured ? 'configured' : 'not-configured',
  };

  if (performCheck && groqConfigured) {
    try {
      // Make a lightweight test request with short timeout and minimal tokens.
      // NOTE: This may incur API usage. Only run when explicitly requested via ?check=true.
      await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: 'This is a lightweight reachability check for Second Chances backend.' },
            { role: 'user', content: 'ping' },
          ],
          max_tokens: 1,
          temperature: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );
      result.groqStatus = 'ok';
    } catch (err: any) {
      // Avoid returning secrets; only surface status and a short error summary
      const code = err.response?.status || err.code || 'unknown';
      result.groqStatus = `error: ${code}`;
    }
  }

  res.json(result);
});

export default router;
