console.log("Custom Print Header JS Loaded..,");

function moveLanguageFieldAfterSpan() {
    
    const body = document.querySelector("body[data-route]");
    if (!body) {
        setTimeout(moveLanguageFieldAfterSpan, 200);
        return;
    }
    const route = body.getAttribute("data-route") || "";
    if (!route.startsWith("print/")) {
        return;
    }

    
    const langDiv = document.querySelector(
        'div.frappe-control.input-max-width[data-fieldname="language"]'
        
    );

    
    const allActions = document.querySelectorAll(
        "div.custom-actions.hidden-xs.hidden-md"
    );
    let headerActions = null;
    let firstSpan = null;

    allActions.forEach(actions => {
        const span = actions.querySelector(
            "span.inner-page-message.text-muted.small"
        );
        if (span && !headerActions) {
            headerActions = actions;
            firstSpan = span;
        }
    });

    if (!langDiv || !headerActions || !firstSpan) {
        setTimeout(moveLanguageFieldAfterSpan, 300);
        return;
    }

    
    if (
        langDiv.id === "lang-moved" &&
        langDiv.parentElement === headerActions
    ) {
        return;
    }

    langDiv.id = "lang-moved";
    langDiv.style.marginLeft = "10px";
    langDiv.style.marginRight = "8px";
    langDiv.style.display = "inline-flex";
    langDiv.style.alignItems = "center";
    langDiv.style.verticalAlign = "middle";
    langDiv.style.width = "120px";

    
    if (firstSpan.nextSibling) {
        headerActions.insertBefore(langDiv, firstSpan.nextSibling);
    } else {
        headerActions.appendChild(langDiv);
    }

     const leftSidebar = document.querySelector(
        "div.col-lg-2.layout-side-section.print-preview-sidebar"
    );

    if (leftSidebar) {
        const leftLangField = leftSidebar.querySelector(
            'div.frappe-control.input-max-width[data-fieldname="language"]'
        );

        if (leftLangField) {
            leftLangField.style.display = "none";
        }
    }
}




document.addEventListener("DOMContentLoaded", function () {
    
    setTimeout(moveLanguageFieldAfterSpan, 400);
    setInterval(moveLanguageFieldAfterSpan, 800);
});
