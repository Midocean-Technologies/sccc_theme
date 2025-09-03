/* global frappe */
(function () {
  const LOG = (...a) => console.log("%c[SCCC]", "color:#8b5cf6;font-weight:bold", ...a);

  // SVGs (swap with your brand icons if you like)
  const ICON = {
//    <-- logo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" style="width: 40px; height: 40px;">
//     <path d="M72 56H32C32 78.09 49.91 96 72 96V56Z" fill="#9163A9"/>
//     <rect x="72" y="32" width="24" height="24" fill="#A18CAD"/>
//   </svg>`,
// -->

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
               <img src="/assets/sccc_theme/images/sidebar-logo.png" alt="SCCC Logo" style="height:38px; margin-top:-6px;">
            </div>
               <div class="sccc-brand-text">
              <div class="sccc-brand-title">SCCC</div>
              <div class="sccc-brand-sub">By SCCC</div>
            </div>
          </div>

          <!-- Module selector -->
          
          <div class="sccc-section-label">Module</div>
          <select class="sccc-select" id="sccc-module-select_">
            <option value="home">Home</option>
          </select>
          <div class="sccc-hr"></div>

          <!-- Settings -->
          <!--- <div class="sccc-link" data-route="settings">
            <span class="fa fa-cog"></span>
            <span class="sccc-link-txt">Settings</span>
          </div> --->

          <div class="sccc-spacer"></div>

          <!-- Tools -->
          <details class="sccc-tools" open>
            <summary class="sccc-tools-head">
              <span>Tools</span>
              <span class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
            <div class="sccc-tool" data-route="list:ToDo">
              <!-- <span class="fa fa-bar-chart"></span> -->
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
    if (route === "home") {
      const r = frappe.get_route();
      const page = (r[1] === "private") ? r[2] : r[1] || "home";
      return frappe.set_route(page);
    }
    return frappe.set_route(route);
  }

  function wireRail($root) {
    // route home
    $root.on("click", ".sccc-brand", function () {
      frappe.set_route("home");
    });
    // User menu toggle
    $root.on("click", ".sccc-user", function() {
      const menu = $root.find(".sccc-user-menu");
      menu.toggle();
    });

    // Logout
    $root.on("click", ".sccc-logout-btn", function() {
      frappe.call({
        method: "logout",
        callback: function () {
          window.location.href = "/login";
        }
      });
    });

    // Settings & tools
    $root.on("click", ".sccc-link", function(){ routeGo(this.getAttribute("data-route")); });
    $root.on("click", ".sccc-tool", function(){ routeGo(this.getAttribute("data-route")); });
    $root.on("change", "#sccc-module-select_", function () {
      const route = this.value;
      frappe.set_route(route);
    });
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
    $root.on("change", "#sccc-module-select_", async function () {
    const route = this.value;
    frappe.set_route(route);
    const label = $(this).find("option:selected").text();
    $root.find(".sccc-select-label").text(label);

    // clear old collapsibles
    $root.find(".sccc-collapsible").remove();
    let page = this.value;
    // fetch workspace details
    const ws = await frappe.call("frappe.desk.desktop.get_desktop_page", { page: JSON.stringify({ name: page }) });
    const data = ws.message || {};
    LOG("Workspace data:", data);
    const collapsibles = [
    {
      title: "Shortcuts",
      items: Array.isArray(data.shortcuts?.items)
        ? data.shortcuts.items.map(s => ({ label: s.label, route: s.link_to ? slugify(s.link_to) : slugify(s.label) }))
        : [],
    },
    {
      title: "Reports",
      items: Array.isArray(data.cards?.items)
        ? data.cards.items.map(r => ({ label: r.label, route: r.link_to ? slugify(r.link_to) : slugify(r.label) }))
        : [],
    },
    {
      title: "Settings",
      items: Array.isArray(data.onboardings?.items)
        ? data.onboardings.items.map(s => ({ label: s.label, route: s.link_to ? slugify(s.link_to) : slugify(s.label) }))
        : [],
    },
  ];

  collapsibles.forEach(col => {
    if (!col.items.length) return;

    const details = $(`
      <details class="sccc-tools sccc-collapsible">
      <summary class="sccc-tools-head">
              <span>${col.title}</span>
              <span class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
           
        ${col.items
          .map(i => `<div class="sccc-tool sccc-collapsible-item" data-route="${i.route}">  <span class="sccc-tool-icn">${ICON.todo}</span>
              <span class="sccc-tool-txt">${i.label} </span></div>`)
          .join("")}
      </details>
    `);

    $root.find("#sccc-module-select_").after(details);
  });
});

$root.on("click", ".sccc-collapsible-item", function () {
  const route = $(this).data("route");
  if (route) frappe.set_route(route);
});
    // Keep module label synced with current workspace title
    // const syncTitle = () => {
    //   const r = frappe.get_route();
    //   const isPriv = r[1] === "private";
    //   const page = (isPriv ? r[2] : r[1]) || "Home";
    //   const pretty = frappe.utils.to_title_case(String(page).replace(/-/g, " "));
    //   $root.find(".sccc-select-label").text(pretty);
    // };
    // syncTitle();
    // frappe.router.on("change", syncTitle);
  }
  async function loadModules($root) {
    const r = await frappe.xcall("frappe.desk.desktop.get_workspace_sidebar_items");
    const pages = (r && r.pages) || [];
    const $sel = $root.find("#sccc-module-select_");

    $sel.empty();
    $sel.append(`<option value="home">Home</option>`);

    pages.forEach(p => {
      const slug = p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`;
      $sel.append(`<option value="${slug}">${p.title}</option>`);
    });

    // Sync with current route
    const rroute = frappe.get_route();
    const currentSlug = (rroute[1] === "private") ? `private/${rroute[2]}` : rroute[1] || "home";
    $sel.val(currentSlug);
  }
   
  function slugify(text) {
    return (text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")       // spaces → dash
      .replace(/[^a-z0-9\-]/g, ""); // remove special chars
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
    loadModules($(rail));
    LOG("✅ SCCC fixed rail (full-bleed top) mounted");
  }

  $(document).on("app_ready", mount);
  if (document.readyState !== "loading") setTimeout(mount, 0);
})();