import type { ListenProps, Port, PortEventListener } from "./api.types";
export declare function addConnectListener(listener: PortEventListener): void;
export declare function addDisconnectListener(listener: PortEventListener): void;
export declare function addMessageListener(listener: PortEventListener): void;
export declare const connect: () => Port | null;
export declare function listen({ type, filter, ...options }: ListenProps): void;
export declare function removeDisconnectListener(listener: PortEventListener): void;
