# 🚀 Autonomous Deployment Agent - Quick Start

## Prerequisites
- ✅ Node.js (v18+)
- ✅ Docker Desktop
- ✅ Groq API Key (already configured in main-flow.yaml)

## 🎯 One-Click Start
```bash
# Windows
start-project.bat

# Manual start (if needed)
docker-compose up -d
npm run dev
```

## 🌐 Access Points
- **Frontend Dashboard**: http://localhost:3000
- **Kestra Workflow UI**: http://localhost:8085

## 🧪 Testing the AI Recovery System

### 1. Import Workflow
1. Open Kestra UI: http://localhost:8085
2. Go to "Flows" → "Create"
3. Copy content from `main-flow.yaml`
4. Save as `recover-ai-flow`

### 2. Test Error Recovery
```bash
# Simulate Infrastructure Error
curl -X POST http://localhost:8085/api/v1/executions/webhook/company.team/recover-ai-flow/mysecretkey \
  -H "Content-Type: application/json" \
  -d '{"error": "Database connection timeout", "service": "api-backend"}'

# Simulate Code Error  
curl -X POST http://localhost:8085/api/v1/executions/webhook/company.team/recover-ai-flow/mysecretkey \
  -H "Content-Type: application/json" \
  -d '{"error": "TypeError: Cannot read property of undefined", "service": "frontend"}'
```

## 🔧 System Components

### AI Brain (Real)
- **Model**: Groq LLaMA 3.3 70B
- **Function**: Error analysis & classification
- **API**: Configured with your real Groq key

### Workflow Engine
- **Engine**: Kestra
- **Port**: 8085
- **Features**: Webhook triggers, conditional logic

### Frontend Dashboard
- **Framework**: Next.js 16
- **Styling**: Tailwind CSS
- **Features**: Real-time status, control panel

## 🎭 Demo Mode
The system includes simulated integrations for:
- Vercel API calls
- GitHub operations
- PR creation/merging

Real components:
- ✅ Groq AI analysis
- ✅ Kestra workflow execution
- ✅ Webhook triggers
- ✅ Error classification logic

## 🔍 Monitoring
- Check Kestra logs: http://localhost:8085/ui/logs
- View execution history in Kestra UI
- Monitor frontend dashboard for system status

## 🛠️ Troubleshooting
- **Port conflicts**: Change ports in docker-compose.yml
- **Docker issues**: Restart Docker Desktop
- **API errors**: Verify Groq API key in main-flow.yaml