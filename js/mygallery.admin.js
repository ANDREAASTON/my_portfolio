// mygallery.admin.js - Admin management for My Gallery (feature parity with project gallery)

document.addEventListener("DOMContentLoaded", async () => {

    if (!window.supabaseClient) {
        console.error("⚠️ supabaseClient not loaded");
        return;
    }

    const PROJECT_SLUG = "myGallery";

    // ---------------------------
    // ELEMENTS
    // ---------------------------
    const uploadForm = document.getElementById("galleryUploadForm");
    const fileInput = document.getElementById("galleryImages");
    const uploadStatus = document.getElementById("uploadStatus");
    const masonry = document.getElementById("adminGallery");

    const viewer = document.getElementById("fullscreenViewer");
    const viewerImg = document.getElementById("fullscreenImage");
    let closeBtn = document.getElementById("fullscreenClose");
    let counter = document.getElementById("imageCounter");

    let currentImages = [];
    let currentIndex = 0;

    // ---------------------------
    // LOAD IMAGES
    // ---------------------------
    async function loadGallery() {
        masonry.innerHTML = "<p>Loading images...</p>";
        currentImages = [];

        const { data: files, error } = await supabaseClient
            .storage
            .from("gallery")
            .list(PROJECT_SLUG, { limit: 1000 });

        if (error) {
            masonry.innerHTML = "<p style='color:red'>Failed to load images.</p>";
            console.error(error);
            return;
        }

        masonry.innerHTML = "";

        if (!files?.length) {
            masonry.innerHTML = "<p>No images uploaded yet.</p>";
            return;
        }

        files.forEach(file => {
            if (file.name === ".keep" || !/\.(jpe?g|png|webp)$/i.test(file.name)) return;

            const key = `${PROJECT_SLUG}/${file.name}`;
            const { data: urlData } = supabaseClient
                .storage
                .from("gallery")
                .getPublicUrl(key);

            if (!urlData?.publicUrl) return;

            const wrapper = document.createElement("div");
            wrapper.className = "admin-image-wrapper";

            const img = document.createElement("img");
            img.src = urlData.publicUrl;
            img.className = "admin-gallery-img";
            img.style.cursor = "pointer";

            const index = currentImages.length;
            img.onclick = () => openViewer(index);

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "btn btn-delete-small";
            delBtn.onclick = () => deleteImage(key, wrapper);

            wrapper.appendChild(img);
            wrapper.appendChild(delBtn);
            masonry.appendChild(wrapper);

            currentImages.push({ url: urlData.publicUrl, key });
        });
    }

        // ------------------------------------
    // IMAGE RESIZE + COMPRESSION
    // ------------------------------------
    async function compressImage(
        file,
        maxWidth = 1600,
        maxHeight = 1600,
        quality = 0.75
    ) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = e => img.src = e.target.result;
            reader.onerror = reject;

            img.onload = () => {
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(
                        maxWidth / width,
                        maxHeight / height
                    );
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    blob => {
                        if (!blob) {
                            reject("Compression failed");
                            return;
                        }

                        resolve(
                            new File([blob], file.name, {
                                type: "image/jpeg",
                                lastModified: Date.now()
                            })
                        );
                    },
                    "image/jpeg",
                    quality
                );
            };

            reader.readAsDataURL(file);
        });
    }


    // ---------------------------
    // UPLOAD IMAGES
    // ---------------------------
    uploadForm?.addEventListener("submit", async e => {
        e.preventDefault();
        if (!fileInput.files.length) return;

        uploadStatus.textContent = "Uploading...";
        uploadStatus.style.color = "#008080";

        let success = 0;
        let failed = 0;

        for (const file of fileInput.files) {
            try {
                const compressed = await compressImage(file);

                const path = `${PROJECT_SLUG}/${Date.now()}-${compressed.name}`;

                const { error } = await supabaseClient
                    .storage
                    .from("gallery")
                    .upload(path, compressed);

                if (error) {
                    failed++;
                    console.error(error);
                } else {
                    success++;
                }
            } catch (err) {
                failed++;
                console.error("Compression error:", err);
            }
        }


        fileInput.value = "";
        uploadStatus.textContent = `✅ Upload complete: ${success} success, ${failed} failed`;
        uploadStatus.style.color = failed ? "orange" : "#008080";

        if (success > 0) {
                setTimeout(() => window.location.reload(), 3000);
            }

        loadGallery();
    });

    // ---------------------------
    // FULLSCREEN VIEWER
    // ---------------------------
    function openViewer(index) {
        currentIndex = index;
        updateViewer();

        viewer.classList.add("active");
        viewer.style.opacity = "1";
        viewer.style.pointerEvents = "auto";

        document.querySelectorAll(".btn-delete-small").forEach(b => b.style.display = "none");

        // CLOSE BUTTON
        if (!closeBtn) {
            closeBtn = document.createElement("span");
            closeBtn.id = "fullscreenClose";
            closeBtn.innerHTML = "&times;";
            viewer.appendChild(closeBtn);
        }

        closeBtn.style.position = "absolute";
        closeBtn.style.top = "10px";
        closeBtn.style.right = "10px";
        closeBtn.style.fontSize = "28px";
        closeBtn.style.fontWeight = "bold";
        closeBtn.style.color = "#fff";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.background = "rgba(0,0,0,0.5)";
        closeBtn.style.padding = "4px 10px";
        closeBtn.style.borderRadius = "4px";
        closeBtn.style.zIndex = "1001";

        closeBtn.onclick = closeViewer;

        // COUNTER
        if (!counter) {
            counter = document.createElement("div");
            counter.id = "imageCounter";
            viewer.appendChild(counter);
        }

        counter.style.position = "absolute";
        counter.style.top = "10px";
        counter.style.right = "60px";
        counter.style.color = "#fff";
        counter.style.background = "rgba(0,0,0,0.5)";
        counter.style.padding = "4px 10px";
        counter.style.borderRadius = "4px";
        counter.style.fontWeight = "bold";
        counter.style.zIndex = "1000";

        updateCounter();
    }

    function closeViewer() {
        viewer.classList.remove("active");
        viewer.style.opacity = "0";
        viewer.style.pointerEvents = "none";
        document.querySelectorAll(".btn-delete-small").forEach(b => b.style.display = "");
    }

    function updateViewer() {
        if (!currentImages[currentIndex]) return;
        viewerImg.src = currentImages[currentIndex].url;
        updateCounter();
    }

    function updateCounter() {
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateViewer();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateViewer();
    }

    // ---------------------------
    // EVENTS
    // ---------------------------
    viewer?.addEventListener("click", e => { if (e.target === viewer) closeViewer(); });
    viewerImg?.addEventListener("click", e => e.stopPropagation());

    document.addEventListener("keydown", e => {
        if (!viewer.classList.contains("active")) return;
        if (e.key === "Escape") closeViewer();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    });

    let touchStartX = 0;
    viewer?.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
    viewer?.addEventListener("touchend", e => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (diff > 50) prevImage();
        if (diff < -50) nextImage();
    });

    // ---------------------------
    // DELETE IMAGE (CONFIRM OVERLAY)
    // ---------------------------
    async function deleteImage(fileKey, wrapper) {
        const overlay = document.createElement("div");
        overlay.className = "delete-overlay";
        overlay.innerHTML = `
            <div class="delete-card">
                <strong>Delete this image?</strong>
                <small>${fileKey.split("/").pop()}</small>
                <div class="delete-actions">
                    <button class="delete-confirm">Yes</button>
                    <button class="delete-cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector(".delete-cancel").onclick = () => overlay.remove();
        overlay.querySelector(".delete-confirm").onclick = async () => {
            const { error } = await supabaseClient
                .storage
                .from("gallery")
                .remove([fileKey]);

            if (error) {
                overlay.querySelector(".delete-card").textContent = "❌ Failed to delete image";
                console.error(error);
                return;
            }

            wrapper.remove();
            currentImages = currentImages.filter(i => i.key !== fileKey);
            if (currentIndex >= currentImages.length) currentIndex = 0;
            updateViewer();
            overlay.remove();
        };
    }

    loadGallery();
});
