# Assets Directory

## Overview
Centralized location for all portfolio assets including images, videos, and documents.

## Directory Structure
```
assets/
├── images/                      # All image files
│   ├── portfolio/              # Profile & personal images
│   ├── projects/               # Project-specific images
│   │   ├── smartbin/
│   │   └── graphics/
│   └── gallery/                # Thumbnail images for homepage
│
├── videos/                      # Video demonstrations
│   └── projects/
│       └── smartbin/
│
└── documents/                   # PDF and document files
```

## Benefits of This Organization

### 🎯 **Scalability**
- Easy to add new projects and assets
- Clear structure for expansion
- No cluttering of root directory

### 📁 **Maintainability**
- All assets in one logical location
- Easy to find specific files
- Simple to backup or migrate

### 🚀 **Performance**
- Can optimize images per folder
- Easy to implement lazy loading
- Simple to configure caching headers

### 🔍 **Findability**
- Obvious naming conventions
- Logical folder hierarchy
- README guides in each folder

### 👥 **Collaboration**
- New contributors know file locations
- Clear conventions to follow
- Easy to document changes

## Quick Reference

| Asset Type | Location | Path Pattern |
|-----------|----------|--------------|
| Profile Photo | portfolio | `assets/images/portfolio/` |
| Smart Bin Images | projects | `assets/images/projects/smartbin/` |
| Graphics Images | projects | `assets/images/projects/graphics/` |
| Gallery Thumbnails | gallery | `assets/images/gallery/` |
| Project Videos | videos | `assets/videos/projects/[project]/` |
| PDF/Resume | documents | `assets/documents/` |

## Usage Examples

### Adding Smart Bin Photo
```html
<img src="assets/images/projects/smartbin/smartBin5.jpg" alt="Smart Bin 5">
```

### Adding Graphics Design
```html
<img src="assets/images/projects/graphics/image26.jpg" alt="New Design">
```

### Adding Project Video
```html
<video controls>
  <source src="assets/videos/projects/robotics/demo.mp4" type="video/mp4">
</video>
```

### Linking Resume
```html
<a href="assets/documents/Aston_Andrea_CV.pdf" download>Download CV</a>
```

## File Naming Conventions

### ✅ Good Examples
- `smartBin-prototype-v2.jpg`
- `social-media-design-2025.jpg`
- `resume-november-2025.pdf`
- `rescue-robot-demo.mp4`

### ❌ Bad Examples
- `image1.jpg` (too generic)
- `photo.jpg` (unclear purpose)
- `file.pdf` (no context)
- `video123.mp4` (random numbering)

## Organization Rules

1. **One asset, one purpose** - No duplicate files
2. **Descriptive names** - Clear file naming
3. **Proper categorization** - Right folder for type
4. **Documentation** - README.md in each folder
5. **Optimization** - Web-ready file sizes
6. **Accessibility** - Proper alt text in HTML

## Adding New Assets

### Process
1. Determine asset type and project
2. Navigate to correct folder
3. Check README.md for specifications
4. Optimize file (compress, resize)
5. Use proper naming convention
6. Update relevant HTML file
7. Test on multiple devices
8. Update README if needed

### Checklist
- [ ] File optimized for web
- [ ] Proper naming convention used
- [ ] Correct folder location
- [ ] HTML references updated
- [ ] Tested on mobile/desktop
- [ ] README.md updated
- [ ] No broken links
- [ ] Git changes staged

## Storage Limits

Recommended file sizes:
- Images: 150KB-500KB per image
- Videos: <20MB per video
- Documents: <2MB per PDF
- Total assets: <500MB

## Tools for Asset Management

### Image Optimization
- TinyPNG/TinyJPG (online)
- ImageOptim (Mac)
- FileOptimizer (Windows)
- GIMP (free, all platforms)

### Video Compression
- ffmpeg (command line)
- HandBrake (GUI)
- CloudConvert (online)
- Adobe Media Encoder

### File Management
- VS Code (built-in explorer)
- Git (version control)
- GitHub (backup)

## Best Practices

✅ **DO**
- Compress images before uploading
- Use descriptive file names
- Keep originals in backup
- Test all assets before deploying
- Document changes in README
- Organize by category consistently
- Use meaningful alt text
- Regular backup of assets

❌ **DON'T**
- Mix different asset types in folders
- Use generic names
- Upload unoptimized files
- Keep duplicate files
- Ignore file size limits
- Leave README files empty
- Ignore mobile compatibility
- Commit large files without compression

## Version Control

### Git Ignore for Large Files
Add to `.gitignore`:
```
assets/**/*.psd    # Photoshop files
assets/**/*.ai     # Illustrator files
assets/**/*.mp4~   # Temp video files
```

### Store Original Files Separately
- Keep PSD/AI source files on local drive
- Use only exported/optimized versions in git
- Consider using Git LFS for large media

## Performance Tips

### Image Optimization
```html
<!-- Use responsive images -->
<img src="assets/images/projects/smartbin/smartBin1.jpg" 
     srcset="smartBin1-small.jpg 480w, smartBin1.jpg 800w"
     alt="Smart Bin" />
```

### Lazy Loading
```html
<img src="assets/images/projects/smartbin/smartBin1.jpg" 
     loading="lazy" 
     alt="Smart Bin" />
```

### WebP Format (Advanced)
```html
<picture>
  <source srcset="assets/images/projects/smartbin/smartBin1.webp" type="image/webp">
  <img src="assets/images/projects/smartbin/smartBin1.jpg" alt="Smart Bin">
</picture>
```

## Support & Troubleshooting

### Broken Image Links
- Check path spelling
- Verify file exists
- Use relative paths from HTML location
- Check file extension case sensitivity

### Large File Sizes
- Compress images with TinyPNG
- Reduce video bitrate with ffmpeg
- Optimize PDFs with Acrobat
- Remove unnecessary metadata

### Mobile Performance
- Use responsive images
- Implement lazy loading
- Compress video files
- Test on actual devices

---

**Last Updated:** November 14, 2025
**Structure Version:** 1.0
**Total Assets:** [to be counted]
