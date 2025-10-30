/* global frappe, $ */
(function () {
  const LOG = (...a) => console.debug("%c[SCCC workspace]", "color:#8b5cf6;font-weight:600", ...a);
  const MOVED_ATTR = "data-sccc-moved";
  const HIDDEN_SEL = ".btn-edit-workspace, .btn-new-workspace";

  // inject strong CSS to hide original workspace buttons unless moved
  function injectHideCSS() {
    const id = "sccc-hide-workspace-buttons-style";
    if (document.getElementById(id)) return;
    const css = `
      /* hide originals unless marked as moved */
      .btn-edit-workspace:not([${MOVED_ATTR}="1"]),
      .btn-new-workspace:not([${MOVED_ATTR}="1"]) {
        display: none !important;
      }
    `;
    const s = document.createElement("style");
    s.id = id;
    s.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(s);
  }

  // function hideWorkspaceButtons() {
  //   console.log("Hiding workspace buttons in edit mode");
  //   if ($(".layout-main-section").hasClass("edit-mode")) {
  //       $(HIDDEN_SEL).hide();
  //   } else {
  //     console.log("Showing workspace buttons");
  //     $(HIDDEN_SEL).show();
  //   }
  // }

  function findHeaderTarget() {
    const targets = [
      ".page-head .page-head-content",
      ".page-head .page-actions",
      ".page-head .title-area",
      ".page-head"
    ];
    for (const sel of targets) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function isWorkspaceRoute() {
    try {
      if (window.frappe && typeof frappe.get_route === "function") {
        const r = frappe.get_route() || [];
        const r0 = (r[0] || "").toString().toLowerCase();
        if (r0 === "workspace" || r0 === "workspaces") return true;
      }
    } catch (e) {}
    // fallback: detect workspace container in DOM by common attributes/ids
    return Boolean(
      document.querySelector(".workspace") ||
      document.querySelector("[data-page-type='workspace']") ||
      document.querySelector('[data-page-route="Workspaces"]') ||
      document.getElementById("page-Workspaces")
    );
  }

  // Move both edit + new buttons into the page head when on a workspace page
  function moveWorkspaceButtonsToHeader() {
    const target = findHeaderTarget();
    if (!target) return false;
    if ($(".layout-main-section").hasClass("edit-mode")) return false;

    // collect both buttons (edit first, then new)
    const selectors = [".btn-edit-workspace", ".btn-new-workspace"];
    let movedAny = false;

    selectors.forEach(sel => {
      const btn = document.querySelector(sel);
      if (!btn) return;

      // if already moved & inside target, ensure visible
      if (btn.hasAttribute(MOVED_ATTR) && target.contains(btn)) {
        btn.style.display = "";
        movedAny = true;
        return;
      }

      // hide other duplicates (keep node but hidden)
      document.querySelectorAll(selectors.join(", ")).forEach(n => {
        if (n === btn) return;
        n.style.display = "none";
      });

      // move the button (preserve listeners) and mark it
      btn.setAttribute(MOVED_ATTR, "1");
      btn.classList.add("sccc-moved-edit-btn");
      // ensure data-label exists (empty) on moved node
      try { btn.setAttribute("data-label", ""); } catch (e) {}
      btn.style.display = ""; // ensure visible in header
      target.appendChild(btn);
      movedAny = true;
    });

    if (movedAny) {
      LOG("Moved workspace action buttons into header", target);
    } else {
      LOG("No workspace action buttons found to move");
    }
    return movedAny;
  }

  function hideMovedButtonInHeader() {
    // hide any moved workspace buttons in header (but keep in DOM)
    document.querySelectorAll(`.btn-edit-workspace[${MOVED_ATTR}], .btn-new-workspace[${MOVED_ATTR}]`)
      .forEach(n => { n.style.display = "none"; });
  }

  function handlePlacement() {
    if (isWorkspaceRoute()) {
      moveWorkspaceButtonsToHeader();
      // hideWorkspaceButtons(); 
    } else {
      hideMovedButtonInHeader();
    }
  }

  // observe DOM for late inserted buttons/header
  const observer = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      if (!m.addedNodes) continue;
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.matches && (n.matches(".btn-edit-workspace") || n.matches(".btn-new-workspace") || n.matches(".page-head") || n.matches(".page-head-content"))) {
          relevant = true;
          break;
        }
        if (n.querySelector && (n.querySelector(".btn-edit-workspace") || n.querySelector(".btn-new-workspace") || n.querySelector(".page-head"))) {
          relevant = true;
          break;
        }
      }
      if (relevant) break;
    }
    if (relevant) {
      // small delay to let page fragments settle
      setTimeout(handlePlacement, 40);
    }
  });

  function startObserver() {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function start() {
    injectHideCSS();
    handlePlacement();
    startObserver();
    setTimeout(function () {
      const $btn = $('.btn-edit-workspace');
      const $newbtn = $('.btn-new-workspace');

      $btn.find('span').text('Edit Dashboard');
      $btn.css('background', '#ec0552');
      $btn.css('color', 'white');
      $newbtn.find('span').text('');
      $newbtn.css('border', '1px solid #ec0552');
      $newbtn.css('color', '#ec0552');
      $newbtn.css('background', 'white');
      $btn.find('svg').hide();
    }, 500);

    // re-run on route changes / Frappe page show events
    $(document).on("show route:change", () => setTimeout(handlePlacement, 40));
    $(document).on("click", ".btn-edit-workspace", function() {
      $(HIDDEN_SEL).hide();
    });
    $(document).on("click", ".btn.btn-secondary.btn-default", function() {
      console.log("Default button clicked");
      $(HIDDEN_SEL).show();
    });
    if (window.frappe && frappe.router && typeof frappe.router.on === "function") {
      try { frappe.router.on("change", () => setTimeout(handlePlacement, 80)); } catch (e) {}
    }

    LOG("workspace header button handler started");
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }

})();