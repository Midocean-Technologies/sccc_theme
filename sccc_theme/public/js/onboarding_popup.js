$(document).ready(function() {
    console.log((!frappe.boot.is_admin_or_client_admin));
    if (!frappe.boot.is_admin_or_client_admin) {
        return;
    }

    const ICON = {
        chevUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
        chevDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
        chevRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`,
    };
    frappe.call({
        method: "sccc_theme.utils.api.get_onboarding_checklist",
        callback: function (r) {
            if (!r.message) return;

            const checklist = r.message;

            const total = checklist.length;
            const completed = checklist.filter(s => s.completed === 1).length;

            // If all steps completed → do not show popup
            if (total > 0 && completed === total) {
                return;
            }

            const percent = Math.round((completed / total) * 100);

            // Create popup container
            let popup = document.createElement("div");
            popup.id = "client-admin-popup";
            popup.className = "sccc-onboarding-popup";
            popup.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 330px;
                background: #ffffff;
                border-radius: 0px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.12);
                z-index: 9999;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            `;

            // Header
            let header = document.createElement("div");
            header.style.cssText = `
                background: #f8f8f8;
                color: #7c7c7c;
                padding: 15px 20px 0px 20px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            header.innerHTML = `
                <div style="font-weight: 600; font-size: 15px;">get started checklist</div>
                <div class="sccc-popup-toggle" style="font-size: 18px;">${ICON.chevDown}</div>
            `;
            popup.appendChild(header);

            // Progress bar
            let progressContainer = document.createElement("div");
            progressContainer.style.cssText = `
                padding: 16px 20px;
                background: #f8f8f8;
            `;
            progressContainer.innerHTML = `
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="flex: 1; height: 10px; background: #e8d5f2; border-radius: 0px;">
                        <div style="width: ${percent}%; height: 100%; background: #812a99ff; border-radius: 0px;"></div>
                    </div>
                    <div style="font-size: 12px; font-weight: 600; color: #7c7c7c;">
                        ${completed}/${total} completed
                    </div>
                </div>
            `;
            popup.appendChild(progressContainer);

            // Content list
            let content = document.createElement("div");
            content.className = "sccc-popup-content";
            content.style.cssText = `
                max-height: 450px;
                overflow-y: auto;
                padding: 0;
            `;

            checklist.forEach((item, idx) => {
                let itemDiv = document.createElement("div");
                itemDiv.style.cssText = `
                    padding: 14px 20px;
                    cursor: pointer;
                `;

                const check =
                    item.completed
                        ? `<span style="width:22px;height:22px;background:#ec0552;color:#fff;border-radius:2px;display:flex;justify-content:center;align-items:center;">✓</span>`
                        : `<span style="width:22px;height:22px;border:2px solid #d1d5db;border-radius:2px;"></span>`;

                const titleStyle = item.completed
                    ? "text-decoration: line-through; color:#a3a3a3;"
                    : "color:#1a1a1a; font-weight:500;";

                itemDiv.innerHTML = `
                    <div style="display:flex;gap:12px;">
                        ${check}
                        <div style="flex:1;">
                            <div style="${titleStyle} font-size:13px;">${item.idx}. ${item.title}</div>
                        </div>
                        <div style="color:#c4c4c4;font-size:16px;">${ICON.chevDown}</div>
                    </div>
                `;

                content.appendChild(itemDiv);

                itemDiv.addEventListener("click", () => {
                    if (item.route) {
                        frappe.set_route(item.route);
                    }
                });
            });

            popup.appendChild(content);

            // Header toggle
            header.addEventListener("click", () => {
                const toggle = header.querySelector(".sccc-popup-toggle");
                if (content.style.display === "none") {
                    content.style.display = "block";
                    toggle.style.transform = "rotate(0deg)";
                } else {
                    content.style.display = "none";
                    toggle.style.transform = "rotate(180deg)";
                }
            });

            document.body.appendChild(popup);
        }
    });
});
