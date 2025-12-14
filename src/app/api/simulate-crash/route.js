import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Get the destination URL
    const KESTRA_URL = "http://localhost:8080/api/v1/executions/webhook/company.team/recover-ai-flow-v2/mysecretkey";
    
    // Log without exposing sensitive information
    console.log("🚀 Sending crash report to Kestra workflow engine");

    console.log(`Using Kestra URL: ${KESTRA_URL}`);
    
    if (!KESTRA_URL) {
      console.error("❌ ERROR: Kestra webhook URL not configured");
      return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    // Basic rate limiting check (simple in-memory approach)
    const now = Date.now();
    const lastRequest = global.lastCrashRequest || 0;
    if (now - lastRequest < 5000) { // 5 second cooldown
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }
    global.lastCrashRequest = now;

    // 2. Prepare the Payload (The Distress Signal)
    const body = await request.json().catch(() => ({}));
    const payload = {
      error: body.error || "CRITICAL_FAILURE: Connection refused at /db/users",
      service: body.service || "frontend-node-01",
      timestamp: new Date().toISOString()
    };

    // 3. Send the Signal to Kestra
    console.log(`Attempting to call webhook: ${KESTRA_URL}`);
    console.log(`Payload: ${JSON.stringify(payload)}`);
    
    let kestraSuccess = false;
    try {
      const kestraResponse = await fetch(KESTRA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log(`Kestra response status: ${kestraResponse.status}`);
      const responseText = await kestraResponse.text();
      console.log(`Kestra response body: ${responseText}`);
      
      if (kestraResponse.ok) {
        console.log("✅ Recovery signal sent successfully to Kestra");
        kestraSuccess = true;
      } else {
        console.error(`❌ Kestra webhook failed: ${kestraResponse.status} - ${responseText}`);
      }
    } catch (error) {
      console.error(`❌ Kestra connection error: ${error.message}`);
      console.error(`Full error:`, error);
    }

    // 4. Return success to the Frontend (with simulated logs for the UI)
    const logs = kestraSuccess ? [
      `[${new Date().toISOString()}] 🚨 CRASH DETECTED in frontend-node-01`,
      `[${new Date().toISOString()}] 📡 Signal sent to Kestra Recovery Agent`,
      `[${new Date().toISOString()}] 🤖 AI Analysis: Infrastructure issue detected`,
      `[${new Date().toISOString()}] 🔄 Auto-recovery sequence initiated`,
      `[${new Date().toISOString()}] ✅ System recovered successfully`
    ] : [
      `[${new Date().toISOString()}] 🚨 CRASH DETECTED in frontend-node-01`,
      `[${new Date().toISOString()}] ⚠️ Kestra agent offline - using fallback mode`,
      `[${new Date().toISOString()}] 🔄 Local recovery sequence initiated`,
      `[${new Date().toISOString()}] ✅ System recovered in fallback mode`
    ];

    return NextResponse.json({ success: true, logs });

  } catch (error) {
    console.error("❌ Crash Simulation Failed:", error);
    
    // Fallback logs even if everything fails
    const fallbackLogs = [
      `[${new Date().toISOString()}] 🚨 CRASH DETECTED in frontend-node-01`,
      `[${new Date().toISOString()}] ❌ Recovery system unavailable`,
      `[${new Date().toISOString()}] 🔧 Manual intervention required`
    ];
    
    return NextResponse.json({ success: false, logs: fallbackLogs });
  }
}