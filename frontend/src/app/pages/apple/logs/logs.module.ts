import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../../@theme/theme.module';
import { LogsComponent } from './logs.component';
import { ContentComponent } from './content.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    LogsComponent,
    ContentComponent
  ],
  entryComponents: [
    ContentComponent
  ]
})
export class LogsModule { }
