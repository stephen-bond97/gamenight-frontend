import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TriviaQuestion } from "src/typings/triviaQuestion";

@Injectable()
export class TriviaService {
    // private url = "https://sbond-gamenight.herokuapp.com/trivia/question";
    private url = "http://localhost:3000/trivia/question";

    /**
     *
     */
    public constructor(private http: HttpClient) {
        
    }

    public GetQuestions(category: any): Observable<TriviaQuestion> {
        return this.request({
            category: category,
        });
    }

    private request<T>(params: any): Observable<T> {
        return this.http.get(this.url, {
            params: params
        }) as Observable<T>;
    }
}
