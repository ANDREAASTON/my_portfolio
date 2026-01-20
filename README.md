# Andrea Aston - Professional Portfolio Website

Modern, responsive portfolio showcasing projects, skills, design work, and professional accomplishments by **Andrea Aston**, a Student Electronics & Computer Engineer from Malawi.

---

## Overview

This is a production-ready static portfolio built with HTML5, CSS3, and vanilla JavaScript. It includes a public site and an admin dashboard backed by Supabase for content management and image storage.

Highlights:
- Electronics & Computer Engineering
- Robotics & Embedded Systems (ESP32, Arduino)
- Web Development
- Graphic Design

---

## Core Features

- Responsive UI with modern styling
- Supabase-backed projects, skills, courses, and resume
- Public gallery with fullscreen viewer
- Admin dashboard for content + image uploads
- EmailJS contact form
- Auto-updating footer year
- Home page premium gradient mesh background

---

## Pages

Public:
- `index.html` - Home / hero
- `aboutpage.html` - About
- `project-grid.html` - Projects grid
- `project-details.html` - Project details + gallery
- `public-skills.html` - Skills showcase
- `public-resume.html` - Resume timeline
- `courses.html` - Courses
- `myGallery.html` - Public gallery
- `contactpage.html` - Contact form

Admin:
- `loginpage.html` - Admin login
- `admin-projects.html` - Project management dashboard
- `admin-create.html` - Create project
- `admin-edit.html` - Edit project
- `admin-projects-gallery.html` - Project gallery manager
- `admin-cover.html` - Set project cover image
- `admin-skills.html` - Manage skills
- `admin-resume.html` - Manage resume
- `admin-courses.html` - Manage courses
- `admin-mygallery.html` - Manage public gallery

---

## Tech Stack

Frontend:
- HTML5, CSS3, vanilla JS (ES6+)
- Font Awesome 6
- Google Fonts (Inter)

Services:
- Supabase (database + storage)
- EmailJS (contact form)

---

## Project Structure

```
my_portfolio/
  index.html
  aboutpage.html
  contactpage.html
  loginpage.html
  project-grid.html
  project-details.html
  public-resume.html
  public-skills.html
  courses.html
  myGallery.html
  style.css
  js/
    supabase.client.js
    site.ui.js
    projects.public.js
    projects.admin.js
    myGallery.js
    mygallery.admin.js
    skills.public.js
    admin-skills.js
    public-resume.js
    admin-resume.js
    courses-public.js
    admin-courses.js
    authadmin.js
    adminauth.js
    admin-auth-guard.js
  README.md
```

---

## Local Development

Option A: open `index.html` directly in a browser (Supabase features require a server).

Option B: run a local server:

```bash
python -m http.server 8000
```

```bash
npx serve .
```

Visit `http://localhost:8000`.

---

## Supabase Setup

1. Create a Supabase project at https://app.supabase.com
2. Create a storage bucket named `gallery`
3. Get your project URL and anon key
4. Update `js/supabase.client.js`:

```js
const SUPABASE_URL = "https://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

If using a private bucket, configure storage policies accordingly.

---

## EmailJS Setup

1. Create an EmailJS account at https://www.emailjs.com
2. Create a service and template
3. Update the public key in `index.html`:

```js
emailjs.init("YOUR_PUBLIC_KEY_HERE");
```

---

## Notes

- The "NEW" tag on skills is shown for 10 days from `created_at`.
- Admin pages are protected by Supabase Auth + guard logic in `js/admin-auth-guard.js`.

---

## Deployment

This is a static site and can be hosted on GitHub Pages, Netlify, Vercel, or any static hosting provider.

---

## License

Copyright 2025 Andrea Aston. All rights reserved.
