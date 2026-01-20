document.addEventListener("DOMContentLoaded", async () => {

    if (!window.supabaseClient) return;

    const container = document.getElementById("skillsContainer");
    if (!container) return;

    const { data, error } = await supabaseClient
        .from("skills")
        .select("*, skill_categories(name)") // join category name
        .order("created_at", { ascending: false });

    if (error || !data.length) {
        container.innerHTML = "<p>No skills available.</p>";
        return;
    }

    container.innerHTML = "";

    // Group by category
    const categories = {};
    data.forEach(skill => {
        const catName = skill.skill_categories?.name || "Uncategorized";
        if (!categories[catName]) categories[catName] = [];
        categories[catName].push(skill);
    });

    Object.entries(categories).forEach(([categoryName, skills]) => {

        const catDiv = document.createElement("div");
        catDiv.className = "skill-category";

        const title = document.createElement("h3");
        title.textContent = categoryName;
        catDiv.appendChild(title);

        skills.forEach(skill => {
            const item = document.createElement("div");
            item.className = "skill-item";

            const label = document.createElement("span");
            label.textContent = skill.skill_name;

            // NEW label (30 days)
            const created = new Date(skill.created_at);
            const daysOld = (Date.now() - created.getTime()) / 86400000;
            if (daysOld <= 10) {
                const newTag = document.createElement("span");
                newTag.className = "skill-tag";
                newTag.textContent = "NEW";
                label.appendChild(newTag);
            }

            const bar = document.createElement("div");
            bar.className = "skill-bar";

            const progress = document.createElement("div");
            progress.className = "skill-progress";
            progress.dataset.width = `${skill.proficiency}%`;

            const percent = document.createElement("span");
            percent.className = "skill-percent";
            percent.textContent = `${skill.proficiency}%`;

            progress.appendChild(percent);
            bar.appendChild(progress);

            item.appendChild(label);
            item.appendChild(bar);

            catDiv.appendChild(item);
        });

        container.appendChild(catDiv);
    });

    // Animate bars
    setTimeout(() => {
        document.querySelectorAll(".skill-progress").forEach(bar => {
            bar.style.width = bar.dataset.width;
        });
    }, 200);
});
