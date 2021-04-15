import { Component, OnInit } from '@angular/core';
import { MENUS } from '../../interfaces/menus'
import { AppComponent } from '../../app.component';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menus = MENUS;

  public options = {
    spinable: true,
    buttonWidth: 40,
  };

  public wings = [
    {
      'title': 'iPad',
      'color': '#ea2a29',
      'icon': { 'name': 'fa fa-tablet' }
    }, {
      'title': 'iMac',
      'color': '#f16729',
      'icon': { 'name': 'fa fa-laptop' }
    }, {
      'title': 'iPhone',
      'color': '#f89322',
      'icon': { 'name': 'fa fa-mobile' }
    }, {
      'title': 'iWatch',
      'color': '#ffcf14',
      'icon': { 'name': 'fa fa-clock-o' }
    }
  ];

  public gutter = {
    top: 30,
  };

  public startAngles = {
    topLeft: -20,
  }

  constructor(public snackBar: MatSnackBar, private ac: AppComponent, public authService: AuthService) { }

  ngOnInit() {
  }

  salir() {
    this.snackBar.open('Has cerrado sesión correctamente, vuelve pronto. ', 'CERRAR', {
      duration: 4000
    });
    this.authService.salir();
  }

  toggle(){
    this.ac.sidenav.toggle();
  }
}
