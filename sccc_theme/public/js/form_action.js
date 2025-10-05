(function () {

    function mountSidebarElements() {
        const moveToPageActions = [
            '.form-assignments',
            '.form-attachments',
            '.form-tags',
            '.form-shared',
            '.form-sidebar-stats',
            '.awesomplete',
            '.awesomplete .input-with-feedback'
        ];

        const $pageActions = $('.page-actions');

        if ($pageActions.length) {
            let $wrapper = $pageActions.find('.page-actions .custom-sidebar-wrapper');
            if (!$wrapper.length) {
                $wrapper = $('<div class="custom-sidebar-wrapper"></div>');
                $pageActions.prepend($wrapper);
            }

            moveToPageActions.forEach(selector => {
                const $element = $('.form-sidebar').find(selector);
                if ($element.length) {
                    $wrapper.prepend($element);
                }
            });

            $('.form-sidebar-stats .form-follow').hide();
        }
    }

    function updateUserLanguage(lang) {
        frappe.call({
            method: "frappe.client.set_value",
            args: {
                doctype: "User",
                name: frappe.session.user,
                fieldname: "language",
                value: lang
            },
            callback: function (r) {
                if (r.message) {
                    // Reload the page instead of showing a message
                    location.reload();
                }
            }
        });
    }


    function addLanguageDropdown() {
        const container = document.querySelector(".custom-actions.hidden-xs.hidden-md");
        if (!container) return;

        const fullPageBtn = Array.from(container.querySelectorAll("button.btn.btn-default.btn-sm.ellipsis"))
                                .find(btn => btn.textContent.includes("Full Page"));

        if (fullPageBtn && !container.querySelector(".lang-select")) {
            const select = document.createElement("select");
            select.className = "btn btn-default btn-sm ellipsis lang-select";
            select.style.marginRight = "5px";

            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Choose Language";
            placeholder.selected = true;
            placeholder.disabled = true;

            const optionEng = document.createElement("option");
            optionEng.value = "en";
            optionEng.textContent = "en";

            const optionAr = document.createElement("option");
            optionAr.value = "ar";
            optionAr.textContent = "ar";

            select.appendChild(placeholder);
            select.appendChild(optionEng);
            select.appendChild(optionAr);

            fullPageBtn.insertAdjacentElement("beforebegin", select);

            select.addEventListener("change", () => {
                const selectedLang = select.value;
                updateUserLanguage(selectedLang);
            });
        }
    }

    function start() {
        setTimeout(mountSidebarElements, 1000);

        const observer = new MutationObserver(() => addLanguageDropdown());
        observer.observe(document.body, { childList: true, subtree: true });

        addLanguageDropdown();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        start();
    } else {
        document.addEventListener("DOMContentLoaded", start);
    }

})();
