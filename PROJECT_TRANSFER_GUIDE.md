# How to Export and Transfer This Project

This guide explains how to get this project out of the current environment and into a new account.

## Method 1: Download as ZIP (Recommended)

### Step 1: Create a ZIP Archive

If you have terminal access in your current environment:

```bash
# Navigate to the project directory
cd /tmp/cc-agent/41526930/project

# Create a ZIP file of the entire project
zip -r chloe-james-coaching-app.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "dist/*" \
  -x ".bolt/*"
```

This excludes:
- `node_modules/` (reinstall with `npm install`)
- `.git/` (you'll create a new repo)
- `dist/` (regenerated with `npm run build`)
- `.bolt/` (development environment specific)

### Step 2: Download the ZIP

Download the created `chloe-james-coaching-app.zip` file to your local machine.

### Step 3: Extract and Set Up

On your new machine:

```bash
# Extract the ZIP
unzip chloe-james-coaching-app.zip -d chloe-james-coaching-app

# Navigate into the project
cd chloe-james-coaching-app

# Install dependencies
npm install

# Create your .env file with new credentials
# (see ENVIRONMENT_VARIABLES.md)
cp .env.example .env
# Edit .env with your new Supabase credentials

# Test the build
npm run build

# Run locally to test
npm run dev
```

## Method 2: Git Clone (If Git is Available)

### If the project is already in a Git repository:

```bash
# Clone the repository
git clone YOUR_REPO_URL chloe-james-coaching-app
cd chloe-james-coaching-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Test build
npm run build
```

## Method 3: Manual File Copy

If you can access the file system directly:

### Files/Folders to Copy

Copy these directories and files to your new location:

```
📁 Project Root
├── 📁 src/                      # All React components (REQUIRED)
├── 📁 public/                   # Static assets, images (REQUIRED)
├── 📁 supabase/
│   ├── 📁 migrations/           # Database schema (REQUIRED)
│   └── 📁 functions/            # Edge functions (REQUIRED)
├── 📁 logic/                    # Documentation files (OPTIONAL)
├── 📄 package.json              # Dependencies (REQUIRED)
├── 📄 package-lock.json         # Lock file (REQUIRED)
├── 📄 vite.config.ts            # Build config (REQUIRED)
├── 📄 tsconfig.json             # TypeScript config (REQUIRED)
├── 📄 tsconfig.app.json         # TypeScript config (REQUIRED)
├── 📄 tsconfig.node.json        # TypeScript config (REQUIRED)
├── 📄 tailwind.config.js        # Styling (REQUIRED)
├── 📄 postcss.config.js         # PostCSS (REQUIRED)
├── 📄 eslint.config.js          # Linting (OPTIONAL)
├── 📄 index.html                # Entry HTML (REQUIRED)
├── 📄 .gitignore                # Git ignore (REQUIRED)
├── 📄 PROJECT_TRANSFER_GUIDE.md # Transfer guide (HELPFUL)
├── 📄 ENVIRONMENT_VARIABLES.md  # Env guide (HELPFUL)
├── 📄 EDGE_FUNCTIONS_GUIDE.md   # Functions guide (HELPFUL)
└── 📄 README.md                 # Project docs (OPTIONAL)
```

### DO NOT Copy These:

```
❌ node_modules/     # Too large, reinstall with npm install
❌ dist/             # Build output, regenerate with npm run build
❌ .git/             # Old git history, start fresh
❌ .bolt/            # Environment-specific
❌ .env              # Contains old credentials
```

## After Exporting: Setup Checklist

Follow these steps in order:

### 1. Install Dependencies
```bash
npm install
```

### 2. Create New .env File
```bash
# Create the file
touch .env

# Add your new Supabase credentials
# (Get these from your new Supabase project)
```

Example `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
```

### 3. Set Up Supabase

```bash
# Install Supabase CLI globally
npm install -g supabase

# Initialize Supabase in the project
supabase init

# Link to your new Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Apply all database migrations
supabase db push

# Deploy all edge functions
# (See EDGE_FUNCTIONS_GUIDE.md for details)
```

### 4. Set Supabase Secrets

```bash
# Set API keys for edge functions
supabase secrets set PDFCO_API_KEY=your_key
supabase secrets set RESEND_API_KEY=your_key
```

### 5. Test Locally

```bash
# Build the project
npm run build

# If successful, run dev server
npm run dev
```

Visit http://localhost:5173 to test the app.

### 6. Initialize Git Repository

```bash
# Initialize new git repo
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Chloe James Coaching app"

# Add remote (GitHub, GitLab, etc.)
git remote add origin YOUR_NEW_REPO_URL

# Push to remote
git push -u origin main
```

### 7. Deploy to Netlify

1. Push code to GitHub (step 6 above)
2. Go to netlify.com
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub and select your repo
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Deploy!

## Verification Checklist

After transfer, verify everything works:

- [ ] Project builds without errors (`npm run build`)
- [ ] Dev server runs (`npm run dev`)
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Forms submit successfully
- [ ] Supabase connection works
- [ ] Database queries execute
- [ ] Edge functions respond
- [ ] PDF generation works
- [ ] Email sending works
- [ ] Navigation between pages works
- [ ] Responsive design looks good

## File Size Reference

Approximate sizes (without node_modules and dist):

- Total project: ~5-10 MB
- Source code: ~2 MB
- Images: ~3-5 MB
- Documentation: ~100 KB
- Migrations: ~50 KB
- Edge functions: ~200 KB

With node_modules (after npm install): ~200-300 MB

## Common Transfer Issues

### "Cannot find module"
**Solution:** Run `npm install` to install dependencies

### "ENOENT: no such file or directory"
**Solution:** Make sure you copied all required files/folders

### "Supabase client error"
**Solution:** Update `.env` with correct credentials from new project

### "Build fails with TypeScript errors"
**Solution:** Ensure all TypeScript config files were copied:
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`

### "Images not loading"
**Solution:** Verify `public/` folder was copied with all images

### "Styles not applying"
**Solution:** Check that these files exist:
- `tailwind.config.js`
- `postcss.config.js`
- `src/index.css`

## Support Contacts

If you encounter issues during transfer:

1. Check all the guide documents:
   - `PROJECT_TRANSFER_GUIDE.md`
   - `ENVIRONMENT_VARIABLES.md`
   - `EDGE_FUNCTIONS_GUIDE.md`

2. Review official documentation:
   - [Supabase Docs](https://supabase.com/docs)
   - [Vite Docs](https://vitejs.dev)
   - [Netlify Docs](https://docs.netlify.com)

3. Common issues are usually:
   - Missing environment variables
   - Incorrect Supabase credentials
   - Missing dependencies (run `npm install`)
   - Edge functions not deployed

## Quick Start Commands

Once you have the files in a new location:

```bash
# Complete setup in one go
npm install && \
npm run build && \
echo "Setup complete! Edit .env with your Supabase credentials" && \
echo "Then run: npm run dev"
```

## Next Steps

After successful transfer:

1. Read `PROJECT_TRANSFER_GUIDE.md` for full setup
2. Configure environment variables (see `ENVIRONMENT_VARIABLES.md`)
3. Deploy edge functions (see `EDGE_FUNCTIONS_GUIDE.md`)
4. Deploy to Netlify
5. Test all functionality
6. Update any hardcoded URLs or references
7. Configure custom domain (optional)

---

**Important:** Keep a backup of the original project until you've verified everything works in the new environment!
