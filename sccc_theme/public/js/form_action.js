// sccc_topbar.js

(function () {
  
    function mountSidebarElements() {
        const $pageHeadPrint = $('.page-actions .custom-actions');
        const $pageHead = $('.frappe-control[data-fieldname="language"]');
        $pageHeadPrint.prepend($pageHead);

        
        const moveToPageActions = [
            '.form-assignments',
            '.form-attachments',
            '.form-tags',
            '.form-shared',
            '.form-sidebar-stats' // for likes and comments
        ];

        const $pageActions = $('.page-actions');

        if ($pageActions.length) {
            // create a wrapper div inside page-actions
            let $wrapper = $pageActions.find('.page-actions .custom-sidebar-wrapper');
            if (!$wrapper.length) {
                $wrapper = $('<div class="custom-sidebar-wrapper"></div>');
                $pageActions.prepend($wrapper);
            }

            // move elements into the wrapper
            moveToPageActions.forEach(selector => {
                const $element = $('.form-sidebar').find(selector);
                if ($element.length) {
                    $wrapper.prepend($element);
                }
            });

            // hide follow button
            $('.form-sidebar-stats .form-follow').hide();
        }
    }
    
    // --- mount ----------------------------------------------------------------
    function start() {
        setTimeout(mountSidebarElements, 2502);

        // Re-mount on form refresh
        // $(document).on('form-refresh', function () {
        //     console.log('----------------------------------------------')
        //     setTimeout(mountSidebarElements, 500);
        // });
        
    }

    // Wait until Frappe booted/DOM ready
    if (document.readyState === "complete" || document.readyState === "interactive") {
        start();
    } else {
        document.addEventListener("DOMContentLoaded", start);
    }
    
})();