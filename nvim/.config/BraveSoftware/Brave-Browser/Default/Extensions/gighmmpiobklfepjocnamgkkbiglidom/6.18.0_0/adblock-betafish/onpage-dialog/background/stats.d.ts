import { type Stats } from "./stats.types";
export declare function clearStats(dialogId: string): void;
export declare function getStats(dialogId: string): Stats;
export declare function isStats(candidate: unknown): candidate is Stats;
export declare function setStats(dialogId: string, stats: Stats): void;
