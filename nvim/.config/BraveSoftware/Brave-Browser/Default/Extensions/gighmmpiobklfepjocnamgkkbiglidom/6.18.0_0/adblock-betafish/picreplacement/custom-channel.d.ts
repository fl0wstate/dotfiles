export default CustomChannel;
declare class CustomChannel extends Channel {
    static createListing(theWidth: any, theHeight: any, theURL: any, theName: any): Listing;
    CUSTOM_META_KEY: string;
    deleteAll(): void;
    getLatestListings(callback: any): void;
    isMaximumAllowedImages(): boolean;
    saveListings(): Promise<any>;
    removeListingByURL(theURLToRemove: any): Promise<any>;
    addCustomImage(imageInfo: any): Promise<any>;
    getBytesInUseForEachImage(): Promise<any[]> | Promise<number>;
    getTotalBytesInUse(): Promise<any>;
}
import Channel from "./channel";
import Listing from "./listing";
