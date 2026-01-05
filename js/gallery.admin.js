// gallery.admin.js
document.addEventListener("DOMContentLoaded", () => {
    const projectSelect = document.getElementById("projectSelect");
    const container = document.getElementById("masonry");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const statusDiv = document.getElementById("uploadStatus");

    const viewer = document.getElementById("fullscreenViewer");
    const viewerImg = document.getElementById("fullscreenImage");
    const closeBtn = document.getElementById("fullscreenClose");
    let counter = document.getElementById("imageCounter");

    let currentImages = [];
    let currentIndex = 0;

    /* ===============================
       IMAGE COMPRESSION SETTINGS
    =============================== */
    const MAX_FILE_SIZE = 50 * 1024; // ~50 KB
    const MAX_WIDTH = 1400;

    async function compressImage(file) {
        return new Promise((resolve) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = () => img.src = reader.result;
            reader.readAsDataURL(file);

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = height * (MAX_WIDTH / width);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.8;
                let blob;

                do {
                    blob = dataURLToBlob(
                        canvas.toDataURL("image/jpeg", quality)
                    );
                    quality -= 0.05;
                } while (blob.size > MAX_FILE_SIZE && quality > 0.1);

                resolve(
                    new File([blob], file.name, { type: "image/jpeg" })
                );
            };
        });
    }

    function dataURLToBlob(dataURL) {
        const parts = dataURL.split(",");
        const binary = atob(parts[1]);
        const array = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
        }
        return new Blob([array], { type: "image/jpeg" });
    }

    // Create counter if missing
    if (!counter && viewer) {
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

    if (!window.supabaseClient) {
        console.error("⚠️ supabaseClient not loaded");
        if (statusDiv) {
            statusDiv.style.color = "red";
            statusDiv.textContent = "Supabase client not initialized - uploads disabled.";
        }
    }

    // -----------------------------
    // LOAD GALLERY
    // -----------------------------
    async function loadAdminGallery(project) {
        if (!container) return;

        container.innerHTML = '<p style="text-align:center;">Loading images...</p>';
        currentImages = [];

        const { data, error } = await supabaseClient.storage
            .from("gallery")
            .list(`${project}/`, { limit: 1000 });

        if (error) {
            console.error(error);
            container.innerHTML = '<p style="color:red;">Failed to load images.</p>';
            return;
        }
        if (!data?.length) {
            container.innerHTML = '<p>No images found for this project.</p>';
            return;
        }

        container.innerHTML = "";
        data.forEach((file) => {
            if (!/\.(jpe?g|png|webp)$/i.test(file.name)) return;

            const { data: urlData } = supabaseClient.storage
                .from("gallery")
                .getPublicUrl(`${project}/${file.name}`);

            if (!urlData?.publicUrl) return;

            const publicUrl = urlData.publicUrl;
            currentImages.push({ url: publicUrl, key: `${project}/${file.name}` });
            const imgIndex = currentImages.length - 1;

            const wrapper = document.createElement("div");
            wrapper.className = "admin-image-wrapper";

            const img = document.createElement("img");
            img.src = publicUrl;
            img.alt = file.name;
            img.className = "admin-gallery-img";
            img.style.cursor = "pointer";
            img.onclick = () => openViewer(imgIndex);

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.className = "btn btn-delete-small";
            delBtn.onclick = () =>
                deleteImage(currentImages[imgIndex].key, wrapper);

            wrapper.appendChild(img);
            wrapper.appendChild(delBtn);
            container.appendChild(wrapper);
        });
    }

    // -----------------------------
    // UPLOAD IMAGES (WITH COMPRESSION)
    // -----------------------------
    async function uploadImages() {
        if (!fileInput.files.length) {
            statusDiv.textContent = "❌ Please select files";
            statusDiv.style.color = "red";
            return;
        }

        const project = projectSelect.value;
        let success = 0, failed = 0;
        const total = fileInput.files.length;

        statusDiv.style.color = "#008080";
        statusDiv.textContent = `Uploading 0 of ${total}...`;

        for (let i = 0; i < total; i++) {
            const originalFile = fileInput.files[i];

            try {
                const compressedFile = await compressImage(originalFile);
                const name = `${project}/${Date.now()}-${compressedFile.name}`;

                const { error } = await supabaseClient.storage
                    .from("gallery")
                    .upload(name, compressedFile);

                if (error) {
                    failed++;
                    console.error("Upload error:", compressedFile.name, error);
                } else {
                    success++;
                }
            } catch (err) {
                failed++;
                console.error("Upload exception:", originalFile.name, err);
            }

            statusDiv.textContent =
                `Uploading ${i + 1} of ${total} (✅ ${success} ❌ ${failed})`;
        }

        fileInput.value = "";
        statusDiv.textContent =
            `✅ Upload complete! Successful: ${success} | Failed: ${failed}`;
        statusDiv.style.color = failed > 0 ? "orange" : "#008080";

        if (success > 0) {
            setTimeout(() => window.location.reload(), 3000);
        }
    }

    uploadBtn?.addEventListener("click", uploadImages);

    // -----------------------------
    // FULLSCREEN VIEWER
    // -----------------------------
    function openViewer(index) {
        currentIndex = index;
        updateViewer();
        if (!viewer) return;
        viewer.classList.add("active");
        viewer.style.opacity = "1";
        viewer.style.pointerEvents = "auto";
        document.querySelectorAll(".btn-delete-small")
            .forEach(btn => btn.style.display = "none");
    }

    function closeViewer() {
        if (!viewer) return;
        viewer.classList.remove("active");
        viewer.style.opacity = "0";
        viewer.style.pointerEvents = "none";
        document.querySelectorAll(".btn-delete-small")
            .forEach(btn => btn.style.display = "");
    }

    function updateViewer() {
        if (!viewerImg || !currentImages[currentIndex]) return;
        viewerImg.src = currentImages[currentIndex].url;
        if (counter)
            counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateViewer();
    }
    function prevImage() {
        currentIndex =
            (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateViewer();
    }

    closeBtn?.addEventListener("click", e => {
        e.stopPropagation();
        closeViewer();
    });

    viewerImg?.addEventListener("click", e => e.stopPropagation());
    viewer?.addEventListener("click", e => {
        if (e.target === viewer) closeViewer();
    });

    document.addEventListener("keydown", e => {
        if (!viewer?.classList.contains("active")) return;
        if (e.key === "Escape") closeViewer();
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
    });

    let touchStartX = 0;
    viewer?.addEventListener("touchstart",
        e => touchStartX = e.changedTouches[0].screenX
    );
    viewer?.addEventListener("touchend", e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextImage();
        if (touchEndX - touchStartX > 50) prevImage();
    });

    // -----------------------------
    // DELETE IMAGE
    // -----------------------------
    async function deleteImage(fileKey, wrapper) {
        if (!fileKey || !wrapper) return;

        const existing = document.querySelector(".delete-overlay");
        if (existing) existing.remove();

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
            const { error } = await supabaseClient.storage
                .from("gallery")
                .remove([fileKey]);

            if (error) {
                console.error(error);
                overlay.querySelector(".delete-card").textContent =
                    "❌ Failed to delete image";
                return;
            }

            wrapper.remove();
            currentImages =
                currentImages.filter(img => img.key !== fileKey);
            if (currentIndex >= currentImages.length) currentIndex = 0;
            updateViewer();
            overlay.remove();
        };
    }

    projectSelect?.addEventListener("change",
        () => loadAdminGallery(projectSelect.value)
    );
    loadAdminGallery(projectSelect.value);
});
