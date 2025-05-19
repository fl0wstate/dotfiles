declare function Overlay(options: any): void;
declare class Overlay {
    constructor(options: any);
    image: any;
    el: any;
    clickHandler: any;
    display(): void;
}
declare namespace Overlay {
    const instances: any[];
    function removeAll(): void;
}
