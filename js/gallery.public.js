// gallery.public.js
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("masonry");
    const viewer = document.getElementById("fullscreenViewer");
    const fullscreenImg = document.getElementById("fullscreenImage");
    const closeBtn = document.getElementById("fullscreenClose");

    if (!container || !viewer || !fullscreenImg || !closeBtn) return;

    const project = container.dataset.project || "";
    let images = [];
    let currentIndex = 0;

    // Create counter
    let counter = viewer.querySelector("#imageCounter");
    if (!counter) {
        counter = document.createElement("div");
        counter.id = "imageCounter";
        counter.style.position = "absolute";
        counter.style.top = "10px";
        counter.style.right = "20px";
        counter.style.color = "#fff";
        counter.style.fontSize = "14px";
        counter.style.background = "rgba(0,0,0,0.4)";
        counter.style.padding = "2px 6px";
        counter.style.borderRadius = "4px";
        viewer.appendChild(counter);
    }

    async function loadGallery(project) {
        container.innerHTML = "<p style='text-align:center;'>Loading gallery...</p>";
        images = [];

        try {
            const { data, error } = await supabaseClient.storage
                .from("gallery")
                .list(`${project}/`, { limit: 1000 });

            if (error || !data?.length) {
                container.innerHTML = "<p style='text-align:center;'>No images found.</p>";
                return;
            }

            // 🔑 NEW: show newest images first
            data.reverse();

            container.innerHTML = "";

            data.forEach((file) => {
                if (!/\.(jpe?g|png|webp)$/i.test(file.name)) return;

                // Get public URL
                const { data: urlData } = supabaseClient.storage
                    .from("gallery")
                    .getPublicUrl(`${project}/${file.name}`);

                if (!urlData?.publicUrl) return;

                const publicUrl = urlData.publicUrl;
                images.push(publicUrl);

                const img = document.createElement("img");
                img.src = publicUrl;
                img.alt = file.name;
                img.style.cursor = "pointer";
                img.className = "public-gallery-img";

                const index = images.length - 1;
                img.addEventListener("click", () => openViewer(index));

                container.appendChild(img);
            });

        } catch (err) {
            console.error(err);
            container.innerHTML = "<p style='text-align:center;color:red;'>Failed to load gallery.</p>";
        }
    }

    function openViewer(index) {
        currentIndex = index;
        fullscreenImg.src = images[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
        viewer.classList.add("active");
        viewer.style.opacity = "1";
        viewer.style.pointerEvents = "auto";
    }

    function hideViewer() {
        viewer.classList.remove("active");
        viewer.style.opacity = "0";
        viewer.style.pointerEvents = "none";
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        fullscreenImg.src = images[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        fullscreenImg.src = images[currentIndex];
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    // Events
    closeBtn.addEventListener("click", hideViewer);
    viewer.addEventListener("click", (e) => {
        if (e.target === viewer) hideViewer();
    });

    document.addEventListener("keydown", (e) => {
        if (!viewer.classList.contains("active")) return;
        if (e.key === "Escape") hideViewer();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    });

    let touchStartX = 0;
    viewer.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
    viewer.addEventListener("touchend", e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextImage();
        if (touchEndX - touchStartX > 50) prevImage();
    });

    loadGallery(project);
});
