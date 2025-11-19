"""Render Admin Power for managing Render.com services."""

import os
import sys

# Add the current directory to the path so we can import base_power
sys.path.append(os.path.dirname(__file__))

# Standard library imports
import json
from typing import Dict, Any

# Third-party imports
import requests

# Local imports
from base_power import BaseSuperpower


class RenderAdminPower(BaseSuperpower):
    """Admin power for managing Render.com services."""

    def get_name(self) -> str:
        """Return the name of the superpower."""
        return "render_admin"

    async def execute(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the Render admin power with the given payload.

        Payload should contain:
        - action (string): "ADD_ENV_VAR" or "TRIGGER_DEPLOY" or "GET_LOGS"
        - render_api_key (string): The master Render API key.
        - service_id (string): The Render service ID (e.g., "srv-d4c69...")
        - env_key (string): (For ADD_ENV_VAR) The key to add/update.
        - env_value (string): (For ADD_ENV_VAR) The value to set.
        """
        try:
            action = payload.get('action')
            api_key = payload.get('render_api_key')
            service_id = payload.get('service_id')

            if not all([action, api_key, service_id]):
                return {
                    "status": "error",
                    "message": ("Missing required payload: action, api_key, "
                                "service_id")
                }

            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json"
            }

            if action == "ADD_ENV_VAR":
                key = payload.get('env_key')
                value = payload.get('env_value')
                if not key or value is None:
                    return {
                        "status": "error",
                        "message": ("Missing env_key or env_value for "
                                    "ADD_ENV_VAR")
                    }

                url = (f"https://api.render.com/v1/services/{service_id}"
                       "/env-vars")
                # This call overwrites, so we must first get, then append, then
                # set. For simplicity, we'll just add one. A real implementation
                # is more complex. NOTE: Render's API updates variables one by
                # one or as a bulk set. Let's use the bulk set method for safety

                # 1. Get existing vars
                get_resp = requests.get(url, headers=headers)
                get_resp.raise_for_status()
                env_vars = get_resp.json()

                # 2. Add/Update the new var
                # This finds the var if it exists, or creates a new object
                found = False
                for item in env_vars:
                    if item.get("envVar", {}).get("key") == key:
                        item["envVar"]["value"] = value
                        found = True
                        break
                if not found:
                    env_vars.append({"envVar": {"key": key, "value": value}})

                # 3. Push the whole block back
                set_resp = requests.put(url, headers=headers, json=env_vars)
                set_resp.raise_for_status()

                return {
                    "status": "success",
                    "action": "ADD_ENV_VAR",
                    "service_id": service_id,
                    "key": key
                }

            elif action == "TRIGGER_DEPLOY":
                url = (f"https://api.render.com/v1/services/{service_id}"
                       "/deploys")
                deploy_payload = {"clearCache": "do_not_clear"}

                resp = requests.post(url, headers=headers, json=deploy_payload)
                resp.raise_for_status()
                return {
                    "status": "success",
                    "action": "TRIGGER_DEPLOY",
                    "deploy_id": resp.json().get('id')
                }

            elif action == "GET_LOGS":
                url = (f"https://api.render.com/v1/services/{service_id}"
                       "/logs?limit=100")
                resp = requests.get(url, headers=headers)
                resp.raise_for_status()
                return {
                    "status": "success",
                    "action": "GET_LOGS",
                    "logs": resp.json()
                }

            else:
                return {
                    "status": "error",
                    "message": f"Unknown action: {action}"
                }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }