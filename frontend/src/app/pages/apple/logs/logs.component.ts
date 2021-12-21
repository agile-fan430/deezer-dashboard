import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { ContentComponent } from './content.component';

@Component({
  selector: 'logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent {
  baseURL: string = 'http://23.82.141.146:3002/logs';

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
      email: {
        title: 'Account',
        type: 'string',
        filter: false,
      },
      content: {
        title: 'Content',
        type: 'custom',
        filter: false,
        renderComponent: ContentComponent
      },
      log_time: {
        title: 'Date',
        type: 'string',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return new Date(cell).toUTCString();
        }
      },
      type: {
        title: 'Type',
        type: 'string',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return cell?"Error":"Log";
      }
      },
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
          field: 'email',
          search: query,
        },
        {
          field: 'content',
          search: query
        }
      ], false);
    }
  }
}
