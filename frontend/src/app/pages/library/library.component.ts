import { Component } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { HttpClient } from '@angular/common/http';
import { CSVRecord } from './CSVRecord';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent {
  baseURL: string = 'http://23.82.141.146:3002/library';

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
      },
      name: {
        title: 'Name',
        type: 'string',
        filter: false,
      },
      link: {
        title: 'Link',
        type: 'string',
        filter: false,
      },
      status: {
        title: 'Status',
        type: 'string',
        editor: {
          type: 'list',
          config: {
            list: [{ value: 'Active', title: 'Active'}, { value: 'Inactive', title: 'Inactive'}],
          },
        },
        filter: false,
      },
    },
  };

  source: ServerDataSource;

  constructor(private http: HttpClient) {
    this.source = new ServerDataSource(this.http, {endPoint: this.baseURL, dataKey: 'data', totalKey: 'total'});
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
        this.http.post(this.baseURL + '/upload', {albums: this.csvResult})
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
      if (curruntRecord.length == headerLength) {
        const csvRecord: CSVRecord = new CSVRecord();
        csvRecord.name = curruntRecord[0].trim();
        csvRecord.link = curruntRecord[1].trim();
        csvRecord.status = curruntRecord[2].trim();
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
    if (query == '') {
      this.source.setFilter([]);
    } else {
      this.source.setFilter([
        {
          field: 'link',
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
        console.log(error);
        event.confirm.reject();
      });
  }

  onEditConfirm(event): void {
    console.log(event);
    this.http.put(this.baseURL + `/${event.newData.id}`, event.newData)
      .subscribe(data => {
        event.confirm.resolve(data);
      }, error => {
        console.log(error);
        event.confirm.reject();
      });
  }

  onDeleteConfirm(event): void {
    console.log(event);
    if (window.confirm('Are you sure you want to delete?')) {
      this.http.delete(this.baseURL + `/${event.data.id}`)
      .subscribe(data => {
        event.confirm.resolve(data);
      }, error => {
        console.log(error);
        event.confirm.reject();
      });
    } else {
      event.confirm.reject();
    }
  }
}
