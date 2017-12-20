import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { AwsService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    continuationToken: string;
    currentUrl: string;
    currentIndex: number;
    bucketName: string = 'test-bucket-exp';
    s3ObjectData: any;
    loading: boolean;

    constructor(private userService: UserService, private awsService: AwsService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.continuationToken = "";
        this.currentUrl = "";
        this.currentIndex = 0;
        this.loading = true;
        this.getAllObjects();        
    }

    getAllObjects() {
        this.awsService.listS3Objects(this.bucketName, 10000, this.continuationToken).then((result: any) => {
            this.s3ObjectData = result.Contents;
            this.continuationToken = result.NextContinuationToken;
            this.currentIndex = 0;
            this.getNextURL();
        });
    }

    onPrevClick() {
        this.loading = true;
        this.currentIndex = this.currentIndex - 1;
        this.currentIndex = Math.max(this.currentIndex, 0)
        this.getNextURL();
    }

    onNextClick() {
        this.loading = true;
        this.currentIndex = this.currentIndex + 1;
        this.getNextURL();
    }

    // deleteUser(id: number) {
    //     this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    // }

    getNextURL() {
        this.currentUrl = this.awsService.getS3SignedUrl({Bucket: this.bucketName, Key: this.s3ObjectData[this.currentIndex].Key});
        this.loading = false;
        console.log("URL = " + this.currentUrl);        
    }

}