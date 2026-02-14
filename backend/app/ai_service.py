from ai.ai_service import generate_incident_summary as _generate_incident_summary_impl

def generate_incident_summary(data):
    """
    Service-layer wrapper for the AI incident summary generator.

    Keeps the route layer decoupled from the ai implementation and provides
    a single place to add business logic, validation, sanitization, retries,
    or rate-limiting in the future.
    """
    # Minimal validation/sanitization
    if not isinstance(data, dict):
        raise ValueError("data must be a dict")

    # Ensure keys exist
    data = {
        "servers": data.get("servers", []),
        "applications": data.get("applications", []),
        "processes": data.get("processes", [])
    }

    # Directly call the AI implementation (blocking). The route runs this
    # function in a threadpool to avoid blocking the event loop.
    return _generate_incident_summary_impl(data)
