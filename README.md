# Andrea Aston — Professional Portfolio Website

A modern, responsive personal portfolio showcasing projects, skills, design work, and professional accomplishments by **Andrea Aston**, a Student Electronics & Computer Engineer from Malawi.

---

## 🎯 Project Overview

This is a **fully-featured, production-ready static portfolio website** built with HTML5, CSS3, and vanilla JavaScript. The site combines sleek modern design with robust functionality, featuring an admin dashboard for dynamic content management, gallery uploads, and client-side form handling.

The portfolio highlights expertise in:
- **Electronics & Computer Engineering**
- **Robotics & Embedded Systems** (ESP32, Arduino)
- **Web Development**
- **Graphic Design**

### Core Features

✨ **Responsive Design** — Optimized for mobile, tablet, and desktop (mobile-first approach)  
🖼️ **Dynamic Gallery** — Supabase-backed image storage with admin management  
📧 **Contact Forms** — EmailJS integration for seamless messaging  
🔐 **Admin Dashboard** — Secure authentication and content management  
⚡ **Performance Optimized** — Fast load times with modern CSS animations  
🎨 **Modern UI** — Smooth animations, hover effects, and transitions  
📱 **Mobile Navigation** — Hamburger menu for responsive navigation  

### Main Pages
- **Home** (`index.html`) — Hero section with social links and call-to-action
- **About** (`aboutpage.html`) — Personal background and professional journey
- **Projects** (`project-grid.html`, `project-details.html`) — Detailed project portfolio
- **Skills** (`public-skills.html`) — Comprehensive skill showcase
- **Resume** (`public-resume.html`) — Downloadable CV and experience
- **Gallery** (`myGallery.html`) — Visual portfolio of design and creative work
- **Contact** (`contactpage.html`) — Contact form with EmailJS
- **Admin Panel** (`admin-*.html`) — Dashboard for managing content and uploads
- **Login** (`loginpage.html`) — Secure authentication system

---

## 🛠️ Tech Stack & Dependencies

**Frontend Framework:**
- HTML5, CSS3 (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter font family)

**Backend & Services:**
- **Supabase** — Cloud storage for gallery images and database
- **EmailJS** — Email form submission without backend server
- **Font Awesome 6** — Icon library (social links, UI elements)

**Build & Deployment:**
- Static site (no build process required)
- Compatible with GitHub Pages, Netlify, Vercel, and traditional hosting

---

## 📂 Project Structure

```
my_portfolio/
│
├── index.html                    # Home/Hero page
├── aboutpage.html               # About section
├── contactpage.html             # Contact form page
├── loginpage.html               # Authentication page
├── project-grid.html            # Projects grid view
├── project-details.html         # Individual project details
├── public-resume.html           # Public resume/CV
├── public-skills.html           # Skills showcase
├── myGallery.html               # Design gallery
├── style.css                    # Main stylesheet (all responsive design)
│
├── admin-cover.html             # Admin dashboard cover/home
├── admin-create.html            # Create new project
├── admin-edit.html              # Edit existing projects
├── admin-projects.html          # Manage all projects
├── admin-projects-gallery.html  # Project gallery management
├── admin-courses.html           # Manage courses/education
├── admin-skills.html            # Manage skills
├── admin-mygallery.html         # Manage gallery images
├── admin-resume.html            # Manage resume content
│
├── js/
│  ├── supabase.client.js        # Supabase configuration & initialization
│  ├── site.ui.js                # Navigation, hamburger menu, UI interactions
│  ├── adminauth.js              # Admin authentication logic
│  ├── authadmin.js              # Auth check middleware
│  ├── mygallery.admin.js        # Gallery image upload & management
│  ├── myGallery.js              # Gallery display on public site
│  ├── projects.admin.js         # Project admin management
│  ├── projects.public.js        # Projects display logic
│  ├── admin-courses.js          # Courses admin functionality
│  ├── admin-skills.js           # Skills admin functionality
│  ├── admin-resume.js           # Resume admin functionality
│  ├── courses-public.js         # Courses public display
│  ├── public-resume.js          # Resume public display
│  └── skills.public.js          # Skills public display
│
└── README.md                    # This file
```

---

## 🚀 Getting Started

### 1. Local Development Setup

Clone or download the repository:
```bash
git clone <repository-url>
cd my_portfolio
```

**Option A: Direct Browser**
- Simply open `index.html` in your web browser
- Most features work without a server (except Supabase features)

**Option B: Local Server** (Recommended)

**Python 3:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx serve .
```

**VS Code:**
- Install the "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

Visit `http://localhost:8000` to view the site.

### 2. Environment Configuration

No build or configuration step needed! The site works out-of-the-box with demo data.

For **Supabase integration**, configure [see Supabase Setup below].

---

## ☁️ Supabase Setup (Gallery & Admin Features)

