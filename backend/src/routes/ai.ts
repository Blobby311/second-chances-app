import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import AIChatMessage from '../models/AIChatMessage';
import axios from 'axios';

const router = express.Router();

// AI Chat with GPT OSS 120B via Groq
router.post(
  '/chat',
  authenticate,
  [body('message').trim().notEmpty(), body('context').optional().isObject()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, context, role } = req.body; // role: 'buyer' or 'seller'
      const groqApiKey = process.env.GROQ_API_KEY;
      const userRole = role || 'seller'; // Default to seller for backward compatibility
      console.info(`[AI] chat request - user=${req.userId}, role=${userRole}, GROQ_API_KEY=${groqApiKey ? 'present' : 'missing'}`);

      // Non-secret logging for debugging: indicate if GROQ API key is configured (do NOT log the key itself)
      console.log(`[AI] Chat request from user ${req.userId} (role=${userRole}) - GROQ configured: ${!!groqApiKey}`);

      // Save user message to database with role context
      const userMessage = new AIChatMessage({
        user: req.userId,
        sender: 'user',
        content: message,
        role: userRole, // Store which role this message is from
      });
      await userMessage.save();

      if (!groqApiKey) {
        // Log missing key (non-secret) and return helpful fallback
        console.warn(`[AI] GROQ_API_KEY not configured; returning fallback response for user ${req.userId}`);

        // Fallback response if API key not configured
        const response = `I'm your AI Plant Assistant! You asked: "${message}". To enable full AI features, please configure the Groq API key. For now, here's a helpful tip: Most plants need consistent watering, good drainage, and appropriate sunlight for their species.`;
        
        // Save bot response to database with role context
        const botMessage = new AIChatMessage({
          user: req.userId,
          sender: 'bot',
          content: response,
          role: userRole,
        });
        await botMessage.save();
        
        return res.json({ response });
      }

      try {
        // Get recent chat history for context (last 10 messages) - filtered by role so buyer/seller have separate conversations
        const recentMessages = await AIChatMessage.find({ 
          user: req.userId,
          role: userRole // Only get messages from the same role
        })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();
        const chatHistory = recentMessages.reverse().map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

        // Call Groq API for GPT OSS 120B (using REST API - Node.js approach)
        const groqResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'openai/gpt-oss-120b',
            messages: [
              {
                role: 'system',
                content: userRole === 'buyer' 
                  ? 'You are a friendly and helpful AI Food Assistant for Second Chances, a food rescue marketplace. You help buyers with cooking tips, food storage advice, recipe suggestions, meal planning, and food waste reduction. Have natural, engaging conversations with users. When they ask questions, answer them directly and helpfully. You can be conversational and friendly, ask follow-up questions if helpful, and provide practical advice. Stay relevant to food, cooking, and sustainable practices topics.'
                  : 'You are a friendly and helpful AI Plant Assistant for Second Chances, a food rescue marketplace. You help sellers with plant care tips, sustainable growing practices, harvesting advice, and food preservation. Have natural, engaging conversations with users. When they ask questions, answer them directly and helpfully. You can be conversational and friendly, ask follow-up questions if helpful, and provide practical advice. Stay relevant to plant care, growing, and sustainable practices topics.',
              },
              ...chatHistory.slice(-10), // Include recent chat history for context
              {
                role: 'user',
                content: message, // User's actual message
              },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          },
          {
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          }
        );

        const aiResponse = groqResponse.data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
        
        // Save bot response to database with role context
        const botMessage = new AIChatMessage({
          user: req.userId,
          sender: 'bot',
          content: aiResponse,
          role: userRole, // Store which role this response is for
        });
        await botMessage.save();
        
        res.json({ response: aiResponse });
      } catch (groqError: any) {
        // Provide clearer logs: include HTTP status code or error code, but do NOT log secrets
        const statusOrCode = groqError.response?.status || groqError.code || 'unknown';
        const summary = groqError.response?.data?.error?.message || groqError.message || 'no message';
        console.error('Groq API error (status/code):', statusOrCode, '-', summary);

        // Fallback response
        const response = `I'm having trouble connecting to the AI service right now. You asked: "${message}". Here's a general tip: For sustainable food practices, try to use all parts of vegetables when possible, store produce properly to extend freshness, and consider composting food scraps.`;
        
        // Save bot fallback response to database with role context
        const botMessage = new AIChatMessage({
          user: req.userId,
          sender: 'bot',
          content: response,
          role: userRole,
        });
        await botMessage.save();
        
        res.json({ response });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get AI chat history
router.get('/chat/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const role = req.query.role as string || 'seller'; // Get role from query, default to seller
    // Filter by role so buyer and seller have separate chat histories
    const messages = await AIChatMessage.find({ 
      user: req.userId,
      role: role 
    })
      .sort({ createdAt: 1 }) // Oldest first for chronological order
      .limit(100) // Limit to last 100 messages
      .lean();
    
    // Format messages for frontend
    const formattedMessages = messages.map((msg) => ({
      id: msg._id.toString(),
      sender: msg.sender,
      content: msg.content,
      timestamp: msg.createdAt,
    }));
    
    res.json(formattedMessages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Food assistant (buyer)
router.post(
  '/food-assistant',
  authenticate,
  [body('question').trim().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get recent purchases for context
      const recentPurchases = await Order.find({ buyer: req.userId })
        .populate('product', 'name category')
        .sort({ createdAt: -1 })
        .limit(5);

      const { question } = req.body;
      const groqApiKey = process.env.GROQ_API_KEY;
      console.info(`[AI] food-assistant request - user=${req.userId}, GROQ_API_KEY=${groqApiKey ? 'present' : 'missing'}`);

      if (!groqApiKey) {
        const response = `Food Assistant: "${question}". Recent purchases: ${recentPurchases.length} items. To enable full AI features, configure the Groq API key.`;
        return res.json({ response, recentPurchases });
      }

      try {
        // Build context from recent purchases
        const purchaseContext = recentPurchases.length > 0
          ? `User's recent purchases: ${recentPurchases.map((p: any) => p.product?.name || 'Unknown').join(', ')}.`
          : '';

        const groqResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'openai/gpt-oss-120b',
            messages: [
              {
                role: 'system',
                content: 'You are a food assistant for Second Chances, a food rescue marketplace. Help users with cooking tips, storage advice, recipe suggestions, and food waste reduction. Be practical and helpful.',
              },
              {
                role: 'user',
                content: `${purchaseContext} Question: ${question}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          },
          {
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const aiResponse = groqResponse.data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
        res.json({ response: aiResponse, recentPurchases });
      } catch (groqError: any) {
        console.error('Groq API error:', groqError.response?.data || groqError.message);
        const response = `Food Assistant: "${question}". Recent purchases: ${recentPurchases.length} items.`;
        res.json({ response, recentPurchases });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get recent purchases for AI context
router.get('/buyer/recent-purchases', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const purchases = await Order.find({ buyer: req.userId })
      .populate('product', 'name category imageUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(purchases);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

