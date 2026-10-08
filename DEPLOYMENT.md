# Taskify Deployment Guide

This guide walks through deploying the Taskify Team Kanban Platform.

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 16.0
- **Git** (for version control)

## Quick Start (Local Development)

### 1. Install Dependencies

```bash
# From project root
npm install --cache /tmp/npm-cache
```

### 2. Set Up Database

Create a PostgreSQL database:

```bash
# Using psql
createdb taskify

# Or using SQL
psql -U postgres
CREATE DATABASE taskify;
\q
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskify"
```

### 4. Run Database Migrations

```bash
cd backend
npm run db:migrate
npm run db:seed
```

This creates tables and seeds with:
- 5 users (1 PM, 4 engineers)
- 3 projects
- 24 sample tasks
- 15 comments

### 5. Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## Production Deployment

### Backend Deployment

1. **Build the backend:**
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables:**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="your-production-database-url"
   export PORT=3000
   export CORS_ORIGIN="https://your-frontend-domain.com"
   ```

3. **Run migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **The build output** will be in `frontend/dist/`

3. **Deploy to static hosting:**
   - Upload `dist/` contents to your hosting provider (Vercel, Netlify, AWS S3, etc.)
   - Configure environment variable: `VITE_API_BASE_URL=https://your-api-domain.com/api/v1`

### Database Hosting Options

- **Heroku Postgres**
- **AWS RDS**
- **DigitalOcean Managed Databases**
- **Supabase**
- **Railway**

## Environment Variables

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment (development/production) |
| CORS_ORIGIN | No | http://localhost:5173 | Allowed frontend origin |

### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| VITE_API_BASE_URL | No | /api/v1 | Backend API base URL |

## Health Checks

### Backend Health
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"2026-10-08T..."}
```

### Database Connection
```bash
cd backend
npm run db:studio
# Opens Prisma Studio at http://localhost:5555
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Connection Errors
- Verify PostgreSQL is running: `pg_isready`
- Check database exists: `psql -l | grep taskify`
- Verify credentials in `.env`
- Check firewall rules allow connections to port 5432

### Migration Errors
```bash
# Reset database (WARNING: Deletes all data)
cd backend
npx prisma migrate reset
npm run db:seed
```

### npm Cache Issues
```bash
# Clean cache and reinstall
npm cache clean --force
npm install --cache /tmp/npm-cache
```

## Monitoring and Logs

### Application Logs
- Backend logs to console (stdout/stderr)
- Use process managers like PM2 for log aggregation
- Prisma query logs enabled in development mode

### Database Monitoring
- Monitor connection pool usage
- Track slow queries (>100ms)
- Set up alerts for failed migrations

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] CORS configured for production domain only
- [ ] Database credentials use strong passwords
- [ ] SSL/TLS enabled for production database connections
- [ ] Input validation enabled on all endpoints
- [ ] XSS sanitization active for all user inputs
- [ ] Rate limiting configured (Phase 2 feature)

## Backup Strategy

### Database Backups
```bash
# Create backup
pg_dump taskify > taskify_backup_$(date +%Y%m%d).sql

# Restore backup
psql taskify < taskify_backup_20261008.sql
```

### Automated Backups
- Configure daily backups with your hosting provider
- Retain backups for 30 days minimum
- Test restore procedure monthly

## Performance Optimization

### Backend
- Enable connection pooling (Prisma handles automatically)
- Add database indexes (already defined in schema)
- Monitor query performance with Prisma Studio

### Frontend
- Enable gzip compression on static hosting
- Configure CDN for static assets
- Use lazy loading for routes (Phase 2 feature)

## Support and Documentation

- **Feature Specification**: `specs/001-team-kanban-platform/spec.md`
- **API Documentation**: `specs/001-team-kanban-platform/contracts/README.md`
- **Data Model**: `specs/001-team-kanban-platform/data-model.md`
- **Architecture Decisions**: `specs/001-team-kanban-platform/research.md`
