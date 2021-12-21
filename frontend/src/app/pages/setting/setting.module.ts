import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { SettingComponent } from './setting.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ToggleButtonComponent,
    SettingComponent,
  ],
})
export class SettingModule { }
