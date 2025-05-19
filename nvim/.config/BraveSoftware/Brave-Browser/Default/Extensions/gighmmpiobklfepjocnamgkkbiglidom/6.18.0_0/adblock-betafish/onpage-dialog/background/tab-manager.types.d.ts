import { Tabs } from "webextension-polyfill";
export declare const lastShownKey = "onpage_dialog_last_shown";
export declare const coolDownPeriodKey = "onpage_dialog_cool_down";
export declare enum DialogEventType {
    buttonClicked = "dialog_button_clicked",
    closed = "dialog_closed",
    ignored = "dialog_ignored",
    injected = "dialog_injected",
    injected_error = "dialog_injected_error",
    initial_ping = "ping.initial",
    received = "received"
}
export declare enum ShowOnpageDialogResult {
    ignored = 0,
    rejected = 1,
    shown = 2,
    error = 3
}
export declare enum DialogErrorEventType {
    error_no_dialog_found = "error.no_ipm",
    get_no_dialog_found = "get.no_dialog",
    ping_no_dialog_found = "ping.no_dialog"
}
export interface TabPage {
    id: Tabs.Tab["id"];
    url: URL;
}
