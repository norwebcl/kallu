import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-inises',
  templateUrl: './inises.component.html',
  styleUrls: ['./inises.component.css']
})
export class InisesComponent implements OnInit {
  formulario: FormGroup;
  datos: any;
  cargando = false;

  hide = true;

  mensaje: string;
  icono: string;
  clase: string;

  formErrores = {
    'email': ''
  }

  mensajesValidacion = {
    'email': {
      'required': 'Email obligatorio',
      'email': 'Introduzca una dirección email correcta'
    }
  }
  constructor(public snackBar: MatSnackBar, private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['']
    });
    this.formulario.valueChanges.subscribe(data => this.detectarCambios(data));
    this.detectarCambios();
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

  enviar() {
    this.cargando = true;
    this.datos = this.crearJSON();
    this.authService.ingresarEmail(this.datos).then((auth: any) => {
      this.snackBar.open('Has iniciado sesión correctamente.', 'CERRAR', {
        duration: 4000
      });

      this.router.navigate(['/']);

    })
      .catch((error) => {
        this.snackBar.open('El usuario o contraseña no es correcto.', 'CERRAR', {
          duration: 4000
        });
        this.cargando = false;
      });
  }

  crearJSON() {
    const crearJSON = {
      email: this.formulario.get('email').value,
      password: this.formulario.get('password').value,
    };
    return crearJSON;
  }

}
