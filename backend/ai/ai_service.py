import ollama
import json

def generate_incident_summary(data):
    """
    data = {
        "servers": ["server_name"],
        "applications": ["app1", "app2"],
        "processes": ["process1", "process2"]
    }
    """
    
    servers_str = ", ".join(data.get('servers', [])) if data.get('servers') else "Unknown"
    apps_str = ", ".join(data.get('applications', [])) if data.get('applications') else "None"
    processes_str = ", ".join(data.get('processes', [])) if data.get('processes') else "None"
    
    # Structured prompt that matches frontend parsing expectations
    prompt = f"""Generate a concise incident report with EXACTLY these sections:

Server: {servers_str}
Applications: {apps_str}
Processes: {processes_str}

Format your response with these exact section headers on separate lines:
Affected Systems: [List affected apps/processes]
Business Impact: [Impact on operations]
Responsible Team: [Team name]
Estimated Resolution: [Time estimate]
Reassurance: [Brief positive message]

Keep each section to 1-2 sentences. Be specific about the systems mentioned."""

    try:
        response = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": prompt}],
            stream=False
        )
        return response["message"]["content"]
    except Exception as e:
        # Fallback response if AI fails
        return f"Incident affecting: {apps_str} on {servers_str}. System administrators have been notified. Estimated resolution: 30 minutes."

