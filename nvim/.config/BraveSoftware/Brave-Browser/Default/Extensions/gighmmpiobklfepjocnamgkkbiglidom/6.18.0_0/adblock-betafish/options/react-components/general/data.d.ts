export const aaOptionsData: {
    name: string;
    onChange: ({ evt }: {
        evt: any;
    }, setCheckedItems: any) => Promise<void>;
    textKey: string;
    helpLink: string;
    subOptions: {
        name: string;
        onChange: ({ evt }: {
            evt: any;
        }, setCheckedItems: any) => Promise<void>;
        textKey: string;
        helpLink: string;
    }[];
}[];
export function getOptionsData(application: any): ({
    name: string;
    onChange: ({ evt }: {
        evt: any;
    }, setCheckedItems: any) => void;
    textKey: string;
    extraInfo: string;
    subOptions: {
        name: string;
        onChange: ({ name, evt }: {
            name: any;
            evt: any;
        }, setCheckedItems: any) => void;
        textKey: string;
        helpLink: string;
        additionalInfoLink: {
            textKey: string;
            href: string;
        };
    }[];
    helpLink: string;
    disabled?: undefined;
    showSubsParentState?: undefined;
} | {
    name: string;
    onChange: ({ evt }: {
        evt: any;
    }, setCheckedItems: any) => void;
    textKey: string;
    extraInfo: string;
    helpLink: string;
    subOptions?: undefined;
    disabled?: undefined;
    showSubsParentState?: undefined;
} | {
    name: string;
    onChange: ({ name, evt }: {
        name: any;
        evt: any;
    }, setCheckedItems: any) => void;
    textKey: string;
    extraInfo?: undefined;
    subOptions?: undefined;
    helpLink?: undefined;
    disabled?: undefined;
    showSubsParentState?: undefined;
} | {
    name: string;
    disabled: boolean;
    onChange: ({ evt }: {
        evt: any;
    }, setCheckedItems: any) => Promise<void>;
    textKey: string;
    showSubsParentState: boolean;
    subOptions: ({
        name: string;
        onChange: ({ name, evt }: {
            name: any;
            evt: any;
        }, setCheckedItems: any) => void;
        textKey: string;
        helpLink: string;
    } | {
        name: string;
        onChange: ({ name, evt }: {
            name: any;
            evt: any;
        }, setCheckedItems: any) => void;
        textKey: string;
        helpLink?: undefined;
    })[];
    extraInfo?: undefined;
    helpLink?: undefined;
} | {
    name: string;
    onChange: ({ evt }: {
        evt: any;
    }, setCheckedItems: any) => void;
    textKey: string;
    subOptions: {
        name: string;
        onChange: ({ name, evt }: {
            name: any;
            evt: any;
        }, setCheckedItems: any) => void;
        textKey: string;
        extraInfo: string;
    }[];
    extraInfo?: undefined;
    helpLink?: undefined;
    disabled?: undefined;
    showSubsParentState?: undefined;
})[];
export const eventsList: {
    [k: string]: any;
};
