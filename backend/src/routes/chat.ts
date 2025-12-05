import express, { Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import Chat, { Message } from '../models/Chat';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get chat list
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.query;
    const user = req.user;

    let chats;
    if (role === 'buyer' || user?.roles.includes('buyer')) {
      chats = await Chat.find({ buyer: req.userId })
        .populate('seller', 'name avatar')
        .populate('lastMessage')
        .sort({ lastMessageAt: -1 });
    } else {
      chats = await Chat.find({ seller: req.userId })
        .populate('buyer', 'name avatar')
        .populate('lastMessage')
        .sort({ lastMessageAt: -1 });
    }

    res.json(chats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat messages
router.get('/:id/messages', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Check authorization
    if (chat.buyer.toString() !== req.userId && chat.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await Message.find({ chat: req.params.id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark as read
    if (chat.buyer.toString() === req.userId) {
      chat.unreadCount.buyer = 0;
    } else {
      chat.unreadCount.seller = 0;
    }
    await chat.save();

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post(
  '/:id/messages',
  authenticate,
  [body('content').trim().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    try {
      let chat = await Chat.findById(req.params.id);

      if (!chat) {
        // Create new chat if doesn't exist
        const { buyerId, sellerId } = req.body;
        if (!buyerId || !sellerId) {
          return res.status(400).json({ error: 'Buyer and seller IDs required' });
        }

        chat = new Chat({
          buyer: buyerId,
          seller: sellerId,
        });
        await chat.save();
      }

      // Check authorization
      if (chat.buyer.toString() !== req.userId && chat.seller.toString() !== req.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const message = new Message({
        chat: chat._id,
        sender: req.userId,
        content: req.body.content,
      });

      await message.save();

      // Update chat
      chat.lastMessage = message._id;
      chat.lastMessageAt = new Date();
      if (chat.buyer.toString() === req.userId) {
        chat.unreadCount.seller += 1;
      } else {
        chat.unreadCount.buyer += 1;
      }
      await chat.save();

      const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

      res.status(201).json(populatedMessage);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete chat
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.buyer.toString() !== req.userId && chat.seller.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Chat.findByIdAndDelete(req.params.id);
    await Message.deleteMany({ chat: req.params.id });

    res.json({ message: 'Chat deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

