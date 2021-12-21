import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../constant';

@Component({
  selector: 'setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  baseURL: string = `${BASE_URL}/settings`;

  min_play: number = 0;
  max_play: number = 0;
  percent_play: number = 50;
  library_rotation: number = 0;
  add_library: number = 0;
  search_title: number = 0;
  min_rotation: number = 0;
  max_rotation: number = 0;
  local_time: boolean = false;
  min_stream: string = '00:00:00';
  max_stream: string = '00:00:00';
  min_pause: number = 0;
  max_pause: number = 0;
  min_pause_frequency: number = 0;
  max_pause_frequency: number = 0;
  constructor(private http: HttpClient) {
    this.http.get(this.baseURL)
      .subscribe((data: any[]) => {
        console.log(data);
        this.min_play = data[0].min_play;
        this.max_play = data[0].max_play;
        this.percent_play = data[0].percent_play;
        this.library_rotation = data[0].library_rotation;
        this.search_title = data[0].search_title;
        this.min_rotation = data[0].min_rotation;
        this.max_rotation = data[0].max_rotation;
        this.local_time = data[0].local_time;
        this.min_stream = data[0].min_stream;
        this.max_stream = data[0].max_stream;
        this.min_pause = data[0].min_pause;
        this.max_pause = data[0].max_pause;
        this.min_pause_frequency = data[0].min_pause_frequency;
        this.max_pause_frequency = data[0].max_pause_frequency;
        this.add_library = data[0].add_library;
      });
  }

  ngOnInit() {
  }

  onSave(event) {
    this.http.post(this.baseURL, {
      min_play: this.min_play,
      max_play: this.max_play,
      percent_play: this.percent_play,
      library_rotation: this.library_rotation,
      search_title: this.search_title,
      min_rotation: this.min_rotation,
      max_rotation: this.max_rotation,
      local_time: this.local_time,
      min_stream: this.min_stream,
      max_stream: this.max_stream,
      min_pause: this.min_pause,
      max_pause: this.max_pause,
      min_pause_frequency: this.min_pause_frequency,
      max_pause_frequency: this.max_pause_frequency,
      add_library: this.add_library
    }).subscribe(data => {
      console.log(data);
    });
  }

}
