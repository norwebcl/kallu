import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  usuarios$: any;
  maxUsuarios = 10;
  esconder = true;

  carga_finalizada=false;

  constructor(public authService: AuthService, public router: Router, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.usuarios$ = this.authService.getUsuarios();

    setTimeout(() => {
      this.carga_finalizada=true;
    }, 5000);

  }

  cargarMas() {
    this.maxUsuarios = this.maxUsuarios + 10;
  }

  filtrarEstudiantes(usuarios: any){
    var estudiantes: Array<any> = []; 
    for(var i=0; i<usuarios.length;i++){
      if(usuarios[i].tipo == "Estudiante"){
        estudiantes.push(usuarios[i]);
      }
    }
    return estudiantes
  }

  eliminarUsuario(uid: any){
    this.authService.eliminarUsuario(uid);
    this.snackBar.open('El usuario ha sido eliminado correctamente.', 'CERRAR', {
      duration: 4000
    });
  }

}
