import json
import requests
from datetime import datetime
from typing import Any, Dict
from langchain_core.tools import tool


@tool
def get_current_time() -> str:
    """Get the current date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@tool
def calculate(expression: str) -> str:
    """Calculate a mathematical expression safely. 
    
    Args:
        expression: A mathematical expression like '2 + 2' or '(10 * 5) / 2'
    """
    try:
        # Simple safety: only allow basic math operations
        allowed_chars = set('0123456789+-*/.() ')
        if not all(c in allowed_chars for c in expression):
            return "Error: Invalid characters in expression"
        
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"Error calculating: {str(e)}"


@tool
def search_web(query: str) -> str:
    """Search the web for information (mock implementation).
    
    Args:
        query: The search query
    """
    # This is a mock implementation - in production you'd use a real search API
    return f"Mock search results for '{query}': This is where real search results would appear. You could integrate with Google Search API, DuckDuckGo, or other search services."


@tool
def get_weather(city: str) -> str:
    """Get current weather for a city (mock implementation).
    
    Args:
        city: The city name to get weather for
    """
    # Mock weather data - in production you'd use a real weather API
    mock_weather = {
        "new york": "Sunny, 22°C (72°F), Light breeze",
        "london": "Cloudy, 15°C (59°F), Light rain expected",
        "tokyo": "Partly cloudy, 18°C (64°F), Calm",
        "paris": "Overcast, 16°C (61°F), Moderate wind"
    }
    
    city_lower = city.lower()
    if city_lower in mock_weather:
        return f"Weather in {city}: {mock_weather[city_lower]}"
    else:
        return f"Mock weather for {city}: Partly cloudy, 20°C (68°F). (This is mock data - integrate with a real weather API for actual weather)"


@tool
def create_todo_item(task: str, priority: str = "medium") -> str:
    """Create a new todo item.
    
    Args:
        task: The task description
        priority: Priority level (low, medium, high)
    """
    # In a real app, this would save to a database
    todo_item = {
        "task": task,
        "priority": priority,
        "created_at": datetime.now().isoformat(),
        "completed": False
    }
    return f"Created todo item: {json.dumps(todo_item, indent=2)}"


# List of all available tools
AVAILABLE_TOOLS = [
    get_current_time,
    calculate,
    search_web,
    get_weather,
    create_todo_item
]