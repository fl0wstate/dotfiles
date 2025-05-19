export declare enum FlavorType {
    chrome = "E",
    edge = "CM",
    firefox = "F"
}
export interface UserAgentInfo {
    flavor: FlavorType;
    os: string;
    osVersion: string;
    browserVersion: string;
}
