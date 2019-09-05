import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(postData: Post) {
        console.log('Post data: ', postData);

        this.http
            .post<{ name: string }>(
                'https://ng-complete-guide-27a7b.firebaseio.com/posts.json',
                postData,
                {
                    observe: 'response'
                }
            )
            .subscribe(responseData => {
                console.log('Response data: ', responseData);
            },
                error => {
                    this.error.next(error.message);
                });
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('test', 'true');

        let headerParams = new HttpHeaders();
        headerParams = headerParams.append('Custom-Header', 'Hello');
        headerParams = headerParams.append('Custom-Header-Two', 'World');

        return this.http
            .get<{ [key: string]: Post }>(
                'https://ng-complete-guide-27a7b.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
                    // headers: headerParams,
                    // params: new HttpParams().set('print', 'pretty')
                    params: searchParams
                }
            )
            .pipe(
                map(responseData => {
                    const postsArray: Post[] = [];
                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key });
                        }
                    }

                    return postsArray;
                }),
                catchError(errorResponse => {
                    return throwError(errorResponse);
                })
            );
    }

    deletePosts() {
        return this.http
            .delete(
                'https://ng-complete-guide-27a7b.firebaseio.com/posts.json',
                {
                    observe: 'events'
                }
            ).pipe(
                tap(event => {
                    console.log(event);
                    if (event.type === HttpEventType.Sent) {
                        // ....
                    }
                    if (event.type === HttpEventType.Response) {
                        console.log(event.body);
                    }
                })
            );
    }
}
