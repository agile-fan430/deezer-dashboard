import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constant';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  activeAccounts: number;
  blockAccounts: number;

  expiration1: number;
  expiration5: number;
  expiration0: number;

  constructor(private http: HttpClient) {
    this.http.get(`${BASE_URL}/customers/getCouponExpiration`)
    .subscribe((data: any) => {
      this.expiration1 = data.expiration1[0].amount;
      if(this.expiration1 < 0) {
        this.expiration1 = 0;
      }
      this.expiration5 = data.expiration5[0].amount;
      if(this.expiration5 < 0) {
        this.expiration5 = 0;
      }
      this.expiration0 = data.expiration0[0].amount;
      if(this.expiration0 < 0) {
        this.expiration0 = 0;
      }
    });
  }
}
