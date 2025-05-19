declare function compareDomainCount(domainA: any, domainB: any): number;
declare function sumChartData(chartDataArray: any): number;
declare function calculateMonthDiff(dateFrom: any, dateTo: any): number;
declare function createDailyLabelData(): string[];
declare function filterTodaysData(chartDataArray: any): null[];
declare function getDatesOfThisWeek(): Date[];
declare function filterThisWeeksData(chartDataArray: any): null[];
declare function getDatesOfThisMonth(): Date[];
declare function filterThisMonthsData(chartDataArray: any): null[];
declare function createThisMonthsLabels(): string[];
declare function getMonthsOfThisYear(): Date[];
declare function filterThisYearsData(chartDataArray: any): null[];
declare function filterForAllData(chartDataArray: any): number[];
declare function createAllDataLabels(): string[];
declare function getNamesOfDays(): string[];
declare function getNamesOfMonths(): string[];
declare const mainTextFontColor: string;
declare const helpIconColor: string;
declare const adsBlockedColor: string;
declare const trackersBlockedColor: string;
declare const adsReplacedColor: string;
declare let subs: {};
declare let labelData: any[];
declare let adChartData: any[];
declare let trackerChartData: any[];
declare let replacedChartData: any[];
declare let earliestDate: Date;
declare let rawData: {};
declare let showAdsData: boolean;
declare let showTrackerData: boolean;
declare let showReplacedData: boolean;
declare const EXT_STATS_KEY: any;
declare function addResizeHandler(): void;
declare function showOrHideNoDataMsgIfNeeded(): void;
declare function showOrHideAdPanelCountNeeded(): void;
declare function showOrHideTrackerPanelCountNeeded(): void;
declare function showOrHideReplacedPanelCountNeeded(): Promise<void>;
declare function hidePageProgressCircleIfNeeded(): Promise<any>;
declare function placeBlockStatsHeaderIcons(): void;
declare const hoursOfThisDay: Date[];
declare const firstMondayOfThisWeek: Date;
declare const firstDayOfThisMonth: Date;
declare const numberOfDaysThisMonth: number;
declare const firstDayOfThisYear: Date;
declare const sampleAdData: any[];
declare const sampleTrackerData: any[];
declare const sampleReplaceData: any[];
declare const sampleLabelData: string[];
declare namespace sampleAdChartDataSet {
    export const fill: boolean;
    export { helpIconColor as backgroundColor };
    export { helpIconColor as borderColor };
    export { sampleAdData as data };
}
declare namespace sampleTrackerChartDataSet {
    const fill_1: boolean;
    export { fill_1 as fill };
    export { helpIconColor as backgroundColor };
    export { helpIconColor as borderColor };
    export { sampleTrackerData as data };
}
declare namespace sampleReplacedChartDataSet {
    const fill_2: boolean;
    export { fill_2 as fill };
    export { helpIconColor as backgroundColor };
    export { helpIconColor as borderColor };
    export { sampleReplaceData as data };
}
declare namespace sampleChartConfig {
    namespace tooltips {
        const enabled: boolean;
    }
    const type: string;
    namespace data {
        export { sampleLabelData as labels };
        export const datasets: {
            fill: boolean;
            backgroundColor: string;
            borderColor: string;
            data: {
                y: number;
                x: number;
            }[];
        }[];
    }
    namespace options {
        const events: never[];
        namespace legend {
            const display: boolean;
            namespace labels {
                const display_1: boolean;
                export { display_1 as display };
            }
        }
        const responsive: boolean;
        const maintainAspectRatio: boolean;
        namespace title {
            const display_2: boolean;
            export { display_2 as display };
        }
        namespace scales {
            const xAxes: {
                display: boolean;
                ticks: {
                    tickMarkLength: number;
                    stepSize: number;
                    callback(value: any, index: any): any;
                    fontColor: string;
                };
            }[];
            const yAxes: {
                display: boolean;
                scaleLabel: {
                    display: boolean;
                };
                ticks: {
                    suggestedMax: number;
                    tickMarkLength: number;
                    fontColor: string;
                };
            }[];
        }
    }
}
declare function getDomainTableRow(rowNum: any, filteredDomainData: any, processedDoms: any): string;
declare function setFontSize(totalAdsBlocked: any, totalAdsSelector: any, totalTrackersBlocked: any, totalTrackersselector: any, totalReplaced: any, totalReplacedSelector: any): void;
declare function loadUserDataFromStorage(): Promise<any>;
declare function getLineChartConfig(chartType: any, filterName: any, labelName: any): Promise<{
    filterName: any;
    type: string;
    events: never[];
    data: {
        labels: string[];
        datasets: {
            label: string;
            fill: boolean;
            backgroundColor: string;
            borderColor: string;
            data: null[];
            spanGaps: boolean;
            pointHoverRadius: number;
            pointRadius: number;
        }[];
    };
    options: {
        spanGaps: boolean;
        responsive: boolean;
        maintainAspectRatio: boolean;
        tooltips: {
            mode: string;
        };
        legend: {
            display: boolean;
            labels: {
                display: boolean;
            };
        };
        title: {
            display: boolean;
        };
        scales: {
            xAxes: {
                display: boolean;
                gridLines: {
                    zeroLineColor: string;
                };
                ticks: {
                    callback(value: any, index: any): any;
                    fontColor: string;
                };
            }[];
            yAxes: {
                display: boolean;
                scaleLabel: {
                    display: boolean;
                };
                ticks: {
                    beginAtZero: boolean;
                    min: number;
                    callback(value: any): any;
                    fontColor: string;
                };
                gridLines: {
                    zeroLineColor: string;
                };
            }[];
        };
    };
}>;
declare function filterBarChartDataForDateRange(startTime: any, endTime: any): Promise<{}>;
declare function getBarChartConfig(chartType: any, filterName: any): Promise<{
    theChartConfig?: undefined;
    filteredDomainData?: undefined;
    processedDoms?: undefined;
} | {
    theChartConfig: {
        type: string;
        data: {
            labels: string[];
            datasets: {
                label: string;
                backgroundColor: string;
                borderColor: string;
                borderWidth: number;
                data: any[];
            }[];
        };
        options: {
            responsive: boolean;
            maintainAspectRatio: boolean;
            tooltips: {
                mode: string;
                intersect: boolean;
            };
            legend: {
                display: boolean;
                labels: {
                    display: boolean;
                };
            };
            title: {
                display: boolean;
            };
            scales: {
                xAxes: {
                    stacked: boolean;
                    radius: number;
                    ticks: {
                        callback(value: any, index: any): any;
                        fontColor: string;
                    };
                    gridLines: {
                        color: string;
                        lineWidth: number;
                        zeroLineColor: string;
                    };
                }[];
                yAxes: {
                    stacked: boolean;
                    beginAtZero: boolean;
                    min: number;
                    ticks: {
                        fontColor: string;
                        min: number;
                        callback(value: any): any;
                        color: string;
                    };
                    gridLines: {
                        zeroLineColor: string;
                    };
                }[];
            };
        };
    };
    filteredDomainData: {};
    processedDoms: {
        domain: string;
        total: any;
    }[];
}>;
declare function updateChart(chartType: string | undefined, filterName: any, labelName: any): Promise<void>;
declare function initializeStatsTabContent(): Promise<void>;
declare function resetPageToInitialState(): Promise<void>;
