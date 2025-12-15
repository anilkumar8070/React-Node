const Groq = require('groq-sdk');

// @desc    Chat with AI bot
// @route   POST /api/chatbot/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Build conversation context - limit to last 10 messages to avoid token limits
    const recentHistory = conversationHistory.slice(-10);
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant for a Student Activity Management Platform. 
        You help students, faculty, and administrators with:
        - Navigating the platform
        - Understanding features like timetable management, activity tracking, attendance
        - Answering questions about the system
        - Providing guidance on using various features
        
        Keep responses concise, friendly, and helpful. If you don't know something specific about the platform, suggest contacting support.`
      },
      ...recentHistory.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Sending request to Groq API...');

    // Call Groq API with Llama 3.1 8B Instant (currently supported, fast and efficient)
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1
    });

    const botResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('Groq API response received successfully');

    res.status(200).json({
      success: true,
      response: botResponse
    });

  } catch (error) {
    console.error('Groq API Error:', error.message);
    console.error('Error details:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error processing chat message',
      error: error.message
    });
  }
};
