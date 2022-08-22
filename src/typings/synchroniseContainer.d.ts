import { SynchronisationType } from "./synchronisationType.enum";

export interface SynchroniseContainer<T> {
    SynchronisationType: SynchronisationType;
    Data?: T;
}