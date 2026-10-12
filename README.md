# Ecotex Inc. - Enterprise Sustainable Packaging Platform

An enterprise-grade eCommerce and digital catalog platform for sustainable packaging, reusable non-woven bags, and custom wholesale manufacturing. Built with modern, modular frontend and backend architectures ready for high-performance VPS deployment.

---

## 📁 Repository Structure

The project is cleanly separated into independent `frontend` and `backend` workspaces:

```text
echotex/
├── frontend/                     # React 19 + Vite + TailwindCSS SPA
│   ├── src/                      # UI Components, pages, admin panel, Zustand store
│   │   ├── admin/                # Executive admin CMS & operational managers
│   │   ├── components/           # Storefront sections, products, RFQ modal, chatbot
│   │   ├── services/             # API services (apiService.ts, messageService.ts)
│   │   ├── store/                # Zustand global state & offline persistence
│   │   └── types.ts              # TypeScript interfaces
│   ├── public/                   # Static assets, branding, and imagery
│   ├── .env.example              # Frontend environment variables template
│   ├── index.html                # High-performance HTML5 template with SEO tags
│   ├── vite.config.ts            # Vite bundler configuration & local dev proxy
│   └── package.json
│
├── backend/                      # Production Node.js / Express REST API server
│   ├── src/
│   │   ├── config/               # Environment configuration & path resolvers
│   │   ├── controllers/          # Domain business logic (Products, Orders, Quotes, Auth, Stats)
│   │   ├── database/             # Atomic JSON persistence engine with automated backups
│   │   ├── middleware/           # JWT auth, rate limiters, upload security, error handlers
│   │   ├── routes/               # Modular REST endpoints (/api/products, /api/orders, etc.)
│   │   ├── utils/                # Cryptographic JWT helpers, structured logger
│   │   └── app.js                # Express app setup with Helmet, CORS, and Morgan
│   ├── uploads/                  # Uploaded media assets directory
│   ├── .env.example              # Backend environment template
│   ├── index.js                  # Server entrypoint with graceful shutdown (Port 3001)
│   ├── test.js                   # Automated 14-point integration test suite
│   ├── db.json                   # Seed database & active record store
│   └── package.json
│
├── ecosystem.config.cjs          # PM2 production process configuration for VPS
├── nginx.conf.example            # Production Nginx reverse-proxy & SSL template
├── dev.js                        # Multi-process development runner
├── package.json                  # Root monorepo workspace scripts
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 3. Run Development Servers
From the root directory:
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Backend Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

### 4. Run Automated Backend Tests
```bash
npm run test
# or: cd backend && npm test
```

---

## 🌐 Production VPS Deployment Guide (Ubuntu / Debian)

Follow these step-by-step instructions to deploy this application to any VPS (DigitalOcean, AWS EC2, Linode, Hetzner, Vultr, etc.).

### Step 1: Update Server & Install Node.js
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
```

Verify installation:
```bash
node -v   # Should be v20.x+
npm -v    # Should be v9.x+
```

### Step 2: Install PM2 Process Manager
```bash
sudo npm install -g pm2
```

### Step 3: Clone the Repository to the VPS
```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/SyedMoosa110/echotex-.git echotex
sudo chown -R $USER:$USER /var/www/echotex
cd /var/www/echotex
```

### Step 4: Configure Backend Environment & Start with PM2
```bash
cd /var/www/echotex/backend
npm install --production

# Create production .env from example
cp .env.example .env

# Edit environment variables (set your strong JWT_SECRET, PORT=3001, HOST=0.0.0.0)
nano .env

# Verify database file permissions
chmod 664 db.json

# Return to project root and start backend via PM2
cd /var/www/echotex
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

Check backend status:
```bash
pm2 status
curl http://127.0.0.1:3001/api/health
```

### Step 5: Build the Frontend SPA
```bash
cd /var/www/echotex/frontend
npm install

# If using standard Nginx reverse proxy, VITE_API_URL defaults to /api
npm run build
```
The optimized production bundle will be created at `/var/www/echotex/frontend/dist`.

### Step 6: Configure Nginx Reverse Proxy
```bash
sudo cp /var/www/echotex/nginx.conf.example /etc/nginx/sites-available/echotex
sudo nano /etc/nginx/sites-available/echotex
# Replace 'yourdomain.com' with your actual domain or VPS public IP
```

Enable the Nginx site configuration:
```bash
sudo ln -s /etc/nginx/sites-available/echotex /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: (Optional) Install Free SSL Certificate via Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port the API server listens on |
| `HOST` | `0.0.0.0` | Network interface binding |
| `NODE_ENV` | `production` | Runtime mode (`development` / `production`) |
| `JWT_SECRET` | *Strong Secret* | Secret key for signing admin JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token validity duration |
| `CORS_ORIGIN` | `*` | Allowed CORS origins (or comma-separated URLs) |
| `MAX_UPLOAD_SIZE_MB` | `25` | Maximum upload size for assets |

### Frontend (`frontend/.env`)
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `/api` | Base API URL (keep `/api` when using reverse proxy) |

---

## 🔒 Security & Performance Features
- **Helmet**: Hardened HTTP security headers.
- **Rate Limiting**: Built-in protection against brute-force and DDoS on auth and public endpoints.
- **Atomic Database Engine**: Safe file-based atomic transactions preventing partial writes with automated backups.
- **SPA Routing**: Flawless HTML5 history API navigation with Nginx fallback.
- **Zero AI Footprint**: Clean, enterprise-standard architecture with zero AI watermarks.

---

## 📄 License
Private & Proprietary - Ecotex Inc.
