import { CommandHandler } from "./command-library.types";
import { DeleteBehavior } from "./delete-commands.types";
export declare function isDeleteBehavior(candidate: unknown): candidate is DeleteBehavior;
export declare function setDeleteCommandHandler(handler: CommandHandler): void;
