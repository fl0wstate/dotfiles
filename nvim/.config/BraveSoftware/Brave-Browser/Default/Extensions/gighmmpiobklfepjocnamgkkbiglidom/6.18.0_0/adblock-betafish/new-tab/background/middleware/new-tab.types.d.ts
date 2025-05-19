import { LicenseStateBehavior, Command } from "../../../ipm/background";
export declare enum CreationMethod {
    default = "default",
    force = "force"
}
export declare const defaultCreationMethod = CreationMethod.default;
export declare const defaultPriority = 1;
export interface NewTabBehavior extends LicenseStateBehavior {
    target: string;
    method: CreationMethod;
    priority: number;
}
export interface NewTab {
    behavior: NewTabBehavior;
    ipmId: string;
}
export interface NewTabParams {
    url: string;
    license_state_list?: string;
    method?: `${CreationMethod}`;
    priority?: number;
}
export declare type NewTabCommand = Command & NewTabParams;
