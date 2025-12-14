from mcp.server.fastmcp import FastMCP
import httpx
import os

# Initialize FastMCP Server
mcp = FastMCP("Kestra-DevOps-Agent")

KESTRA_API_URL = os.getenv("KESTRA_API_URL", "http://localhost:8085/api/v1")

@mcp.tool()
async def get_failed_executions() -> str:
    """
    Fetches the latest failed executions from Kestra.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{KESTRA_API_URL}/executions", params={"state": "FAILED", "size": 5})
            response.raise_for_status()
            data = response.json()
            
            if not data.get("results"):
                return "No failed executions found."
            
            summary = []
            for exc in data["results"]:
                summary.append(f"- ID: {exc['id']} | Flow: {exc['flowId']} | State: {exc['state']['current']}")
            
            return "\n".join(summary)
    except Exception as e:
        return f"Error fetching executions: {str(e)}"

@mcp.tool()
async def trigger_recovery_flow(error_message: str, service_name: str) -> str:
    """
    Manually triggers the specific Kestra recovery flow.
    Args:
        error_message: The error content to analyze
        service_name: The name of the failing service
    """
    try:
        async with httpx.AsyncClient() as client:
            # Prepare payload for Webhook or API execution trigger
            # Assuming we trigger via API for direct execution, or webhook if configured.
            # Using API execution trigger for 'company.team.recover-ai-flow'
            
            # Note: For API trigger, we typically POST to /executions/{namespace}/{flowId}
            # But the flow has inputs.
            
            # Using the Webhook approach might be easier if we have the key, but let's try direct execution
            url = f"{KESTRA_API_URL}/executions/company.team/recover-ai-flow"
            
            # Kestra API expects multipart/form-data for inputs if files, or simple JSON?
            # Actually Kestra API v1 allows JSON inputs.
            
            payload = {
                "error": error_message,
                "service": service_name,
                "timestamp": "manual-trigger"
            }
            
            response = await client.post(
                url, 
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            result = response.json()
            
            return f"Started Recovery Flow! Execution ID: {result['id']}"
            
    except Exception as e:
        return f"Failed to trigger flow: {str(e)}"

if __name__ == "__main__":
    mcp.run()
