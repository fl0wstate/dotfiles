let lastLocation = location.href;

// On first opening

window.onload = function() {
    browser.storage.local.get(getConstNotSyncing.extensionIsEnabledData, function (obj) {
        
        const isEnabled = obj[getConstNotSyncing.extensionIsEnabledData] ?? true;
       
        if (isEnabled == true) {
            pageIsChanged();
            runContentChangesObserver();
        }
    })
};

// Content and attributes changes observer

function runContentChangesObserver() {
    new MutationObserver(() => {
        
        const url = location.href;
        
        if (lastLocation != url) {
            lastLocation = url;
            pageIsChanged();
        }
    }).observe(document, {subtree: true, childList: true});
}

// Detect page where should run an action

function pageIsChanged() {
    const urlWithoutParameters = location.protocol + '//' + location.host + location.pathname;
    const locationHref = location.href;
    
    // Search Page
    if (locationHref.includes(searchPageUrlPart)) {
        searchPageIsOpened();
        
    // Video Page
    } else if (locationHref.includes(videoPageUrlPart)) {
        videoPageIsOpened();
        
    // Shorts Page
    } else if (locationHref.includes(shortsPageUrlPart)) {
        shortsPageIsOpened();
        
    // Channel Page
    } else if ((locationHref.includes(channelPageUrlPart1)) || (locationHref.includes(channelPageUrlPart2))) {
        channelPagesIsOpened();

    // Home Page
    } else if ((urlWithoutParameters == homePageUrlPartDesktop) || (urlWithoutParameters == homePageUrlPartMobile)) {
        homePageIsOpened();
    }
}
