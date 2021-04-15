import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTOS } from '../../interfaces/autos'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar } from '@angular/material';
import { PAISES } from '../../interfaces/paises';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit {

  formulario: FormGroup;

  paises = PAISES;

  formErrores = {
    'displayName': '',
    'correo': '',
    'rut': '',
    'tipo': '',
    'texto': '',
    'skype': '',
    'hangouts': '',
  }
  cargando = false;
  mensajeError = false;
  mensajesValidacion = {

    'displayName': {
      'required': 'Requerido',
      'maxlength': 'Máximo 200 caracteres.',
    },
    'correo': {
      'required': 'Requerido',
      'maxlength': 'Máximo 200 caracteres.',
      'email': 'Ingrese una dirección de correo válida'
    },
    'rut': {
      'required': 'Requerido',
      'minlength': 'Mínimo 6 caracteres.',
      'maxlength': 'Máximo 20 caracteres.',
    },
    'tipo': {
      'maxlength': 'Máximo 10000 caracteres.',
    },
    'texto': {
      'maxlength': 'Máximo 10000 caracteres.',
    },
    'skype': {
      'maxlength': 'Máximo 10000 caracteres.',
    },
    'hangouts': {
      'maxlength': 'Máximo 10000 caracteres.',
    },


  }


  constructor(public fb: FormBuilder, public authService: AuthService, public router: Router, public snackBar: MatSnackBar, ) {

  }

  ngOnInit() {

    this.formulario = this.fb.group({
      'displayName': ['', [Validators.required, Validators.maxLength(200)]],
      'correo': ['', [Validators.required, Validators.email]],
      'rut': ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      // 'rut': ['', [Validators.maxLength(20),Validators.pattern(/[0-9]{20}/)]],
      'tipo': ['Estudiante'],
      'pais': ['Chile'],
      'plan': ['Silver'],
      'skype': [''],
      'hangouts': [''],
      'burn_user': [''],
      'burn_password': [''],
      'dia_uno': ['Lunes'],
      'dia_dos': ['Viernes'],
      'hora_uno': ['00:00'],
      'hora_dos': ['23:30'],
      'texto': ['', Validators.maxLength(1000)],
    });

    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
    this.checkUsuario();

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

  get displayName() { return this.formulario.get('displayName') }
  get correo() { return this.formulario.get('correo') }
  get password() { return this.formulario.get('rut') }
  get rut() { return this.formulario.get('rut') }
  get tipo() { return this.formulario.get('tipo') }
  get pais() { return this.formulario.get('pais') }
  get plan() { return this.formulario.get('plan') }
  get skype() { return this.formulario.get('skype') }
  get hangouts() { return this.formulario.get('hangouts') }
  get biografia() { return this.formulario.get('texto') }
  get dia_uno() { return this.formulario.get('dia_uno') }
  get dia_dos() { return this.formulario.get('dia_dos') }
  get hora_uno() { return this.formulario.get('hora_uno') }
  get hora_dos() { return this.formulario.get('hora_dos') }
  get burn_user() { return this.formulario.get('burn_user') }
  get burn_password() { return this.formulario.get('burn_password') }

  checkUsuario() {
    if (this.tipo.value == 'Profesor') {
      return true;
    } else {
      return false;
    }
  }


  agregar() {
    this.cargando = true;
    
    var clases_totales = 0;

    if(this.plan.value=='Silver'){
      clases_totales = 12;
    }

    if(this.plan.value == 'Gold'){
      clases_totales = 24;

    }
    if(this.plan.value == 'Platinum'){
      clases_totales = 48;

    }

    if (this.tipo.value == 'Profesor') {
      this.authService.agregarUsuario(
        {
          email: this.correo.value,
          password: this.password.value,
          rut: this.rut.value,
          displayName: this.displayName.value,
          pais: this.pais.value,
          tipo: 'Profesor',
          skype: this.skype.value,
          hangouts: this.hangouts.value,
          biografia: this.biografia.value,
          dia_uno: this.dia_uno.value,
          dia_dos: this.dia_dos.value,
          hora_uno: this.hora_uno.value,
          hora_dos: this.hora_dos.value,
          activo: true,
        }).then(ref => {
          this.router.navigate(['/profesores']);
          this.snackBar.open('El usuario ha sido registrado correctamente.', 'CERRAR', {
            duration: 4000
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open('El correo electrónico ya se encuentra registrado.', 'CERRAR', {
            duration: 4000
          });
          this.cargando = false;
        });
    }
    if (this.tipo.value == 'Estudiante') {
      this.authService.agregarUsuario(
        {
          email: this.correo.value,
          password: this.password.value,
          rut: this.rut.value,
          displayName: this.displayName.value,
          pais: this.pais.value,
          tipo: 'Estudiante',
          skype: this.skype.value,
          hangouts: this.hangouts.value,
          plan: this.plan.value,
          activo: true,
          burn_user: this.burn_user.value,
          burn_password: this.burn_password.value,
          clases_totales: clases_totales,
        }).then(ref => {
          this.router.navigate(['/estudiantes']);
          this.snackBar.open('El usuario ha sido registrado correctamente.', 'CERRAR', {
            duration: 4000
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open('El correo electrónico ya se encuentra registrado.', 'CERRAR', {
            duration: 4000
          });
          this.cargando = false;
        });
    }
  }
}
