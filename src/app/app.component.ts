import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    loadedPosts: Post[] = [];
    isFetching: boolean = false;
    error = null;
    private errorSub: Subscription;

    constructor(private http: HttpClient, private postService: PostService) { }

    ngOnInit() {
        this.errorSub = this.postService.error.subscribe(errorMessage => {
            this.error = errorMessage;
        });

        this.fetchPosts();
    }

    ngOnDestroy() {
        this.errorSub.unsubscribe();
    }

    onCreatePost(postData: Post) {
        this.postService.createAndStorePost(postData);
    }

    onFetchPosts() {
        this.fetchPosts();
    }

    onClearPosts() {
        this.isFetching = true;
        this.postService.deletePosts()
            .subscribe(() => {
                this.isFetching = false;
                this.loadedPosts = [];
            });
    }

    onHandleError() {
        this.error = null;
    }

    private fetchPosts() {
        this.isFetching = true;

        this.postService.fetchPosts()
            .subscribe(
                posts => {
                    this.isFetching = false;
                    console.log('Fetch posts: ', posts);

                    this.loadedPosts = posts;
                },
                error => {
                    this.isFetching = false;
                    this.error = error.error.error;
                });
    }

}
