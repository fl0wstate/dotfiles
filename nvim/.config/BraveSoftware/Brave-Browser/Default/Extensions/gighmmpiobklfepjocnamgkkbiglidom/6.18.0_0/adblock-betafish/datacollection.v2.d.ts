export default DataCollectionV2;
declare namespace DataCollectionV2 {
    function start(): void;
    function end(): void;
    function getCache(): {
        filters: {};
        domains: {};
    };
}
