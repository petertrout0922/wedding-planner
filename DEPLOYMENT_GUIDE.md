# Wedding Planner Deployment Guide

## What You'll Accomplish
By following this guide, your wedding planner will be live on the internet at askpaulathompson.com, accessible to anyone, with all data securely stored in your database.

---

## Step 1: Create a GitHub Account (5 minutes)

**What is GitHub?** Think of it as Dropbox for code. It stores your website files online so they can be automatically deployed.

1. Open a new tab and go to: **https://github.com/signup**
2. Enter your email address (use: paula@askpaulathompson.com)
3. Create a password (save it somewhere safe!)
4. Choose a username (suggestion: paulathompson or askpaulathompson)
5. Click through the setup questions (you can skip the email preferences)
6. Verify your email address (check your inbox)
7. **Done!** You now have a GitHub account.

---

## Step 2: Create Your First Repository (3 minutes)

**What is a Repository?** It's like a folder on GitHub that holds all your website files.

1. Once logged into GitHub, click the green **"New"** button (top left)
2. **Repository name**: Type `wedding-planner`
3. **Description** (optional): Type "Wedding Planning Application"
4. Leave it as **Public** (it's free)
5. **Do NOT check** any of the boxes (no README, no .gitignore, no license)
6. Click the green **"Create repository"** button
7. You'll see a page with instructions - **keep this tab open**, you'll need it in a moment

---

## Step 3: Connect Your Computer to GitHub (Return to me)

**What happens here:** I'll run some commands to upload your website files to GitHub.

**What you need to do:**

Come back to our chat and tell me:
- "I created the repository"
- Share the repository URL (it will look like: https://github.com/YOUR-USERNAME/wedding-planner)

I'll then upload all your files automatically.

---

## Step 4: Create a Netlify Account (3 minutes)

**What is Netlify?** It's a service that takes your files from GitHub and makes them into a live website that anyone can visit.

1. Open a new tab and go to: **https://app.netlify.com/signup**
2. Click **"Sign up with GitHub"** (easiest option!)
3. Click **"Authorize Netlify"** when GitHub asks
4. You'll be taken to your Netlify dashboard
5. **Done!** Netlify and GitHub are now connected.

---

## Step 5: Deploy Your Website (5 minutes)

1. In your Netlify dashboard, click **"Add new site"** (blue button)
2. Click **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. You'll see a list of your repositories - click **"wedding-planner"**
5. **Build settings** - Netlify will auto-detect these:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - **These should already be filled in - don't change them!**
6. Click **"Deploy wedding-planner"**
7. Wait 2-3 minutes while Netlify builds your site
8. You'll see a random URL like `amazing-cupcake-123456.netlify.app`
9. **Your site is now live!** (But we still need to add the database and custom domain)

---

## Step 6: Add Your Database Connection (5 minutes)

**What's happening:** Your website needs to know where your database is. This is like giving someone your home address.

1. In Netlify, find your site and click on it
2. Click **"Site configuration"** in the left sidebar
3. Click **"Environment variables"**
4. Click **"Add a variable"** → **"Add a single variable"**

**Now add these TWO variables:**

### First Variable:
- **Key**: Type exactly `VITE_SUPABASE_URL`
- **Values**: Click into the box and paste your Supabase URL
  - **Where to find it:** Open a new tab, go to your Supabase project, click the Settings gear icon, click "API", and copy the URL under "Project URL"
- Click **"Create variable"**

### Second Variable:
- Click **"Add a variable"** again
- **Key**: Type exactly `VITE_SUPABASE_ANON_KEY`
- **Values**: Paste your Supabase anon key
  - **Where to find it:** Same place as above, but copy the key under "Project API keys" → "anon public"
- Click **"Create variable"**

5. After adding both variables, click **"Deploys"** in the left sidebar
6. Click **"Trigger deploy"** → **"Deploy site"**
7. Wait 2-3 minutes for the rebuild
8. **Your site now works with your database!**

---

## Step 7: Connect Your Custom Domain (10 minutes)

**What's happening:** Instead of the random Netlify URL, people will visit askpaulathompson.com

### Part A: Add Domain in Netlify

1. In your Netlify site, click **"Domain management"** in the left sidebar
2. Click **"Add a domain"**
3. Type: `askpaulathompson.com`
4. Click **"Verify"**
5. If it says you don't own it, click **"Add domain anyway"**
6. You'll see a message about DNS configuration - **keep this tab open**

### Part B: Update Your Domain Settings

**Where you do this depends on where you bought askpaulathompson.com:**

**If you bought it from GoDaddy:**
1. Log in to GoDaddy
2. Go to "My Products" → "Domains"
3. Click on askpaulathompson.com
4. Find "DNS" or "Manage DNS"
5. Look for "A Records" or "Nameservers"
6. You need to either:
   - **Option 1 (Easier):** Change nameservers to Netlify's (Netlify will show you what to enter)
   - **Option 2:** Add an A record pointing to Netlify's IP address

**If you bought it from Namecheap, Google Domains, or another provider:**
The process is similar - log in, find DNS settings, and follow the instructions Netlify provides.

**Don't know where you bought it?**
- Go to **https://who.is**
- Type in `askpaulathompson.com`
- Look for "Registrar" - that's who you bought it from

### Part C: Wait for Propagation (15 minutes to 24 hours)

After updating DNS settings:
- Changes can take 15 minutes to 24 hours to take effect
- Check back by visiting askpaulathompson.com in your browser
- Once it loads, you're done!

---

## Step 8: Enable HTTPS (Automatic)

Once your domain is connected, Netlify will automatically:
- Get an SSL certificate (the padlock icon in browsers)
- Enable HTTPS (secure connection)
- This happens automatically within 24 hours of connecting your domain

---

## Troubleshooting

### "My site shows an error"
- Check that you added both environment variables correctly in Netlify
- Make sure you triggered a new deploy after adding them

### "My domain isn't working"
- DNS changes take time (sometimes up to 24 hours)
- Double-check that you updated the DNS settings with your domain provider
- Try visiting the Netlify URL (the random one) to confirm the site itself works

### "I need to make changes"
- Any time you want to update the site, we make changes in the code
- Once you tell me what to change, I'll update the code
- Commit the changes to GitHub
- Netlify will automatically deploy the updates in 2-3 minutes

---

## What to Do Next

**Come back to our chat and tell me:**
1. What step you're on
2. If you get stuck anywhere
3. When you've successfully completed each step

I'm here to help with every step of the way!

---

## Summary: What You're Doing

1. ✓ **GitHub** - Stores your website files online
2. ✓ **Netlify** - Turns those files into a live website
3. ✓ **Environment Variables** - Connects your website to your database
4. ✓ **Custom Domain** - Makes your site accessible at askpaulathompson.com
5. ✓ **Automatic Deployment** - Every change you make will automatically update the live site

**That's it!** Once set up, any changes I make will automatically appear on your live site within minutes.