To enable image uploads and dynamic gallery management, set up Supabase:

### Step 1: Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Create a new project (choose your region)
4. Wait for the project to initialize

### Step 2: Create Storage Bucket
1. Navigate to **Storage** in the sidebar
2. Click **Create new bucket**
3. Name it `gallery` (or customize in code)
4. Choose **Public** or **Private** based on your needs
5. Create the bucket

### Step 3: Configure API Keys
1. Go to **Project Settings** → **API**
2. Copy your **Project URL** and **anon (public) key**
3. Update `js/supabase.client.js`:

```javascript
const SUPABASE_URL = "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key-here";
```

### Step 4: Set Bucket Policies (if Private)
If using a private bucket, set RLS (Row Level Security) policies to allow uploads:

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');
```

### Step 5: Upload via Admin Panel
1. Log in via `loginpage.html`
2. Go to **Admin Dashboard** → **Gallery Management**
3. Select images and click **Upload**
4. Images appear in `myGallery.html`

---

## 🔐 Admin Authentication

### Default Credentials
The system uses a simple hardcoded authentication (change for production):

**Username:** `admin`  
**Password:** Check `js/adminauth.js` for current password

⚠️ **Security Note:** This is a demo authentication system. For production:
- Use proper backend authentication
- Store credentials securely
- Implement JWT tokens or session management
- Add rate limiting and CSRF protection

### Admin Features
- Create, edit, and delete projects
- Upload and manage gallery images
- Manage skills and resume content
- Update courses and education
- View and organize all portfolio content

---

## 📧 Contact Form Setup

The contact form uses **EmailJS** for email delivery without a backend server.

### Configuration
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up and create a service
3. Set up an email template
4. Get your **Service ID**, **Template ID**, and **Public Key**
5. Update the config in `index.html`:

```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE");
```

Update template variables in `js/site.ui.js` as needed.

---

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints for:
- **Mobile** (< 480px)
- **Tablet** (480px - 900px)
- **Desktop** (900px - 1600px)
- **Large Desktop** (> 1600px)

All layouts tested on common devices (iPhone, iPad, MacBook, Windows desktop).

---

## ✨ Key Features Explained

### 1. **Hero Section with Animations**
- Smooth fade-in-down animations on page load
- Responsive image with hover effects
- Social media links with hover effects

### 2. **Dynamic Project Gallery**
- Grid layout with hover previews
- Detailed project pages
- Image lazy loading (optional)
- Filter/sort functionality (customizable)

### 3. **Skills Showcase**
- Categorized skills display
- Progress bars or tags
- Admin management interface

### 4. **Resume Section**
- Downloadable PDF (if hosted)
- Timeline view of education and experience
- Admin editing capabilities

### 5. **Admin Dashboard**
- Centralized content management
- Intuitive forms for all portfolio sections
- Real-time updates to public site
- Authentication system

---

## 🧪 Testing & Debugging

### Browser DevTools
- Open **F12** or **Ctrl+Shift+I** (Windows) / **Cmd+Option+I** (Mac)
- **Console Tab:** Check for JavaScript errors
- **Network Tab:** Monitor image loading and API calls
- **Elements Tab:** Inspect HTML/CSS for styling issues

### Common Issues & Solutions

**Issue:** Images not loading in gallery
- **Solution:** Check Supabase bucket permissions, verify API keys, inspect Network tab for 403/404 errors

**Issue:** Contact form not sending
- **Solution:** Verify EmailJS API key, check template ID and service ID, check email quota

**Issue:** Admin features not working
- **Solution:** Clear browser cache, check authentication status, verify Supabase configuration

**Issue:** Animations not visible
- **Solution:** Ensure CSS animations are enabled, check browser DevTools for animation performance settings

---

## 📦 Deployment

### GitHub Pages
1. Push code to GitHub
2. Go to **Settings** → **Pages**
3. Select branch (`main`) and folder (`/` root)
4. Site deploys automatically

### Netlify
1. Drag & drop project folder, or
2. Connect GitHub repo for auto-deploy

### Vercel
1. Import project from GitHub
2. Deploy (auto-configured for static sites)

### Traditional Hosting
- FTP upload to server
- Ensure `index.html` is accessible at domain root
- No special server configuration needed

---

## 🎨 Customization Guide

### Change Colors
Edit CSS variables in `style.css` (top of file):
```css
:root {
  --primary-color: #your-color;
  --bg-color: #your-color;
  /* ... more variables */
}
```

### Update Content
- Edit HTML files directly
- Update `js/*.js` files for logic changes
- Use Admin Dashboard for dynamic content

### Modify Layout
- Edit CSS Grid/Flexbox properties
- Adjust breakpoints in media queries
- Customize spacing with CSS variables

### Add New Pages
1. Create `newpage.html`
2. Copy navigation from existing pages
3. Link from navbar and other relevant pages
4. Style with `style.css`

---

## 📊 Performance Tips

- **Images:** Compress before uploading (tools: TinyPNG, ImageOptim)
- **CSS:** Minify for production
- **JavaScript:** Use async/defer attributes
- **Fonts:** Limit weights (currently using 300-700)
- **Caching:** Enable browser caching on hosting provider

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact & Social

**Direct Contact:**
- 📧 Email: via contact form on site
- 💬 WhatsApp: +265997721105
- 📍 Location: Malawi

**Social Profiles:**
- 🔗 LinkedIn: https://www.linkedin.com/in/andrea-aston-2888a2286
- 📸 Instagram: https://www.instagram.com/aston__andrew
- 👥 Facebook: https://www.facebook.com/share/1Bz3NqUBeM/

---

## 📝 License & Attribution

© 2025 Andrea Aston. All rights reserved.

This portfolio showcases work in:
- Robotics & Embedded Systems
- Electronics & Computer Engineering
- Web Development
- Graphic Design

---

## 🛠️ Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Page won't load | Missing files | Check file paths, use relative paths |
| Images not showing | 404 errors | Verify image filenames and paths |
| Forms not working | API keys missing | Set up EmailJS and Supabase |
| Admin login fails | Wrong credentials | Check `adminauth.js` |
| Styles look broken | CSS not linked | Clear cache, check `<link>` tag |

---

## 🚀 Future Enhancements

- [ ] Backend API for authentication
- [ ] Database for dynamic content
- [ ] Blog section with CMS
- [ ] Search functionality
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] Performance monitoring

---

**Built with ❤️ by Andrea Aston**

*Last updated: January 2025*

---

## 🛠️ Local Setup & Development

This is a static site — you can preview it locally in a browser or serve it with a simple HTTP server.

Basic options:
- Open `index.html` directly in your browser (works for most features)
- Use a lightweight server:
  - Python 3: `python -m http.server 8000`
  - Node: `npx serve .`
  - VS Code: use the Live Server extension

Visit `http://localhost:8000` (or the port you choose) to preview the site.

---

## ⚙️ Supabase (Gallery) Setup

If you want the gallery and admin upload to work with Supabase, follow these steps:

1. **Create a Supabase project** at https://app.supabase.com
2. **Create a storage bucket** named `gallery` (or update code to use your bucket name)
3. **Bucket permissions**:
   - For public access use a public bucket, or
   - Keep it private and the code will request signed URLs for access (the site supports both patterns)
4. **Get your API keys**: locate `URL` and `anon` key in Project Settings → API
5. **Configure the client** in `js/supabase.client.js`:
   ```js
   const SUPABASE_URL = "https://your-project-id.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-key";
   window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   ```
6. **Upload images** via the Admin page (`admin.html`) or Supabase dashboard

Notes:
- If images do not appear, check DevTools → Console and Network for 401/403 errors. This usually indicates bucket permissions or incorrect keys.
- The gallery code expects images organized under project folders matching the `projectSelect` values in `admin.html`.

---

## 📁 File Structure (summary)

```
my_portfolio/
├─ index.html
├─ admin.html
├─ aboutpage.html
├─ contactpage.html
├─ style.css
├─ script.js (legacy site-level scripts)
├─ js/
│  ├─ supabase.client.js   # Supabase client config
│  ├─ gallery.admin.js     # Admin gallery & uploader (preferred)
│  └─ ...                 # other modular scripts
└─ projects/               # project pages
```

---

## 🧪 Testing & Debugging Tips

- Open DevTools (F12) → Console for runtime errors and logs
- Network tab shows image requests (403/404 indicate permissions or wrong paths)
- Ensure `js/supabase.client.js` is loaded before `js/gallery.admin.js` and any pages using Supabase

---

## ✅ Admin Usage

- Go to `admin.html`
- Choose a project from the dropdown, select images, and click **Upload**
- Check the `#uploadStatus` box and the Supabase storage dashboard for result

If the upload button does nothing, open DevTools Console and look for logs such as `Upload button element:` or `uploadImages called` to diagnose.

---

## 📦 Deployment

You can host this static site on GitHub Pages, Netlify, Vercel, or any static hosting provider.
- For GitHub Pages, push to `main` and enable Pages in repo settings (serve from `/` or `/docs`).

---

## 🤝 Contributing

If you'd like to contribute improvements, please open a Pull Request. Keep changes small, focused, and documented.

---

## 📞 Contact

- Email: use the contact form on the site
- WhatsApp: +265997721105
- Instagram: https://www.instagram.com/aston__andrew
- LinkedIn: https://www.linkedin.com/in/andrea-aston-2888a2286

---

## 📝 License

© 2025 Andrea Aston. All rights reserved.

---

**Built with ❤️ by Andrea Aston**
