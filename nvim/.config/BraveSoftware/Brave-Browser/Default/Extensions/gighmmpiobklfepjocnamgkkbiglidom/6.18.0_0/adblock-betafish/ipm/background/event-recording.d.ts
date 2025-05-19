import { CommandName } from "./command-library.types";
export declare function recordEvent(ipmId: string | null, command: CommandName, name: string): void;
export declare function recordGenericEvent(name: string): void;
