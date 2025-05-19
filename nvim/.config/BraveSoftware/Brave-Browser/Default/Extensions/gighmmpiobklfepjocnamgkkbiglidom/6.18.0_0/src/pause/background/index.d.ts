import { FilterOrigin } from "../../filters/shared";
declare const pausedFilterText1 = "@@*";
declare const pausedFilterText2 = "@@*$document";
declare const adblockIsPaused: (newValue?: boolean) => boolean | undefined;
declare const allowlistTab: (tabURL: string, origin?: FilterOrigin) => Promise<void>;
declare const removeAllAllowlistRulesForTab: (tabId: number) => Promise<boolean>;
declare const isTabTemporaryAllowlisted: (tabId: number) => Promise<boolean>;
export { allowlistTab, isTabTemporaryAllowlisted, removeAllAllowlistRulesForTab, adblockIsPaused, pausedFilterText1, pausedFilterText2, };
