import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-agendar',
  templateUrl: './agendar.component.html',
  styleUrls: ['./agendar.component.css']
})
export class AgendarComponent implements OnInit {
  hoy: any;

  formulario: FormGroup;
  formErrores = {
    'hora_clase': '',
    'fecha_clase': '',
  }
  cargando = false;
  mensajeError = false;
  mensajesValidacion = {

    'hora_clase': {
      'required': 'Requerido',
    },
    'fecha_clase': {
      'required': 'Requerido',
    },


  }

  miId: any;
  profesorId: any;
  profesor$: any;

  actuales: any;

  constructor(public fb: FormBuilder, public authService: AuthService, public router: Router, public snackBar: MatSnackBar, ) {
  }

  ngOnInit() {

    this.authService.user
      .filter(user => !!user) 
      .take(1) 
      .subscribe(user => {
        if (user) {
          this.miId = user.uid;
        }
      })

    this.profesorId = this.authService.profesorId;
    this.formulario = this.fb.group({
      'fecha_clase': ['', [Validators.required]],
      'hora_clase': ['20:30', [Validators.required]],
    });

    this.actuales=this.authService.actuales;
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    this.profesor$ = this.authService.getProfesorPorId(this.profesorId);


  }

  detectarCambios(data?: any) {
    if (!this.formulario) { return; }
    const form = this.formulario;
    for (const field in this.formErrores) {
      this.formErrores[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.mensajesValidacion[field];
        for (const key in control.errors) {
          this.formErrores[field] += messages[key] + ' ';
        }
      }
    }
  }


  get fecha_clase() { return this.formulario.get('fecha_clase') }
  get hora_clase() { return this.formulario.get('hora_clase') }


  agregar() {
    var act = this.actuales + 1;
    this.cargando = true;
    var fecha_convert = new Date(this.fecha_clase.value);
    var fecha = new Date().getTime();
    this.authService.agendarClase(
      {
        fecha_creacion: fecha,
        fecha_clase: fecha_convert,
        hora_clase: this.hora_clase.value,
        estudianteRef: this.authService.getUserPub(this.miId).ref,
        profesorRef: this.authService.getUserPub(this.profesorId).ref, 
        profesorId: this.profesorId,
        estudianteId: this.miId,
        estado: 'Enviada'

      }).then(ref => {
        console.log('Actuales: '+act);
        this.authService.actualizarUser(this.miId, { clases_actuales: act });
        this.authService.profesorId = null;
        this.router.navigate(['/clases']);
        this.snackBar.open('La clase ha sido agendada correctamente, espera la confirmación del profesor.', 'CERRAR', {
          duration: 4000
        });
      })
      .catch((error) => {
        console.log(error);
        this.snackBar.open('Hubo un problema al agendar la clase, intenta nuevamente.', 'CERRAR', {
          duration: 4000
        });
        this.cargando = false;
      });
  }
}
