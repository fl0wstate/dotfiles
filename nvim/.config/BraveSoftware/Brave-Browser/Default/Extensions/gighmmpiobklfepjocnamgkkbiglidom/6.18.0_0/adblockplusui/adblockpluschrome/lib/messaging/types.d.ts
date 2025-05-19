export function toPlainBlockableItem({ filter, matchInfo, request }: {
    filter: any;
    matchInfo: any;
    request: any;
}): {
    docDomain: any;
    isFrame: boolean;
    rewrittenUrl: any;
    type: any;
    url: any;
};
export function toPlainFilter(filter: any): {};
export function toPlainRecommendation(recommendation: any): {};
export function toPlainSubscription(subscription: any): {};
export let toPlainFilterError: (obj?: any) => {};
