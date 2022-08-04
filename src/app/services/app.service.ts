import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class AppService {
    public LoadingStateChange = new Subject<boolean>();

    public SetLoading(isLoading: boolean): void {
        this.LoadingStateChange.next(isLoading);
    }
}