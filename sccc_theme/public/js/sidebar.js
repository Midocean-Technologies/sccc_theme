/* global frappe */
(function () {
  const LOG = (...a) => console.log("%c[SCCC]", "color:#8b5cf6;font-weight:bold", ...a);

  // SVGs (swap with your brand icons if you like)
  const ICON = {
    logo: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l7 4v6l-7 4-7-4V6l7-4z" fill="currentColor" opacity=".75"/>
      <path d="M5 13l7 4 7-4" stroke="currentColor" stroke-width="2" opacity=".35"/>
    </svg>`,
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
            <div class="sccc-logo">${ICON.logo}</div>
            <div class="sccc-brand-text">
              <div class="sccc-brand-title">SCCC</div>
              <div class="sccc-brand-sub">By SCCC</div>
            </div>
          </div>

          <!-- Module selector -->
          <div class="sccc-section-label">Module</div>
          <button class="sccc-select" id="sccc-module-select">
            <span class="sccc-select-icon">${ICON.cmd}</span>
            <span class="sccc-select-label">Home</span>
            <span class="sccc-select-caret">${ICON.chevDown}</span>
          </button>

          <div class="sccc-hr"></div>

          <!-- Settings -->
          <div class="sccc-link" data-route="settings">
            <span class="sccc-link-icn">${ICON.gear}</span>
            <span class="sccc-link-txt">Settings</span>
          </div>

          <div class="sccc-spacer"></div>

          <!-- Tools -->
          <details class="sccc-tools" open>
            <summary class="sccc-tools-head">
              <span>Tools</span>
              <span class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
            <div class="sccc-tool" data-route="list:ToDo">
              <span class="sccc-tool-icn">${ICON.todo}</span>
              <span class="sccc-tool-txt">Todo</span>
            </div>
            <div class="sccc-tool" data-route="list:Note">
              <span class="sccc-tool-icn">${ICON.note}</span>
              <span class="sccc-tool-txt">Note</span>
            </div>
            <div class="sccc-tool" data-route="modules">
              <span class="sccc-tool-icn">${ICON.more}</span>
              <span class="sccc-tool-txt">More</span>
            </div>
          </details>

          <div class="sccc-hr"></div>

          <!-- User card -->
          <div class="sccc-user">
            <div class="sccc-avatar">${initials}</div>
            <div class="sccc-user-meta">
              <div class="sccc-user-name">${frappe.utils.escape_html(user)}</div>
              <div class="sccc-user-mail">${frappe.utils.escape_html(email)}</div>
            </div>
            <button class="sccc-user-caret" title="Account">${ICON.chevDown}</button>
          </div>
        </div>
      </aside>
    `;
  }

  function routeGo(route) {
    if (route.startsWith("list:")) return frappe.set_route("list", route.split(":")[1]);
    if (route === "home") {
      const r = frappe.get_route();
      const page = (r[1] === "private") ? r[2] : r[1] || "home";
      return frappe.set_route(page);
    }
    return frappe.set_route(route);
  }

  function wireRail($root) {
    // Settings & tools
    $root.on("click", ".sccc-link", function(){ routeGo(this.getAttribute("data-route")); });
    $root.on("click", ".sccc-tool", function(){ routeGo(this.getAttribute("data-route")); });

    // Module selector dialog
    $root.find("#sccc-module-select").on("click", async () => {
      const r = await frappe.xcall("frappe.desk.desktop.get_workspace_sidebar_items");
      const pages = (r && r.pages) || [];
      const opts = pages.map(p => p.title).filter(Boolean);
      frappe.prompt(
        [{ fieldname: "ws", label: "Workspace", fieldtype: "Select", options: opts.join("\n"), reqd: 1 }],
        (v) => {
          const p = pages.find(pp => pp.title === v.ws);
          if (!p) return;
          const route = p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`;
          frappe.set_route(route);
          $root.find(".sccc-select-label").text(p.title);
        },
        __("Switch Workspace"),
        __("Go")
      );
    });

    // Keep module label synced with current workspace title
    const syncTitle = () => {
      const r = frappe.get_route();
      const isPriv = r[1] === "private";
      const page = (isPriv ? r[2] : r[1]) || "Home";
      const pretty = frappe.utils.to_title_case(String(page).replace(/-/g, " "));
      $root.find(".sccc-select-label").text(pretty);
    };
    syncTitle();
    frappe.router.on("change", syncTitle);
  }

  function mount() {
    if (document.getElementById("sccc-rail-fixed")) return;

    // Add global left padding so desk doesn’t sit under the rail
    document.body.classList.add("sccc-rail-padding");

    const holder = document.createElement("div");
    holder.innerHTML = railHTML();
    const rail = holder.firstElementChild;
    document.body.appendChild(rail);

    wireRail($(rail));
    LOG("✅ SCCC fixed rail (full-bleed top) mounted");
  }

  $(document).on("app_ready", mount);
  if (document.readyState !== "loading") setTimeout(mount, 0);
})();