import { type DialogContent } from "../shared";
import { type Dialog, type DialogBehavior } from "./dialog.types";
export declare function isDialog(candidate: unknown): candidate is Dialog;
export declare function isDialogBehavior(candidate: unknown): candidate is DialogBehavior;
export declare function isDialogContent(candidate: unknown): candidate is DialogContent;
