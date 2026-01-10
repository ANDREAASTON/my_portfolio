// admin.project.js - Unified Project Management System (RLS SAFE)
document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // SUPABASE + AUTH CHECK
    // ==========================================
    if (!window.supabaseClient) {
        console.error("⚠️ supabaseClient not loaded");
        return;
    }

    const {
        data: { user },
        error: authError
    } = await supabaseClient.auth.getUser();
    const isAuthenticated = !!user;

    // ==========================================
    // PAGE ELEMENTS
    // ==========================================
    const createForm = document.getElementById("createProjectForm");
    const editForm = document.getElementById("editProjectForm");
    const projectsList = document.getElementById("projectsList");
    const coverSelectionContainer = document.getElementById("coverSelection");
    const galleryProjectSelect = document.getElementById("projectSelect");
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    const uploadStatus = document.getElementById("uploadStatus");
    const masonryContainer = document.getElementById("masonry");

    const viewer = document.getElementById("fullscreenViewer");
    const viewerImg = document.getElementById("fullscreenImage");
    const closeBtn = document.getElementById("fullscreenClose");
    let counter = document.getElementById("imageCounter");

    let currentImages = [];
    let currentIndex = 0;

    // ===============================
    // UTILITY FUNCTIONS
    // ===============================
    function generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    // ===============================
    // IMAGE COMPRESSION
    // ===============================
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
                    blob = dataURLToBlob(canvas.toDataURL("image/jpeg", quality));
                    quality -= 0.05;
                } while (blob.size > MAX_FILE_SIZE && quality > 0.1);

                resolve(new File([blob], file.name, { type: "image/jpeg" }));
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

    // ===============================
    // CREATE PROJECT PAGE
    // ===============================
    if (createForm && isAuthenticated) {
        const titleInput = document.getElementById("projectTitle");
        const slugPreview = document.getElementById("slugPreview");
        const shortDescInput = document.getElementById("shortDescription");
        const fullDescInput = document.getElementById("fullDescription");
        const statusDiv = document.getElementById("createStatus");

        titleInput?.addEventListener("input", () => {
            slugPreview.textContent = generateSlug(titleInput.value) || "(slug will appear here)";
        });

        createForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const title = titleInput.value.trim();
            const slug = generateSlug(title);
            const shortDesc = shortDescInput.value.trim();
            const fullDesc = fullDescInput.value.trim();
            if (!title || !slug || !shortDesc || !fullDesc) {
                statusDiv.textContent = "❌ All fields are required";
                statusDiv.style.color = "red";
                return;
            }

            statusDiv.textContent = "Creating project...";
            statusDiv.style.color = "#008080";

            const { data: project, error } = await supabaseClient
                .from("projects")
                .insert([{
                    title, slug, short_description: shortDesc,
                    full_description: fullDesc, cover_image: null,
                    published: false, owner_id: user.id
                }])
                .select()
                .single();

            if (error) {
                statusDiv.textContent = `❌ Failed: ${error.message}`;
                statusDiv.style.color = "red";
                return;
            }

            const dummyFile = new Blob([""], { type: "text/plain" });
            await supabaseClient.storage.from("gallery").upload(`${slug}/.keep`, dummyFile);

            statusDiv.textContent = "✅ Project created! Redirecting...";
            setTimeout(() => window.location.href = `admin-projects-gallery.html?project=${slug}`, 1500);
        });
    }

    // ===============================
    // EDIT PROJECT PAGE
    // ===============================
    if (editForm && isAuthenticated) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectSlug = urlParams.get("slug");
        const titleInput = document.getElementById("editTitle");
        const slugDisplay = document.getElementById("editSlug");
        const shortDescInput = document.getElementById("editShortDescription");
        const fullDescInput = document.getElementById("editFullDescription");
        const publishedCheckbox = document.getElementById("editPublished");
        const statusDiv = document.getElementById("editStatus");
        const currentCoverImg = document.getElementById("currentCover");
        let projectId = null;

        async function loadProject() {
            if (!projectSlug) return;
            const { data, error } = await supabaseClient
                .from("projects")
                .select("*")
                .eq("slug", projectSlug)
                .single();
            if (error || !data) {
                statusDiv.textContent = "❌ Project not found";
                statusDiv.style.color = "red";
                return;
            }
            projectId = data.id;
            titleInput.value = data.title;
            slugDisplay.textContent = data.slug;
            shortDescInput.value = data.short_description;
            fullDescInput.value = data.full_description;
            publishedCheckbox.checked = data.published;

            if (data.cover_image) {
                currentCoverImg.src = data.cover_image;
                currentCoverImg.style.display = "block";
                currentCoverImg.style.maxWidth = "300px";
                currentCoverImg.style.marginTop = "10px";
            } else {
                currentCoverImg.style.display = "none";
            }

            if (data.created_at) {
                const dateElem = document.createElement("p");
                dateElem.textContent = `Created on: ${new Date(data.created_at).toLocaleString()}`;
                slugDisplay.parentElement.appendChild(dateElem);
            }
        }

        loadProject();

        editForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!projectId) return;

            statusDiv.textContent = "Updating...";
            statusDiv.style.color = "#008080";

            const { error } = await supabaseClient
                .from("projects")
                .update({
                    title: titleInput.value.trim(),
                    short_description: shortDescInput.value.trim(),
                    full_description: fullDescInput.value.trim(),
                    published: publishedCheckbox.checked
                })
                .eq("id", projectId);

            if (error) {
                statusDiv.textContent = `❌ Update failed: ${error.message}`;
                statusDiv.style.color = "red";
                return;
            }

            statusDiv.textContent = "✅ Updated!";
            setTimeout(() => window.location.href = "admin-projects.html", 1500);
        });
    }

    // ===============================
    // GALLERY: LOAD, UPLOAD WITH PROGRESS, VIEW, DELETE
    // ===============================
    if (galleryProjectSelect) {

        async function populateProjectDropdown() {
            const { data, error } = await supabaseClient
                .from("projects")
                .select("slug, title")
                .order("title", { ascending: true });
            if (!data || error) return;

            galleryProjectSelect.innerHTML = "";
            data.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.slug;
                opt.textContent = p.title;
                galleryProjectSelect.appendChild(opt);
            });

            const preSelected = new URLSearchParams(window.location.search).get("project");
            if (preSelected) galleryProjectSelect.value = preSelected;
        }

        await populateProjectDropdown();

        async function loadGalleryImages(projectSlug) {
            if (!masonryContainer) return;

            masonryContainer.innerHTML = "Loading images...";
            currentImages = [];

            const { data: files, error } = await supabaseClient.storage.from("gallery").list(projectSlug, { limit: 1000 });
            if (error) return masonryContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
            if (!files?.length) return masonryContainer.innerHTML = "<p>No images uploaded.</p>";

            masonryContainer.innerHTML = "";
            files.forEach(file => {
                if (file.name === ".keep" || !/\.(jpe?g|png|webp)$/i.test(file.name)) return;

                const { data: urlData } = supabaseClient.storage.from("gallery").getPublicUrl(`${projectSlug}/${file.name}`);
                if (!urlData?.publicUrl) return;

                const wrapper = document.createElement("div");
                wrapper.className = "admin-image-wrapper";

                const img = document.createElement("img");
                img.src = urlData.publicUrl;
                img.alt = file.name;
                img.className = "admin-gallery-img";
                img.style.cursor = "pointer";
                const index = currentImages.length;
                img.onclick = () => openViewer(index);

                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete";
                delBtn.className = "btn btn-delete-small";
                delBtn.onclick = () => deleteImage(`${projectSlug}/${file.name}`, wrapper);

                wrapper.appendChild(img);
                wrapper.appendChild(delBtn);
                masonryContainer.appendChild(wrapper);

                currentImages.push({ url: urlData.publicUrl, key: `${projectSlug}/${file.name}` });
            });
        }

        galleryProjectSelect.addEventListener("change", () => loadGalleryImages(galleryProjectSelect.value));
        if (galleryProjectSelect.value) loadGalleryImages(galleryProjectSelect.value);

        // ===============================
        // UPLOAD WITH PROGRESS & COMPRESSION
        // ===============================
        async function uploadImages() {
            const project = galleryProjectSelect.value;
            if (!project || !fileInput.files.length) {
                uploadStatus.textContent = "❌ Select project and files.";
                uploadStatus.style.color = "red";
                return;
            }

            const total = fileInput.files.length;
            let success = 0, failed = 0;
            uploadStatus.style.color = "#008080";

            for (let i = 0; i < total; i++) {
                const file = fileInput.files[i];
                try {
                    const compressed = await compressImage(file);
                    const name = `${project}/${Date.now()}-${compressed.name}`;

                    const { error } = await supabaseClient.storage.from("gallery").upload(name, compressed);
                    if (error) { failed++; console.error(error); }
                    else success++;

                } catch (err) { failed++; console.error(err); }

                uploadStatus.textContent = `Uploading ${i + 1} / ${total} (✅${success} ❌${failed})`;
            }

            fileInput.value = "";
            uploadStatus.textContent = `✅ Upload complete: ${success} success, ${failed} failed`;
            uploadStatus.style.color = failed > 0 ? "orange" : "#008080";

                
            if (success > 0) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }

        uploadBtn?.addEventListener("click", uploadImages);

        // ===============================
        // FULLSCREEN VIEWER
        // ===============================
        function openViewer(index) {
            currentIndex = index;
            updateViewer();
            if (!viewer) return;

            viewer.classList.add("active");
            viewer.style.opacity = "1";
            viewer.style.pointerEvents = "auto";
            document.querySelectorAll(".btn-delete-small").forEach(btn => btn.style.display = "none");

            // ----------------------
            // CREATE STYLED CLOSE BUTTON
            // ----------------------
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
            closeBtn.style.color = "white";
            closeBtn.style.cursor = "pointer";
            closeBtn.style.background = "rgba(0,0,0,0.5)";
            closeBtn.style.padding = "4px 10px";
            closeBtn.style.borderRadius = "4px";
            closeBtn.style.zIndex = "1001";

            closeBtn.onclick = () => closeViewer();

            // ----------------------
            // CREATE STYLED IMAGE COUNTER
            // ----------------------
            if (!counter) {
                counter = document.createElement("div");
                counter.id = "imageCounter";
                viewer.appendChild(counter);
            }

            counter.style.position = "absolute";
            counter.style.top = "10px";
            counter.style.right = "60px"; // leave space next to close button
            counter.style.color = "white";
            counter.style.background = "rgba(0,0,0,0.5)";
            counter.style.padding = "4px 10px";
            counter.style.borderRadius = "4px";
            counter.style.fontSize = "14px";
            counter.style.fontWeight = "bold";
            counter.style.zIndex = "1000";

            updateCounter();
        }

        function closeViewer() {
            if (!viewer) return;
            viewer.classList.remove("active");
            viewer.style.opacity = "0";
            viewer.style.pointerEvents = "none";
            document.querySelectorAll(".btn-delete-small").forEach(btn => btn.style.display = "");
        }

        function updateViewer() {
            if (!viewerImg || !currentImages[currentIndex]) return;
            viewerImg.src = currentImages[currentIndex].url;
            updateCounter();
        }

        // ----------------------
        // IMAGE COUNTER UPDATE FUNCTION
        // ----------------------
        function updateCounter() {
            if (!counter) return;
            counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }

        function nextImage() { currentIndex = (currentIndex + 1) % currentImages.length; updateViewer(); }
        function prevImage() { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateViewer(); }

        viewerImg?.addEventListener("click", e => e.stopPropagation());
        viewer?.addEventListener("click", e => { if (e.target === viewer) closeViewer(); });
        document.addEventListener("keydown", e => {
            if (!viewer?.classList.contains("active")) return;
            if (e.key === "Escape") closeViewer();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        });

        let touchStartX = 0;
        viewer?.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
        viewer?.addEventListener("touchend", e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) nextImage();
            if (touchEndX - touchStartX > 50) prevImage();
        });

        // ===============================
        // DELETE IMAGE
        // ===============================
        async function deleteImage(fileKey, wrapper) {
            if (!fileKey || !wrapper) return;

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
                </div>`;
            document.body.appendChild(overlay);

            overlay.querySelector(".delete-cancel").onclick = () => overlay.remove();
            overlay.querySelector(".delete-confirm").onclick = async () => {
                const { error } = await supabaseClient.storage.from("gallery").remove([fileKey]);
                if (error) {
                    overlay.querySelector(".delete-card").textContent = "❌ Failed to delete image";
                    console.error(error);
                    return;
                }
                wrapper.remove();
                currentImages = currentImages.filter(img => img.key !== fileKey);
                if (currentIndex >= currentImages.length) currentIndex = 0;
                updateViewer();
                overlay.remove();
            };
        }
    }

        // ==========================================
        // PAGE: MANAGE PROJECTS LIST
        // ==========================================
        if (projectsList) {

            async function loadAllProjects() {
                try {
                    const { data, error } = await supabaseClient
                        .from("projects")
                        .select("*")
                        .order("created_at", { ascending: false });

                    if (error) throw error;

                    if (!data || data.length === 0) {
                        projectsList.innerHTML = "<p>No projects found.</p>";
                        return;
                    }

                    projectsList.innerHTML = "";

                    data.forEach(project => {
                        const card = document.createElement("div");
                        card.className = "project-card";

                        card.innerHTML = `
                            <div class="project-card-header">
                                <h3>${project.title}</h3>
                                <span class="project-status ${project.published ? "published" : "unpublished"}">
                                    ${project.published ? "Published" : "Unpublished"}
                                </span>
                            </div>

                            <div class="project-slug">/${project.slug}</div>

                            <div class="project-actions">
                                <button class="btn btn-small btn-outline"
                                    onclick="location.href='admin-edit.html?slug=${project.slug}'">
                                    Edit
                                </button>

                                <button class="btn btn-small btn-secondary"
                                    onclick="location.href='admin-projects-gallery.html?project=${project.slug}'">
                                    Gallery
                                </button>

                                <button class="btn btn-small btn-primary"
                                    onclick="location.href='admin-cover.html?slug=${project.slug}'">
                                    Cover
                                </button>

                                <button class="btn btn-small danger btn-danger"
                                    data-id="${project.id}"
                                    data-slug="${project.slug}">
                                    Delete
                                </button>
                            </div>
                        `;

                        // DELETE HANDLER
                        card.querySelector(".btn-danger").onclick = () =>
                            confirmDeleteProject(project.id, project.slug);

                        projectsList.appendChild(card);
                    });

                } catch (err) {
                    console.error("Failed to load projects:", err);
                    projectsList.innerHTML =
                        `<p style="color:red;">Error loading projects</p>`;
                }
            }

            loadAllProjects();

            // ==========================================
            // DELETE PROJECT (DB + STORAGE)
            // ==========================================
            async function confirmDeleteProject(projectId, projectSlug) {
                const overlay = document.createElement("div");
                overlay.className = "delete-overlay";

                overlay.innerHTML = `
                    <div class="delete-card">
                        <strong>Delete Project?</strong>
                        <p>This will permanently delete the project and all images.</p>
                        <div class="delete-actions">
                            <button class="delete-confirm btn btn-small btn-danger">Yes, Delete</button>
                            <button class="delete-cancel btn btn-small">Cancel</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);

                overlay.querySelector(".delete-cancel").onclick = () => overlay.remove();

                overlay.querySelector(".delete-confirm").onclick = async () => {
                    overlay.querySelector(".delete-card").innerHTML = "<p>Deleting project...</p>";

                    try {
                        // Delete gallery images
                        const { data: files } = await supabaseClient
                            .storage
                            .from("gallery")
                            .list(projectSlug, { limit: 1000 });

                        if (files?.length) {
                            const paths = files.map(f => `${projectSlug}/${f.name}`);
                            await supabaseClient.storage.from("gallery").remove(paths);
                        }

                        // Delete project row
                        const { error } = await supabaseClient
                            .from("projects")
                            .delete()
                            .eq("id", projectId);

                        if (error) throw error;

                        overlay.remove();
                        loadAllProjects();

                    } catch (err) {
                        console.error("Delete failed:", err);
                        overlay.querySelector(".delete-card").innerHTML =
                            "<p style='color:red'>Failed to delete project.</p>";
                    }
                };
            }
        }

   
     // ==========================================
    // PAGE: ADMIN COVER SELECTION
    // ==========================================
    if (coverSelectionContainer) {
        if (!isAuthenticated) {
            alert("You must be logged in to select a cover image.");
            window.location.href = "loginpage.html";
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const projectSlug = urlParams.get("slug");

        if (!projectSlug) {
            coverSelectionContainer.innerHTML = "<p style='color:red'>No project selected.</p>";
        } else {

            async function loadCoverImages() {
                coverSelectionContainer.innerHTML = "Loading images...";

                const { data: files, error } = await supabaseClient.storage
                    .from("gallery")
                    .list(projectSlug, { limit: 100, offset: 0 });

                if (error) {
                    coverSelectionContainer.innerHTML = `<p style="color:red">Error loading images: ${error.message}</p>`;
                    console.error("Cover load error:", error);
                    return;
                }

                if (!files || files.length === 0) {
                    coverSelectionContainer.innerHTML = "<p>No images uploaded yet.</p>";
                    return;
                }

                coverSelectionContainer.innerHTML = "";

                for (const file of files) {
                    if (file.name === ".keep") continue;

                    const { data: publicUrl } = supabaseClient.storage
                        .from("gallery")
                        .getPublicUrl(`${projectSlug}/${file.name}`);

                    const imgWrapper = document.createElement("div");
                    imgWrapper.className = "cover-item-wrapper";

                    const img = document.createElement("img");
                    img.src = publicUrl.publicUrl;
                    img.alt = file.name;
                    img.className = "cover-item";

                    const btn = document.createElement("button");
                    btn.textContent = "Set as Cover";
                    btn.className = "btn btn-small";
                    btn.addEventListener("click", async () => {
                        coverStatus.textContent = "Updating cover image...";
                        coverStatus.style.color = "#008080";

                        const { error } = await supabaseClient
                            .from("projects")
                            .update({ cover_image: publicUrl.publicUrl })
                            .eq("slug", projectSlug);

                        if (error) {
                            coverStatus.textContent = `❌ Failed to set cover: ${error.message}`;
                            coverStatus.style.color = "red";
                        } else {
                            coverStatus.textContent = "✅ Cover image updated!";
                            coverStatus.style.color = "#008080";
                        }
                    });

                    imgWrapper.appendChild(img);
                    imgWrapper.appendChild(btn);
                    coverSelectionContainer.appendChild(imgWrapper);
                }
            }

            loadCoverImages();
        }
    }

    // ===============================
    // LOGOUT BUTTON
    // ===============================
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await supabaseClient.auth.signOut();      // 1️⃣ End Supabase session
            localStorage.removeItem("adminAuth");     // 2️⃣ Clear admin flag
            window.location.href = "loginpage.html";  // 3️⃣ Redirect to login
        });
    }


});
