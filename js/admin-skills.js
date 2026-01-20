// admin-skills.js — Full Skill & Category Management (Overlay-based)

document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) return;

    const list = document.getElementById("skillsAdminList");
    const form = document.getElementById("createSkillForm");
    const skillCategory = document.getElementById("skillCategory");
    const skillName = document.getElementById("skillName");
    const skillProficiency = document.getElementById("skillProficiency");
    const statusDiv = document.getElementById("skillStatus");

    let editingSkillId = null;
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
            .from("skill_categories")
            .select("*")
            .order("name");

        if (error) {
            statusDiv.textContent = "❌ Failed to load categories";
            statusDiv.style.color = "red";
            return;
        }

        categoriesCache = data;

        skillCategory.innerHTML = `
            <option value="">Select category</option>
            <option value="__manage__">⚙ Manage Categories</option>
        `;

        data.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat.id;
            opt.textContent = cat.name;
            skillCategory.appendChild(opt);
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
                        .from("skill_categories")
                        .update({ name: newName })
                        .eq("id", cat.id);

                    editOverlay.remove();
                    overlay.remove();
                    await loadCategories();
                    loadSkills();
                };
            };
        });

        // DELETE CATEGORY
        overlay.querySelectorAll(".danger").forEach(btn => {
            btn.onclick = async () => {
                const catId = btn.dataset.id;

                const { count } = await supabaseClient
                    .from("skills")
                    .select("*", { count: "exact", head: true })
                    .eq("category_id", catId);

                if (count > 0) {
                    statusDiv.textContent = "❌ Cannot delete category with skills";
                    statusDiv.style.color = "red";
                    autoClearStatus();
                    return;
                }

                const confirmOverlay = createOverlay(`
                    <div class="delete-card">
                        <strong>Delete category?</strong>
                        <div class="delete-actions" style="margin-top:10px">
                            <button class="delete-confirm btn btn-small">Yes</button>
                            <button class="delete-cancel btn btn-small">Cancel</button>
                        </div>
                    </div>
                `);

                confirmOverlay.querySelector(".delete-cancel").onclick = () => confirmOverlay.remove();
                confirmOverlay.querySelector(".delete-confirm").onclick = async () => {
                    await supabaseClient
                        .from("skill_categories")
                        .delete()
                        .eq("id", catId);

                    confirmOverlay.remove();
                    overlay.remove();
                    await loadCategories();
                    loadSkills();
                };
            };
        });
    }

    /* ===============================
       LOAD SKILLS (FILTERED)
    =============================== */
    async function loadSkills() {
        let query = supabaseClient
            .from("skills")
            .select("*, skill_categories(name)")
            .order("created_at", { ascending: false });

        if (skillCategory.value && skillCategory.value !== "__manage__") {
            query = query.eq("category_id", skillCategory.value);
        }

        const { data, error } = await query;
        if (error) return;

        list.innerHTML = "";

        // Group by category
        const grouped = {};
        data.forEach(skill => {
            const catName = skill.skill_categories?.name || "Uncategorized";
            if (!grouped[catName]) grouped[catName] = [];
            grouped[catName].push(skill);
        });

        Object.entries(grouped).forEach(([categoryName, skills]) => {
            const group = document.createElement("div");
            group.className = "skills-admin-group";

            const heading = document.createElement("h3");
            heading.textContent = categoryName;
            group.appendChild(heading);

            const grid = document.createElement("div");
            grid.className = "skills-admin-grid";

            skills.forEach(skill => {
                const row = document.createElement("div");
                row.className = "skills-admin-row";

                const info = document.createElement("div");
                info.className = "skills-admin-info";
                info.textContent = `${skill.skill_name} - ${skill.proficiency}%`;

                const actions = document.createElement("div");
                actions.className = "skills-admin-actions";
                actions.innerHTML = `
                    <button class="btn btn-small edit">Edit</button>
                    <button class="btn btn-small danger">Delete</button>
                `;

                // EDIT SKILL
                actions.querySelector(".edit").onclick = () => {
                    skillCategory.value = skill.category_id;
                    skillName.value = skill.skill_name;
                    skillProficiency.value = skill.proficiency;
                    editingSkillId = skill.id;
                    form.querySelector("button").textContent = "Update Skill";
                };

                // DELETE SKILL
                actions.querySelector(".danger").onclick = () => {
                    const overlay = createOverlay(`
                        <div class="delete-card">
                            <strong>Delete skill?</strong>
                            <small>${skill.skill_name}</small>
                            <div class="delete-actions" style="margin-top:10px">
                                <button class="delete-confirm btn btn-small">Yes</button>
                                <button class="delete-cancel btn btn-small">Cancel</button>
                            </div>
                        </div>
                    `);

                    overlay.querySelector(".delete-cancel").onclick = () => overlay.remove();
                    overlay.querySelector(".delete-confirm").onclick = async () => {
                        await supabaseClient.from("skills").delete().eq("id", skill.id);
                        overlay.remove();
                        loadSkills();
                    };
                };

                row.appendChild(info);
                row.appendChild(actions);
                grid.appendChild(row);
            });

            group.appendChild(grid);
            list.appendChild(group);
        });

    }

    /* ===============================
       FORM SUBMIT
    =============================== */
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const categoryId = Number(skillCategory.value);
        const name = skillName.value.trim();
        const proficiency = Number(skillProficiency.value);

        if (!categoryId || !name || isNaN(proficiency)) {
            statusDiv.textContent = "❌ All fields required";
            statusDiv.style.color = "red";
            autoClearStatus();
            return;
        }

        if (editingSkillId) {
            await supabaseClient
                .from("skills")
                .update({ category_id: categoryId, skill_name: name, proficiency })
                .eq("id", editingSkillId);

            statusDiv.textContent = "✅ Skill updated";
        } else {
            await supabaseClient
                .from("skills")
                .insert({ category_id: categoryId, skill_name: name, proficiency });

            statusDiv.textContent = "✅ Skill added";
        }

        statusDiv.style.color = "green";
        autoClearStatus();

        setTimeout(() => {
            form.reset();
            editingSkillId = null;
            form.querySelector("button").textContent = "Add Skill";
            loadSkills();
        }, 3000);
    });

    /* ===============================
       CATEGORY CHANGE HANDLER
    =============================== */
    skillCategory.addEventListener("change", () => {
        if (skillCategory.value === "__manage__") {
            openCategoryManager();
            skillCategory.value = "";
            return;
        }
        loadSkills();
    });

    /* ===============================
       INIT
    =============================== */
    await loadCategories();
    loadSkills();
});

