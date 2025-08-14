# 🎬 SETUP YOUR PRELOADER VIDEO

## Step 1: Add Your Video File
1. Put your video file in the `public/videos/` folder
2. Name it something like `my-preloader.mp4`

Example:
\`\`\`
public/
  videos/
    my-preloader.mp4  ← Your video here
\`\`\`

## Step 2: Update the Code
In `pet-seed-store.tsx`, find this line (around line 300):

\`\`\`tsx
if (showPreloader) {
  return <Preloader onComplete={handlePreloaderComplete} duration={4000} />
}
\`\`\`

Change it to:
\`\`\`tsx
if (showPreloader) {
  return (
    <Preloader 
      onComplete={handlePreloaderComplete} 
      videoSrc="/videos/my-preloader.mp4"
      duration={4000} 
    />
  )
}
\`\`\`

## Step 3: Replace the filename
- Change `my-preloader.mp4` to your actual video filename
- Make sure the path starts with `/videos/`

## ✅ That's it!
Your video will now play as the preloader background!

## 🚨 Important Notes:
- **Without videoSrc**: Shows animated loading screen (current behavior)
- **With videoSrc**: Shows your video as background
- **Video not found**: Falls back to animated loading screen

## Example with different filename:
If your video is named `intro.mp4`:
\`\`\`tsx
videoSrc="/videos/intro.mp4"
\`\`\`

If your video is named `loading-animation.mp4`:
\`\`\`tsx
videoSrc="/videos/loading-animation.mp4"
