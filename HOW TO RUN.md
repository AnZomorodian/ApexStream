# ApexStream (Apex Player) - Deployment Guide

This guide covers how to run the ApexStream dashboard in various environments, including local development, Docker, VPS, and how to expose your local laptop server to the internet.

## 1. Local Development
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Access the app at `http://localhost:5000`

## 2. Docker Deployment
1. Build the Docker image:
   ```bash
   docker build -t apexstream .
   ```
2. Run the container:
   ```bash
   docker run -d -p 5000:5000 --name apexstream apexstream
   ```

## 3. Exposing a Laptop/Home Server to the Internet
If you are running the app on your laptop and want others to access it via an IP or Domain:

### Method A: Port Forwarding (IP Access)
1. Find your laptop's local IP (e.g., `192.168.1.50`).
2. Log in to your Router settings.
3. Forward port `5000` to your laptop's local IP.
4. Share your **Public IP** with others (find it via "what is my IP").

### Method B: Using a Tunnel (Easiest & Safest)
Use a tool like **Cloudflare Tunnel** or **ngrok** to create a secure tunnel to your local machine.
1. Install Cloudflare Tunnel (cloudflared).
2. Run: `cloudflared tunnel --url http://localhost:5000`
3. Cloudflare will provide a public URL like `https://xyz.trycloudflare.com`.

### Method C: VPS with Reverse Proxy (Domain Access)
1. Get a VPS (Ubuntu recommended).
2. Install Docker and Nginx.
3. Run the Docker container on the VPS.
4. Configure Nginx to proxy your domain (e.g., `streams.yourdomain.com`) to `localhost:5000`.

## 4. How to run Docker with IP/Domain on a Laptop
If you want to use a specific IP or Domain with Docker on your local machine:
1. **IP Binding**: When running Docker, you can bind to a specific interface:
   ```bash
   docker run -d -p 192.168.1.50:5000:5000 --name apexstream apexstream
   ```
2. **Domain Mapping**: Edit your `hosts` file (`/etc/hosts` on Linux/Mac, `C:\Windows\System32\drivers\etc\hosts` on Windows) to map a domain to your local IP:
   ```text
   127.0.0.1 streams.local
   ```
3. **External Access**: To allow external users to use a domain, you must point the domain's A Record to your Public IP and use Port Forwarding or a Tunnel (see Method B).

## Admin Access
- **URL**: `/admin`
- **Username**: `Admin`
- **Password**: `Admin123`
