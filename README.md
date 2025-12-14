# Autonomous Deployment Agent

## Quick Start

1. **Start Kestra:**
   ```bash
   docker-compose up -d
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the agent:**
   ```bash
   python start.py
   ```

## Access
- Kestra UI: http://localhost:8080
- Webhook endpoint: http://localhost:8080/api/v1/executions/webhook/company.team/recover-ai-flow/mysecretkey

## How it works
The agent monitors for errors and triggers autonomous recovery through AI-powered decision making using Groq's LLaMA model.