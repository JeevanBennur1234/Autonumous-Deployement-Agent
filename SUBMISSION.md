# 🤖 RecoverAI - Autonomous Deployment Agent

**AssembleHack 2024 Submission**

## 🏆 What This Does
RecoverAI is an autonomous agent that detects production crashes, analyzes them with AI, and automatically fixes them while you sleep.

## 🎯 The Demo Flow
1. **The Crash**: Click "Simulate Crash" → 500 Error occurs
2. **The Trigger**: Webhook fires → Hits Kestra workflow engine  
3. **The Brain**: Groq LLaMA 3.3 analyzes the error logs
4. **The Decision**: AI determines if it's infrastructure vs code issue
5. **The Fix**: Auto-generates code patch and creates PR
6. **The Review**: CodeRabbit simulates code review with "LGTM!"

## 🛠 Tech Stack
- **Frontend**: Next.js (React) - Simple dashboard
- **Workflow Engine**: Kestra - Orchestrates the recovery process
- **AI Brain**: Groq LLaMA 3.3 70B - Real AI analysis
- **Infrastructure**: Docker Compose

## 🚀 Quick Start
```bash
# 1. Start Kestra
docker-compose up -d

# 2. Install dependencies  
npm install

# 3. Start frontend
npm run dev

# 4. Create flow in Kestra UI (localhost:8080)
# Copy main-flow.yaml content to Kestra

# 5. Test the system
# Visit localhost:3000 → Click "Simulate Crash"
```

## 🎬 Key Demo Points
- **Real AI Integration**: Uses actual Groq API calls
- **CodeRabbit Simulation**: Shows "LGTM! Fix looks clean" 
- **End-to-End Automation**: Zero human intervention
- **Production Ready**: Handles real webhook triggers

## 🏅 Prize Categories
- **Wakanda Prize**: AI-powered crisis report generation
- **Cline Prize**: Used Cline for complex YAML generation
- **Innovation**: Autonomous error recovery system

Built with ❤️ using Cline AI Assistant