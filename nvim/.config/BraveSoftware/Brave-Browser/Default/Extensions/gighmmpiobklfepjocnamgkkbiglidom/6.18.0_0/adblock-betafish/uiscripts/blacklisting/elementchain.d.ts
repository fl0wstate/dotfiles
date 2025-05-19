declare function ElementChain(el: any): void;
declare class ElementChain {
    constructor(el: any);
    stack: any[];
    changeEvents: any[];
    current(): any;
    moveUp(): boolean;
    moveDown(): boolean;
    moveTo(depth: any): void;
    change(listener: any, callback: any): void;
}
