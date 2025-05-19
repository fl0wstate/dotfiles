import { NewTab } from "./middleware";
export declare function compareNewTabRequestsByPriority(newTabA: NewTab, newTabB: NewTab): number;
export declare function isCoolDownPeriodOngoing(): Promise<boolean>;
