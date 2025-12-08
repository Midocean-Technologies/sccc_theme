(function () {
  function goHomeIfRoot() {
    try {
      const path = window.location.pathname || "";
      const hash = window.location.hash || "";

      const isRootApp = path === "/app" || path === "/app/" || path === "/desk" || path === "/" || path === "";
      const hasHashRoute = hash.replace(/^#/, "").trim().length > 0;

      if (isRootApp && !hasHashRoute) {
        // Try to use frappe.set_route if available, otherwise fallback to full redirect
        let tries = 0;
        const id = setInterval(() => {
          if (window.frappe && typeof frappe.set_route === "function") {
            try {
              frappe.set_route("home");
            } catch (e) {
              window.location.href = "/app/home";
            }
            clearInterval(id);
            return;
          }

          tries++;
          if (tries > 20) {
            // fallback after some attempts
            window.location.href = "/app/home";
            clearInterval(id);
          }
        }, 150);
      }
    } catch (e) {
      console.error("force_home.js error:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", goHomeIfRoot);
  } else {
    goHomeIfRoot();
  }
})();
