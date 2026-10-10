const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', chatController.sendMessage);
router.get('/history', chatController.getChatHistory);
router.delete('/history', chatController.clearChatHistory);

module.exports = router;
