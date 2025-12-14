import requests
import yaml

# Read the flow file
with open('main-flow.yaml', 'r', encoding='utf-8') as f:
    flow_content = f.read()

# Deploy to Kestra
url = 'http://localhost:8080/api/v1/flows'
headers = {'Content-Type': 'application/x-yaml'}

response = requests.put(url, data=flow_content, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")