export default idleHandler;
declare namespace idleHandler {
    const IDLE_ALARM_NAME: string;
    function alarmHandler(alarm: any): void;
    function alarmHandler(alarm: any): void;
    function scheduleItemOnce(callback: any, seconds: any): Promise<void>;
    function scheduleItemOnce(callback: any, seconds: any): Promise<void>;
    const scheduledItems: never[];
    function runIfIdle(): Promise<void>;
    function runIfIdle(): Promise<void>;
}
