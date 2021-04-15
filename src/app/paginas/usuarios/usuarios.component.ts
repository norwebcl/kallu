import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios$: any;
  maxUsuarios = 10;
  esconder = true;

  constructor(public authService: AuthService) { }

  ngOnInit() {

    this.usuarios$ = this.authService.getUsuarios();

  }

  cargarMas() {
    this.maxUsuarios = this.maxUsuarios + 10;
  }


  eliminar(usuario: any) {
  }

  filtrarGuardias(usuarios: any){
    var guardias: Array<any> = []; 
    for(var i=0; i<usuarios.length;i++){
      if(usuarios[i].guardia){
        guardias.push(usuarios[i]);
      }
    }
    return guardias
  }

  filtrarSupervisores(usuarios: any){
    var admins: Array<any> = []; 
    for(var i=0; i<usuarios.length;i++){
      if(usuarios[i].supervisor){
        admins.push(usuarios[i]);
      }
    }
    return admins
  }

  filtrarUsuarios(usuarios: any){
    var admins: Array<any> = []; 
    for(var i=0; i<usuarios.length;i++){
      if(usuarios[i].usuario){
        admins.push(usuarios[i]);
      }
    }
    return admins
  }

  cambiarEstadoUsuario(userId: any, variable: any){
    var estado = !variable;
  
    this.authService.updateUsuario(userId,
      {
        activo: estado,
      }
      );
  }


}
