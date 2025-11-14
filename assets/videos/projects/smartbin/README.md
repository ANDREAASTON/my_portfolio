# Smart Bin Project Video

## File
- `smartBinVedio.mp4` - Smart Bin demonstration video

## Specifications
- Format: MP4 (H.264 codec)
- Playback: 0.5x speed (slow motion)
- Mode: Muted auto-play (as background demo)
- Duration: [original duration]
- Resolution: [original resolution]

## Usage
- Smart Bin project page (smartBin.html)
- Demonstrates system functionality
- Shows touchless operation
- Displays sensor detection

## To Replace or Update
1. Record new footage of Smart Bin
2. Edit and optimize for web
3. Export as MP4 (H.264/AAC codec)
4. Compress to <20MB
5. Replace this file (keep same name)
6. Test playback in browser
7. Verify no broken links in smartBin.html

## Video Editing Tips
- Keep clear view of the product
- Show all key features
- Use good lighting
- Record from different angles
- Include motion to show responsiveness

## Compression Steps
```bash
# Using ffmpeg
ffmpeg -i smartBinVedio.mp4 -c:v libx264 -preset slow -crf 23 -c:a aac -q:a 5 smartBinVedio-compressed.mp4
```

## Browser Testing
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Safari desktop
- [ ] Chrome mobile
- [ ] Safari iOS
- [ ] Firefox Android

## Related Files
- Project page: `smartBin.html`
- Project images: `assets/images/projects/smartbin/`
