import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { CSVRecord } from './CSVRecord';
import { BASE_URL } from '../../constant';

@Component({
  selector: 'ngx-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent {
  baseURL: string = `${BASE_URL}/customers`;

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
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
        title: 'E-mail',
        type: 'string',
        filter: false,
      },
      name: {
        title: 'Name',
        type: 'string',
        filter: false,
      },
      pwd: {
        title: 'Password',
        type: 'string',
        filter: false,
      },
      security: {
        title: 'Security Question',
        type: 'string',
        filter: false,
      },
      country: {
        title: 'Country',
        type: 'string',
        filter: false,
      },
      bot_id: {
        title: 'Bot',
        type: 'number',
        filter: false,
      },
      proxy: {
        title: 'Proxy',
        type: 'string',
        filter: false,
      },
      status: {
        title: 'Status',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value, cell) => {
          return (value==1)?'🟢':'🔴';
        },
        editable: false
      },
      error: {
        title: 'Last Error',
        type: 'string',
        filter: false,
        editable: false
      },
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };

  source: ServerDataSource;

  constructor(private http: HttpClient) {
    this.source = new ServerDataSource(this.http, { endPoint: this.baseURL, dataKey: 'data', totalKey: 'total' });
  }


  csvResult: any[];

  uploadListener($event: any): void {

    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        const headersRow = this.getHeaderArray(csvRecordsArray);

        this.csvResult = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.http.post(this.baseURL + '/upload', {customers: this.csvResult})
          .subscribe(data => {
            this.source.append(data);
          });
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert('Please import valid .csv file.');
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    const csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length === headerLength) {
        const csvRecord: CSVRecord = new CSVRecord();
        csvRecord.email = curruntRecord[0].trim();
        csvRecord.name = curruntRecord[1].trim();
        csvRecord.password = curruntRecord[2].trim();
        csvRecord.country = curruntRecord[3].trim();
        csvRecord.bot_id = curruntRecord[4].trim();
        csvRecord.proxy = curruntRecord[5].trim();
        csvRecord.security = curruntRecord[7].trim();
        csvArr.push(csvRecord);
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = (<string>csvRecordsArr[0]).split(',');
    const headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvResult = [];
  }


  onSearch(query: string = '') {
    if (query === '') {
      this.source.setFilter([]);
    } else {
      this.source.setFilter([
        {
          field: 'email',
          search: query,
        },
        {
          field: 'bot_id',
          search: query,
        },
        {
          field: 'proxy',
          search: query,
        },
      ], false);
    }
  }

  onCreateConfirm(event): void {
    this.http.post(this.baseURL, event.newData)
      .subscribe(data => {
        this.source.add(data);
        event.confirm.resolve();
      }, error => {
        event.confirm.reject();
      });
  }

  onEditConfirm(event): void {
    this.http.put(this.baseURL + `/${event.newData.id}`, event.newData)
      .subscribe(data => {
        event.confirm.resolve(data);
        this.source.refresh();
      }, error => {
        event.confirm.reject();
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.http.delete(this.baseURL + `/${event.data.id}`)
      .subscribe(data => {
        event.confirm.resolve(data);
      }, error => {
        event.confirm.reject();
      });
    } else {
      event.confirm.reject();
    }
  }
}
