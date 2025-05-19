import { CommandHandler } from "../../../ipm/background";
import { NewTabBehavior } from "./new-tab.types";
export declare function isNewTabBehavior(candidate: unknown): candidate is NewTabBehavior;
export declare function setNewTabCommandHandler(handler: CommandHandler, onCommandsProcessed: () => void): void;
