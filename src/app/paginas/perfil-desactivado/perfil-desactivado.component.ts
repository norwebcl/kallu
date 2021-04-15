import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-desactivado',
  templateUrl: './perfil-desactivado.component.html',
  styleUrls: ['./perfil-desactivado.component.css']
})
export class PerfilDesactivadoComponent implements OnInit {

  constructor(public router: Router, public authService: AuthService) { }

  ngOnInit() {
  }

  cambiarEstadoUsuario(userId: any, variable: boolean){
    var estado = !variable
    this.authService.updateUsuario(userId,
      {
        activo: estado,
        primerLogin: false
      });

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
  }


}
