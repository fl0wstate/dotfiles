export declare const injectionOrigins: string[];
export declare const getInfoCommand = "getInjectionInfo";
export interface InjectionInfo {
    isPremium: boolean;
    version: string;
    id: string;
    blockCount: number;
    experimentFlags: Record<string, unknown>;
}
