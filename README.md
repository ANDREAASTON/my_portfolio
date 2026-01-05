# Andrea Aston — Portfolio Website

A modern, responsive personal portfolio showcasing projects, skills, and design work by Andrea Aston (Electronics & Computer Engineering student).

---

## 🚀 Project Overview

This repository contains the static portfolio site for Andrea Aston. The site is a simple, self-contained static website that uses HTML, CSS, and JavaScript with optional Supabase-backed image storage for the gallery and admin upload functionality.

Key pages:
- Home (`index.html`)
- About (`aboutpage.html`)
- Skills (`skillspage.html`)
- Resume (`resumepage.html`)
- Projects (multiple pages in `/projects`)
- Gallery (`myGallery/myGallery.html`)
- Admin panel (`admin.html`) for uploading gallery images

---

## 🧰 Tech Stack

- HTML5, CSS3, JavaScript
- Supabase Storage (optional) for gallery backend
- EmailJS for contact form
- Font Awesome, Google Fonts

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
