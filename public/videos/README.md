# How to Add Your Preloader Video

## Step 1: Create the videos folder
Make sure you have a `videos` folder inside your `public` directory:
\`\`\`
public/
  videos/
    (your video files go here)
\`\`\`

## Step 2: Add your video file
Place your video file in the `public/videos/` folder and name it `preloader.mp4`

Example:
\`\`\`
public/
  videos/
    preloader.mp4  ← Your video goes here
\`\`\`

## Step 3: Supported formats
- **MP4** (recommended) - `preloader.mp4`
- **WebM** (fallback) - `preloader.webm`

## Video specifications:
- **Duration**: 2-5 seconds (optimal)
- **Resolution**: 1920x1080 or 1280x720
- **File size**: Under 5MB for fast loading
- **Format**: MP4 with H.264 codec

## What happens:
1. If your video exists → It will play as the preloader background
2. If no video found → Shows animated loading screen with progress bar
3. Users can always skip the preloader with the "Skip" button

## File structure example:
\`\`\`
your-project/
├── public/
│   ├── videos/
│   │   ├── preloader.mp4     ← Your main video
│   │   └── preloader.webm    ← Optional fallback
│   └── ...
├── components/
│   └── preloader.tsx
└── ...
\`\`\`

## To use a different video name:
If you want to use a different filename, update the component:
\`\`\`tsx
<Preloader
  onComplete={handlePreloaderComplete}
  videoSrc="/videos/your-video-name.mp4"
  duration={4000}
/>
