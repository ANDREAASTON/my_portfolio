document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) return;

    const list = document.getElementById("resumeAdminList");
    const form = document.getElementById("createResumeForm");
    const resumeCategory = document.getElementById("resumeCategory");
    const titleInput = document.getElementById("resumeTitle");
    const descriptionInput = document.getElementById("resumeDescription");
    const startYearInput = document.getElementById("resumeStartYear");
    const endYearInput = document.getElementById("resumeEndYear");
    const linksInput = document.getElementById("resumeLinks");
    const statusDiv = document.getElementById("resumeStatus");

    let editingItemId = null;
    let categoriesCache = [];

    /* ===============================
       OVERLAY HELPER
    =============================== */
    function createOverlay(html) {
        const overlay = document.createElement("div");
        overlay.className = "delete-overlay";
        overlay.innerHTML = html;
        document.body.appendChild(overlay);
        return overlay;
    }

    function autoClearStatus() {
        setTimeout(() => {
            statusDiv.textContent = "";
        }, 3000);
    }

    /* ===============================
       LOAD CATEGORIES
    =============================== */
    async function loadCategories() {
        const { data, error } = await supabaseClient
            .from("resume_categories")
            .select("*")
            .order("name");

        if (error) {
            statusDiv.textContent = "❌ Failed to load categories";
            statusDiv.style.color = "red";
            return;
        }

        categoriesCache = data;

        resumeCategory.innerHTML = `
            <option value="">Select category</option>
            <option value="__manage__">⚙ Manage Categories</option>
        `;

        data.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id;
            opt.textContent = cat.name;
            resumeCategory.appendChild(opt);
        });
    }

    /* ===============================
       MANAGE CATEGORIES OVERLAY
    =============================== */
    function openCategoryManager() {
        const rows = categoriesCache.map(cat => `
            <div class="form-group">
                <strong>${cat.name}</strong>
                <div style="margin-top:6px">
                    <button class="btn btn-small edit" data-id="${cat.id}">Edit</button>
                    <button class="btn btn-small danger" data-id="${cat.id}">Delete</button>
                </div>
            </div>
        `).join("");

        const overlay = createOverlay(`
            <div class="delete-card" style="max-width:420px">
                <strong>Manage Categories</strong>
                <div style="margin-top:10px;max-height:300px;overflow:auto">
                    ${rows || "<small>No categories</small>"}
                </div>
                <div class="delete-actions" style="margin-top:10px">
                    <button class="btn btn-small delete-cancel">Close</button>
                </div>
            </div>
        `);

        overlay.querySelector(".delete-cancel").onclick = () => overlay.remove();

        // EDIT CATEGORY
        overlay.querySelectorAll(".edit").forEach(btn => {
            btn.onclick = () => {
                const cat = categoriesCache.find(c => c.id == btn.dataset.id);

                const editOverlay = createOverlay(`
                    <div class="delete-card">
                        <strong>Edit Category</strong>
                        <input type="text" value="${cat.name}" id="editCatInput" style="margin-top:10px;width:100%">
                        <div class="delete-actions" style="margin-top:10px">
                            <button class="btn btn-small edit-confirm">Save</button>
                            <button class="btn btn-small delete-cancel">Cancel</button>
                        </div>
                    </div>
                `);

                editOverlay.querySelector(".delete-cancel").onclick = () => editOverlay.remove();

                editOverlay.querySelector(".edit-confirm").onclick = async () => {
                    const newName = editOverlay.querySelector("#editCatInput").value.trim();
                    if (!newName) return;

                    await supabaseClient
                        .from("resume_categories")
                        .update({ name: newName })
                        .eq("id", cat.id);

                    editOverlay.remove();
                    overlay.remove();
                    await loadCategories();
                    loadResumeItems();
                };
            };
        });

        // DELETE CATEGORY
        overlay.querySelectorAll(".danger").forEach(btn => {
            btn.onclick = async () => {
                const catId = btn.dataset.id;

                const { count } = await supabaseClient
                    .from("resume_items")
                    .select("*", { count: "exact", head: true })
                    .eq("category_id", catId);

                if (count > 0) {
                    statusDiv.textContent = "❌ Cannot delete category with items";
                    statusDiv.style.color = "red";
                    autoClearStatus();
                    return;
                }

                const confirmOverlay = createOverlay(`
                    <div class="delete-card">
                        <strong>Delete category?</strong>
                        <div class="delete-actions" style="margin-top:10px">
                            <button class="delete-confirm btn btn-small">Yes</button>
                            <button class="btn btn-small delete-cancel">Cancel</button>
                        </div>
                    </div>
                `);

                confirmOverlay.querySelector(".delete-cancel").onclick = () => confirmOverlay.remove();
                confirmOverlay.querySelector(".delete-confirm").onclick = async () => {
                    await supabaseClient
                        .from("resume_categories")
                        .delete()
                        .eq("id", catId);

                    confirmOverlay.remove();
                    overlay.remove();
                    await loadCategories();
                    loadResumeItems();
                };
            };
        });
    }

    /* ===============================
       LOAD RESUME ITEMS
    =============================== */
    async function loadResumeItems(filterCategoryId = null) {
        try {
            let query = supabaseClient
                .from("resume_items")
                .select("*, resume_categories(name)")
                .order("start_year", { ascending: false });

            if (filterCategoryId) query = query.eq("category_id", filterCategoryId);

            const { data, error } = await query;
            if (error) throw error;

            list.innerHTML = "";

            // Group by category
            const grouped = {};
            data.forEach(item => {
                const catName = item.resume_categories?.name || "Uncategorized";
                if (!grouped[catName]) grouped[catName] = [];
                grouped[catName].push(item);
            });

            Object.entries(grouped).forEach(([categoryName, items]) => {
                const group = document.createElement("div");
                group.className = "resume-admin-group";

                const heading = document.createElement("h3");
                heading.textContent = categoryName;
                group.appendChild(heading);

                const grid = document.createElement("div");
                grid.className = "resume-admin-grid";

                items.forEach(item => {
                    const linkHTML = item.links?.length
                        ? `<ul>${item.links.map(l => `<li><a href="${l.url}" target="_blank">${l.name}</a></li>`).join("")}</ul>`
                        : "";
                    const years = item.end_year ? `${item.start_year} - ${item.end_year}` : `${item.start_year} - Present`;

                    const row = document.createElement("div");
                    row.className = "resume-admin-row";
                    row.innerHTML = `
                        <div class="resume-admin-info">
                            <div class="resume-admin-title">${years} - ${item.title}</div>
                            <div class="resume-admin-desc">${item.description || ""}</div>
                            ${linkHTML}
                        </div>
                        <div class="resume-admin-actions">
                            <button class="btn btn-small edit">Edit</button>
                            <button class="btn btn-small danger">Delete</button>
                        </div>
                    `;

                    // EDIT ITEM
                    row.querySelector(".edit").onclick = () => {
                        resumeCategory.value = item.category_id || "";
                        titleInput.value = item.title;
                        descriptionInput.value = item.description;
                        startYearInput.value = item.start_year;
                        endYearInput.value = item.end_year || "";
                        linksInput.value = item.links?.map(l => `${l.name}|${l.url}`).join("; ") || "";
                        editingItemId = item.id;
                        form.querySelector("button").textContent = "Update Item";
                        statusDiv.textContent = `Editing "${item.title}"...`;
                        statusDiv.style.color = "#008080";
                        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                    };

                    // DELETE ITEM
                    row.querySelector(".danger").onclick = () => {
                        const overlay = createOverlay(`
                            <div class="delete-card">
                                <strong>Delete this item?</strong>
                                <small>${item.title}</small>
                                <div class="delete-actions" style="margin-top:8px">
                                    <button class="delete-confirm btn btn-small">Yes</button>
                                    <button class="btn btn-small delete-cancel">Cancel</button>
                                </div>
                            </div>
                        `);
                        overlay.querySelector(".delete-cancel").onclick = () => overlay.remove();
                        overlay.querySelector(".delete-confirm").onclick = async () => {
                            await supabaseClient.from("resume_items").delete().eq("id", item.id);
                            overlay.remove();
                            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                            loadResumeItems();
                        };
                    };

                    grid.appendChild(row);
                });

                group.appendChild(grid);
                list.appendChild(group);
            });
        } catch (err) {
            statusDiv.textContent = `Failed: ${err.message}`;
            statusDiv.style.color = "red";
        }
    }

    /* ===============================
       FORM SUBMIT (ADD / UPDATE)
    =============================== */
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const categoryId = Number(resumeCategory.value);
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const startYear = Number(startYearInput.value);
        const endYear = endYearInput.value ? Number(endYearInput.value) : null;

        // Convert simple link format to JSON
        let links = [];
        if (linksInput.value.trim()) {
            links = linksInput.value.split(";").map(l => {
                const [name, url] = l.split("|").map(x => x.trim());
                return { name, url };
            });
        }

        if (!categoryId || !title || !startYear) {
            statusDiv.textContent = "❌ Required fields missing";
            statusDiv.style.color = "red";
            autoClearStatus();
            return;
        }

        statusDiv.textContent = editingItemId ? "Updating item..." : "Adding item...";
        statusDiv.style.color = "#008080";

        try {
            if (editingItemId) {
                await supabaseClient
                    .from("resume_items")
                    .update({ category_id: categoryId, title, description, start_year: startYear, end_year: endYear, links })
                    .eq("id", editingItemId);
                statusDiv.textContent = "✅ Item updated!";
            } else {
                await supabaseClient
                    .from("resume_items")
                    .insert({ category_id: categoryId, title, description, start_year: startYear, end_year: endYear, links });
                statusDiv.textContent = "✅ Item added!";
            }

            statusDiv.style.color = "green";
            autoClearStatus();

            setTimeout(() => {
                form.reset();
                editingItemId = null;
                form.querySelector("button").textContent = "Add Item";
                loadResumeItems();
            }, 3000);
        } catch (err) {
            statusDiv.textContent = `❌ Failed: ${err.message}`;
            statusDiv.style.color = "red";
        }
    });

    /* ===============================
       CATEGORY CHANGE HANDLER
    =============================== */
    resumeCategory.addEventListener("change", () => {
        if (resumeCategory.value === "__manage__") {
            openCategoryManager();
            resumeCategory.value = "";
            return;
        }
        loadResumeItems(resumeCategory.value);
    });

    /* ===============================
       INIT
    =============================== */
    await loadCategories();
    loadResumeItems();
});

