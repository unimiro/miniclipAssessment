import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {
  
  constructor(private router: Router){}
  navigateToSimulation(){
    this.router.navigate(['/match-simulation']);
  }
}
