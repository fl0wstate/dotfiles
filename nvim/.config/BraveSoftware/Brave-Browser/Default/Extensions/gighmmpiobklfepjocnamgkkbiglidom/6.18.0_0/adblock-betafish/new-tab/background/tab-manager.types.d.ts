export declare const blockCountQueryParameter = "bc";
export declare const lastShownKey = "new_tab_last_shown";
export declare const coolDownPeriodKey = "new_tab_cool_down";
export declare enum NewTabEventType {
    created = "tab_created",
    loaded = "tab_loaded",
    received = "received",
    has_content = "has_content"
}
export declare enum NewTabErrorEventType {
    noBehaviorFound = "error_no_behavior",
    licenseStateNoMatch = "license_state_no_match",
    noUrlFound = "error_no_url",
    tabCreationError = "tab_creation_error"
}
export declare enum NewTabExitEventType {
    admin = "newtab_admin",
    disabled = "newtab_disabled"
}
