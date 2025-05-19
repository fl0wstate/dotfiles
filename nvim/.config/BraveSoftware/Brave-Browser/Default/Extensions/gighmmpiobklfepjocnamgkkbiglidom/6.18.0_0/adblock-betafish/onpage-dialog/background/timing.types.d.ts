export declare enum Timing {
    afterWebAllowlisting = "after_web_allowlisting",
    immediate = "immediate",
    revisitWebAllowlisted = "revisit_web_allowlisted_site",
    afterNavigation = "after_navigation"
}
export interface TimingConfiguration {
    cooldownDuration: number;
    maxAllowlistingDelay?: number;
    maxDisplayCount: number;
    minAllowlistingDelay?: number;
}
