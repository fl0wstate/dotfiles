export interface Message {
    type: string;
}
export interface ErrorMessage extends Message {
    error: string;
}
export interface AdWallMessage extends Message {
    userLoggedIn: string;
}
