"""
Supabase Authentication Helper for Jupyter Notebooks

Simple authentication module that handles:
- Session persistence to file
- OTP-based authentication
- Automatic session reuse
- Easy authenticated requests
"""

import json
import os
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional, Dict, Any
import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Session storage file
SESSION_FILE = Path(".supabase_session.json")

# Initialize Supabase client
_supabase: Optional[Client] = None
_current_token: Optional[str] = None


def _get_supabase() -> Client:
    """Get or create Supabase client."""
    global _supabase
    if not _supabase:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_ANON_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment")
        _supabase = create_client(url, key)
    return _supabase


def _save_session(session) -> bool:
    """Save Supabase session to file."""
    if session:
        session_data = {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "expires_at": session.expires_at,
            "expires_in": session.expires_in,
            "token_type": session.token_type,
            "user": {
                "id": session.user.id,
                "email": session.user.email
            } if session.user else None
        }
        SESSION_FILE.write_text(json.dumps(session_data, indent=2))
        print(f"✅ Session saved")
        return True
    return False


def _load_session() -> Optional[str]:
    """Load and validate session from file."""
    global _current_token
    
    if not SESSION_FILE.exists():
        return None
    
    try:
        session_data = json.loads(SESSION_FILE.read_text())
        
        # Check if token is expired
        if session_data.get("expires_at"):
            expires_at = datetime.fromtimestamp(session_data["expires_at"], tz=timezone.utc)
            now = datetime.now(timezone.utc)
            if expires_at < now:
                print(f"⚠️ Session expired")
                return None
            else:
                time_left = expires_at - now
                hours_left = time_left.total_seconds() / 3600
                print(f"✅ Session valid for {hours_left:.1f} hours")
        
        # Set the session in Supabase client
        supabase = _get_supabase()
        supabase.auth.set_session(
            session_data["access_token"],
            session_data["refresh_token"]
        )
        
        _current_token = session_data["access_token"]
        print(f"✅ Logged in as: {session_data.get('user', {}).get('email', 'Unknown')}")
        return _current_token
        
    except Exception as e:
        print(f"❌ Failed to load session: {e}")
        return None


def refresh_token() -> Optional[str]:
    """
    Refresh the current session using the refresh token.
    
    Returns:
        New access token if successful, None otherwise
    """
    global _current_token
    
    if not SESSION_FILE.exists():
        print("❌ No session to refresh")
        return None
    
    try:
        session_data = json.loads(SESSION_FILE.read_text())
        refresh_token_value = session_data.get("refresh_token")
        
        if not refresh_token_value:
            print("❌ No refresh token available")
            return None
        
        supabase = _get_supabase()
        print("🔄 Refreshing session...")
        
        # Refresh the session using the refresh token
        response = supabase.auth.refresh_session(refresh_token_value)
        
        if response and response.session:
            print("✅ Session refreshed successfully!")
            _save_session(response.session)
            _current_token = response.session.access_token
            return _current_token
        else:
            print("❌ Failed to refresh session")
            return None
            
    except Exception as e:
        print(f"❌ Failed to refresh session: {e}")
        return None


def sign_in(force_new: bool = False) -> Optional[str]:
    """
    Sign in to Supabase. Uses existing session if available.
    
    Args:
        force_new: If True, forces a new sign in even if session exists
    
    Returns:
        Access token if successful, None otherwise
    """
    global _current_token
    
    # Try to use existing session unless forced to create new
    if not force_new:
        token = _load_session()
        if token:
            return token
    
    # Need to sign in with OTP
    supabase = _get_supabase()
    email = os.getenv("SUPABASE_EMAIL")
    
    if not email:
        email = input("Enter your email: ")
    
    print(f"📧 Sending OTP to {email}...")
    response = supabase.auth.sign_in_with_otp({"email": email})
    
    if not response:
        print("❌ Failed to send OTP")
        return None
    
    print("✅ OTP sent! Check your email")
    
    # Get OTP from user
    otp_code = input("Enter the 6-digit code from your email: ")
    
    print(f"🔐 Verifying OTP...")
    response = supabase.auth.verify_otp({
        "email": email,
        "token": otp_code,
        "type": "email"
    })
    
    if response.session:
        print("✅ Sign in successful!")
        _save_session(response.session)
        _current_token = response.session.access_token
        return _current_token
    else:
        print("❌ Failed to verify OTP")
        return None


def get_token() -> Optional[str]:
    """
    Get the current authentication token.
    Automatically signs in if no valid token exists.
    
    Returns:
        Access token or None
    """
    global _current_token
    
    if _current_token:
        return _current_token
    
    # Try to load from file or sign in
    return sign_in()


def sign_out():
    """Sign out and clear saved session."""
    global _current_token, _supabase
    
    # Sign out from Supabase
    if _supabase:
        try:
            _supabase.auth.sign_out()
        except:
            pass
    
    # Clear token
    _current_token = None
    
    # Delete session file
    if SESSION_FILE.exists():
        SESSION_FILE.unlink()
        print("✅ Signed out and cleared session")
    else:
        print("✅ Signed out")


def request(
    endpoint: str,
    method: str = "GET",
    data: Optional[Dict[str, Any]] = None,
    base_url: str = "http://localhost:8000"
) -> Optional[requests.Response]:
    """
    Make an authenticated request to the backend.
    
    Args:
        endpoint: API endpoint (e.g., "/auth_test")
        method: HTTP method (GET, POST, PUT, DELETE)
        data: Optional data for POST/PUT requests
        base_url: Base URL of the API
    
    Returns:
        Response object or None if authentication fails
    
    Example:
        response = auth.request("/auth_test")
        if response and response.ok:
            print(response.json())
    """
    token = get_token()
    if not token:
        print("❌ Authentication required")
        return None
    
    url = f"{base_url}{endpoint}"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        if method == "GET":
            return requests.get(url, headers=headers)
        elif method == "POST":
            return requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            return requests.put(url, headers=headers, json=data)
        elif method == "DELETE":
            return requests.delete(url, headers=headers)
        else:
            print(f"❌ Unsupported method: {method}")
            return None
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return None


def get_user_info() -> Optional[Dict[str, Any]]:
    """
    Get current user information from the backend.
    
    Returns:
        User info dict or None if not authenticated
    """
    response = request("/auth_test")
    if response and response.ok:
        return response.json()
    return None


# Convenience function for notebook usage
def init():
    """
    Initialize authentication for notebook use.
    Automatically signs in using saved session or prompts for OTP.
    
    Returns:
        True if authenticated, False otherwise
    
    Example:
        import auth_helper as auth
        if auth.init():
            print("Ready to make authenticated requests!")
    """
    token = sign_in()
    return token is not None