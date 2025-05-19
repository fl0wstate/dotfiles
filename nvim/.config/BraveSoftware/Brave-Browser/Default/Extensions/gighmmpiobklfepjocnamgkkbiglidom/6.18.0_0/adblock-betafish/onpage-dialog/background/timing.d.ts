import { type Tabs } from "webextension-polyfill";
import { type Dialog } from "./dialog.types";
import { type Stats } from "./stats.types";
import { Timing } from "./timing.types";
export declare function isTiming(candidate: unknown): candidate is Timing;
export declare function shouldBeDismissed(dialog: Dialog, stats: Stats): boolean;
export declare function shouldBeShown(tab: Tabs.Tab, dialog: Dialog, stats: Stats): Promise<boolean>;
export declare function start(): Promise<void>;
