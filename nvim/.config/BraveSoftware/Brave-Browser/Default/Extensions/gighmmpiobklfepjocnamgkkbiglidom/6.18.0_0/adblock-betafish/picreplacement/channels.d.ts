export const channelsNotifier: EventEmitter;
export class Channels {
    static getContentType(details: any): any;
    static getFrameId(details: any): any;
    static shouldUseFilter(filter: any): Promise<any>;
    constructor(license: any);
    license: any;
    channelGuide: {} | undefined;
    add(data: any): number | undefined;
    remove(channelId: any): void;
    getGuide(): {};
    getIdByName(name: any): string | undefined;
    isCustomChannel(id: any): boolean;
    isCustomChannelEnabled(): any;
    getListings(id: any): any;
    setEnabled(id: any, enabled: any): void;
    refreshAllEnabled(): void;
    isAnyEnabled(): boolean;
    disableAllChannels(): void;
    randomListing(opts: any): any;
    addNewChannels(): void;
    loadFromStorage(): void;
    saveToStorage(): void;
    filterListener({ request, filter }: {
        request: any;
        filter: any;
    }): Promise<void>;
    initializeListeners(): void;
}
import { EventEmitter } from "../../adblockplusui/adblockpluschrome/lib/events";
