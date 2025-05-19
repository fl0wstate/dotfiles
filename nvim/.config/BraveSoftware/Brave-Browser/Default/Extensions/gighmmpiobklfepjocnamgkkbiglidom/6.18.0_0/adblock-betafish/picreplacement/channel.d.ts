export default Channel;
declare class Channel {
    static listingFactory(widthParam: any, heightParam: any, url: any, title: any, channelName: any): Listing;
    static prefetch(): void;
    static getLatestListings(): void;
    static calculateType(w: any, h: any): string;
    listings: any[];
    getListings(): any[];
    refresh(): void;
}
import Listing from "./listing";
