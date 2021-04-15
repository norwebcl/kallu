import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
const SMALL_WIDTH_BREAKPOINT = 1100;

import { MatSnackBar } from '@angular/material';

import { MENUS } from './interfaces/menus'

import { AuthService } from './core/auth.service';
import {
  Router, Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from "@angular/router";

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('sidenav') sidenav: MatSidenav;

  menus = MENUS;
  public loading: boolean = true;

  constructor(public snackBar: MatSnackBar, public authService: AuthService, private router: Router) {

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {


    this.router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }
  
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => this.loading = false, 1000);
    }
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
    
  }

}
