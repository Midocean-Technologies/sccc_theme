/* global frappe */
(function () {
  // const LOG = (...a) => console.log("%c[SCCC]", "color:#8b5cf6;font-weight:bold", ...a);

  const ICON = {
    userCaret: `
        <svg class="chev-both" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- Up arrow (placed higher) -->
          <polyline points="6 8 12 4 18 8"/>
          <!-- Down arrow (placed lower) -->
          <polyline points="6 16 12 20 18 16"/>
        </svg>
      `,
    chevUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
    chevDown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    chevRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`,
    gear: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4l-2.1 1.2.2 2.4-2.4.2L15.6 18 14.4 20l-2.4-.2L11 22H9l-.9-2.2L5.7 20 4.4 18l-1.9-.2.2-2.4L.9 12 2.7 10l-.2-2.4L4.9 7 6.2 5l2.4.2L11 3h2l.9 2.2 2.4-.2L18.3 7l2.4.6-.2 2.4L21 12z"/></svg>`,
    cmd: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 3a4 4 0 100 8h2V9H7a2 2 0 110-4 2 2 0 012 2v2h6V7a4 4 0 10-4 4h2v2h-2a4 4 0 104 4v-2h-6v2a2 2 0 11-2-2h2v-2H7z"/></svg>`,
    todo: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M9 11h11v2H9v-2zM9 7h11v2H9V7zm0 8h11v2H9v-2zM6 7H4v2h2V7zm0 4H4v2h2v-2zm0 4H4v2h2v-2z"/></svg>`,
    note: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16l4-4h8a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>`,
    more: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6 10a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
    workspace: `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v4h-8V3zM3 13h4v8H3v-8zm6 6h10v4H9v-4z"/></svg>`
  };

  function lowerFirst(text) {
    if (!text) return "";
    return text.charAt(0).toLowerCase() + text.slice(1);
  }

  function formatLabel(label) {
    return lowerFirst(frappe.utils.escape_html(label));
  }

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
              <div class="sccc-brand-title">${__("sccc erp")}</div>
              <div class="sccc-brand-sub">${__("sccc by stc")}</div>
            </div>
          </div>
          <!-- Module selector -->
          <div class="sccc-section-label">${__("Module")}</div>

          <!-- custom dropdown: visible trigger + list; hidden native select kept for route logic -->
          <div class="sccc-select custom" id="sccc-module-select_wrap" tabindex="0" aria-haspopup="listbox">
            <button type="button" class="sccc-select-trigger" aria-expanded="false">
              <span class="sccc-select-item-icn">${frappe.utils.icon('image-view', "md")}</span>

              <span class="sccc-select-label">${__("home")}</span>
              <span class="sccc-select-caret">${ICON.chevRight}</span>
            </button>
            <div class="sccc-select-list" role="listbox" aria-label="${__("Modules")}" hidden></div>
            <select id="sccc-module-select_" hidden></select>
          </div>

          <div class="sccc-hr"></div>
          <div id="sccc-dashboard-wrap" class="sccc-dashboard-wrap" aria-hidden="false">
            <button type="button" id="sccc-dashboard-btn" class="sccc-dashboard-btn" title="${__("Dashboard")}" aria-label="${__("Dashboard")}" data-route="dashboard">
              <span class="sccc-select-item-icon icon">
                <img src="/assets/sccc_theme/icon/Home.svg" alt="Home Icon" class="icon-img" />
              </span>

              <span>
                <span class="sccc-dashboard-label" style="font-size:14px;">${__("home")}</span>
                <span class="" style="font-size:14px;">${__("dashboard")}</span>
              </span>
            </button>
          </div>
          <div class="sccc-spacer"></div>

          <!-- Tools -->
          <div class="sccc-tools-div">
              <div class="sccc-tool", data-route="tools-page">
                <span>
                  <img src ="/assets/sccc_theme/images/tools.svg" alt="tools" style="height:18px; margin-left:10px;"/>
                </span>
                <span class="sccc-tool-txt">${__("Tools")}</span>
                <span class="sccc-row-caret">${ICON.chevRight}</span>
              </div>
              <div class="sccc-tool" data-route="configuration">
                <span>
                  <img src ="/assets/sccc_theme/images/configuration.svg" alt="configuration" style="height:18px; margin-left:10px;"/>
                </span>
                <span class="sccc-tool-txt">${__("Configuration")}</span>
                <span class="sccc-row-caret">${ICON.chevRight}</span>
              </div>

            <div class="sccc-hr"></div>

            <div class="sccc-user">
              <div class="sccc-avatar">${initials}</div>
              <div class="sccc-user-meta">
                <div class="sccc-user-name">${frappe.utils.escape_html(user)}</div>
                <div class="sccc-user-mail">${frappe.utils.escape_html(email)}</div>
              </div>
              <button class="sccc-user-caret" title="${__("Account")}">
                <span class="sccc-user-caret-up">${ICON.userCaret}</span>
              </button>
              <div class="sccc-user-menu">
                <button class="sccc-account-btn">${__("My Profile")}</button>
                <button class="sccc-my-settings-btn">${__("My Settings")}</button>
                <button class="sccc-apps-btn">${__("Apps")}</button>
                <button class="sccc-logout-btn">${__("Log out")}</button>
              </div>
            </div>

          </div>
      </aside>
    `;
  }

  function routeGo(route) {
    if (route.startsWith("list:")) return frappe.set_route("list", route.split(":")[1]);
    if (route === "home") return frappe.set_route("home");
    if (route === "configuration") return frappe.set_route("app/configuration");
    if (route === "tools-page") return frappe.set_route("app/tools-page"); 

    return frappe.set_route(route);
  }

  function wireRail($root) {
    //  $root.on("click", ".sccc-brand", () => frappe.set_route("home"));
    $root.on("click", ".sccc-brand", () => {
      const $sel = $root.find("#sccc-module-select_");
      $sel.val("home").trigger("change");
    });
$root.on("click", ".sccc-user", function() {
  $root.find(".sccc-user-menu").toggle();
  // Hide the select list when user menu is toggled
  $root.find(".sccc-select-list").attr("hidden", true);
  $root.find(".sccc-select-trigger").attr("aria-expanded", "false");
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
        // focus selected item for keyboard users, or first if none
        const $toFocus = $list.find(".sccc-select-item.selected").first();
        if ($toFocus.length) {
          $toFocus.focus();
        } else {
          $list.find(".sccc-select-item[tabindex]").first().focus();
        }
        // Hide the user menu when select list is toggled
        $root.find(".sccc-user-menu").hide();
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
        // $dash.find(".sccc-select-item-icon").html(iconHtml);
        $dash.find(".sccc-dashboard-label").text(label);
        // make dashboard route point to module's slug (keeps same value as native select)
        $dash.attr("data-route", val === "home" ? "home" : val);
      }

      // set native select and trigger existing change handler
      $sel.val(val).trigger("change");

      // update selected class
      $wrap.find(".sccc-select-list .sccc-select-item").removeClass("selected");
      $item.addClass("selected");

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

      // update selected class and aria-selected in the custom list
      const $wrap = $root.find("#sccc-module-select_wrap");
      $wrap.find(".sccc-select-list .sccc-select-item").removeClass("selected").removeAttr("aria-selected");
      $wrap.find(`.sccc-select-list .sccc-select-item[data-value="${route}"]`).addClass("selected").attr("aria-selected", "true");

      // ALSO update Dashboard button to reflect current selection
      const $dash = $root.find("#sccc-dashboard-btn");
      if ($dash.length) {
        // $dash.find(".sccc-select-item-icon").html(selIconHtml);
        $dash.find(".sccc-dashboard-label").text(label || __("home"));
        $dash.attr("data-route", route === "home" ? "home" : route);
      }

      $root.find(".sccc-collapsible").remove();
      $root.find(".sccc-child-module").remove();

      const r = await frappe.xcall("sccc_theme.utils.workspace.get_workspace_sidebar_items");
      const pages = (r && r.pages) || [];
      const filteredPages = pages.filter(p => !p.parent_page);
  let page = this.value;

  // build slug lookup for pages
  const slugFor = p => (p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`);
  const slugMap = {};
  filteredPages.forEach(p => { p._slug = slugFor(p); slugMap[p._slug] = p; });

  // determine if the selected page is itself a child module
  const selectedPageObj = slugMap[page] || null;

  let items = [], links = [];
  if (selectedPageObj) {
    const ws = await frappe.call("sccc_theme.utils.utils.get_sidebar_items", { page });
    items = ws.message[0] || [];
    links = ws.message[1] || [];
  }
  // LOG("Workspace data:", {items, links});

  const selectedIsChild = selectedPageObj && selectedPageObj.parent_page;

  // collect child modules only if selected is a child (treat as parent), else none
  let parentSlugForChildren = null;
  if (selectedIsChild) {
    parentSlugForChildren = (page || "").replace(/^private\//, "");
  }

  const childModules = filteredPages.filter(p => {
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
    const innerGroupsHtml = Object.entries(groupedChild).map(([type, list],j) => {
      const collapseId = `collapse-child-${j}`;
      const typeIcon = frappe.utils.icon('menu', "sm");
      return `
        <div class="sccc-tools sccc-collapsible">
          <div class="ccc-child-header sccc-tools-head">
            <span class="sccc-tools-icon">${typeIcon}</span> ${frappe.utils.escape_html(__(type))}</span>
            <span class="sccc-tools-caret">${ICON.chevRight}</span>
          </div>
          <div id="${collapseId}" class="collapse sccc-collapsible-body">
            ${list.map(i => `
              <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                <span class="sccc-tool-txt">${frappe.utils.escape_html(__(i.label))}</span>
              </div>`).join("")}
          </div>
        </div>`;
    }).join("");
    const innerlinkGroupsHtml = Object.entries(groupedLinks).map(([category, list],j) => {
      const collapseId = `collapse-child-links-${j}`;
      const typeIcon = frappe.utils.icon('menu', "sm");
      return `
        <div class="sccc-tools sccc-collapsible">
          <div class="ccc-child-header sccc-tools-head">
            <span class="sccc-tools-icon">${typeIcon}</span> ${frappe.utils.escape_html(__(category))}</span>
            <span class="sccc-tools-caret">${ICON.chevRight}</span>
          </div>
          <div id="${collapseId}" class="collapse sccc-collapsible-body">
            ${list.map(i => `
              <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                <span class="sccc-tool-txt">${frappe.utils.escape_html(__(i.label))}</span>
              </div>`).join("")}
          </div>
        </div>`;
    }).join("");

        // the child container is a details element (collapsible header)
        const $details = $(`
          <details class="sccc-child details-child" ${selectedIsChild && selectedPageObj && childSlug === slugFor(selectedPageObj) ? "open" : ""}>
            <summary class="sccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${frappe.utils.escape_html(child.title)}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevRight}</span>
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

      Object.entries(links_grouped).forEach(([category, list],j) => {
        const iconHtml = list[0] && list[0].category_icon ? `<img src="${list[0].category_icon}" style="height:18px; width:18px;" />` : frappe.utils.icon('menu', "sm");
        const collapseId = `collapse-links-${j}`;
        const link_details = $(`
          <div class="sccc-tools sccc-collapsible details-child">
            <div class="ccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${__(category)}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevRight}</span>
            </div>
            <div id="${collapseId}" class="collapse sccc-collapsible-body">
              ${list.map(i => `
                <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                  <span class="sccc-tool-txt">${__(i.label)}</span>
                </div>`).join("")}
            </div>
          </div>
        `);
        $childWrap.append(link_details);
        $root.find(".sccc-spacer").before($childWrap);
      });

      Object.entries(grouped).forEach(([type, list], j) => {
        const iconHtml = frappe.utils.icon('menu', "sm");
        const collapseId = `collapse-card-${j}`;
        const details = $(`
          <div class=" sccc-collapsible details-child" style='margin-left:0; margin-right:0;'>
            <div class="ccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${__(type)}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevRight}</span>
            </div>
            <div id="${collapseId}" class="collapse sccc-collapsible-body">
              ${list.map(i => `
                <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                  <span class="sccc-tool-txt">${__(i.label)}</span>
                </div>`).join("")}
            </div>
          </div>
        `);
        $childWrap.append(details);
        $root.find(".sccc-spacer").before($childWrap);
      });

    });
    $root.on("click", ".sccc-collapsible-item", function () {
      const route = $(this).data("route");
      if (route) frappe.set_route(route);
      $('.sccc-collapsible-item').removeClass('selected');
      $(this).addClass('selected');
    });
    // Accordion behavior: only one open at a time
    $root.on('click', '.sccc-collapsible .sccc-tools-head', function() {
        const $body = $(this).next('.sccc-collapsible-body');
        $('.sccc-collapsible-body').not($body).collapse('hide');
        $body.collapse('toggle');
    });

    // Update caret on collapse show/hide
    $root.on('shown.bs.collapse', '.sccc-collapsible-body', function() {
        $(this).prev('.sccc-tools-head').find('.sccc-tools-caret').html(ICON.chevDown);
    });
    $root.on('hidden.bs.collapse', '.sccc-collapsible-body', function() {
        $(this).prev('.sccc-tools-head').find('.sccc-tools-caret').html(ICON.chevRight);
    });

    $root.on('toggle', 'details', function() {
        const caret = $(this).find('summary .sccc-tools-caret');
        caret.html(this.open ? ICON.chevDown : ICON.chevRight);
    });

    $root.on('click', '#sccc-module-select_wrap.sccc-select.custom', function() {
        const $caret = $(this).find('.sccc-select-caret');
        const expanded = $(this).find('.sccc-select-trigger').attr('aria-expanded') === 'true';
        $caret.html(expanded ? ICON.chevDown : ICON.chevRight);
    });

  }
  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-word chars
      .replace(/\s+/g, "-");    // spaces → dashes
  }
  async function loadchild($root,selectedText) {
      $root.find(".sccc-collapsible").remove();
      $root.find(".sccc-child-module").remove();
      const r = await frappe.xcall("sccc_theme.utils.workspace.get_workspace_sidebar_items");
      const pages = (r && r.pages) || [];
      const filteredPages = pages.filter(p => !p.parent_page);
      // let page = pages.filter(p => p.name === selectedText)[0];

      let page = slugify(selectedText)

      // build slug lookup for pages
      const slugFor = p => (p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`);
      const slugMap = {};
      filteredPages.forEach(p => { p._slug = slugFor(p); slugMap[p._slug] = p; });

      // determine if the selected page is itself a child module
      const selectedPageObj = slugMap[page] || null;

      let items = [], links = [];
      if (selectedPageObj) {
        const ws = await frappe.call("sccc_theme.utils.utils.get_sidebar_items", { page });
        items = ws.message[0] || [];
        links = ws.message[1] || [];
      }
      // LOG("Workspace data:", {items, links});

      const selectedIsChild = selectedPageObj && selectedPageObj.parent_page;

      // collect child modules only if selected is a child (treat as parent), else none
      let parentSlugForChildren = null;
      if (selectedIsChild) {
        parentSlugForChildren = (page || "").replace(/^private\//, "");
      }

      const childModules = filteredPages.filter(p => {
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
        const innerGroupsHtml = Object.entries(groupedChild).map(([type, list],j) => {
          const collapseId = `collapse-child-${j}`;
          const typeIcon = frappe.utils.icon('menu', "sm");
          return `
            <div class="sccc-tools sccc-collapsible">
              <div class="ccc-child-header sccc-tools-head">
                <span class="sccc-tools-icon">${typeIcon}</span> ${frappe.utils.escape_html(__(type))}</span>
                <span class="sccc-tools-caret">${ICON.chevRight}</span>
              </div>
              <div id="${collapseId}" class="collapse sccc-collapsible-body">
                ${list.map(i => `
                  <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                    <span class="sccc-tool-txt">${frappe.utils.escape_html(__(i.label))}</span>
                  </div>`).join("")}
              </div>
            </div>`;
        }).join("");
        const innerlinkGroupsHtml = Object.entries(groupedLinks).map(([category, list],j) => {
          const collapseId = `collapse-child-links-${j}`;
          const typeIcon = frappe.utils.icon('menu', "sm");
          return `
            <div class="sccc-tools sccc-collapsible">
              <div class="ccc-child-header sccc-tools-head">
                <span class="sccc-tools-icon">${typeIcon}</span> ${frappe.utils.escape_html(__(category))}</span>
                <span class="sccc-tools-caret">${ICON.chevRight}</span>
              </div>
              <div id="${collapseId}" class="collapse sccc-collapsible-body">
                ${list.map(i => `
                  <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                    <span class="sccc-tool-txt">${frappe.utils.escape_html(__(i.label))}</span>
                  </div>`).join("")}
              </div>
            </div>`;
        }).join("");

        // the child container is a details element (collapsible header)
        const $details = $(`
          <details class="sccc-child details-child" ${selectedIsChild && selectedPageObj && childSlug === slugFor(selectedPageObj) ? "open" : ""}>
            <summary class="sccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${frappe.utils.escape_html(child.title)}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevRight}</span>
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

      Object.entries(links_grouped).forEach(([category, list],j) => {
        const iconHtml = list[0] && list[0].category_icon ? `<img src="${list[0].category_icon}" style="height:18px; width:18px;" />` : frappe.utils.icon('menu', "sm");
        const collapseId = `collapse-links-${j}`;
        const link_details = $(`
          <div class="sccc-tools sccc-collapsible details-child" '>
            <div class="ccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${__(category)}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevRight}</span>
            </div>
            <div id="${collapseId}" class="collapse sccc-collapsible-body">
              ${list.map(i => `
                <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                  <span class="sccc-tool-txt">${__(i.label)}</span>
                </div>`).join("")}
            </div>
          </div>
        `);
        $childWrap.append(link_details);
      });

      Object.entries(grouped).forEach(([type, list],j) => {
        const iconHtml = frappe.utils.icon('menu', "sm");
        const collapseId = `collapse-card-${j}`;
        const details = $(`
          <div class=" sccc-collapsible details-child" style='margin-left:0; margin-right:0;'>
            <div class="ccc-child-header sccc-tools-head" style="display:flex;align-items:center;gap:8px;margin:4px 0 4px 0;">
              <span class="sccc-tools-icon">${iconHtml}</span>
              <strong style="font-size:13px">${__(type)}</strong>
              <span style="margin-left:auto" class="sccc-tools-caret">${ICON.chevRight}</span>
            </div>
            <div id="${collapseId}" class="collapse sccc-collapsible-body">
              ${list.map(i => `
                <div class="sccc-tool sccc-collapsible-item" style="border-radius:0; margin-left:17px; border-left:1px solid #424162;" data-route="${i.route}">
                  <span class="sccc-tool-txt">${__(i.label)}</span>
                </div>`).join("")}
            </div>
          </div>
        `);
        $childWrap.append(details);
      });

      // insert child wrap if any content
      if ($childWrap.children().length) {
        $root.find(".sccc-spacer").before($childWrap);
        const line = $(` <div class="sccc-hr"></div>`);
        // $childWrap.append(line);
      }

    }
  
  async function loadModules($root) {
  const r = await frappe.xcall("sccc_theme.utils.workspace.get_workspace_sidebar_items");
  const pages = (r && r.pages) || [];
  const filteredPages = pages.filter(p => !p.parent_page);

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

  addOption("home", "home", frappe.utils.icon('image-view', "md"));

  // Build a lookup map of doctype → workspace
  const doctypeToWorkspace = {};
  // LOG(filteredPages)
  filteredPages.forEach(p => {
    if (frappe.router.slug(p.title) === "home") return;
    const slug = p.public ? frappe.router.slug(p.title) : `private/${frappe.router.slug(p.title)}`;
    const iconHtml = p.icon ? frappe.utils.icon(p.icon, "md") : frappe.utils.icon('image-view', "md");
    // Add all workspaces to dropdown, including children
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
  setTimeout(()=>{
    const selectedText = $("#navbar-breadcrumbs li:first a").text().trim();
    // Only update label if selectedText is not empty, otherwise keep default or use from selected option
    if (selectedText) {
      $wrap.find(".sccc-select-label").text(selectedText);
    } else {
      // Fallback to the label of the selected option
      const fallbackLabel = $sel.find("option:selected").text() || __("home");
      $wrap.find(".sccc-select-label").text(fallbackLabel);
    }
    $list.find(`.sccc-select-item[data-value="${currentSlug}"]`).attr("aria-selected", "true").addClass("selected");
    // update trigger icon to match selected item (fallback to image-view)
    const selIconHtml = $list.find(`.sccc-select-item[data-value="${currentSlug}"] .sccc-select-item-icn`).html();
    $wrap.find(".sccc-select-trigger .sccc-select-item-icn").html(selIconHtml);

    // also update Dashboard button on load to match selected module
    const $dash = $wrap.siblings("#sccc-dashboard-wrap").find("#sccc-dashboard-btn");
    if ($dash.length) {
      const dashIcon = selIconHtml || frappe.utils.icon('image-view', 'md');
      const dashLabel = selectedText || $sel.find("option:selected").text() || __("home");
      $dash.find(".sccc-select-item-icn").html(dashIcon);
      // $dash.find(".sccc-select-item-icon").html(dashIcon);
      $dash.find(".sccc-dashboard-label").text(dashLabel);
      $dash.attr("data-route", currentSlug === "home" ? "home" : currentSlug);
    }
    loadchild($root, selectedText || $sel.find("option:selected").text() || __("home"))
  },1000)
  

}

  function mount() {
    if (document.getElementById("sccc-rail-fixed")) return;

    // Detect if current language is RTL
    const isRTL = frappe.utils.is_rtl && frappe.utils.is_rtl(frappe.boot.lang);

    if (isRTL) {
      document.body.classList.add("sccc-rail-rtl-padding");
    } else {
      document.body.classList.add("sccc-rail-padding");
    }

    const holder = document.createElement("div");
    holder.innerHTML = railHTML();
    const rail = holder.firstElementChild;

    if (isRTL) {
      rail.classList.add("sccc-rail-rtl");
    }

    document.body.appendChild(rail);
    wireRail($(rail));
    loadModules($(rail));
    // LOG("✅ SCCC fixed rail mounted");
  }

  $(document).on("app_ready", mount);
  if (document.readyState !== "loading") setTimeout(mount, 0);

  $(document).on('page-change', () => {
    console.log('<->')
    try {
    // Build a route string comparable to data-route attributes
    let route = "";
    if (window.frappe && typeof frappe.get_route === "function") {
      const r = frappe.get_route() || [];
      route = Array.isArray(r) ? r.filter(Boolean).join("/") : r.toString();
    } else {
      route = (location.hash || "").replace(/^#/, "").split("?")[0] || location.pathname.replace(/^\/app\//, "");
    }
    route = route.replace(/^\/+|\/+$/g, "");
    console.log('>>',route)
    if (!route) {
      // clear selection if no route
      $('.sccc-collapsible-item').removeClass('selected');
      return;
    }

    // find best match and highlight
    // normalize route for robust matching (strip /app/, trim slashes, lowercase)
    const normalizedRoute = (route || "").toString().replace(/^\/app\/?/i, "").replace(/^\/+|\/+$/g, "").toLowerCase();

    // attempt multiple matching strategies:
    // 1) exact normalized route
    // 2) slugified route (spaces → dashes)
    // 3) data-route contains slugified doctype (Form/List flows)
    // 4) match by item label == last route segment
    const slugRoute = slugify(normalizedRoute); // uses existing slugify() in this file
    const lastSeg = (normalizedRoute.split("/").filter(Boolean).pop() || "").trim();
    const lastSegSlug = slugify(lastSeg);

    // get doctype from frappe route array when available
    let routeDoctype = null;
    try {
      const rarr = (window.frappe && typeof frappe.get_route === "function") ? (frappe.get_route() || []) : [];
      if (Array.isArray(rarr) && rarr[0]) {
        if (rarr[0].toString().toLowerCase() === "form" && rarr[1]) routeDoctype = rarr[1];
        if (rarr[0].toString().toLowerCase() === "list" && rarr[1]) routeDoctype = rarr[1];
      }
    } catch (e) {}

    let $match = $();

    // exact normalized match
    $match = $(`.sccc-collapsible-item`).filter(function () {
      let r = ($(this).attr('data-route') || "").toString().replace(/^\/app\/?/i, "").replace(/^\/+|\/+$/g, "").toLowerCase();
      return r === normalizedRoute;
    }).first();

    // slugified match (handles labels like "All Item Groups" -> all-item-groups)
    if ((!$match || !$match.length) && slugRoute) {
      $match = $(`.sccc-collapsible-item`).filter(function () {
        const r = ($(this).attr('data-route') || "").toString();
        const rs = slugify(r.replace(/^\/app\/?/i, "").replace(/^\/+|\/+$/g, "").toLowerCase());
        return rs === slugRoute || rs.indexOf(slugRoute) !== -1 || slugRoute.indexOf(rs) !== -1;
      }).first();
    }

    // match by doctype present in route (Form/List flows)
    if ((!$match || !$match.length) && routeDoctype) {
      const dtSlug = slugify(routeDoctype.toString().toLowerCase());
      $match = $(`.sccc-collapsible-item`).filter(function () {
        const r = (($(this).attr('data-route') || "") + " " + ($(this).text() || "")).toString().toLowerCase();
        return r.indexOf(dtSlug) !== -1 || r.indexOf(routeDoctype.toString().toLowerCase()) !== -1;
      }).first();
    }

    // final fallback: match by last label segment
    if ((!$match || !$match.length) && lastSegSlug) {
      $match = $(`.sccc-collapsible-item`).filter(function () {
        const r = ($(this).attr('data-route') || "").toString();
        const txt = ($(this).text() || "").toString().trim().toLowerCase();
        return slugify(txt) === lastSegSlug || txt === lastSeg;
      }).first();
    }

    console.log('route lookup', { raw: route, normalized: normalizedRoute, slug: slugRoute, last: lastSeg, doctype: routeDoctype, found: $match.length });

    if ($match && $match.length) {
      // clear selection everywhere (collapsible items, module select, tools)
      $('.sccc-collapsible-item').removeClass('selected');
      $match.addClass('selected');
      console.log('---???????????',$match)

     // also highlight corresponding module select item (if present)
     try {
       const mRoute = ($match.attr('data-route') || '').toString();
       let $selItem = $();
       if (mRoute) {
         // try matching by exact value (native select uses slugs)
         $selItem = $root.find(`.sccc-select-item[data-value="${mRoute}"], .sccc-select-item[data-value="${mRoute.replace(/^private\//,'')}"]`);
       }
       if (!$selItem.length) {
         // fallback: match by label text
         const txt = $match.find('.sccc-tool-txt').text().trim();
         if (txt) $selItem = $root.find(`.sccc-select-item`).filter(function () { return ($(this).data('label') || '').toString().trim() === txt; }).first();
       }
       if ($selItem && $selItem.length) {
         $selItem.addClass('selected').attr('aria-selected', 'true');
         const iconHtml = $selItem.find('.sccc-select-item-icn').html() || '';
         $root.find('.sccc-select-trigger .sccc-select-item-icn').html(iconHtml);
          $root.find('.sccc-select-label').text($selItem.data('label') || $selItem.text().trim());
        }
      } catch (e) { /* ignore */ }
       // open parent collapsible/accordion so item is visible
       const $body = $match.closest('.sccc-collapsible-body');
      //  if ($body.length) $body.addClass('show');
       // Close all other collapses
        $('.sccc-collapsible-body').not($body).collapse('hide');

        // Toggle clicked one
        $body.collapse('toggle');
       const $details = $match.closest('details');
       if ($details.length) $details.prop('open', true);
       // scroll into view
       try { $match.get(0).scrollIntoView({ block: "nearest", behavior: "auto" }); } catch (e) {}
     }
    } catch (e) { console.warn("SCCC highlight on page-change error", e); }
  
  });

})();