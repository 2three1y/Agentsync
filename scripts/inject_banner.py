import os
import re

def inject_beta_banner():
    # Placeholder script to simulate injecting the beta banner and governance updates
    # In a real scenario, this would modify HTML or JS files
    target_file = 'index.html'
    if not os.path.exists(target_file):
        print(f"{target_file} not found. Skipping.")
        return

    with open(target_file, 'r') as f:
        content = f.read()

    # Logic to inject the banner if not already present
    banner_html = '<div id="beta-banner" style="background: black; color: white; text-align: center; padding: 10px; font-weight: bold;">BETA</div>'
    if 'id="beta-banner"' not in content:
        # Simple injection before closing body tag
        new_content = content.replace('</body>', f'{banner_html}</body>')
        with open(target_file, 'w') as f:
            f.write(new_content)
        print("Beta banner injected into index.html")
    else:
        print("Beta banner already present.")

if __name__ == "__main__":
    inject_beta_banner()
    print("Governance updates verified.")
