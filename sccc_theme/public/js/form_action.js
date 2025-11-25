console.log("sccc_theme: form_action.js loaded");
(function () {
  
    function mountSidebarElements() {
        const $pageHeadPrint = $('.page-actions .custom-actions');
        const $pageHead = $('.frappe-control[data-fieldname="language"]');
        $pageHeadPrint.prepend($pageHead);

        const moveToPageActions = [
            '.form-assignments',
            '.form-attachments',
            // '.form-tags',
            // '.form-shared',
            // '.form-sidebar-stats' // for likes and comments
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
    
    function start() {
        setTimeout(mountSidebarElements, 2502);
        
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        start();
    } else {
        document.addEventListener("DOMContentLoaded", start);
    }
    
})();