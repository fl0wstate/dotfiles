import { type Command } from "../../../ipm/background";
import { type Timing } from "../timing.types";
export declare const defaultPriority = 1;
export interface DialogParams {
    timing: Timing;
    display_duration?: number;
    sub_title: string;
    upper_body: string;
    lower_body?: string;
    button_label: string;
    button_target: string;
    domain_list?: string;
    license_state_list?: string;
    priority?: number;
}
export declare type DialogCommand = Command & DialogParams;
