# Asset Organization Guide

## Directory Structure

```
assets/
├── images/                          # All image files
│   ├── portfolio/                   # Profile & about section images
│   │   ├── AndreaAston.jpg
│   │   └── README.md
│   │
│   ├── projects/                    # Project-specific images
│   │   ├── smartbin/                # Smart Bin project
│   │   │   ├── smartBin1.jpg
│   │   │   ├── smartBin2.jpg
│   │   │   ├── smartBin3.jpg
│   │   │   ├── smartBin4.jpg
│   │   │   └── README.md
│   │   │
│   │   └── graphics/                # Graphic Design portfolio
│   │       ├── image.jpg
│   │       ├── image0.jpg
│   │       ├── image1.jpg
│   │       ├── ... (all design images)
│   │       └── README.md
│   │
│   └── gallery/                     # Project showcase images
│       ├── Graphics.jpg             # Graphic Design thumbnail
│       ├── smartBin.jpg             # Smart Bin thumbnail
│       ├── Photography.jpg          # Photography thumbnail
│       ├── RescueRobot.jpg          # Rescue Robot thumbnail
│       ├── Robotics Instructor.jpg  # STEM Workshop thumbnail
│       └── README.md
│
├── videos/                          # Video files
│   ├── projects/
│   │   ├── smartbin/
│   │   │   ├── smartBinVedio.mp4
│   │   │   └── README.md
│   │   └── README.md
│   └── README.md
│
├── documents/                       # PDF and document files
│   ├── Aston_Andrea_CV.pdf
│   └── README.md
│
└── README.md                        # Asset management guide

```

## Folder Descriptions

### assets/images/portfolio/
**Purpose:** Personal profile and about section images
**Contents:**
- Profile photo (AndreaAston.jpg)
- Headshots
- Personal branding images

**When to add:** When updating profile information or adding new about section images

### assets/images/projects/smartbin/
**Purpose:** Smart Bin project images and media
**Contents:**
- Project photos (smartBin1-4.jpg)
- Component photos
- Prototype images

**When to add:** When adding new project photos or documentation images

### assets/images/projects/graphics/
**Purpose:** Graphic Design portfolio images
**Contents:**
- Design portfolio images (image0-25.jpg)
- Design samples
- Portfolio showcase images

**When to add:** When creating new designs or updating portfolio

### assets/images/gallery/
**Purpose:** Project thumbnail images for main portfolio page
**Contents:**
- Project category thumbnails
- Preview images shown on homepage

**When to add:** When creating new project categories or updating thumbnails

### assets/videos/projects/smartbin/
**Purpose:** Project demonstration videos
**Contents:**
- smartBinVedio.mp4 (Smart Bin demo)

**When to add:** When creating tutorial or demo videos for projects

### assets/documents/
**Purpose:** PDF files, CVs, documents
**Contents:**
- Aston_Andrea_CV.pdf (Resume/CV)

**When to add:** When updating resume or adding documentation files

---

## Usage in HTML Files

### Updating Image Paths

**Old structure:**
```html
<img src="AndreaAston.jpg" alt="Andrea Aston">
<img src="Graphics.jpg" alt="Graphic Design">
<img src="SmartBin/smartBin1.jpg" alt="Smart Bin 1">
<img src="GraphicDesigningImages/image0.jpg" alt="Design Sample">
```

**New structure:**
```html
<img src="assets/images/portfolio/AndreaAston.jpg" alt="Andrea Aston">
<img src="assets/images/gallery/Graphics.jpg" alt="Graphic Design">
<img src="assets/images/projects/smartbin/smartBin1.jpg" alt="Smart Bin 1">
<img src="assets/images/projects/graphics/image0.jpg" alt="Design Sample">
```

### Video Files

**Old:**
```html
<source src="SmartBin/smartBinVedio.mp4" type="video/mp4">
```

**New:**
```html
<source src="assets/videos/projects/smartbin/smartBinVedio.mp4" type="video/mp4">
```

### Document Files

