const repo = require('../repositories/repositoryFactory');
const chatbotService = require('../services/chatbotService');

// @desc    Send query to EcoGuide AI chatbot
// @route   POST /api/chat
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, caseId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
    }

    // 1. Fetch optional case context if caseId provided
    let caseContext = null;
    if (caseId) {
      const caseDoc = await repo.cases.findById(caseId);
      if (caseDoc) {
        const assessment = await repo.assessments.findByCaseId(caseId);
        caseContext = {
          _id: caseDoc._id,
          productName: caseDoc.productName,
          category: caseDoc.category,
          physicalCondition: caseDoc.physicalCondition,
          approxAge: caseDoc.approxAge,
          assessment
        };
      }
    }

    // 2. Save User Message
    await repo.chats.create({
      userId: req.user._id,
      caseId: caseId || null,
      sender: 'user',
      message
    });

    // 3. Process Bot Response
    const botResponse = await chatbotService.processQuery({
      userId: req.user._id,
      userMessage: message,
      caseContext
    });

    // 4. Save Assistant Response
    const savedBotMsg = await repo.chats.create({
      userId: req.user._id,
      caseId: caseId || null,
      sender: 'assistant',
      message: botResponse.message,
      isRuleBased: botResponse.isRuleBased,
      metadata: botResponse.metadata
    });

    res.status(200).json({
      success: true,
      chat: savedBotMsg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user chat history
// @route   GET /api/chat/history
// @access  Private
exports.getChatHistory = async (req, res, next) => {
  try {
    const history = await repo.chats.findByUser(req.user._id, 100);
    res.status(200).json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/history
// @access  Private
exports.clearChatHistory = async (req, res, next) => {
  try {
    await repo.chats.deleteByUser(req.user._id);
    res.status(200).json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    next(error);
  }
};
