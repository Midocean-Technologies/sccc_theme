(function () {
    function mountSidebarElements() {
        const moveToPageActions = [
            '.form-assignments',
            '.form-attachments',
            '.form-tags',
            '.form-shared',
            '.form-sidebar-stats'
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

    function addMyButton() {
        const container = document.querySelector(".custom-actions.hidden-xs.hidden-md");
        if (!container) return;

        const fullPageBtn = Array.from(container.querySelectorAll("button.btn.btn-default.btn-sm.ellipsis"))
                                .find(btn => btn.textContent.includes("Full Page"));

        if (fullPageBtn && !container.querySelector(".my-custom-btn")) {
            const newBtn = document.createElement("button");
            newBtn.className = "btn btn-default btn-sm ellipsis my-custom-btn";
            newBtn.textContent = "My Button";

            fullPageBtn.insertAdjacentElement("beforebegin", newBtn);

            newBtn.addEventListener("click", () => alert("Button clicked!"));
        }
    }

    function start() {
        setTimeout(mountSidebarElements, 2500);

        const observer = new MutationObserver(() => addMyButton());
        observer.observe(document.body, { childList: true, subtree: true });

        addMyButton();
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        start();
    } else {
        document.addEventListener("DOMContentLoaded", start);
    }
})();
