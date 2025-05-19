export function allowlist({ hostname, origin, singlePage, url }: {
    hostname: any;
    origin: any;
    singlePage?: boolean | undefined;
    url: any;
}): Promise<void>;
export function revalidateAllowlistingStates(): Promise<void>;
export namespace allowlistingState {
    const addListener: (name: string, listener: Function) => void;
    const removeListener: (name: string, listener: Function) => void;
}
export type filtersIsAllowlistedResult = {
    hostname: boolean;
    page: boolean;
};
