# Project Videos

## Overview
Video files for project demonstrations and documentation.

## Directory Structure
```
videos/
└── projects/
    └── smartbin/
        └── smartBinVedio.mp4
```

## Files
- `smartBinVedio.mp4` - Smart Bin project demonstration video

## Specifications
- Format: MP4 (H.264 codec)
- Playback rate: 0.5x (slowed down for viewing)
- Usage: Auto-play with muted audio (demo mode)
- Location: smartBin.html

## To Add New Project Videos

### 1. Record Video
- Use phone or camera with good lighting
- Keep video under 1-2 minutes
- Landscape orientation preferred
- Clear audio (if needed)

### 2. Edit Video
- Trim to essential content
- Add captions if narrated
- Use simple transitions
- Target 30-60 seconds for best engagement

### 3. Export & Compress
- Export as MP4 (H.264/AAC)
- Target file size: <20MB
- Resolution: 1280x720 (720p) or higher
- Frame rate: 30fps

### 4. Optimize
- Use ffmpeg:
  ```bash
  ffmpeg -i input.mp4 -vcodec h264 -acodec aac -strict -2 output.mp4
  ```
- Or use online tool: Handbrake, CloudConvert

### 5. Add to Project
- Save to `assets/videos/projects/[project-name]/`
- Update HTML:
  ```html
  <source src="assets/videos/projects/smartbin/projectname.mp4" type="video/mp4">
  ```
- Set playback rate if needed:
  ```html
  <video ... id="videoId">
    ...
  </video>
  <script>
    document.getElementById('videoId').playbackRate = 0.5;
  </script>
  ```

### 6. Test
- Test on desktop and mobile
- Check audio levels
- Verify auto-play works
- Check fallback content

## Browser Compatibility
- Chrome: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support
- Mobile: ✅ Most devices (may require user interaction)

## Best Practices
- Keep videos short (<2 min)
- Include fallback image
- Provide captions for accessibility
- Compress for web delivery
- Test on various connection speeds
- Consider bandwidth for mobile users

## Troubleshooting
- **Video won't play:** Check file format and codec
- **Slow to load:** Reduce file size/bitrate
- **Audio sync issues:** Re-export from source
- **Mobile won't autoplay:** Check muted attribute, add user gesture

## Recommendations
- Smart Bin: Add assembly process video
- Graphics: Add design timelapse
- Photography: Add portfolio showcase video
- Robotics: Add competition footage
