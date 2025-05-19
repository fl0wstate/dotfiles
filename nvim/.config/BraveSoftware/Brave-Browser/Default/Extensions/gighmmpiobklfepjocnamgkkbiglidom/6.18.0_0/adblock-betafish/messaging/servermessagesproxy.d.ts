declare class ServerMessages {
    static recordGeneralMessage: (msg: any, callback: any, additionalParams: any) => void;
    static recordAnonymousErrorMessage: (msg: any, callback: any, additionalParams: any) => void;
}
