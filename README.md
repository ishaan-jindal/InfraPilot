# InfraPilot

### Deploy Anywhere.

Deploy applications directly from GitHub to either managed infrastructure provided by InfraPilot or your own servers using a single unified deployment workflow.

**Managed Hosting + Bring Your Own Infrastructure in one platform.**

---

# Overview

InfraPilot is a deployment platform that simplifies application hosting by providing a Vercel-like experience without locking users into a single infrastructure provider.

Users can choose between:

### Managed Hosting

Deploy directly to infrastructure managed by InfraPilot.

Ideal for:

* Personal projects
* Portfolios
* Hackathon submissions
* Rapid prototyping

No server setup required.

---

### Bring Your Own Infrastructure (BYOI)

Deploy directly to infrastructure you already own.

Supported targets:

* Oracle Cloud
* AWS EC2
* DigitalOcean
* Hetzner
* Azure VMs
* Home Labs
* Raspberry Pi
* Any Linux server with SSH access

Ideal for:

* Production workloads
* Cost-conscious developers
* Organizations requiring infrastructure ownership

---

# Problem

Modern deployment platforms are often split into two extremes.

### Managed Platforms

Examples:

* Vercel
* Netlify
* Railway

Advantages:

* Easy deployment
* Great developer experience

Limitations:

* Vendor lock-in
* Usage limits
* Limited infrastructure control

---

### Self-Hosted Infrastructure

Advantages:

* Full ownership
* Lower long-term costs
* Complete flexibility

Limitations:

* Complex setup
* SSL management
* Reverse proxy configuration
* Deployment automation overhead

---

Developers are forced to choose between convenience and control.

---

# Solution

InfraPilot combines both approaches.

Users connect a GitHub repository and choose a deployment target.

The deployment target can be:

### Option A — InfraPilot Managed Hosting

GitHub

↓

InfraPilot Build System

↓

Managed Runtime

↓

HTTPS Website

---

### Option B — User Infrastructure

GitHub

↓

InfraPilot Deployment Engine

↓

SSH Connection

↓

User VPS

↓

HTTPS Website

---

The deployment workflow remains identical regardless of infrastructure choice.

This provides:

* Simplicity of managed platforms
* Flexibility of self-hosting
* No infrastructure lock-in

---

# Core Features

## GitHub Integration

* GitHub OAuth
* Repository selection
* Deployment history
* Future support for automatic redeployments

---

## Automatic Framework Detection

InfraPilot analyzes repository structure and configuration files.

Supported frameworks:

* Next.js
* React
* FastAPI
* Django
* Flask
* Generic Docker projects

Detection is performed using static repository analysis rather than AI, ensuring predictable and reliable deployments.

---

## Deployment Plan Generation

Before deployment, InfraPilot generates a deployment plan.

Example:

Framework:
Next.js

Build Command:
npm run build

Start Command:
npm start

Runtime:
Docker

Port:
3000

Deployment Target:
Managed Infrastructure

Status:
Ready

---

## Managed Hosting

Users can deploy directly to infrastructure provided by InfraPilot.

Benefits:

* No VPS required
* Instant onboarding
* Ideal for judges and demonstrations
* Simplest deployment path

Generated URL:

https://my-app.infrapilot.dev

---

## Bring Your Own Infrastructure

Users can connect existing servers through SSH.

InfraPilot automatically:

* Connects to server
* Installs dependencies
* Builds application
* Starts containers
* Configures HTTPS

Benefits:

* Full ownership
* Lower hosting costs
* Infrastructure flexibility

---

## One-Click Deployments

InfraPilot automates:

* Repository cloning
* Dependency installation
* Docker image creation
* Container startup
* Reverse proxy configuration
* SSL provisioning
* Health verification

---

## Automatic HTTPS

HTTPS is automatically configured using Caddy.

No manual SSL configuration is required.

---

## Live Deployment Logs

Users can monitor deployment progress in real time.

Example:

Cloning repository...

Installing dependencies...

Building container...

Configuring HTTPS...

Deployment successful.

---

## Deployment History

Every deployment stores:

* Timestamp
* Commit hash
* Deployment status
* Deployment logs

---

# System Architecture

```
                    GitHub
                       |
                       |
                Next.js Dashboard
                       |
                       |
                    FastAPI
                       |
    --------------------------------------
    |                                    |
    |                                    |
```

Managed Infrastructure            User Infrastructure
|                                    |
|                                    |
Docker                               Docker
|                                    |
|                                    |
Caddy                                Caddy
|                                    |
--------------------------------------
|
Live Website

---

# Why This Is Different

Most platforms force users into a specific infrastructure model.

InfraPilot allows users to choose:

* Deploy on our infrastructure
* Deploy on their infrastructure

while keeping the exact same deployment workflow.

This removes vendor lock-in without sacrificing developer experience.

---

# Hackathon MVP

For the hackathon, InfraPilot will support:

### Managed Hosting

Deploy applications directly on InfraPilot infrastructure with automatic subdomain generation.

Example:

https://demo.infrapilot.dev

---

### VPS Deployments

Deploy applications to user-owned servers via SSH.

Supported examples:

* Oracle Cloud VM
* AWS EC2
* DigitalOcean Droplet
* Hetzner VPS

---

### Supported Frameworks

* Next.js
* React
* FastAPI
* Flask
* Django
* Dockerized applications

---

# Vision

InfraPilot provides infrastructure freedom.

Developers should not have to choose between the simplicity of Vercel and the flexibility of self-hosted infrastructure.

By unifying managed hosting and bring-your-own-infrastructure deployments into a single workflow, InfraPilot enables developers to deploy anywhere with minimal operational complexity.

