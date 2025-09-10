/* global frappe */
(function () {
  const LOG = (...a) => console.log("%c[SCCC]", "color:#8b5cf6;font-weight:bold", ...a);

  const ICON = {
    chevUp: `<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 14l5-5 5 5z"/></svg>`,
    chevDown: `<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>`,
    gear: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4l-2.1 1.2.2 2.4-2.4.2L15.6 18 14.4 20l-2.4-.2L11 22H9l-.9-2.2L5.7 20 4.4 18l-1.9-.2.2-2.4L.9 12 2.7 10l-.2-2.4L4.9 7 6.2 5l2.4.2L11 3h2l.9 2.2 2.4-.2L18.3 7l2.4.6-.2 2.4L21 12z"/></svg>`,
    cmd: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 3a4 4 0 100 8h2V9H7a2 2 0 110-4 2 2 0 012 2v2h6V7a4 4 0 10-4 4h2v2h-2a4 4 0 104 4v-2h-6v2a2 2 0 11-2-2h2v-2H7z"/></svg>`,
    todo: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M9 11h11v2H9v-2zM9 7h11v2H9V7zm0 8h11v2H9v-2zM6 7H4v2h2V7zm0 4H4v2h2v-2zm0 4H4v2h2v-2z"/></svg>`,
    note: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16l4-4h8a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>`,
    more: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 10a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"/></svg>`
  };

  function railHTML() {
    const user  = (frappe.session && frappe.session.user_fullname) || frappe.user.full_name();
    const email = (frappe.session && frappe.session.user) || frappe.user.name;
    const initials = (user || "U").split(/\s+/).map(s=>s[0]).slice(0,2).join("").toUpperCase();

    return `
      <aside id="sccc-rail-fixed" class="sccc-rail-fixed" aria-label="SCCC left rail">
        <div class="sccc-rail-panel">
          <!-- Brand -->
          <div class="sccc-brand">
            <div class="sccc-logo">
               <img src="/assets/sccc_theme/images/SCCC_Sidebar_Logo.png" alt="SCCC Logo" style="height:38px; margin-top:-6px;">
            </div>
               <div class="sccc-brand-text">
              <div class="sccc-brand-title">SCCC</div>
              <div class="sccc-brand-sub">By SCCC</div>
            </div>
          </div>

          <!-- Module selector -->
          <div class="sccc-section-label">Module</div>
          <select class="sccc-select" id="sccc-module-select_"></select>
          <div class="sccc-hr"></div>

          <div class="sccc-spacer"></div>

          <!-- Tools -->
          <details class="sccc-tools" open>
            <summary class="sccc-tools-head">
              <span>Tools</span>
              <span class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
            <div class="sccc-tool" data-route="list:ToDo">
              <span>📊</span>
              <span class="sccc-tool-txt">Todo</span>
            </div>
            <div class="sccc-tool" data-route="list:Note">
              <span>💪</span>
              <span class="sccc-tool-txt">Note</span>
            </div>
          </details>

          <div class="sccc-hr"></div>

          <div class="sccc-user">
            <div class="sccc-avatar">${initials}</div>
            <div class="sccc-user-meta">
              <div class="sccc-user-name">${frappe.utils.escape_html(user)}</div>
              <div class="sccc-user-mail">${frappe.utils.escape_html(email)}</div>
            </div>
            <button class="sccc-user-caret" title="Account">${ICON.chevUp}</button>
            <div class="sccc-user-menu">
              <button class="sccc-logout-btn"><i class="fa fa-sign-out"></i> Logout</button>
            </div>
          </div>
      </aside>
    `;
  }

  function routeGo(route) {
    if (route.startsWith("list:")) return frappe.set_route("list", route.split(":")[1]);
    if (route === "home") return frappe.set_route("home");
    return frappe.set_route(route);
  }

  function wireRail($root) {
    $root.on("click", ".sccc-brand", () => frappe.set_route("home"));
    $root.on("click", ".sccc-user", function() {
      $root.find(".sccc-user-menu").toggle();
    });
    $root.on("click", ".sccc-logout-btn", () => {
      frappe.call({
        method: "logout",
        callback: () => window.location.href = "/login"
      });
    });
    $root.on("click", ".sccc-link", function(){ routeGo(this.getAttribute("data-route")); });
    $root.on("click", ".sccc-tool", function(){ routeGo(this.getAttribute("data-route")); });
    $root.on("change", "#sccc-module-select_", async function () {
      const route = this.value;
      frappe.set_route(route);
      const label = $(this).find("option:selected").text();
      $root.find(".sccc-select-label").text(label);
      $root.find(".sccc-collapsible").remove();
      let page = this.value;
      const ws = await frappe.call("sccc_theme.utils.utils.get_sidebar_items", { page });
      const items = ws.message || [];
      LOG("Workspace data:", items);
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
      }, {});
      Object.entries(grouped).forEach(([type, list]) => {
        const details = $(`
          <details class="sccc-tools sccc-collapsible">
            <summary class="sccc-tools-head">
              <span>${type}</span>
              <span class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
            ${list.map(i => `
              <div class="sccc-tool sccc-collapsible-item" data-route="${i.route}">
                <span class="sccc-tool-icn">${ICON.todo}</span>
                <span class="sccc-tool-txt">${i.label}</span>
              </div>`).join("")}
          </details>
        `);
        $root.find("#sccc-module-select_").after(details);
      });
    });
    $root.on("click", ".sccc-collapsible-item", function () {
      const route = $(this).data("route");
      if (route) frappe.set_route(route);
    });
  }

  async function loadModules($root) {
  const r = await frappe.xcall("frappe.desk.desktop.get_workspace_sidebar_items");
  const pages = (r && r.pages) || [];
  const $sel = $root.find("#sccc-module-select_");

  $sel.empty();
  $sel.append(`<option value="home">Home</option>`);

  // Build a lookup map of doctype → workspace
  const doctypeToWorkspace = {};

  pages.forEach(p => {
    if (frappe.router.slug(p.title) === "home") return;
    const slug = p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`;
    $sel.append(`<option value="${slug}">${p.title}</option>`);

    if (p.link_to) {
      // Some pages include link_to or doctypes
      p.link_to.forEach(dt => {
        doctypeToWorkspace[dt] = slug;
      });
    }
    if (p.doctypes) {
      p.doctypes.forEach(dt => {
        doctypeToWorkspace[dt] = slug;
      });
    }
  });

  let currentSlug = "home";
  let rroute = frappe.get_route();
  let pathname = window.location.pathname;

  if (rroute && rroute[0] === "workspace") {
    if (rroute[1] === "private") {
      currentSlug = `private/${rroute[2]}`;
    } else {
      currentSlug = rroute[1];
    }
  } else if (rroute && (rroute[0] === "Form" || rroute[0] === "List")) {
    const doctype = rroute[1];
    if (doctypeToWorkspace[doctype]) {
      currentSlug = doctypeToWorkspace[doctype];
    }
  } else if (pathname.startsWith("/app/")) {
    const parts = pathname.replace(/^\/app\//, "").split("/");
    if (parts[0] === "private") {
      currentSlug = `private/${parts[1]}`;
    } else {
      currentSlug = parts[0] || "home";
    }
  }

  $sel.val(currentSlug);
}



  function mount() {
    if (document.getElementById("sccc-rail-fixed")) return;
    document.body.classList.add("sccc-rail-padding");
    const holder = document.createElement("div");
    holder.innerHTML = railHTML();
    const rail = holder.firstElementChild;
    document.body.appendChild(rail);
    wireRail($(rail));
    loadModules($(rail));
    LOG("✅ SCCC fixed rail mounted");
  }

  $(document).on("app_ready", mount);
  if (document.readyState !== "loading") setTimeout(mount, 0);
})();
