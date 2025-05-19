export function stopIconAnimation(): Promise<any>;
export function startIconAnimation(type: string): void;
export function resetBadgeText(): Promise<void>;
export function showIconBadgeCTA(reason: any): Promise<void>;
export function getNewBadgeTextReason(): string;
export const statsInIconKey: "current_show_statsinicon";
export namespace NEW_BADGE_REASONS {
    const FREE_DC_UPDATE: string;
    const SEVEN_DAY: string;
    const UPDATE: string;
    const UPDATE_FOR_EVERYONE: string;
    const VPN_CTA: string;
}
