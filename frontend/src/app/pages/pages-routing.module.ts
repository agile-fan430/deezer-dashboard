import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountsComponent } from './apple/accounts/accounts.component';
import { AlbumsComponent } from './apple/albums/albums.component';
import { TracksComponent } from './apple/tracks/tracks.component';
import { ArtistsComponent } from './apple/artists/artists.component';
import { SettingComponent } from './setting/setting.component';
import { AnalyticsComponent } from './analytics/analytic.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'accounts',
      component: AccountsComponent,
    },
    {
      path: 'albums',
      component: AlbumsComponent,
    },
    {
      path: 'tracks',
      component: TracksComponent,
    },
    {
      path: 'artists',
      component: ArtistsComponent,
    },
    {
      path: 'analytics',
      component: AnalyticsComponent
    },
    {
      path: 'settings',
      component: SettingComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
