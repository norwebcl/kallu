import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  clases$: any;
  maxClases = 10;
  esconder = true;
  carga_finalizada = false;

  usuario: any;
  usuarios: any;
  constructor(public authService: AuthService, public router: Router, public snackBar: MatSnackBar, private afs: AngularFirestore) {
  }

  ngOnInit() {

    this.authService.user
      .filter(user => !!user) 
      .take(1)
      .subscribe(user => {
        if (user) {
          this.usuario = user;
        }
      })

    this.clases$ = this.authService.getClases();

    this.authService.getUsuarios().subscribe(usuarios =>
      this.usuarios = usuarios
    );

    setTimeout(() => {
      this.carga_finalizada = true;
    }, 3000);

  }

  cargarMas() {
    this.maxClases = this.maxClases + 10;
  }

  filtrarSolicitudes(clases: any) {

    if (this.usuario.tipo == 'Estudiante') {
      var solicitudes: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Enviada" && this.usuario.uid == clases[i].estudianteId) {
          solicitudes.push(clases[i]);
        }
      }
      return solicitudes
    }


    if (this.usuario.tipo == 'Profesor') {
      var solicitudes: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Enviada" && this.usuario.uid == clases[i].profesorId) {
          solicitudes.push(clases[i]);
        }
      }
      return solicitudes
    }


    if (this.usuario.tipo == 'Admin') {
      var solicitudes: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Enviada") {
          solicitudes.push(clases[i]);
        }
      }
      return solicitudes
    }

  }

  filtrarAgendadas(clases: any) {
    if (this.usuario.tipo == 'Estudiante') {
      var agendadas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Agendada" && this.usuario.uid == clases[i].estudianteId) {
          agendadas.push(clases[i]);
        }
      }
      return agendadas
    }
    if (this.usuario.tipo == 'Profesor') {
      var agendadas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Agendada" && this.usuario.uid == clases[i].profesorId) {
          agendadas.push(clases[i]);
        }
      }
      return agendadas
    }
    if (this.usuario.tipo == 'Admin') {
      var agendadas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Agendada") {
          agendadas.push(clases[i]);
        }
      }
      return agendadas
    }


  }

  filtrarFinalizadas(clases: any) {

    if (this.usuario.tipo == 'Estudiante') {
      var finalizadas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Finalizada" && this.usuario.uid == clases[i].estudianteId) {
          finalizadas.push(clases[i]);
        }
      }
      return finalizadas
    }
    if (this.usuario.tipo == 'Profesor') {
      var finalizadas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Finalizada" && this.usuario.uid == clases[i].profesorId) {
          finalizadas.push(clases[i]);
        }
      }
      return finalizadas
    }
    if (this.usuario.tipo == 'Admin') {
      var finalizadas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Finalizada") {
          finalizadas.push(clases[i]);
        }
      }
      return finalizadas
    }
  }

  filtrarCanceladas(clases: any) {

    if (this.usuario.tipo == 'Estudiante') {

      var canceladas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Cancelada" && this.usuario.uid == clases[i].estudianteId) {
          canceladas.push(clases[i]);
        }
      }
      return canceladas

    }

    if (this.usuario.tipo == 'Profesor') {

      var canceladas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Cancelada" && this.usuario.uid == clases[i].profesorId) {
          canceladas.push(clases[i]);
        }
      }
      return canceladas

    }

    if (this.usuario.tipo == 'Admin') {

      var canceladas: Array<any> = [];
      for (var i = 0; i < clases.length; i++) {
        if (clases[i].estado == "Cancelada") {
          canceladas.push(clases[i]);
        }
      }
      return canceladas

    }

  }

  aceptar(clase: any) {
    this.authService.actualizarClase(clase.id, {
      estado: 'Agendada'
    });
    this.snackBar.open('La clase virtual ha sido agendada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }


  cancelar(clase: any) {
    var clasact: number;

    this.usuarios.forEach(usuario => {
      if(usuario.uid == clase.estudianteId){
        clasact = usuario.clases_actuales;
      }
    });
    this.authService.actualizarUser(clase.estudianteId, { clases_actuales: clasact - 1 });
    this.authService.actualizarClase(clase.id, {
      estado: 'Cancelada'
    });
    this.snackBar.open('La clase virtual ha sido cancelada correctamente.', 'CERRAR', {
      duration: 4000
    })
  }

  realizada(clase: any) {
    this.authService.actualizarClase(clase.id, {
      estado: 'Finalizada'
    });
    this.snackBar.open('La clase virtual ha sido realizada correctamente.', 'CERRAR', {
      duration: 4000
    });
  }


}
