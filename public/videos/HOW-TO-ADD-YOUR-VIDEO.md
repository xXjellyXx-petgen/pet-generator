# 🎬 How to Add Your Own Preloader Video

## 📁 Step 1: Put your video in the right place
\`\`\`
public/
  videos/
    my-video.mp4  ← Your video file here
\`\`\`

## 🔧 Step 2: Tell the app to use your video
In `pet-seed-store.tsx`, find this line:
\`\`\`tsx
<Preloader
  onComplete={handlePreloaderComplete}
  duration={4000}
/>
\`\`\`

Change it to:
\`\`\`tsx
<Preloader
  onComplete={handlePreloaderComplete}
  videoSrc="/videos/my-video.mp4"
  duration={4000}
/>
\`\`\`

## ✅ That's it!
- Replace `my-video.mp4` with your actual video filename
- Your video will play as the preloader background
- If you don't add `videoSrc`, it shows the animated loading screen instead

## 📋 Video Requirements:
- **Format**: MP4 recommended
- **Size**: Under 10MB for fast loading
- **Duration**: 2-8 seconds works best
- **Location**: Must be in `public/videos/` folder

## 🎯 Example:
If your video is named `awesome-intro.mp4`:
\`\`\`tsx
<Preloader
  onComplete={handlePreloaderComplete}
  videoSrc="/videos/awesome-intro.mp4"
  duration={5000}
/>
