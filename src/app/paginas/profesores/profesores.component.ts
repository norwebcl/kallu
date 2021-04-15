import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {

  usuarios$: any;
  maxUsuarios = 10;
  esconder = true;
  carga_finalizada = false;

  usuario: any;

  constructor(public authService: AuthService, public router: Router, public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.usuarios$ = this.authService.getUsuarios();

    this.authService.user
      .filter(user => !!user) 
      .take(1) 
      .subscribe(user => {
        if (user) {
          this.usuario = user;
        }
      })

    setTimeout(() => {
      this.carga_finalizada = true;
    }, 3000);


  }

  cargarMas() {
    this.maxUsuarios = this.maxUsuarios + 10;
  }

  filtrarProfesores(usuarios: any) {
    var profesores: Array<any> = [];
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].tipo == "Profesor") {
        profesores.push(usuarios[i]);
      }
    }
    return profesores
  }

  eliminarUsuario(uid: any) {
    this.authService.eliminarUsuario(uid);
    this.snackBar.open('El usuario ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

  solicitar(profesorId: any, actuales: any) {
    this.authService.profesorId = profesorId;
    this.authService.actuales = actuales;
    this.router.navigate(['/agendar']);
  }

}
