import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-progress',
  template: `
    <div class="{{stateClass}}" >
    {{content}}
  </div>`,
  styleUrls: ['./logs.component.scss']
})
export class ContentComponent implements ViewCell, OnInit {

  @Input() value: string | number;
  @Input() rowData: any;
  stateClass: string;
  content: string;

  constructor() { }

  ngOnInit() {
    this.stateClass = this.rowData.type ? 'font-danger' : '';
    console.log(this.rowData);
    this.content = this.rowData.content;
  }
}