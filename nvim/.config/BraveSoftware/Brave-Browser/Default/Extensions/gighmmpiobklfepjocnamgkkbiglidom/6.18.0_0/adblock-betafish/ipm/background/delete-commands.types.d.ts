import type { Behavior, Command } from "./command-library.types";
export interface DeleteBehavior extends Behavior {
    commandIds: string[];
}
export declare const deleteAllKey = "__all__";
export interface DeleteParams {
    commands: string;
}
export declare type DeleteCommand = Command & DeleteParams;
