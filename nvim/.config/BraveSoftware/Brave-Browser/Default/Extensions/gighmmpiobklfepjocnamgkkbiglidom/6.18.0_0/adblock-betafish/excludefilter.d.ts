export default ExcludeFilter;
declare namespace ExcludeFilter {
    export { setExcludeFilters };
}
declare function setExcludeFilters(filtersToExclude: any): Promise<void>;
