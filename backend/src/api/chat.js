import express from 'express';
import chatService from '../services/chatService.js';

const router = express.Router();

// Create new chat session
router.post('/sessions', (req, res) => {
  try {
    const sessionId = chatService.createSession();
    res.json({ sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Send message
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ 
        error: 'Message and sessionId are required' 
      });
    }

    const result = await chatService.generateResponse(message, sessionId);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate response'
    });
  }
});

// Clear session
router.delete('/sessions/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    chatService.clearSession(sessionId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear session' });
  }
});

export default router;