**Old:**
```html
<a href="Aston_Andrea_CV.pdf" download>Download CV</a>
```

**New:**
```html
<a href="assets/documents/Aston_Andrea_CV.pdf" download>Download CV</a>
```

---

## Benefits of This Organization

### 1. **Scalability**
- Easy to add new images without cluttering root directory
- Clear categorization for different project types
- Room for growth

### 2. **Maintainability**
- Organized by purpose and project
- Easy to find specific assets
- Clear naming conventions

### 3. **Performance**
- Can optimize images by folder
- Easy to implement lazy loading per category
- Simple to configure CDN paths

### 4. **Collaboration**
- Team members know where to put new assets
- Reduces confusion about file locations
- Clear structure for version control

### 5. **SEO & Accessibility**
- Descriptive folder names improve crawlability
- Better alt-text organization
- Semantic folder structure

---

## Naming Conventions

### Images
- Use descriptive names: `smartBin-prototype-v2.jpg` (good)
- Avoid: `image1.jpg` (ambiguous)
- Use hyphens for spacing: `project-name-description.jpg`
- Include version if applicable: `logo-v2.png`

### Videos
- Follow pattern: `[project]-[type]-[description].mp4`
- Example: `smartbin-demo-assembly.mp4`

### Documents
- Include type and version: `resume-2025.pdf` or `portfolio-guide-v1.pdf`

---

## Adding New Asset Categories

### If adding a new project type:
1. Create folder: `assets/images/projects/[project-name]/`
2. Add README.md inside
3. Update image paths in HTML
4. Add to this guide

### If adding new project category:
1. Create folder: `assets/images/projects/[category]/`
2. Organize images by subcategory if needed
3. Document in README.md
4. Update all relevant HTML files

---

## Best Practices

### ✅ DO:
- Organize by type/category
- Use descriptive names
- Include README.md in each folder
- Keep original high-quality versions
- Use consistent naming patterns
- Document changes

### ❌ DON'T:
- Mix different types in one folder
- Use generic names (image1, photo2, etc.)
- Keep duplicate files
- Store unnecessarily large files
- Ignore folder organization
- Leave README.md files empty

---

## File Size Optimization

### Image Optimization
```
Original Size          After Optimization    Format
JPG: 2.5MB    →        JPG: 150KB             JPG for photos
PNG: 1.2MB    →        PNG: 80KB              PNG for graphics
```

### Tools to use:
- TinyPNG/TinyJPG (online)
- ImageOptim (Mac)
- FileOptimizer (Windows)
- ffmpeg (video compression)

---

## Migration Checklist

- [ ] Move images to `assets/images/` with category subfolders
- [ ] Move videos to `assets/videos/` with project subfolders
- [ ] Move documents to `assets/documents/`
- [ ] Update all image paths in HTML files
- [ ] Update video source paths
- [ ] Update document links
- [ ] Test all images load correctly
- [ ] Check responsive images work
- [ ] Verify no broken links
- [ ] Update navigation to use new paths
- [ ] Add README.md files to each folder
- [ ] Update this guide with any changes

---

## README.md Template for Asset Folders

```markdown
# [Folder Name] Assets

## Overview
Brief description of what this folder contains.

## Files
- `file1.jpg` - Description
- `file2.jpg` - Description

## Usage
How these files are used in the project.

## Notes
- Image size: [dimensions]
- Format: [JPG/PNG/etc]
- Last updated: [date]
```

---

## Quick Reference

| Asset Type | Location | Path Pattern |
|-----------|----------|--------------|
| Profile Photo | portfolio | `assets/images/portfolio/[name].jpg` |
| Project Photo | projects | `assets/images/projects/[project]/[name].jpg` |
| Gallery Thumb | gallery | `assets/images/gallery/[name].jpg` |
| Project Video | videos | `assets/videos/projects/[project]/[name].mp4` |
| PDF/Document | documents | `assets/documents/[name].pdf` |

---

**Last Updated:** November 14, 2025
