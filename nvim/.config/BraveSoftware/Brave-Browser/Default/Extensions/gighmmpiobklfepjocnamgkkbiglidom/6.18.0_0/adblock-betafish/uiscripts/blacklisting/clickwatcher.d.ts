declare function Highlighter(): void;
declare class Highlighter {
    getCurrentNode: (el: any) => any;
    enable: () => void;
    disable: () => void;
    destroy: () => void;
}
declare function ClickWatcher(): void;
declare class ClickWatcher {
    callbacks: {
        cancel: never[];
        click: never[];
    };
    clickedElement: any;
    highlighter: Highlighter | null;
    cancel(callback: any): void;
    click(callback: any): void;
    fire(eventName: any, arg: any): void;
    enable(): void;
    disable(): void;
    close(): void;
    onClose(): void;
    clickHandler(event: any): boolean;
    eventsListener(): void;
}
