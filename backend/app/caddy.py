"""
Caddy reverse-proxy management via Caddy's admin API.

For the MVP, Caddy runs on localhost and we configure routes through
the JSON admin API at http://localhost:2019.
"""

from __future__ import annotations

import httpx
from app.config import CADDY_API_URL, BASE_DOMAIN


async def add_reverse_proxy(subdomain: str, target_port: int) -> bool:
    """
    Add a reverse-proxy route so that http://<subdomain>.<BASE_DOMAIN>
    proxies to http://localhost:<target_port>.

    Uses Caddy's /config/ admin API endpoint.
    Returns True on success.
    """
    hostname = f"{subdomain}.{BASE_DOMAIN}"

    route = {
        "@id": f"infrapilot_{subdomain}",
        "match": [{"host": [hostname]}],
        "handle": [
            {
                "handler": "reverse_proxy",
                "upstreams": [{"dial": f"localhost:{target_port}"}],
            }
        ],
    }

    try:
        async with httpx.AsyncClient() as client:
            # 1. Try to append to 'srv0' (default Caddyfile server)
            resp = await client.post(
                f"{CADDY_API_URL}/config/apps/http/servers/srv0/routes",
                json=route,
                timeout=10,
            )
            if resp.status_code in (200, 201):
                return True

            # 2. Try our custom 'infrapilot' server routes
            resp = await client.post(
                f"{CADDY_API_URL}/config/apps/http/servers/infrapilot/routes",
                json=route,
                timeout=10,
            )
            if resp.status_code in (200, 201):
                return True

            # 3. Create the server if neither exists
            if resp.status_code in (404, 500):
                # In production, listen on 80 and 443 to handle auto-HTTPS
                listen_ports = [":80"]
                if BASE_DOMAIN != "localhost":
                    listen_ports.append(":443")

                server_config = {
                    "listen": listen_ports,
                    "routes": [route],
                }
                resp = await client.put(
                    f"{CADDY_API_URL}/config/apps/http/servers/infrapilot",
                    json=server_config,
                    timeout=10,
                )
                return resp.status_code in (200, 201)

            return False

    except httpx.ConnectError:
        # Caddy is not running — log but don't fail the deployment
        return False
    except Exception:
        return False


async def remove_reverse_proxy(subdomain: str) -> bool:
    """
    Remove the reverse-proxy route for *subdomain*.
    """
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.delete(
                f"{CADDY_API_URL}/id/infrapilot_{subdomain}",
                timeout=10,
            )
            return resp.status_code in (200, 204)

    except httpx.ConnectError:
        return False
    except Exception:
        return False


def get_deployment_url(subdomain: str) -> str:
    """Return the public URL for a deployed application."""
    if BASE_DOMAIN == "localhost":
        return f"http://{subdomain}.localhost"
    return f"https://{subdomain}.{BASE_DOMAIN}"
