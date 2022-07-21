import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TriviaService {
    private url = "https://opendb.com/api.php";

    /**
     *
     */
    public constructor(private http: HttpClient) {
        
    }

    public GetQuestions(category: any): Observable<any> {
        return this.request({
            category: category
        });
    }

    private request<T>(params: any): Observable<T> {
        return this.http.get(this.url, {
            params: params
        }) as Observable<T>;
    }
}