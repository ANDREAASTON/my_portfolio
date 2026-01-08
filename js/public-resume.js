document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) return;

    const container = document.getElementById("resumeTimeline"); // add this ID in public HTML

    const { data, error } = await supabaseClient
        .from("resume_items")
        .select("*, resume_categories(name)")
        .order("start_year", { ascending: false });

    if (error || !data.length) {
        container.innerHTML = "<p>No resume items available.</p>";
        return;
    }

    // Group by year
    const itemsByYear = {};
    data.forEach(item => {
        const yearKey = item.end_year ? item.end_year : new Date().getFullYear();
        if (!itemsByYear[yearKey]) itemsByYear[yearKey] = [];
        itemsByYear[yearKey].push(item);
    });

    container.innerHTML = "";

    Object.keys(itemsByYear).sort((a, b) => b - a).forEach(year => {
        itemsByYear[year].forEach(item => {
            const div = document.createElement("div");
            div.className = "timeline-item";

            const years = item.end_year ? `${item.start_year} - ${item.end_year}` : `${item.start_year} - Present`;
            const linksHTML = item.links?.length ? `<ul>${item.links.map(l => `<li><a href="${l.url}" target="_blank">${l.name}</a></li>`).join("")}</ul>` : "";

            div.innerHTML = `
                <span class="timeline-date">${years}</span>
                <div class="timeline-card">
                    <h3>${item.title}${item.resume_categories?.name ? ` — ${item.resume_categories.name}` : ""}</h3>
                    <p>${item.description || ""}</p>
                    ${linksHTML}
                </div>
            `;

            container.appendChild(div);
        });
    });
});
