# 🔧 GitHub Pages Troubleshooting Guide

## 🚨 Issue: README Shows Instead of App

If your GitHub Pages URL shows the README instead of your app, follow these steps:

### Step 1: Check GitHub Pages Settings

1. **Go to your repository on GitHub**
2. **Click "Settings" tab**
3. **Scroll down to "Pages" section**
4. **Under "Source", select "GitHub Actions"**
5. **Make sure it's not set to "Deploy from a branch"**

### Step 2: Verify Workflow is Running

1. **Go to "Actions" tab in your repository**
2. **Look for "Deploy Next.js site to Pages" workflow**
3. **Check if it's running successfully (green checkmark)**
4. **If it failed, click on it to see error details**

### Step 3: Check Build Output

The workflow should create an `out` folder with your built app. If it's not working:

1. **Check the workflow logs** for any build errors
2. **Make sure your `next.config.js` has `output: 'export'`**
3. **Verify your `package.json` has the correct scripts**

### Step 4: Manual Test

Test your build locally:

```bash
npm run build
```

This should create an `out` folder. Check if it contains:
- `index.html`
- `_next/` folder with static assets
- Other app files

### Step 5: Force Re-deploy

If the workflow is stuck:

1. **Go to Actions tab**
2. **Click "Re-run all jobs"** on the latest workflow
3. **Wait for it to complete**

## 🔗 Issue: Links Not Working

### Fix README Links

Replace the placeholder links in README.md:

1. **Find this line in README.md:**
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
   ```

2. **Replace with your actual URL:**
   ```
   https://your-actual-username.github.io/your-actual-repo-name
   ```

### Common URL Patterns

- **Username**: Your GitHub username
- **Repo Name**: Your repository name (usually the folder name)
- **Full URL**: `https://username.github.io/repo-name`

## 🛠️ Step-by-Step Fix

### 1. Update README Links

```bash
# Edit README.md and replace:
# YOUR_USERNAME → your actual GitHub username
# YOUR_REPO_NAME → your actual repository name
```

### 2. Check Repository Settings

1. **Repository → Settings → Pages**
2. **Source: GitHub Actions**
3. **Save**

### 3. Trigger New Deployment

```bash
git add .
git commit -m "Fix GitHub Pages deployment"
git push origin V1
```

### 4. Wait for Deployment

1. **Go to Actions tab**
2. **Wait for "Deploy Next.js site to Pages" to complete**
3. **Check the deployment URL**

## 🎯 Expected Result

After fixing, your GitHub Pages URL should show:
- ✅ Your cat swiping app (not README)
- ✅ Working buttons and interactions
- ✅ Beautiful UI with animations
- ✅ Cat images loading properly

## 🚨 Common Issues & Solutions

### Issue: "404 Not Found"
- **Cause**: GitHub Pages not configured properly
- **Solution**: Check Pages settings, ensure source is "GitHub Actions"

### Issue: "Build Failed"
- **Cause**: Next.js build errors
- **Solution**: Check Actions logs, fix any TypeScript/CSS errors

### Issue: "App loads but images don't work"
- **Cause**: CORS or image optimization issues
- **Solution**: Verify `unoptimized: true` in next.config.js

### Issue: "Still shows README"
- **Cause**: GitHub Pages serving wrong files
- **Solution**: Clear browser cache, check if workflow completed successfully

## 📞 Still Having Issues?

1. **Check the Actions tab** for error messages
2. **Verify your repository is public** (required for free GitHub Pages)
3. **Make sure you're using the V1 branch** (your default branch)
4. **Wait 5-10 minutes** after pushing changes

## ✅ Success Checklist

- [ ] GitHub Pages source set to "GitHub Actions"
- [ ] Workflow runs successfully (green checkmark)
- [ ] README links updated with correct URL
- [ ] App loads instead of README
- [ ] All features work (swipe, buttons, animations)
- [ ] Images load properly

Your app should now be live and working! 🐱✨
