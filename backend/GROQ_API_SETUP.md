# Groq API Setup Guide

The AI assistant feature requires a Groq API key to function. This guide shows how to set it up.

## Step 1: Get Groq API Key

1. Go to https://console.groq.com/
2. Sign up or log in (it's free!)
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the API key (you'll only see it once, so save it!)

## Step 2: Add to Render Backend

### For Render Deployment:

1. Go to https://dashboard.render.com/
2. Select your backend service (`second-chances-app`)
3. Click on "Environment" in the left sidebar
4. Click "Add Environment Variable"
5. Add:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Paste your Groq API key
6. Click "Save Changes"
7. Render will automatically redeploy your service

### For Local Development:

1. Go to `backend/` directory
2. Open or create `.env` file
3. Add this line:
   ```
   GROQ_API_KEY=your_api_key_here
   ```
4. Restart your backend server

## Step 3: Verify It Works

After redeploying, test the AI assistant:
- Open the app
- Go to AI Assistant (buyer or seller)
- Send a message
- You should get real AI responses instead of placeholder messages

## Troubleshooting

**If you still see placeholder messages:**
- Check that `GROQ_API_KEY` is exactly spelled (case-sensitive)
- Make sure there are no extra spaces in the value
- Verify the backend has finished redeploying
- Check Render logs for any errors

**Error Messages:**
- "Failed to connect to AI service" - Usually means API key is invalid or quota exceeded
- Placeholder message - API key is not set or backend hasn't been redeployed

## Free Tier Limits

Groq offers a free tier with generous limits:
- Fast response times
- Good for development and small projects
- Check https://console.groq.com/ for current limits

