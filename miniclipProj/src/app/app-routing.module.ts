import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';
import { MatchSimulationComponent } from './components/match-simulation/match-simulation.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'title-bar',
    component: HomeComponent
  },
  {
    path: 'team-management',
    component: TeamManagementComponent
  },
  {
    path: 'match-simulation',
    component: MatchSimulationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
