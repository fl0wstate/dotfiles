export default messageValidator;
declare const messageValidator: MessageValidator;
declare class MessageValidator {
    generateNewRandomText: () => any;
    randomtext: any;
    validateMessage: (message: any) => Promise<any>;
}
