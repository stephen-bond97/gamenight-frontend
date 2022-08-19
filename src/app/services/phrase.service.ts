import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";

@Injectable()
export class PhraseService {
    /**
     *
     */
    constructor(private http: HttpClient) {

    }

    public Phrase(): Observable<string> {
        return of("flight of the conchords");
    }
}