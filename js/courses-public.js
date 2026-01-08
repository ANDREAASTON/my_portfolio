document.addEventListener("DOMContentLoaded", async () => {

    if (!window.supabaseClient) return;

    const container = document.getElementById("coursesContainer");
    const searchInput = document.getElementById("courseSearchInput");

    if (!container) return;

    let allCourses = []; // store all courses for filtering

    // ===========================
    // LOAD COURSES
    // ===========================
    async function loadCourses() {
        const { data, error } = await supabaseClient
            .from("courses")
            .select("*, course_categories(name)")
            .order("created_at", { ascending: false });

        if (error || !data.length) {
            container.innerHTML = "<p>No courses available.</p>";
            return;
        }

        allCourses = data; // store for search
        renderCourses(allCourses);
    }

    // ===========================
    // RENDER COURSES
    // ===========================
    function renderCourses(courses, highlight = "") {
        // Group by category
        const categories = {};
        courses.forEach(course => {
            const catName = course.course_categories?.name || "Uncategorized";
            if (!categories[catName]) categories[catName] = [];
            categories[catName].push(course);
        });

        container.innerHTML = "";

        Object.entries(categories).forEach(([categoryName, courses]) => {
            const catDiv = document.createElement("div");
            catDiv.className = "category-card";

            const title = document.createElement("h3");
            title.textContent = categoryName;
            catDiv.appendChild(title);

            const ul = document.createElement("ul");

            courses.forEach(course => {
                const li = document.createElement("li");

                // Highlight matched search
                if (highlight) {
                    const regex = new RegExp(`(${highlight})`, "gi");
                    li.innerHTML = course.course_name.replace(regex, `<mark>$1</mark>`);
                } else {
                    li.textContent = course.course_name;
                }

                ul.appendChild(li);
            });

            // Only append category if it has at least one course
            if (courses.length > 0) catDiv.appendChild(ul);

            if (ul.children.length > 0) container.appendChild(catDiv);
        });
    }

    // ===========================
    // SEARCH FUNCTION
    // ===========================
    searchInput.addEventListener("input", () => {
        const filter = searchInput.value.toLowerCase();

        if (!filter) {
            renderCourses(allCourses);
            return;
        }

        // Filter courses by name
        const filtered = allCourses.filter(course =>
            course.course_name.toLowerCase().includes(filter)
        );

        renderCourses(filtered, filter);
    });

    await loadCourses();
});
