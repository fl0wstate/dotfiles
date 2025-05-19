import { type LocaleInfo } from "../../i18n/background";
import { type Message } from "../../polyfills/shared";
import { type DialogContent } from "./dialog.types";
export interface HideMessage extends Message {
    type: "onpage-dialog.hide";
}
export interface PingMessage extends Message {
    type: "onpage-dialog.ping";
    displayDuration: number;
}
export interface ResizeMessage extends Message {
    type: "onpage-dialog.resize";
    height: number;
}
export interface ShowMessage extends Message {
    type: "onpage-dialog.show";
    platform: string;
}
export interface StartInfo {
    content: DialogContent;
    localeInfo: LocaleInfo;
}
