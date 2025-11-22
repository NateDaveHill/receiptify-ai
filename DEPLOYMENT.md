# 🚀 Deploying Receiptify AI to Vercel

## Quick Deployment Guide

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project? → No
   - Project name → `receiptify-ai` (or your preferred name)
   - Directory → `.` (current directory)
   - Build command → (leave default)
   - Output directory → (leave default)

4. **Add your OpenAI API key:**
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   - Choose: Production, Preview, Development
   - Paste your OpenAI API key: `sk-proj-...`

5. **Redeploy with environment variable:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Website

1. **Push to GitHub:**
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/receiptify-ai.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to: https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `receiptify-ai` repository
   - Click "Import"

3. **Configure Environment Variables:**
   - In the project settings, add:
     - Name: `OPENAI_API_KEY`
     - Value: `sk-proj-YOUR_API_KEY_HERE`
   - Click "Deploy"

4. **Done!** Your app will be live at: `https://receiptify-ai.vercel.app`

---

## 🔒 Security Features

- ✅ **API Key Protection:** Your OpenAI API key is stored securely in Vercel environment variables
- ✅ **Backend Proxy:** All OpenAI API calls go through serverless functions, never exposed to frontend
- ✅ **No Client-Side Secrets:** The frontend only calls `/api/*` endpoints on your own domain

---

## 🧪 Testing Locally

To test the Vercel serverless functions locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run development server
vercel dev
```

---

## 📝 Environment Variables

| Variable | Where to Use | Description |
|----------|--------------|-------------|
| `OPENAI_API_KEY` | Vercel Only | Your OpenAI API key (starts with `sk-proj-` or `sk-`) |

**Important:** The `.env.local` file is for local development only and is NOT deployed to Vercel. You must add environment variables through Vercel's dashboard or CLI.

---

## 🐛 Troubleshooting

### API calls fail with "API key not configured"
- Make sure you added `OPENAI_API_KEY` to Vercel environment variables
- Redeploy after adding environment variables

### "Module not found" errors
- Run `npm install` locally
- Commit `package-lock.json`
- Push changes and redeploy

### Camera doesn't work
- Ensure you're accessing the site via HTTPS (Vercel provides this automatically)
- Check browser permissions for camera access

---

## 💰 Cost Estimate

Using OpenAI's gpt-4o model:
- **Image Analysis:** ~$0.005 per scan
- **Recipe Generation:** ~$0.01 per generation
- **Recipe Details:** ~$0.005 per recipe

**Total:** ~$0.02 per complete flow (scan → recipes → details)

100 scans = ~$2.00

---

## 📊 Monitor Usage

- **OpenAI Dashboard:** https://platform.openai.com/usage
- **Vercel Dashboard:** https://vercel.com/dashboard
