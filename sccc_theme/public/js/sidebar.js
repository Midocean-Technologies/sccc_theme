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
    more: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 10a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
    workspace: `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v4h-8V3zM3 13h4v8H3v-8zm6 6h10v4H9v-4z"/></svg>`
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
               <img src="/assets/sccc_theme/images/logo.svg" alt="SCCC Logo" style="height:38px; margin-top:-6px;">
            </div>
            <div class="sccc-brand-text">
              <div class="sccc-brand-title">SCCC</div>
              <div class="sccc-brand-sub">By SCCC</div>
            </div>
          </div>

          <!-- Module selector -->
          <div class="sccc-section-label">Module</div>

          <!-- custom dropdown: visible trigger + list; hidden native select kept for route logic -->
          <div class="sccc-select custom" id="sccc-module-select_wrap" tabindex="0" aria-haspopup="listbox">
            <button type="button" class="sccc-select-trigger" aria-expanded="false">
              <span class="sccc-select-item-icn">${frappe.utils.icon('image-view', "md")}</span>

              <span class="sccc-select-label">Home</span>
              <span class="sccc-select-caret">${ICON.chevDown}</span>
            </button>
            <div class="sccc-select-list" role="listbox" aria-label="Modules" hidden></div>
            <select id="sccc-module-select_" hidden></select>
          </div>

          <div class="sccc-hr"></div>
          <div id="sccc-dashboard-wrap" class="sccc-dashboard-wrap" aria-hidden="false">
            <button type="button" id="sccc-dashboard-btn" class="sccc-dashboard-btn" title="Dashboard" aria-label="Dashboard" data-route="dashboard">
              <span class="sccc-select-item-icon icon">${frappe.utils.icon('image-view', 'md')}</span>
              <span>
                <span class="sccc-dashboard-label">Home</span>
                <span class="">Dashboard</span>
              </span>
            </button>
          </div>
          <div class="sccc-spacer"></div>

          <!-- Tools -->
          <div class="sccc-tools-div">
            <details class="sccc-tools" open>
              <summary class="sccc-tools-head">
                <span>Tools</span>
                <span class="sccc-tools-caret">${ICON.chevDown}</span>
              </summary>
              <div class="sccc-tool" data-route="list:ToDo">
                <span class="sccc-tools-caret">${frappe.utils.icon('list', "md")}</span>
                <span class="sccc-tool-txt">Todo</span>
              </div>
              <div class="sccc-tool" data-route="list:Note">
                <span class="sccc-tools-caret">${frappe.utils.icon('sell', "md")}</span>
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
                <button class="sccc-account-btn">My Profile</button>
                <button class="sccc-my-settings-btn"">My Settings</button>
                <button class="sccc-apps-btn">Apps</button>
                <button class="sccc-logout-btn">Log out</button>
              </div>
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

    $root.on("click", ".sccc-my-settings-btn", () => {
      frappe.set_route("Form", "User", frappe.session.user);
    });

    $root.on("click", ".sccc-account-btn", () => {
      frappe.set_route("/app/user-profile");
    });
    
    $root.on("click", ".sccc-apps-btn", () => {
      frappe.set_route("/app/module-def");
    });
    
    $root.on("click", ".sccc-link", function(){ routeGo(this.getAttribute("data-route")); });
    $root.on("click", ".sccc-tool", function(){ routeGo(this.getAttribute("data-route")); });

    // custom dropdown trigger
    $root.on("click", ".sccc-select-trigger", function (e) {
      const $wrap = $(this).closest("#sccc-module-select_wrap");
      const $list = $wrap.find(".sccc-select-list");
      const expanded = $(this).attr("aria-expanded") === "true";
      $(this).attr("aria-expanded", !expanded);
      if (expanded) {
        $list.attr("hidden", true);
      } else {
        $list.removeAttr("hidden");
        // focus first item for keyboard users
        $list.find(".sccc-select-item[tabindex]").first().focus();
      }
    });
    // dashboard button click -> go to its route (default 'dashboard')
    $root.on("click", "#sccc-dashboard-btn", function () {
      const route = this.getAttribute("data-route") || "home";
      if (route === "home") return frappe.set_route("home");
      return frappe.set_route(route);
    });

    // pick item from custom list
    $root.on("click", ".sccc-select-item", function (e) {
      const $item = $(this);
      const val = $item.data("value");
      const label = $item.data("label");
      const $wrap = $item.closest("#sccc-module-select_wrap");
      const $sel = $wrap.find("#sccc-module-select_");

      // update visible label
      $wrap.find(".sccc-select-label").text(label);

      // update trigger icon to match selected item (fallback to image-view)
      const iconHtml = $item.find(".sccc-select-item-icn").html() || frappe.utils.icon('image-view', 'md');
      $wrap.find(".sccc-select-trigger .sccc-select-item-icn").html(iconHtml);

      // ALSO update Dashboard button label + icon and set its route
      const $dash = $root.find("#sccc-dashboard-btn");
      if ($dash.length) {
        $dash.find(".sccc-select-item-icon").html(iconHtml);
        $dash.find(".sccc-dashboard-label").text(label);
        // make dashboard route point to module's slug (keeps same value as native select)
        $dash.attr("data-route", val === "home" ? "home" : val);
      }

      // set native select and trigger existing change handler
      $sel.val(val).trigger("change");

      // close list
      $wrap.find(".sccc-select-list").attr("hidden", true);
      $wrap.find(".sccc-select-trigger").attr("aria-expanded", "false");
    });

    // close dropdown when clicking outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest("#sccc-module-select_wrap").length) {
        const $wrap = $root.find("#sccc-module-select_wrap");
        $wrap.find(".sccc-select-list").attr("hidden", true);
        $wrap.find(".sccc-select-trigger").attr("aria-expanded", "false");
      }
    });

    // keep existing change handler for logic (routes / workspace items)
    $root.on("change", "#sccc-module-select_", async function () {
      const route = this.value;
      frappe.set_route(route);
      const label = $(this).find("option:selected").text();
      // update visible label in custom trigger
      $root.find(".sccc-select-label").text(label);

      // update trigger icon to match selected/native selection (fallback)
      const selIconHtml = $root.find(`.sccc-select-item[data-value="${route}"] .sccc-select-item-icn`).html() || frappe.utils.icon('image-view', 'md');
      $root.find(".sccc-select-trigger .sccc-select-item-icn").html(selIconHtml);

      // ALSO update Dashboard button to reflect current selection
      const $dash = $root.find("#sccc-dashboard-btn");
      if ($dash.length) {
        $dash.find(".sccc-select-item-icon").html(selIconHtml);
        $dash.find(".sccc-dashboard-label").text(label || "Dashboard");
        $dash.attr("data-route", route === "home" ? "dashboard" : route);
      }

      $root.find(".sccc-collapsible").remove();
      $root.find(".sccc-child-module").remove();

      const r = await frappe.xcall("frappe.desk.desktop.get_workspace_sidebar_items");
      const pages = (r && r.pages) || [];
      let page = this.value;
      const ws = await frappe.call("sccc_theme.utils.utils.get_sidebar_items", { page });
      const items = ws.message[0] || [];
      const links = ws.message[1] || [];
      LOG("Workspace data:", ws);

      // build slug lookup for pages
      const slugFor = p => (p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`);
      const slugMap = {};
      pages.forEach(p => { p._slug = slugFor(p); slugMap[p._slug] = p; });

      // determine if the selected page is itself a child module
      const selectedPageObj = slugMap[page] || null;
      const selectedIsChild = selectedPageObj && selectedPageObj.parent_page;

      // collect child modules for the relevant parent (if selecting parent) or for the parent of selected child
      let parentSlugForChildren = null;
      if (selectedIsChild) {
        parentSlugForChildren = frappe.router.slug(selectedPageObj.parent_page);
      } else {
        // selected page may be a parent; use its slug (strip private/ prefix for comparison)
        parentSlugForChildren = (page || "").replace(/^private\//, "");
      }

      const childModules = pages.filter(p => {
        if (!p.parent_page) return false;
        return frappe.router.slug(p.parent_page) === parentSlugForChildren;
      });

      // Render child modules as collapsible details and keep a map to insert selected items into the right child
      const $childWrap = $('<div class="sccc-child-module"></div>');
      const childDetailsMap = {}; // slug -> $details element

      for (const child of childModules) {
        const childSlug = slugFor(child);
        const iconHtml = child.icon ? ( (typeof child.icon === 'string' && child.icon.trim().startsWith('<svg')) ? child.icon : frappe.utils.icon(child.icon, "md") ) : frappe.utils.icon('image-view', "md");

        // fetch items for this child
        const childWs = await frappe.call("sccc_theme.utils.utils.get_sidebar_items", { page: child.title });
        const childItems = childWs.message[0] || [];
        const childlinks = childWs.message[1] || [];
        // group child items by type
        const groupedChild = childItems.reduce((acc, itm) => {
          if (!acc[itm.type]) acc[itm.type] = [];
          acc[itm.type].push(itm);
          return acc;
        }, {});
        const groupedLinks = childlinks.reduce((acc, itm) => {
          if (!acc[itm.category]) acc[itm.category] = [];
          acc[itm.category].push(itm);
          return acc;
        }, {});

        // build inner HTML for grouped types inside this child details
        const innerGroupsHtml = Object.entries(groupedChild).map(([type, list]) => {
          const typeIcon = frappe.utils.icon('menu', "sm");
          return `
            <details class="sccc-tools sccc-collapsible">
              <summary class="ccc-child-header sccc-tools-head">
                <span><span class="sccc-tools-icon">${typeIcon}</span> ${frappe.utils.escape_html(type)}</span>
                <span class="sccc-tools-caret">${ICON.chevDown}</span>
              </summary>
              ${list.map(i => `
                <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                  <span class="sccc-tool-txt">${frappe.utils.escape_html(i.label)}</span>
                </div>`).join("")}
            </details>`;
        }).join("");
        const innerlinkGroupsHtml = Object.entries(groupedLinks).map(([category, list]) => {
          const typeIcon = frappe.utils.icon('menu', "sm");
          return `
            <details class="sccc-tools sccc-collapsible">
              <summary class="ccc-child-header sccc-tools-head">
                <span><span class="sccc-tools-icon">${typeIcon}</span> ${frappe.utils.escape_html(category)}</span>
                <span class="sccc-tools-caret">${ICON.chevDown}</span>
              </summary>
              ${list.map(i => `
                <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                  <span class="sccc-tool-txt">${frappe.utils.escape_html(i.label)}</span>
                </div>`).join("")}
            </details>`;
        }).join("");

        // the child container is a details element (collapsible header)
        const $details = $(`
          <details class="sccc-child details-child" ${selectedIsChild && selectedPageObj && childSlug === slugFor(selectedPageObj) ? "open" : ""}>
            <summary class="sccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${frappe.utils.escape_html(child.title)}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
            <div class="sccc-child-content">
              ${innerGroupsHtml}
              ${innerlinkGroupsHtml}
            </div>
          </details>
        `);

        childDetailsMap[childSlug] = $details;
        $childWrap.append($details);
      }

      // insert child wrap if any
      if (childModules.length) {
        $root.find(".sccc-spacer").before($childWrap);
        const line = $(` <div class="sccc-hr"></div>`);
        // $childWrap.append(line);
      }

      // Group and render main collapsible items (items belong to the selected page)
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
      }, {});
      
      const links_grouped = links.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});
     
      Object.entries(links_grouped).forEach(([category, list]) => {
        const iconHtml = frappe.utils.icon('menu', "sm");
        
        const link_details = $(`
          <details class="sccc-tools sccc-collapsible details-child" style='margin-left:0; margin-right:0;'>
            <summary class="ccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${category}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
            ${list.map(i => `
              <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                <span class="sccc-tool-txt">${i.label}</span>
              </div>`).join("")}
          </details>
        `);
        $childWrap.append(link_details);

        $root.find(".sccc-spacer").before($childWrap);
      });

      Object.entries(grouped).forEach(([type, list]) => {
        const iconHtml = frappe.utils.icon('menu', "sm");
        
        const details = $(`
          <details class=" sccc-collapsible details-child" style='margin-left:0; margin-right:0;'>
            <summary class="ccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${type}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevDown}</span>
            </summary>
            ${list.map(i => `
              <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                <span class="sccc-tool-txt">${i.label}</span>
              </div>`).join("")}
          </details>
        `);
        $childWrap.append(details);

        $root.find(".sccc-spacer").before($childWrap);
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

  const $wrap = $root.find("#sccc-module-select_wrap");
  const $list = $wrap.find(".sccc-select-list");
  const $sel = $wrap.find("#sccc-module-select_");

  $sel.empty();
  $list.empty();

  // helper to add item to both native select and custom list
  function addOption(value, label, iconHtml) {
    const safeLabel = frappe.utils.escape_html(__(label) || label);

    $sel.append(`<option value="${value}">${safeLabel}</option>`);
    const $item = $(`
      <div role="option" tabindex="0" class="sccc-select-item" data-value="${value}" data-label="${label}">
        <span class="sccc-select-item-icn">${iconHtml}</span>
        <span class="sccc-select-item-txt">${safeLabel}</span>
      </div>
    `);
    $list.append($item);
  }

  addOption("home", "Home", frappe.utils.icon('image-view', "md"));

  // Build a lookup map of doctype → workspace
  const doctypeToWorkspace = {};
  LOG(pages)
  pages.forEach(p => {
    if (frappe.router.slug(p.title) === "home") return;
    const slug = p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`;
    const iconHtml = p.icon ? frappe.utils.icon(p.icon, "md") : frappe.utils.icon('image-view', "md");
    if(!p.parent_page){
      addOption(slug, p.title, iconHtml);

      if (p.link_to) {
        p.link_to.forEach(dt => {
          doctypeToWorkspace[dt] = slug;
        });
      }
      if (p.doctypes) {
        p.doctypes.forEach(dt => {
          doctypeToWorkspace[dt] = slug;
        });
      }
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

  // set selection in native select (will trigger change when user picks)
  $sel.val(currentSlug);

  // update visible label and mark focused item
  const selectedText = $sel.find("option:selected").text() || "Home";
  $wrap.find(".sccc-select-label").text(selectedText);
  $list.find(`.sccc-select-item[data-value="${currentSlug}"]`).attr("aria-selected", "true");
  // update trigger icon to match selected item (fallback to image-view)
  const selIconHtml = $list.find(`.sccc-select-item[data-value="${currentSlug}"] .sccc-select-item-icn`).html();
  $wrap.find(".sccc-select-trigger .sccc-select-item-icn").html(selIconHtml);

  // also update Dashboard button on load to match selected module
  const $dash = $wrap.siblings("#sccc-dashboard-wrap").find("#sccc-dashboard-btn");
  if ($dash.length) {
    const dashIcon = selIconHtml || frappe.utils.icon('image-view', 'md');
    const dashLabel = selectedText || "Home";
    $dash.find(".sccc-select-item-icn").html(dashIcon);
    $dash.find(".sccc-select-item-icon").html(dashIcon);
    $dash.find(".sccc-dashboard-label").text(dashLabel);
    $dash.attr("data-route", currentSlug === "home" ? "home" : currentSlug);
  }
  $root.find("#sccc-module-select_").trigger("change");

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