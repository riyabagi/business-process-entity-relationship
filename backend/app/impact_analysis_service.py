"""
Impact Analysis Service
Centralized service layer for all impact calculations based on Neo4j graph data.
"""

from db.neo4j import (
    get_disturbed_entities,
    get_assurance_dependencies,
    get_servers as db_get_servers,
)
from typing import Dict, List, Any, Tuple
import math


def calculate_assurance_score(
    asset: str, 
    dependencies: List[Dict[str, Any]]
) -> float:
    """
    Calculate assurance score using:
    - Redundancy: Does service have backup?
    - Health: Is it currently operational?
    - Criticality: How important is it?
    - Depth of dependency: How many layers deep?
    
    Args:
        asset: The infrastructure asset/server
        dependencies: List of dependent applications with metrics
    
    Returns:
        float: Assurance score 0-1, where 1 = fully assured, 0 = completely failed
    """
    if not dependencies or len(dependencies) == 0:
        return 1.0  # No dependencies = fully assured
    
    scores = []
    
    for dep in dependencies:
        redundancy = dep.get("redundancy", 0.5)  # 0-1: is there backup?
        health = dep.get("health", 0.8)  # 0-1: is it healthy?
        criticality = dep.get("criticality", 0.5)  # 0-1: how critical?
        
        # Assurance = (redundancy + health) weighted by criticality
        # When criticality high and redundancy/health low = low assurance
        dep_assurance = (redundancy * 0.4 + health * 0.6)
        
        # Apply criticality weighting (critical services need high assurance)
        weighted_score = dep_assurance * (1 - criticality * 0.3)
        
        scores.append(weighted_score)
    
    # Average across all dependencies
    avg_score = sum(scores) / len(scores) if scores else 1.0
    return round(max(0.0, min(1.0, avg_score)), 2)


def calculate_financial_risk(
    server: str,
    affected_services: List[str],
    dependencies: List[Dict[str, Any]]
) -> float:
    """
    Calculate financial risk in millions of dollars.
    
    Formula:
    - Base risk: $1M per critical service down
    - Dependency risk: Based on data volume and criticality
    - Cascade risk: Multiplier based on number of affected services
    
    Args:
        server: The failed server
        affected_services: List of affected service names
        dependencies: Dependency data from Neo4j
    
    Returns:
        float: Risk in millions of dollars
    """
    base_risk = 1.0  # $1M base
    
    # Risk per affected service
    service_risk = 0.0
    for svc in affected_services:
        # Find criticality from dependencies
        matching_dep = next(
            (d for d in dependencies if d.get("name", "").lower() == svc.lower()),
            None
        )
        
        if matching_dep:
            criticality = matching_dep.get("criticality", 0.5)
            redundancy = matching_dep.get("redundancy", 0.5)
            # High criticality + low redundancy = high risk
            risk_factor = criticality * (1 - redundancy)
            service_risk += risk_factor * 2.0  # $2M per high-risk service
        else:
            service_risk += 1.5  # Default $1.5M per service
    
    # Cascade multiplier: more failures = exponential impact
    cascade_multiplier = 1.0 + (len(affected_services) * 0.15)
    
    total_risk = (base_risk + service_risk) * cascade_multiplier
    return round(total_risk, 1)


def calculate_regulatory_impact(
    affected_services: List[str],
    dependencies: List[Dict[str, Any]]
) -> str:
    """
    Determine regulatory impact level based on:
    - FCA/PRA critical services affected
    - Data sensitivity
    - System availability requirements
    
    Args:
        affected_services: List of affected service names
        dependencies: Dependency data
    
    Returns:
        str: "NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"
    """
    if not affected_services:
        return "NONE"
    
    # Check for regulatory-critical services
    regulatory_keywords = ["fps", "faster payments", "sanctions", "aml", "kyc"]
    has_regulatory_service = any(
        any(kw in svc.lower() for kw in regulatory_keywords)
        for svc in affected_services
    )
    
    if has_regulatory_service:
        return "CRITICAL"
    
    # Check for payment/settlement services
    payment_keywords = ["payment", "settlement", "clearing", "transfer"]
    has_payment_service = any(
        any(kw in svc.lower() for kw in payment_keywords)
        for svc in affected_services
    )
    
    if has_payment_service and len(affected_services) > 2:
        return "HIGH"
    
    if has_payment_service:
        return "MEDIUM"
    
    if len(affected_services) > 3:
        return "HIGH"
    
    if len(affected_services) > 1:
        return "MEDIUM"
    
    return "LOW"


def determine_system_status(
    affected_services: List[str],
    avg_assurance: float
) -> str:
    """
    Determine overall system status.
    
    Args:
        affected_services: Count of affected services
        avg_assurance: Average assurance score across services
    
    Returns:
        str: "OPERATIONAL", "DEGRADED", "CRITICAL", "OFFLINE"
    """
    if not affected_services:
        return "OPERATIONAL"
    
    if avg_assurance > 0.8:
        return "DEGRADED"
    
    if avg_assurance > 0.4:
        return "CRITICAL"
    
    return "OFFLINE"


