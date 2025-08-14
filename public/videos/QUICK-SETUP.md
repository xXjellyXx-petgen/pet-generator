# 🚀 QUICK SETUP - Add Your Preloader Video

## 📁 Step 1: Add Your Video
Put your video file here: `public/videos/my-video.mp4`

## 🔧 Step 2: Update the Code
In `pet-seed-store.tsx`, find this line (around line 300):

**FIND THIS:**
\`\`\`tsx
return <Preloader onComplete={handlePreloaderComplete} videoSrc="/videos/your-video-name.mp4" duration={4000} />
\`\`\`

**CHANGE TO:**
\`\`\`tsx
return <Preloader onComplete={handlePreloaderComplete} videoSrc="/videos/my-video.mp4" duration={4000} />
\`\`\`

## ✅ Done!
Replace `my-video.mp4` with your actual filename.

## 🔍 Debug Mode
In development, you'll see debug info showing:
- Video Source path
- Whether video was found
- Current status

## 📋 Video Requirements:
- **Format**: MP4 (recommended)
- **Location**: `public/videos/` folder
- **Size**: Under 10MB for fast loading
- **Duration**: 2-8 seconds optimal

## 🎯 Examples:
- Video named `intro.mp4` → `videoSrc="/videos/intro.mp4"`
- Video named `loading.mp4` → `videoSrc="/videos/loading.mp4"`
- Video named `preloader.mp4` → `videoSrc="/videos/preloader.mp4"`
