import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Ng2ImgMaxModule } from 'ng2-img-max';
import { SwiperModule } from 'ngx-useful-swiper';

//Idioma
import { LOCALE_ID } from '@angular/core';
import locale from '@angular/common/locales/es-CL';
import { registerLocaleData } from '@angular/common';
registerLocaleData(locale);
import { MomentModule } from 'ngx-moment';
import 'moment/locale/es';

//Angularfire
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from './../environments/environment';

import { AppComponent } from './app.component';
import { InicioComponent } from './paginas/inicio/inicio.component';

//Rutas
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routing';

//Pipes
import { ReversePipe } from './core/reverse.pipe';
import { DocPipe } from './core/doc.pipe';
import { OrdenarPipe } from './core/ordenar.pipe';
import { TrimPipe } from './core/trim.pipe';

import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { HeaderComponent } from './ui/header/header.component';
import { FooterComponent } from './ui/footer/footer.component';

import { InisesComponent } from './autenticacion/inises/inises.component';
import { AgregarUsuarioComponent } from './paginas/agregar-usuario/agregar-usuario.component';
import { UsuariosComponent } from './paginas/usuarios/usuarios.component';
import { AdminGuard } from './core/admin.guard';
import { LoginGuard } from './core/login.guard';
import { PerfilDesactivadoComponent } from './paginas/perfil-desactivado/perfil-desactivado.component';
import { ActiveGuard } from './core/active.guard';
import { ProntoComponent } from './paginas/pronto/pronto.component';
import { ProfesoresComponent } from './paginas/profesores/profesores.component';
import { EstudiantesComponent } from './paginas/estudiantes/estudiantes.component';
import { ClasesComponent } from './paginas/clases/clases.component';
import { AgendarComponent } from './paginas/agendar/agendar.component';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    HeaderComponent,
    FooterComponent,
    InisesComponent,
    AgregarUsuarioComponent,
    UsuariosComponent,
    ReversePipe,
    DocPipe,
    OrdenarPipe,
    TrimPipe,
    PerfilDesactivadoComponent,
    ProntoComponent,
    ProfesoresComponent,
    EstudiantesComponent,
    ClasesComponent,
    AgendarComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    Ng2ImgMaxModule,
    SwiperModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    RouterModule.forRoot(ROUTES),

  ],
  providers: [
    { provide: LOCALE_ID, useValue: "es-CL" },
    AuthService,
    AuthGuard,
    AdminGuard,
    LoginGuard,
    ActiveGuard,   
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule { }
