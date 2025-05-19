import { Listener, ScheduleType } from "./scheduled-event-emitter.types";
export declare function setListener(name: string, listener: Listener): Promise<void>;
export declare function setSchedule(name: string, time: number, scheduleType?: ScheduleType): Promise<void>;
export declare function removeSchedule(name: string): Promise<void>;
export declare function removeListener(name: string): Promise<void>;
