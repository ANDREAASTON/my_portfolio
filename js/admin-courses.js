// admin-courses.js - Course Management with Category Filter, Inline Edit & Delete Overlay
document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) return;

    const list = document.getElementById("coursesAdminList");
    const form = document.getElementById("createCourseForm");
    const courseCategory = document.getElementById("courseCategory");
    const courseName = document.getElementById("courseName");
    const statusDiv = document.getElementById("courseStatus");

    let editingCourseId = null;

    // ===========================
    // LOAD CATEGORIES
    // ===========================
    async function loadCategories() {
        try {
            const { data, error } = await supabaseClient
                .from("course_categories")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;

            courseCategory.innerHTML = '<option value="">Select category</option>';
            data.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.id;
                option.textContent = cat.name;
                courseCategory.appendChild(option);
            });

        } catch (err) {
            console.error("Failed to load categories:", err);
            statusDiv.textContent = "❌ Failed to load categories";
            statusDiv.style.color = "red";
        }
    }

        // ===========================
    // LOAD COURSES
    // ===========================
    async function loadCourses() {
        try {
            const categoryFilter = Number(courseCategory.value) || null;

            let query = supabaseClient
                .from("courses")
                .select("id, course_name, category_id, course_categories(name)")
                .order("created_at", { ascending: false });

            if (categoryFilter) query = query.eq("category_id", categoryFilter);

            const { data, error } = await query;

            if (error) throw error;

            list.innerHTML = "";

            if (!data.length) {
                list.innerHTML = "<p>No courses available.</p>";
                return;
            }

            data.forEach(course => {
                const row = document.createElement("div");
                row.className = "form-group";

                const catName = course.course_categories?.name || "Uncategorized";

                row.innerHTML = `
                    <strong>${catName}</strong><br>
                    ${course.course_name}
                    <div style="margin-top:8px">
                        <button class="btn btn-small edit">Edit</button>
                        <button class="btn btn-small danger">Delete</button>
                    </div>
                `;

                // EDIT
                row.querySelector(".edit").onclick = () => {
                    courseCategory.value = String(course.category_id);
                    courseName.value = course.course_name;
                    editingCourseId = course.id;
                    form.querySelector("button[type='submit']").textContent = "Update Course";
                    statusDiv.textContent = `Editing "${course.course_name}"...`;
                    statusDiv.style.color = "#008080";
                };

                // DELETE
                row.querySelector(".danger").onclick = () => {
                    const overlay = document.createElement("div");
                    overlay.className = "delete-overlay";
                    overlay.innerHTML = `
                        <div class="delete-card">
                            <strong>Delete this course?</strong>
                            <small>${course.course_name}</small>
                            <div class="delete-actions" style="margin-top:8px">
                                <button class="delete-confirm btn btn-small">Yes</button>
                                <button class="delete-cancel btn btn-small">Cancel</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(overlay);

                    overlay.querySelector(".delete-cancel").onclick = () => overlay.remove();
                    overlay.querySelector(".delete-confirm").onclick = async () => {
                        const { error } = await supabaseClient
                            .from("courses")
                            .delete()
                            .eq("id", course.id);

                        if (error) {
                            alert("Failed to delete course: " + error.message);
                            overlay.remove();
                            return;
                        }

                        overlay.remove();
                        loadCourses(); // reload filtered courses
                    };
                };

                list.appendChild(row);
            });
        } catch (err) {
            statusDiv.textContent = `❌ Failed to load courses: ${err.message}`;
            statusDiv.style.color = "red";
        }
    }

    // ===========================
    // FORM SUBMIT
    // ===========================
        form.addEventListener("submit", async e => {
        e.preventDefault();

        const categoryId = Number(courseCategory.value);
        const name = courseName.value.trim();

        if (!categoryId || !name) {
            statusDiv.textContent = "❌ All fields are required.";
            statusDiv.style.color = "red";
            return;
        }

        statusDiv.textContent = editingCourseId ? "Updating course..." : "Adding course...";
        statusDiv.style.color = "#008080";

        try {
            if (editingCourseId) {
                const { error } = await supabaseClient
                    .from("courses")
                    .update({ category_id: categoryId, course_name: name })
                    .eq("id", editingCourseId);

                if (error) throw error;
                statusDiv.textContent = "✅ Course updated!";
            } else {
                const { error } = await supabaseClient
                    .from("courses")
                    .insert({ category_id: categoryId, course_name: name });

                if (error) throw error;
                statusDiv.textContent = "✅ Course added!";
            }

            // Reset form
            form.reset();
            editingCourseId = null;
            form.querySelector("button[type='submit']").textContent = "Add Course";

            // Reload courses
            loadCourses();

            // Clear success message after 3 seconds
            setTimeout(() => {
                statusDiv.textContent = "";
            }, 3000);

        } catch (err) {
            statusDiv.textContent = `❌ Failed: ${err.message}`;
            statusDiv.style.color = "red";
        }
    });

    // ===========================
    // RELOAD COURSES WHEN CATEGORY CHANGES
    // ===========================
    courseCategory.addEventListener("change", loadCourses);

    // ===========================
    // INITIAL LOAD
    // ===========================
    await loadCategories();
    loadCourses();
});
