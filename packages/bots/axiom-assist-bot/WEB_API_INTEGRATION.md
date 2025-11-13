# Web API Integration for Axiom ID Landing Page

This document outlines the implementation of a web chat widget for the Axiom ID landing page, completing the full support ecosystem.

## 🏗️ Architecture Overview

```
Visitor ───► axiomid.app ───► Chat Widget ───► Web API (Render) ───► Pinecone + Gemini
```

## 📁 Files Created

1. **[web-api.mjs](web-api.mjs)** - Express.js middleware API for web chat
2. **[render.yaml](render.yaml)** - Render deployment configuration
3. **[ChatWidget.tsx](file:///Users/cryptojoker710/Desktop/Axiom%20ID/axiom_id/src/app/ChatWidget.tsx)** - Frontend chat widget component
4. **[page.tsx](file:///Users/cryptojoker710/Desktop/Axiom%20ID/axiom_id/src/app/page.tsx)** - Updated to include chat widget

## 🔧 Web API Implementation

### Features
- Express.js server with CORS support
- POST `/api/chat` endpoint for processing questions
- Health check endpoint at `/`
- Input validation and rate limiting
- Website-specific persona for visitor engagement

### Environment Variables
```env
GEMINI_API_KEY=your_google_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PORT=3001
```

### Deployment
- Free tier on Render
- Automatic scaling
- Environment variable configuration

## 🖼️ Frontend Chat Widget

### Features
- Floating chat button in bottom-right corner
- Expandable chat window
- Message history with auto-scroll
- Loading indicators
- Responsive design
- Website-specific persona

### Components
1. **Chat Button** - Floating icon to open chat
2. **Chat Window** - Expandable conversation interface
3. **Message Display** - Different styling for user vs bot messages
4. **Input Form** - Text input with submit button

### Styling
- Blue color scheme matching Axiom ID branding
- Smooth animations and transitions
- Mobile-responsive design
- Accessible UI elements

## 🚀 Deployment Steps

### 1. Render Web API Service
1. Create new web service on Render
2. Connect to axiom-assist-bot repository
3. Set build command: `npm install`
4. Set start command: `npm run web-api`
5. Add environment variables:
   - `GEMINI_API_KEY`
   - `PINECONE_API_KEY`
   - `NODE_VERSION=20`

### 2. Update Chat Widget
Replace the simulation function in ChatWidget.tsx with actual API call:

```javascript
const response = await fetch('https://your-render-service.onrender.com/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ question: inputValue }),
});

const data = await response.json();
return data.answer;
```

### 3. Configure CORS
Ensure the web API allows requests from your domain:

```javascript
app.use(cors({
  origin: ['https://axiomid.app', 'http://localhost:3000'],
  credentials: true
}));
```

## 🎯 Benefits

1. **Instant Engagement** - Visitors get immediate answers
2. **Reduced Friction** - No need to leave site for information
3. **Live Demonstration** - Show AI capabilities in action
4. **User Guidance** - Direct visitors to next steps
5. **Consistent Messaging** - Same knowledge base as Discord bot
6. **Zero Cost** - Uses free tiers of all services

## 🛡️ Security Considerations

1. **API Key Protection** - Keys stored only on Render, not in frontend
2. **Input Validation** - Prevents abuse and injection attacks
3. **Rate Limiting** - Prevents excessive API usage
4. **CORS Configuration** - Restricts access to authorized domains
5. **Error Handling** - Graceful degradation on failures

## 🎨 User Experience

### Visitor Journey
1. Land on axiomid.app
2. See floating chat icon
3. Click to open chat
4. Ask questions about Axiom ID
5. Get instant, helpful responses
6. Follow guided next steps

### Persona Differences
- **Discord Bot**: Technical support for developers
- **Website Bot**: Sales and education for visitors
- **Strategist**: Strategic thinking for project owner

## 📊 Analytics Opportunities

The web API could log interactions to provide insights:
- Most common questions
- Visitor interests
- Conversion funnel effectiveness
- Chat usage patterns

This data could inform future product development and marketing strategies.