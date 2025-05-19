import { type LicenseStateBehavior } from "../../ipm/background";
import { type DialogContent } from "../shared";
import { type Timing } from "./timing.types";
export interface DialogBehavior extends LicenseStateBehavior {
    displayDuration: number;
    target: string;
    timing: Timing;
    domainList?: string;
    priority: number;
}
export interface Dialog {
    behavior: DialogBehavior;
    content: DialogContent;
    id: string;
    ipmId?: string;
}
