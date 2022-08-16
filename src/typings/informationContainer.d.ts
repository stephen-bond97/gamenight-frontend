import { InformationType } from "./informationType.enum";

export interface InformationContainer {
    InformationType: InformationType;
    Data: any;
}