
import { Routes } from '@angular/router';

import { InisesComponent } from './autenticacion/inises/inises.component';

import { AuthGuard } from './core/auth.guard';
import { AgregarUsuarioComponent } from './paginas/agregar-usuario/agregar-usuario.component';
import { LoginGuard } from './core/login.guard';
import { PerfilDesactivadoComponent } from './paginas/perfil-desactivado/perfil-desactivado.component';
import { AdminGuard } from './core/admin.guard';
import { ProntoComponent } from './paginas/pronto/pronto.component';
import { ProfesoresComponent } from './paginas/profesores/profesores.component';
import { EstudiantesComponent } from './paginas/estudiantes/estudiantes.component';
import { ClasesComponent } from './paginas/clases/clases.component';
import { AgendarComponent } from './paginas/agendar/agendar.component';


export const ROUTES: Routes = [
  { path: '', component: ClasesComponent, canActivate: [AuthGuard] },
  { path: 'profesores', component: ProfesoresComponent, canActivate: [AuthGuard] },
  { path: 'estudiantes', component: EstudiantesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'clases', component: ClasesComponent, canActivate: [AuthGuard] },
  { path: 'agendar', component: AgendarComponent, canActivate: [AuthGuard] },
  { path: 'agregar-usuario', component: AgregarUsuarioComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'cuenta-desactivada', component: PerfilDesactivadoComponent, canActivate: [AuthGuard] },
  { path: 'pronto', component: ProntoComponent, canActivate: [AuthGuard] },
  { path: 'iniciosesion', component: InisesComponent, data: { active: false, icon: 'person', text: 'Iniciar Sesión' }, canActivate: [LoginGuard] },
  { path: '**', redirectTo: '' },
];
