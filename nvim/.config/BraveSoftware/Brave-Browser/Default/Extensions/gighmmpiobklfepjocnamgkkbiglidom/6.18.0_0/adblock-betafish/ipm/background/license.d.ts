import { LicenseState } from "./data-collection.types";
import { LicenseStateBehavior } from "./command-library.types";
export declare function isValidLicenseState(candidate: unknown): candidate is LicenseState;
export declare const doesLicenseStateMatch: (behavior: LicenseStateBehavior) => Promise<boolean>;
export declare const defaultLicenseState = LicenseState.inactive;