def derive_tps_impact(
    affected_services: List[str],
    dependencies: List[Dict[str, Any]],
    baseline_tps: int = 120
) -> List[Dict[str, Any]]:
    """
    Derive TPS (Transactions Per Second) graph based on service failures.
    NOT simulated - calculated from service criticality.
    
    Args:
        affected_services: List of affected services
        dependencies: Dependency data
        baseline_tps: Normal baseline TPS
    
    Returns:
        List of time-series data points
    """
    if not affected_services:
        # Normal operation
        return [
            {"time": "13:50", "value": baseline_tps - 5},
            {"time": "13:55", "value": baseline_tps},
            {"time": "14:00", "value": baseline_tps - 3},
            {"time": "14:05", "value": baseline_tps},
            {"time": "14:10", "value": baseline_tps - 2},
            {"time": "14:15", "value": baseline_tps},
        ]
    
    # Calculate total criticality impact
    total_criticality = 0.0
    for svc in affected_services:
        matching_dep = next(
            (d for d in dependencies if d.get("name", "").lower() == svc.lower()),
            None
        )
        if matching_dep:
            total_criticality += matching_dep.get("criticality", 0.5)
    
    # TPS drop factor: 0-1, where 1 = complete loss
    drop_factor = min(1.0, total_criticality / 3.0)
    
    # Generate TPS timeline showing the impact
    pre_failure_tps = baseline_tps - 2
    failure_tps = int(baseline_tps * (1 - drop_factor * 0.7))
    recovery_tps = int(baseline_tps * (1 - drop_factor * 0.3))
    
    return [
        {"time": "13:50", "value": pre_failure_tps},
        {"time": "13:55", "value": pre_failure_tps},
        {"time": "14:00", "value": pre_failure_tps},
        {"time": "14:05", "value": failure_tps},  # Impact hits
        {"time": "14:10", "value": failure_tps},
        {"time": "14:15", "value": recovery_tps},  # Some recovery
    ]


def format_affected_services(
    server: str,
    disturbed_data: Dict[str, Any],
    dependencies: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Format affected services with calculated assurance scores.
    
    Args:
        server: The failed server
        disturbed_data: Data from Neo4j about what's disturbed
        dependencies: Dependency data for calculations
    
    Returns:
        List of affected services with metrics
    """
    services_list = disturbed_data.get("services", [])
    applications = disturbed_data.get("applications", [])
    
    affected_services = []
    
    # Add affected services
    for svc in services_list:
        matching_dep = next(
            (d for d in dependencies if d.get("name", "").lower() == svc.lower()),
            None
        )
        
        if matching_dep:
            redundancy = matching_dep.get("redundancy", 0.5)
            health = matching_dep.get("health", 0.8)
            # When failed, health becomes 0 if no redundancy
            impacted_health = health * redundancy if redundancy > 0.3 else 0.0
            assurance = round(impacted_health, 2)
        else:
            assurance = 0.1  # Default low assurance for unknown services
        
        affected_services.append({
            "name": svc,
            "affected": True,
            "assuranceScore": assurance,
            "rootCause": server
        })
    
    # Add unaffected services with minimal degradation
    all_service_names = set(services_list)
    for dep in dependencies:
        dep_name = dep.get("name", "")
        if dep_name and dep_name not in all_service_names:
            # Slightly degraded due to system load
            affected_services.append({
                "name": dep_name,
                "affected": False,
                "assuranceScore": round(dep.get("health", 0.8) * 0.95, 2),
                "rootCause": None
            })
    
    return affected_services


def build_propagation_chain(
    server: str,
    disturbed_data: Dict[str, Any]
) -> List[str]:
    """
    Build the propagation chain from Neo4j graph traversal.
    
    Args:
        server: The failed server
        disturbed_data: Data from Neo4j
    
    Returns:
        List of propagation steps
    """
    applications = disturbed_data.get("applications", [])
    services = disturbed_data.get("services", [])
    processes = disturbed_data.get("processes", [])
    servers = disturbed_data.get("servers", [])
    
    chain = [f"🔴 Failure initiated at {server}"]
    
    if servers:
        chain.append(f"  ├─ Infrastructure Impact: {', '.join(servers[:3])}")
    
    if applications:
        chain.append(f"  ├─ Applications Affected: {', '.join(applications[:3])}")
    
    if services:
        chain.append(f"  ├─ Services Degraded: {', '.join(services[:3])}")
    
    if processes:
        chain.append(f"  └─ Processes Impacted: {', '.join(processes[:3])}")
    
    return chain


def simulate_failure(server: str) -> Dict[str, Any]:
    """
    Main endpoint: Simulate failure of a server and return complete impact analysis.
    
    This is the single source of truth for all impact metrics.
    
    Args:
        server: The server that failed
    
    Returns:
        Dict with all impact metrics ready for frontend rendering
    """
    try:
        # Fetch graph data from Neo4j
        disturbed_data = get_disturbed_entities(server)
        dependencies = get_assurance_dependencies(server)
        
        # Extract service lists
        affected_service_names = disturbed_data.get("services", [])
        
        # Calculate all metrics
        avg_assurance = calculate_assurance_score(server, dependencies)
        financial_risk = calculate_financial_risk(server, affected_service_names, dependencies)
        regulatory_impact = calculate_regulatory_impact(affected_service_names, dependencies)
        system_status = determine_system_status(affected_service_names, avg_assurance)
        
        # Derive time-series data
        tps_data = derive_tps_impact(affected_service_names, dependencies)
        
        # Format services for frontend
        formatted_services = format_affected_services(
            server, disturbed_data, dependencies
        )
        
        # Build propagation chain
        propagation_chain = build_propagation_chain(server, disturbed_data)
        
        return {
            "systemStatus": system_status,
            "financialRisk": financial_risk,
            "regImpact": regulatory_impact,
            "assuranceScore": avg_assurance,
            "services": formatted_services,
            "tpsData": tps_data,
            "propagationChain": propagation_chain,
            "failedServer": server,
            "affectedCount": len(affected_service_names),
        }
    
    except Exception as e:
        # Return error response
        return {
            "systemStatus": "CRITICAL",
            "financialRisk": 0.0,
            "regImpact": "CRITICAL",
            "assuranceScore": 0.0,
            "services": [],
            "tpsData": [],
            "propagationChain": [f"Error: {str(e)}"],
            "failedServer": server,
            "affectedCount": 0,
            "error": str(e)
        }
