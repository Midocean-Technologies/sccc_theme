// sccc_topbar.js

(function () {
  // --- constants ------------------------------------------------------------
  const IDS = {
    BAR: "sccc-topbar",
    STYLE: "sccc-topbar-style",
  };

  // --- CSS (scoped, no !important needed) -----------------------------------
  const CSS = `
/* root layout variables */
:root {
  --sccc-left: 0px;
  --sccc-right: 0px;    /* ✅ new for RTL */
  --sccc-top-h: 58px;
  --sccc-rightwidth: calc(100% - var(--sccc-left) - var(--sccc-right));
}


/* remove native Frappe top navbar completely */
header.navbar.navbar-expand { display: none; }

/* make room for our fixed topbar across the app */
body {
  /* push everything down; keep in sync with --sccc-top-h */
  padding-top: var(--sccc-top-h);
}

/* our topbar */
#${IDS.BAR}.sccc-topbar {
  position: fixed;
  top: 0;
  left: var(--sccc-left);
  right: var(--sccc-right);
  width: var(--sccc-rightwidth);
  height: var(--sccc-top-h);
  z-index: 1050; /* above content, below modals */
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background: var(--bg-color, #fff);
  border-bottom: 1px solid var(--border-color, #e5e7eb);
}

/* sections */
.sccc-left, .sccc-center, .sccc-right { display: flex; align-items: center; min-width: 0; }
.sccc-left { gap: 10px; }
.sccc-center { justify-content: center; }
.sccc-right { justify-content: flex-end; gap: 8px; }

/* pill/title */
#navbar-breadcrumbs li:first-child {
  font-weight: 600;
  font-size: 14px;
  padding: 6px 10px;
  background: var(--control-bg, #f6f7f9);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0px;
  max-width: 40vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#navbar-breadcrumbs li:first-child a:before {content: unset !important}
/* search */
.sccc-search {
  display: flex; align-items: center; gap: 8px;
  // width: min(520px, 60vw);
  padding: 6px 10px;
  background: var(--control-bg, #f6f7f9);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0px;
}
.sccc-search input {
  width: 100%;
  border: 0; outline: none; background: transparent;
  font-size: 14px;
}

/* icon buttons */
.sccc-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  color: var(--text-color, #111827);
  cursor: pointer;
}
.sccc-icon:hover { background: #eef0f3; }

/* avatar look */
.sccc-avatar { border-radius: 0px; }



/* ensure page-head comes AFTER the bar in visual flow */
.page-head { margin-top: 0; } /* body padding already shifts everything */
`;

  // --- HTML -----------------------------------------------------------------
  function buildTopbarHTML() {
    return `
<div id="${IDS.BAR}" class="sccc-topbar navbar" role="region" aria-label="SCCC Top Bar">
  <div class="sccc-left" style="width:700px;">
    <button class="sccc-icon sccc-panes" title="Toggle Navigation" aria-label="Toggle Navigation">
      <img src ="/assets/sccc_theme/images/Header.svg" alt="Header" style="width:100px;"/>
    </button>
    <nav style=" margin:0 !important;" class="sccc-breadcrumbs nav d-none d-sm-flex" id="navbar-breadcrumbs"></nav>
  </div>

  <div class="sccc-center">
    <div class="sccc-search">
      <span class="sccc-search-icn">
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10 4a6 6 0 014.58 9.83l4.3 4.3-1.42 1.41-4.3-4.29A6 6 0 1110 4zm0 2a4 4 0 100 8 4 4 0 000-8z"></path></svg>
      </span>
      <input id="sccc-search-input" type="text" placeholder="Search" autocomplete="off" />
    </div>
  </div>

  <div class="sccc-right">
    <button class="sccc-icon" id="sccc-lang-btn" data-act="lang" title="Language" aria-label="Language">
        <span id="sccc-lang-display" style="font-size:12px;">En</span>
      </button>
    <button class="sccc-icon" data-route="integrations" title="Integrations" aria-label="Integrations">
      <img class="es-icon icon-md" src ="/files/integ.svg" alt="integration"/>
    </button>
    <button class="sccc-icon" data-route="calendar-view" title="Calendar" aria-label="Calendar">
      <img class="es-icon icon-md" src ="/files/calendr.svg" alt="calender"/>
    </button>

    <!-- Notifications dropdown (core-compatible) -->
    
    <div class="sccc-icon dropdown dropdown-notifications dropdown-mobile">
        <button
          class="btn-reset nav-link notifications-icon text-muted"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          title="Notifications"
          aria-label="Notifications"
        >
          <span class="notifications-seen">
            <span class="sr-only">${__("No new notifications")}</span>
            <svg class="es-icon icon-md" style="stroke:#2523239e;"><use href="#es-line-notifications"></use></svg>
          </span>
          <span class="notifications-unseen">
            <span class="sr-only">${__("You have unseen notifications")}</span>
            <svg class="es-icon icon-md"><use href="#es-line-notifications-unseen"></use></svg>
          </span>
        </button>
        <div class="dropdown-menu notifications-list dropdown-menu-right" role="menu">
          <div class="notification-list-header">
            <div class="header-items"></div>
            <div class="header-actions"></div>
          </div>
          <div class="notification-list-body">
            <div class="panel-notifications"></div>
            <div class="panel-events"></div>
            <div class="panel-changelog-feed"></div>
          </div>
        </div>
      </div>
  </div>
</div>`;
  }

/* <i class="fa fa-calendar"></i>
<i class="fa fa-trash"></i>
<i class="fa fa-bell"></i>
<i class="fa fa-adjust" aria-hidden="true"></i> */

  // --- rail / offset helpers ------------------------------------------------
  function measureLeftSidebar() {
    // Prefer explicit var if you ever set it in CSS: :root { --sccc-rail-w: 264px; }
    const cssVar = getComputedStyle(document.documentElement).getPropertyValue("--sccc-rail-w").trim();
    if (cssVar) {
      const n = parseFloat(cssVar);
      if (!isNaN(n) && n > 0) return n;
    }

    // Your fixed rail
    const rail = document.querySelector("#sccc-rail-fixed");
    if (rail && rail.offsetParent !== null) {
      let w = rail.getBoundingClientRect().width;
      if (!w) {
        const cw = parseFloat(getComputedStyle(rail).width);
        if (!isNaN(cw) && cw > 0) w = cw;
      }
      return Math.max(0, Math.round(w));
    }

    // Fallback to standard side sections if your rail is hidden
    const candidates = [
      ".layout-side-section",
      ".page-content .layout-side-section",
      ".list-sidebar.overlay-sidebar"
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.offsetParent !== null) {
        const w = el.getBoundingClientRect().width || parseFloat(getComputedStyle(el).width) || 0;
        if (w > 0) return Math.round(w);
      }
    }
    return 0;
  }

  function ensureLeftOffset() {
    const isRTL = frappe.utils.is_rtl && frappe.utils.is_rtl(frappe.boot.lang);
    const sidebar = document.getElementById("sccc-rail-fixed");
    const isClosed = sidebar && sidebar.classList.contains("closed");
      if (isRTL) {
        const right = isClosed ? 0 : measureLeftSidebar();
        document.documentElement.style.setProperty("--sccc-right", `${right}px`);
        document.documentElement.style.setProperty("--sccc-left", `0px`);
        document.documentElement.style.setProperty("--sccc-rightwidth", `calc(100% - ${right}px)`);
      } else {
        const left = measureLeftSidebar();
        document.documentElement.style.setProperty("--sccc-left", `${left}px`);
        document.documentElement.style.setProperty("--sccc-right", `0px`);
        document.documentElement.style.setProperty("--sccc-rightwidth", `calc(100% - ${left}px)`);
      }

  }

  function observeFixedRail() {
    const rail = document.querySelector("#sccc-rail-fixed");
    if (!rail) return;

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => ensureLeftOffset());
      ro.observe(rail);
    }

    const mo = new MutationObserver(() => ensureLeftOffset());
    mo.observe(rail, { attributes: true, attributeFilter: ["class", "style"] });

    rail.addEventListener("transitionend", (e) => {
      if (e.propertyName === "width" || e.propertyName === "transform" || e.propertyName === "left") {
        ensureLeftOffset();
      }
    });
  }

  function attachToggleSync() {
    document.querySelectorAll(".sidebar-toggle-btn, .sccc-panes").forEach((btn) => {
      btn.addEventListener("click", () => {
        ensureLeftOffset();              // now
        setTimeout(ensureLeftOffset, 16);  // next frame
        setTimeout(ensureLeftOffset, 260); // typical transition end
        const sidebar = document.getElementById("sccc-rail-fixed");
        const topbar = document.getElementById("sccc-topbar");
        const isRTL = frappe.utils.is_rtl && frappe.utils.is_rtl(frappe.boot.lang);

        sidebar.classList.toggle("closed");
        if(sidebar.classList.contains("closed")){
          if (isRTL) {
            document.body.classList.remove("sccc-rail-rtl-padding");
          } else {
            document.body.classList.remove("sccc-rail-padding");
          }
          topbar.classList.add("expanded");
        }
        else {
          if (isRTL) {
            document.body.classList.add("sccc-rail-rtl-padding");
          } else {
            document.body.classList.add("sccc-rail-padding");
          }
          topbar.classList.remove("expanded");
        }
      });
    });
  }

  // --- utility --------------------------------------------------------------
  function injectStyleOnce() {
    if (document.getElementById(IDS.STYLE)) return;
    const tag = document.createElement("style");
    tag.id = IDS.STYLE;
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }

  function removeFrappeNavbar() {
    const n = document.querySelector("header.navbar.navbar-expand");
    if (n) n.remove();
  }

  function syncTitle() {
  const pill = document.getElementById("sccc-title-pill");
  const crumbs = document.getElementById("sccc-breadcrumbs");
  if (!pill || !crumbs) return;

  function slugify(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-\/]/g, "-")
      .replace(/\-+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  let label = "Home";
  let breadcrumbParts = [];

  if (window.frappe && typeof frappe.get_route === "function") {
    const r = frappe.get_route();

    if (Array.isArray(r) && r.length) {
      // remove list/form and empty parts
      let cleanRoute = r.filter((part) => {
        if (!part) return false;
        const p = String(part).toLowerCase();
        // remove list/form + "workspaces"
        return p !== "list" && p !== "form" && p !== "workspaces";
      });


      breadcrumbParts = cleanRoute.map((part, idx, arr) => {
        const raw = String(part);
        let txt;

        // last part is usually docname -> keep as-is (don’t prettify)
        if (idx === arr.length - 1 && arr.length > 1) {
          txt = raw;
        } else {
          // prettify workspace / doctype names
          let pretty = raw.replace(/-/g, " ");
          txt =
            frappe && frappe.utils && frappe.utils.to_title_case
              ? frappe.utils.to_title_case(pretty)
              : pretty.charAt(0).toUpperCase() + pretty.slice(1);
        }

        // handle "New" documents (e.g. ["lead", "new"])
        if (/^new\b/i.test(raw) && arr[0]) {
          txt = "New " + (arr[0].replace(/-/g, " "));
        }

        // build slug array and remove any empty slugs
        const routeSlug = arr
          .slice(0, idx + 1)
          .map(slugify)
          .filter(Boolean);

        return {
          text: txt,
          routeSlug: routeSlug,
        };
      });

      if (breadcrumbParts.length) {
        label = breadcrumbParts[0].text;
      }
    }
  }

  // set title pill to workspace name
  pill.textContent = label;

  // render breadcrumbs
  crumbs.innerHTML = "";

  // helper to get the current route (slugified)
  function getCurrentRouteSlug() {
    if (window.frappe && typeof frappe.get_route === "function") {
      return frappe
        .get_route()
        .filter(Boolean)
        .map(slugify)
        .filter(Boolean);
    }
    // fallback to hash if needed
    if (window.location && window.location.hash) {
      return window.location.hash.replace(/^#/, "").split("/").filter(Boolean);
    }
    return [];
  }

  breadcrumbParts.forEach((part, i) => {
    // skip if no useful slug (render as plain text)
    const isLast = i === breadcrumbParts.length - 1;

    if (!part.routeSlug || part.routeSlug.length === 0) {
      const span = document.createElement("span");
      span.textContent = part.text;
      if (isLast) span.setAttribute("aria-current", "page");
      crumbs.appendChild(span);
    } else {
      if (isLast) {
        // last crumb = current page -> non-clickable
        const span = document.createElement("span");
        span.textContent = part.text;
        span.setAttribute("aria-current", "page");
        crumbs.appendChild(span);
      } else {
        const link = document.createElement("a");
        link.textContent = part.text;
        link.href = "#" + part.routeSlug.join("/");
        link.style.cursor = "pointer";

        link.addEventListener("click", (e) => {
          e.preventDefault();

          // recompute current route at click time for accuracy
          const current = getCurrentRouteSlug();
          const target = part.routeSlug;

          // if target === current, do nothing (prevents changing to "#")
          if (JSON.stringify(current) === JSON.stringify(target)) {
            return;
          }

          if (window.frappe && typeof frappe.set_route === "function") {
            // call frappe navigation with spread args
            frappe.set_route(...target);
          } else {
            // fallback: update hash
            window.location.hash = target.join("/");
          }
        });

        crumbs.appendChild(link);
      }
    }

    if (i < breadcrumbParts.length - 1) {
      const sep = document.createElement("span");
      sep.textContent = " › ";
      sep.classList.add("sep");
      crumbs.appendChild(sep);
    }
  });
}


  function wireActions($root) {
    // route buttons
    $root.querySelectorAll("[data-route]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const route = btn.getAttribute("data-route");
        if (window.frappe && frappe.set_route) frappe.set_route(route);
      });
    });

    // ...existing code...
    // language switcher
    const langBtn = $root.querySelector('[data-act="lang"]');
    if (langBtn) {
      // set initial label from frappe boot if available
      const disp = $root.querySelector("#sccc-lang-display");
      if (disp && window.frappe && frappe.boot && frappe.boot.lang) {
        disp.textContent = String(frappe.boot.lang).slice(0,2).toUpperCase();
      }

      // helper: fetch enabled languages from Language doctype
      function fetchEnabledLanguages() {
        if (!window.frappe || !frappe.call) {
          return Promise.resolve([]);
        }

        // determine current user's language (prefer User.language, fallback to boot.lang)
        const currentUserLang =
          (frappe.boot && frappe.boot.user && frappe.boot.user.language) ||
          (frappe.boot && frappe.boot.lang) ||
          "";
        const norm = (s) => String(s || "").trim().toLowerCase();

        return new Promise((resolve) => {
          frappe.call({
            method: "frappe.client.get_list",
            args: {
              doctype: "Language",
              filters: [["Language", "enabled", "=", 1]],
              fields: ["name", "language_code", "language_name"],
              limit_page_length: 0,
              order_by: "name",
            },
            callback: (r) => {
              const list = (r && r.message) || [];
              // normalize to [{code, label}] and exclude current user's language
              const langs = list
                .map((L) => {
                  const code = (L.language_code || L.name || "").toString();
                  const label = (L.language_name || L.name || code).toString();
                  return { code, label };
                })
                .filter((L) => norm(L.code) !== norm(currentUserLang));
              resolve(langs);
            },
            error: () => resolve([]),
          });
        });
      }

      langBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const MENU_ID = "sccc-lang-menu";
        let menu = document.getElementById(MENU_ID);
        if (menu) {
          menu.remove();
          return;
        }

        // build a simple floating menu
        menu = document.createElement("div");
        menu.id = MENU_ID;
        menu.className = "sccc-lang-menu";
        Object.assign(menu.style, {
          position: "absolute",
          top: (langBtn.getBoundingClientRect().bottom + window.scrollY) + "px",
          right: (window.innerWidth - langBtn.getBoundingClientRect().right + 12) + "px",
          background: "#fff",
          border: "1px solid var(--border-color, #e5e7eb)",
          boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
          zIndex: 2000,
          minWidth: "160px",
          padding: "6px 4px",
        });

        // load languages from server (fallback to frappe.boot.available_languages)
        let langs = [];
        try {
          langs = await fetchEnabledLanguages();
        } catch (err) {
          langs = [];
        }
        if (!langs || langs.length === 0) {
          const bootLangs = (window.frappe && frappe.boot && (frappe.boot.available_languages || frappe.boot.langs)) || ["en"];
          langs = bootLangs.map((L) => {
            const code = typeof L === "string" ? L : (L.code || L.value || L.name || "");
            const label = typeof L === "string" ? L.toUpperCase() : (L.label || code).toString();
            return { code, label };
          });
        }

        // render items
        langs.forEach((L) => {
          const code = (L.code || "").toString();
          const label = (L.label || L.name || code).toString();
          const item = document.createElement("div");
          item.textContent = label;
          item.style.padding = "8px 12px";
          item.style.cursor = "pointer";
          item.style.fontSize = "13px";

          item.addEventListener("click", async () => {
            // Set current user's language field and reload to apply
            const currentUser = (window.frappe && (frappe.session && frappe.session.user)) || (frappe && frappe.boot && frappe.boot.user && frappe.boot.user.name) || null;
            if (!currentUser) {
              // fallback: set cookie and reload
              document.cookie = "home_language=" + encodeURIComponent(code) + "; path=/";
              window.location.reload();
              return;
            }

            // try to set user's language via server
            try {
              await new Promise((resolve) => {
                frappe.call({
                  method: "frappe.client.set_value",
                  args: {
                    doctype: "User",
                    name: currentUser,
                    fieldname: "language",
                    value: code
                  },
                  callback: (r) => {
                    resolve(r);
                  },
                  error: () => resolve(null)
                });
              });
            } catch (err) {
              // ignore and fallback
            }

            // update display and reload to apply language
            const dispNode = document.getElementById("sccc-lang-display");
            if (dispNode) dispNode.textContent = code.slice(0,2).toUpperCase();
            // cleanup menu then reload
            const m = document.getElementById(MENU_ID);
            if (m) m.remove();
            window.location.reload();
          });

          menu.appendChild(item);
        });

        document.body.appendChild(menu);
      });

      // close menu when clicking elsewhere
      document.addEventListener("click", () => {
        const m = document.getElementById("sccc-lang-menu");
        if (m) m.remove();
      });
    }
 // ...existing code...
    

    // clear / reload
    const clearBtn = $root.querySelector('[data-act="clear"]');
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        // if ListView present, clear filters; else reload
        const list = cur_list || (frappe && frappe.views && frappe.views.listview && frappe.views.listview.ListView && frappe.views.listview.ListView.prototype);
        if (window.cur_list && cur_list.filter_area) {
          cur_list.filter_area.clear();
          cur_list.refresh();
        } else {
          frappe && frappe.ui && frappe.ui.toolbar && frappe.ui.toolbar.clear_cache
            ? frappe.ui.toolbar.clear_cache()
            : window.location.reload();
        }
      });
    }

    // search: proxy to existing awesomebar if present
    const searchInput = $root.querySelector("#sccc-search-input");
    if (searchInput) {
      function initAwesomeBar() {
        if (frappe.search && frappe.search.AwesomeBar) {
          const bar = new frappe.search.AwesomeBar();
          bar.setup(searchInput);
          console.log("✅ SCCC AwesomeBar initialized");
          return true;
        }
        return false;
      }

      // Retry until frappe.search.AwesomeBar is ready
      let tries = 0;
      const maxTries = 20;
      const interval = setInterval(() => {
        if (initAwesomeBar() || tries >= maxTries) {
          clearInterval(interval);
        }
        tries++;
      }, 300);
    }


  }

  function insertBarOnce() {
    if (document.getElementById(IDS.BAR)) return document.getElementById(IDS.BAR);

    const barHTML = buildTopbarHTML();
    const tmp = document.createElement("div");
    tmp.innerHTML = barHTML.trim();
    const bar = tmp.firstElementChild;

    // Place BEFORE .page-head (so it becomes the "first div" visually)
    const pageHead = document.querySelector(".page-head");
    if (pageHead && pageHead.parentElement) {
      pageHead.parentElement.insertBefore(bar, pageHead);
    } else {
      // fallback: prepend to body
      document.body.prepend(bar);
    }
    return bar;
  }
  function syncBreadcrumb() {
    const $breadcrumbs = $("#navbar-breadcrumbs");
    $breadcrumbs.empty(); // clear existing breadcrumbs

    // get the page title text
    const titleText = $(".title-text").attr("title");
    if (titleText) {
      $breadcrumbs.append(
        $("<li>").append($("<a>").attr("href", '').text(titleText))
      );
    }
  }
  function onEveryShow() {
    // called on route change/page show
    ensureLeftOffset();
    syncBreadcrumb();
  }

  // --- mount ----------------------------------------------------------------
  function mount() {
    injectStyleOnce();
    removeFrappeNavbar();
    const bar = insertBarOnce();
    wireActions(bar);

    // sync now
    ensureLeftOffset();
    syncBreadcrumb();

    // observers and hooks
    observeFixedRail();
    attachToggleSync();

    // Frappe "show" event on page wrappers updates title/offset reliably
    $(document).on("show", ".page-container, .page-head, .page-content, .title-text, #sccc-module-select_", onEveryShow);
    const titleNode = document.querySelector(".title-text");
    if (titleNode) {
        const observer = new MutationObserver(() => {
            syncBreadcrumb();
        });

        observer.observe(titleNode, {
            characterData: true,   // changes inside text nodes
            subtree: true,         // include all child nodes
            attributes: true,      // catch attribute changes
            attributeFilter: ["title"] // only watch title attribute
        });
    }
    // Also watch route changes (SPA)
    if (window.frappe && frappe.router) {
      frappe.router.on("change", onEveryShow);
    }

    // handle window resizes
    window.addEventListener("resize", ensureLeftOffset, { passive: true });

    // small delays to catch late CSS/layout
    setTimeout(ensureLeftOffset, 16);
    setTimeout(ensureLeftOffset, 260);
    // additional delay for breadcrumb sync on page load/refresh
    setTimeout(syncBreadcrumb, 500);
  }

  // Wait until Frappe booted/DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();