export default ServerMessages;
declare namespace ServerMessages {
    export { recordAdreportMessage };
    export { recordAdWallMessage };
    export { recordAnonymousMessage };
    export { recordAnonymousErrorMessage };
    export { recordErrorMessage };
    export { recordGeneralMessage };
    export { recordStatusMessage };
    export { sendMessageToBackupLogServer };
    export { recordOptOutMessage };
    export { recordAllowlistEvent };
}
declare function recordAdreportMessage(msg: any, callback: any, additionalParams: any): void;
declare function recordAdWallMessage(msg: any, additionalParams: any): void;
declare function recordAnonymousMessage(msg: any, queryType: any, callback: any, additionalParams: any): void;
declare function recordAnonymousErrorMessage(msg: any, callback: any, additionalParams: any): void;
declare function recordErrorMessage(msg: any, additionalParams: any, callback: any): void;
declare function recordGeneralMessage(msg: any, callback: any, additionalParams: any): void;
declare function recordStatusMessage(msg: any, callback: any, additionalParams: any): void;
declare function sendMessageToBackupLogServer(msg: any, errorMsg: any, queryType?: string): Promise<void>;
declare function recordOptOutMessage(): Promise<void>;
declare function recordAllowlistEvent(eventName: any, allowlistDuration: any): Promise<void>;
