export declare enum DataType {
    customer = "customer",
    device = "device",
    event = "event"
}
export interface BaseAttributes {
    app_name: string;
    browser_name: string;
    os: string;
    language_tag: string;
    app_version: string;
    install_type: string;
}
interface EventAttributes extends BaseAttributes {
    ipm_id: string;
    command_name: string;
    command_version: number;
}
export declare enum PlatformType {
    web = "web"
}
export interface EventData {
    type: DataType.event;
    device_id: string;
    action: string;
    platform: PlatformType;
    app_version: string;
    user_time: string;
    attributes: EventAttributes;
}
export declare enum LicenseState {
    active = "premium",
    inactive = "free"
}
interface DeviceAttributes extends BaseAttributes {
    blocked_total: number;
    license_status: LicenseState;
}
export interface DeviceData {
    type: DataType.device;
    device_id: string;
    attributes: DeviceAttributes;
}
export declare enum PlatformStatus {
    true = "true"
}
interface PlatformInfo {
    platform: PlatformType;
    active: PlatformStatus;
}
declare type PlatformInfoList = PlatformInfo[];
export interface UserData {
    type: DataType.customer;
    platforms: PlatformInfoList;
    attributes: BaseAttributes;
}
interface IpmCommand {
    id: string;
}
export interface IpmCapability {
    name: string;
    version: number;
}
export interface IpmData {
    active: IpmCommand[];
    capabilities: IpmCapability[];
}
export interface PayloadData {
    user: UserData;
    device: DeviceData;
    events: EventData[];
    ipm: IpmData;
}
export declare const eventStorageKey = "ipm_events";
export {};
