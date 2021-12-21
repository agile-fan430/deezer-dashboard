import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constant';

@Component({
  selector: 'analytics',
  templateUrl: './analytic.component.html',
})
export class AnalyticsComponent {
  baseURL: string = `${BASE_URL}/analytics`;

  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        filter: false,
        valuePrepareFunction: (value,row,cell) => {
          return (this.source.getPaging().page - 1) * this.source.getPaging().perPage + cell.row.index + 1;
        },
      },
      saved_for: {
        title: 'Date',
        type: 'string',
        filter: false,
      },
      play_amounts: {
        title: 'Play Counts',
        type: 'string',
        filter: false,
      },
      active_accounts: {
        title: 'Active Accounts',
        type: 'string',
        filter: false,
      }
    },
  };

  source: ServerDataSource;

  constructor(private http: HttpClient) {
    this.source = new ServerDataSource(this.http, {endPoint: this.baseURL, dataKey: 'data', totalKey: 'total'});
  }

  onSearch(query: string = '') {
    console.log(query);
    if (query == '') {
      this.source.setFilter([]);
    } else {
      this.source.setFilter([
        {
          field: 'saved_for',
          search: query,
        }
      ], false);
    }
  }
}
