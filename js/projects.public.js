// projects.full.public.js - Load projects grid and full project page dynamically
document.addEventListener("DOMContentLoaded", async () => {

    if (!window.supabaseClient) {
        console.error("⚠️ Supabase client not loaded");
        return;
    }

    // ---------------------------
    // PROJECT GRID (all published projects)
    // ---------------------------
    const projectsGrid = document.getElementById("projectsGrid");
    if (projectsGrid) {
        projectsGrid.innerHTML = "<p>Loading projects...</p>";

        try {
            const { data: projects, error } = await supabaseClient
                .from("projects")
                .select("*")
                .eq("published", true)
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (!projects?.length) {
                projectsGrid.innerHTML = "<p>No projects available at the moment.</p>";
                return;
            }

            projectsGrid.innerHTML = ""; // clear loading text

            projects.forEach(project => {
                const card = document.createElement("div");
                card.className = "project-card";

                const imgDiv = document.createElement("div");
                imgDiv.className = "project-img";

                const img = document.createElement("img");
                img.src = project.cover_image || "wallpapers/placeholder.jpg";
                img.alt = project.title || "Project Image";
                imgDiv.appendChild(img);

                const contentDiv = document.createElement("div");
                contentDiv.className = "project-content";

                const title = document.createElement("h3");
                title.textContent = project.title || "Untitled Project";

                const desc = document.createElement("p");
                desc.textContent = project.short_description || "No description available.";

                const btn = document.createElement("a");
                btn.className = "btn btn-small";
                btn.textContent = "See More";
                btn.href = `project-details.html?slug=${project.slug}`;

                contentDiv.appendChild(title);
                contentDiv.appendChild(desc);
                contentDiv.appendChild(btn);

                card.appendChild(imgDiv);
                card.appendChild(contentDiv);

                projectsGrid.appendChild(card);
            });

        } catch (err) {
            console.error(err);
            projectsGrid.innerHTML = `<p style="color:red">Failed to load projects: ${err.message}</p>`;
        }
    }

    // ---------------------------
    // FULL PROJECT PAGE
    // ---------------------------
    const masonryContainer = document.getElementById("masonry");
    if (masonryContainer) {

        const urlParams = new URLSearchParams(window.location.search);
        const projectSlug = urlParams.get("slug");
        if (!projectSlug) {
            document.body.innerHTML = "<p style='color:red;text-align:center;margin-top:50px;'>Project not specified.</p>";
            return;
        }

        const projectTitle = document.getElementById("projectTitle");
        const projectDescription = document.getElementById("projectDescription");

        // Fullscreen viewer
        const viewer = document.getElementById("fullscreenViewer");
        const viewerImg = document.getElementById("fullscreenImage");
        const closeBtn = document.getElementById("fullscreenClose");

        // ----------------------
        // CREATE/STYLIZE IMAGE COUNTER
        // ----------------------
        let counter = document.getElementById("imageCounter");
        if (!counter && viewer) {
            counter = document.createElement("div");
            counter.id = "imageCounter";
            counter.innerText = `${currentIndex + 1} / ${galleryImages.length}`; // initial count

            viewer.appendChild(counter);

            // Style it like the close button
            counter.style.position = "absolute";
            counter.style.bottom = "20px";    // stick to bottom
            counter.style.right = "20px";     // stick to right
            counter.style.fontSize = "14px";
            counter.style.fontWeight = "bold";
            counter.style.color = "white";
            counter.style.background = "rgba(0,0,0,0.5)";
            counter.style.padding = "4px 8px";
            counter.style.borderRadius = "4px";
            counter.style.zIndex = "1001";
            counter.style.userSelect = "none"; // prevent selection
        }


        let galleryImages = [];
        let currentIndex = 0;

        try {
            // Fetch project
            const { data: project, error } = await supabaseClient
                .from("projects")
                .select("*")
                .eq("slug", projectSlug)
                .single();

            if (error || !project) throw new Error("Project not found");

            // Populate hero section with Markdown formatting
            projectTitle.textContent = project.title || "Untitled Project";
            projectDescription.innerHTML = project.full_description ? marked.parse(project.full_description) : "<p>No description available.</p>";

            // Load gallery
            masonryContainer.dataset.project = project.slug;
            masonryContainer.innerHTML = "<p>Loading images...</p>";

            const { data: files, error: galleryError } = await supabaseClient.storage
                .from("gallery")
                .list(project.slug, { limit: 1000 });

            if (galleryError) throw galleryError;

            if (!files?.length) {
                masonryContainer.innerHTML = "<p>No images uploaded.</p>";
            } else {
                masonryContainer.innerHTML = "";
                galleryImages = [];

                files.forEach(file => {
                    if (file.name === ".keep" || !/\.(jpe?g|png|webp)$/i.test(file.name)) return;

                    const { data: urlData } = supabaseClient.storage.from("gallery").getPublicUrl(`${project.slug}/${file.name}`);
                    if (!urlData?.publicUrl) return;

                    const wrapper = document.createElement("div");
                    wrapper.className = "project-image-wrapper";

                    const img = document.createElement("img");
                    img.src = urlData.publicUrl;
                    img.alt = file.name;
                    img.className = "project-gallery-img";
                    img.style.cursor = "pointer";

                    const index = galleryImages.length;
                    img.onclick = () => openViewer(index);

                    wrapper.appendChild(img);
                    masonryContainer.appendChild(wrapper);

                    galleryImages.push(urlData.publicUrl);
                });
            }

        } catch (err) {
            console.error(err);
            document.body.innerHTML = `<p style="color:red;text-align:center;margin-top:50px;">${err.message}</p>`;
        }

        // -----------------------------
        // Fullscreen Viewer Functions
        // -----------------------------
        function openViewer(index) {
            currentIndex = index;
            updateViewer();
            if (!viewer) return;

            viewer.classList.add("active");
            viewer.style.opacity = "1";
            viewer.style.pointerEvents = "auto";

            // ----------------------
            // CREATE/STYLIZE CLOSE BUTTON
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
            closeBtn.onclick = closeViewer;

            // ----------------------
            // CREATE/STYLIZE IMAGE COUNTER
            // ----------------------
            if (!counter) {
                counter = document.createElement("div");
                counter.id = "imageCounter";
                viewer.appendChild(counter);
            }

            counter.style.position = "absolute";
            counter.style.top = "10px";
            counter.style.right = "60px"; // space to the left of close button
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
        }

        function updateViewer() {
            if (!viewerImg || !galleryImages[currentIndex]) return;
            viewerImg.src = galleryImages[currentIndex];
            updateCounter();
        }

        function updateCounter() {
            if (!counter) return;
            counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
        }

        // ----------------------
        // NAVIGATION
        // ----------------------
        document.addEventListener("keydown", e => {
            if (!viewer?.classList.contains("active")) return;
            if (e.key === "Escape") closeViewer();
            if (e.key === "ArrowRight") { currentIndex = (currentIndex + 1) % galleryImages.length; updateViewer(); }
            if (e.key === "ArrowLeft") { currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length; updateViewer(); }
        });

        viewer?.addEventListener("click", e => { if (e.target === viewer) closeViewer(); });

        let touchStartX = 0;
        viewer?.addEventListener("touchstart", e => touchStartX = e.changedTouches[0].screenX);
        viewer?.addEventListener("touchend", e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) currentIndex = (currentIndex + 1) % galleryImages.length;
            if (touchEndX - touchStartX > 50) currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateViewer();
        });
     }

});
