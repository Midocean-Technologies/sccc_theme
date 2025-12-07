console.log("[SCCC] Onboarding redirect script initialized");

// Wait until boot info and router are ready
frappe.after_ajax(() => {

    console.log("[SCCC] Boot info:", frappe.boot.sccc_onboarding_required);

    // If onboarding required
    if (frappe.boot.sccc_onboarding_required) {

        const onboarding_page = "main-onboarding";
        const current_route = frappe.get_route();

        // Already on onboarding page → do nothing
        if (current_route && current_route.includes(onboarding_page)) return;

        console.log("[SCCC] Redirecting to onboarding...");
        frappe.set_route(onboarding_page);
    }

    // Attach route change listener
    if (frappe.router && frappe.router.on) {
        frappe.router.on("change", () => {
            if (frappe.boot.sccc_onboarding_required) {
                frappe.set_route("main-onboarding");
            }
        });
    } else {
        console.warn("[SCCC] frappe.router.on not available");
    }
});
