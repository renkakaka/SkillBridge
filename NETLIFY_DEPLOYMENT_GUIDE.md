# Netlify Deployment Guide for SkillBridge

## Issues Fixed

1. **Prisma Binary Targets**: Added proper binary targets configuration for Netlify's Linux environment
2. **Duplicate Package Files**: Removed conflicting package.json and package-lock.json files
3. **Next.js Configuration**: Updated for proper Netlify deployment
4. **Build Scripts**: Fixed duplicate and incorrect build commands

## Deployment Steps

### 1. Environment Variables Setup

In your Netlify dashboard, go to Site Settings > Environment Variables and add:

```
DATABASE_URL=your_postgresql_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-site.netlify.app
RESEND_API_KEY=your_resend_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Build Settings

The following settings are already configured in `netlify.toml`:

- **Build command**: `npm run build:netlify`
- **Publish directory**: `.next`
- **Node version**: 18
- **Prisma configuration**: Binary targets for Linux compatibility

### 3. Database Setup

Ensure your PostgreSQL database is accessible from Netlify's servers. You can use:
- Supabase (recommended)
- Railway
- Neon
- Any other PostgreSQL provider

### 4. Deploy

1. Connect your GitHub repository to Netlify
2. Set the build command to: `npm run build:netlify`
3. Set the publish directory to: `.next`
4. Add all environment variables
5. Deploy!

## Key Changes Made

### package.json
- Fixed duplicate `build:netlify` script
- Added `@netlify/plugin-nextjs` dependency
- Updated Prisma generate command with explicit schema path

### netlify.toml
- Added proper Prisma binary targets
- Configured Netlify Next.js plugin
- Set correct publish directory
- Added memory optimization

### prisma/schema.prisma
- Added binary targets configuration for cross-platform compatibility

### next.config.ts
- Removed standalone output (not needed with Netlify plugin)
- Kept other optimizations for production

## Troubleshooting

### Prisma Generate Issues
If you still get Prisma errors, try:
1. Clear Netlify cache
2. Ensure DATABASE_URL is correct
3. Check that all environment variables are set

### Build Failures
1. Check Node.js version (should be 18)
2. Verify all dependencies are in package.json
3. Ensure no conflicting package files

### API Routes Not Working
The `@netlify/plugin-nextjs` plugin handles API routes automatically. If issues persist:
1. Check environment variables
2. Verify database connectivity
3. Check Netlify function logs

## Support

If you encounter issues:
1. Check Netlify build logs
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check Prisma schema for syntax errors
