export declare const maximumProcessableCommands = 100;
export declare const commandStorageKey = "ipm_commands";
export declare const commandStats = "ipm_commands_stats";
export interface Behavior {
}
export interface LicenseStateBehavior extends Behavior {
    licenseStateList?: string;
}
export declare type CommandHandler = (ipmId: string, isInitialization: boolean) => void;
export declare enum CommandName {
    createOnPageDialog = "create_on_page_dialog",
    createTab = "create_tab",
    deleteCommands = "delete_commands"
}
export declare const CommandVersion: Record<CommandName, number>;
export interface CommandMetaData {
    version: number;
    command_name: CommandName;
    ipm_id: string;
    expiry: string;
    attributes?: InternalAttributes;
}
export interface InternalAttributes {
    received: number;
    language: string;
}
export declare type Command = CommandMetaData & Record<string, unknown>;
export interface Content {
}
export interface CommandActor {
    getBehavior: (command: Command) => Behavior | null;
    getContent: (command: Command) => Content | null;
    handleCommand: CommandHandler;
    isValidCommand: (command: Command) => boolean;
    onCommandsProcessed: () => void;
}
export declare enum CommandEventType {
    ipmCancelled = "ipm_cancelled",
    expired = "command_expired"
}
export declare enum DeleteEventType {
    sucess = "deletion_success",
    error = "deletion_error"
}
