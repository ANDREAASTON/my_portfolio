// mygallery.js - Dedicated public gallery for "myGallery" project
document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) {
        console.error("⚠️ Supabase client not loaded");
        return;
    }

    const projectSlug = "myGallery";
    const masonryContainer = document.getElementById("masonry");
    const heroTitle = document.querySelector(".design3d-hero h1");

    if (!masonryContainer) return;

    // Update hero title
    if (heroTitle) heroTitle.textContent = "My Gallery";

    masonryContainer.dataset.project = projectSlug;
    masonryContainer.innerHTML = "<p>Loading images...</p>";

    let galleryImages = [];
    let currentIndex = 0;

    // Fullscreen viewer
    let viewer = document.getElementById("fullscreenViewer");
    let viewerImg = document.getElementById("fullscreenImage");
    let closeBtn = document.getElementById("fullscreenClose");
    let counter = document.getElementById("imageCounter");

    // Create fullscreen viewer if it doesn't exist
    if (!viewer) {
        viewer = document.createElement("div");
        viewer.id = "fullscreenViewer";
        viewer.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s; z-index: 9999;
        `;

        viewerImg = document.createElement("img");
        viewerImg.id = "fullscreenImage";
        viewerImg.style.maxWidth = "90%";
        viewerImg.style.maxHeight = "90%";
        viewer.appendChild(viewerImg);

        // Close button
        closeBtn = document.createElement("div");
        closeBtn.id = "fullscreenClose";
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cssText = `
            position: absolute; top: 15px; right: 20px; color: white; font-size: 32px;
            cursor: pointer; z-index: 10000;
        `;
        viewer.appendChild(closeBtn);
        
        document.body.appendChild(viewer);
    }

    // -----------------------------
    // Load images from Supabase
    // -----------------------------
    try {
        const { data: files, error } = await supabaseClient.storage
            .from("gallery")
            .list(projectSlug, { limit: 1000 });
        if (error) throw error;

        if (!files?.length) {
            masonryContainer.innerHTML = "<p>No images uploaded.</p>";
            return;
        }

        masonryContainer.innerHTML = "";
        galleryImages = [];

        files.forEach(file => {
            if (file.name === ".keep" || !/\.(jpe?g|png|webp)$/i.test(file.name)) return;

            const { data: urlData } = supabaseClient.storage.from("gallery").getPublicUrl(`${projectSlug}/${file.name}`);
            if (!urlData?.publicUrl) return;

            const wrapper = document.createElement("div");
            wrapper.className = "project-image-wrapper";

            const img = document.createElement("img");
            img.src = urlData.publicUrl;
            img.alt = file.name;
            img.className = "project-gallery-img";
            img.style.cursor = "pointer";
            const index = galleryImages.length;
            img.onclick = () => openViewer(index); // OPEN VIEWER

            wrapper.appendChild(img);
            masonryContainer.appendChild(wrapper);

            galleryImages.push(urlData.publicUrl);
        });

    } catch (err) {
        console.error(err);
        masonryContainer.innerHTML = `<p style="color:red">Failed to load gallery: ${err.message}</p>`;
    }

    // -----------------------------
    // Fullscreen Viewer Functions
    // -----------------------------
    function openViewer(index) {
        currentIndex = index;
        updateViewer();
        viewer.classList.add("active");
        viewer.style.opacity = "1";
        viewer.style.pointerEvents = "auto";
    }

    function closeViewer() {
        viewer.classList.remove("active");
        viewer.style.opacity = "0";
        viewer.style.pointerEvents = "none";
    }

    function updateViewer() {
        if (!viewerImg || !galleryImages[currentIndex]) return;
        viewerImg.src = galleryImages[currentIndex];
        updateCounter(); // Update counter on each view change
    }

    function updateCounter() {
        if (!counter) return;
        counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateViewer();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateViewer();
    }

    // -----------------------------
    // Event listeners
    // -----------------------------
    closeBtn?.addEventListener("click", closeViewer);
    viewerImg?.addEventListener("click", e => e.stopPropagation());
    viewer?.addEventListener("click", e => { if (e.target === viewer) closeViewer(); });

    document.addEventListener("keydown", e => {
        if (!viewer?.classList.contains("active")) return;
        if (e.key === "Escape") closeViewer();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    });

    // -----------------------------
    // Mobile swipe support
    // -----------------------------
    let touchStartX = 0;
    viewer?.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
    viewer?.addEventListener("touchend", e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextImage();
        if (touchEndX - touchStartX > 50) prevImage();
    });
});
