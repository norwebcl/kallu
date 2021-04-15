import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../interfaces/user';
import { Archivo } from '../interfaces/archivo';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import { Query } from '@firebase/firestore-types'

@Injectable()
export class AuthService {

  usernames: AngularFirestoreDocument<any>
  mundoweed: AngularFirestoreDocument<any>
  user: Observable<User>;

  uploadedImage: Blob;
  usuarios: AngularFirestoreCollection<any>;

  filtroNombreInicio$: BehaviorSubject<string | null>;
  filtroNombreFin$: BehaviorSubject<string | null>;

  colSearch: Observable<any[]>;

  userId: any;

  profesorId: any = null;
  actuales : number;

  clases: AngularFirestoreCollection<any>;

  constructor(private afAuth: AngularFireAuth, private ng2ImgMax: Ng2ImgMaxService,
    private afs: AngularFirestore,
    private router: Router) {

    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      });

    this.usuarios = this.afs.collection('users');

    this.filtroNombreInicio$ = new BehaviorSubject(null);
    this.filtroNombreFin$ = new BehaviorSubject(null);

    this.clases = this.afs.collection('clases');

    this.actuales = 0;

  }

  ingresarEmail(datos): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(datos.email, datos.password)
        .then((user) => {
          resolve();
        })
        .catch((err: any) => {
          var message = err.message;
          reject(message);
        });
    });
  }

  registroUsuarioEmail(datos: any): Promise<any> {
    var fecha = new Date().getTime();
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(datos.email,
        datos.password)
        .then((user) => {
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
          const data = {
            uid: user.uid,
            email: user.email,
            password: datos.password,
            fecha_creacion: fecha,
            displayName: datos.displayName,
            idDpto: datos.idDpto || null,
            activo: datos.activo,
            fcmTokens: {},
            primerLogin: true,
            admin: false,
            usuario: datos.usuario || null,
            supervisor: datos.supervisor || null,
            guardia: datos.guardia || null,
          }
          userRef.set(data);
          resolve(this.userId = user.uid);
        })
        .catch((err: any) => {
          console.log(err);
          var message = err.message;
          reject(message);
        });
    });
  }

  agregarUsuario(datos: any): Promise<any> {
    var fecha = new Date().getTime();
    return new Promise((resolve, reject) => {
      this.usuarios.add({
        email: datos.email,
        password: datos.password,
        fecha_creacion: fecha,
        displayName: datos.displayName,
        rut: datos.rut,
        activo: datos.activo,
        pais: datos.pais,
        tipo: datos.tipo,
        skype: datos.skype || null,
        hangouts: datos.hangouts || null,
        biografia: datos.biografia || null,
        dia_uno: datos.dia_uno || null,
        dia_dos: datos.dia_dos || null,
        hora_uno: datos.hora_uno || null,
        hora_dos: datos.hora_dos || null,
        plan: datos.plan || null,
        burn_user: datos.burn_user || null,
        burn_password: datos.burn_password || null,
        clases_totales: datos.clases_totales || null,
        clases_actuales: 0,
      }).then((user) => {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
        const data = {
          uid: user.id
        }
        userRef.update(data);
        resolve(this.userId = user.id);
      })
        .catch((err: any) => {
          console.log(err);
          var message = err.message;
          reject(message);
        });
    });

  }

  eliminarUsuario(uid: any) {

    return new Promise((resolve, reject) => {
      this.usuarios.doc(uid).delete().then((user) => {
        console.log("Usuario Eliminado: "+ uid)
      })
        .catch((err: any) => {
          console.log(err);
          var message = err.message;
          reject(message);
        });
    });


  }

  reiniciarCont(datos): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(datos.email)
        .then((val: any) => {
          resolve();
        })
        .catch((err: any) => {
          var message = err.message;
          reject(message);
        });
    });
  }

  actualizarUsuario(user: User, data: any) {
    return this.afs.doc(`users/${user.uid}`).update(data)
  }

  actualizarUser(userId: any, data: any) {
    return this.afs.doc(`users/${userId}`).update(data)
  }

  updateUsuario(uid: string, data: any) {
    return this.afs.doc(`users/${uid}`).update(data)
  }

  salir() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/iniciosesion']);
    });
  }

  getUsuarios() {
    return this.afs.collection(`users`).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }

  getPorId(id) {
    return this.afs.doc<any>(`users/${id}`).valueChanges();
  }

  getUserPub(id) {
    return this.afs.doc<any>(`users/${id}`);
  }

  get(id) {
    return this.afs.doc<any>(`users/${id}`);
  }


  actualizar(id, data) {
    return this.get(id).update(data)
  }

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp()
  }

  filtroNombre(texto) {
    const textoBuscar = texto;
    this.filtroNombreInicio$.next(textoBuscar);
    this.filtroNombreFin$.next(textoBuscar + '\uf8ff');
  }

  crearId() {
    return this.afs.createId();
  }


  getProfesorPorId(id: any) {
    return this.afs.doc<any>(`users/${id}`).valueChanges();
  }

  agendarClase(data: any) {
    return this.clases.add(data);
  }

  getClases() {
    return this.afs.collection(`clases`).snapshotChanges().map(actions => {
      return actions.map(a => {
        return { id: a.payload.doc.id, ...a.payload.doc.data() }
      })
    })
  }


  getClase(id) {
    return this.afs.doc<any>(`clases/${id}`);
  }


  actualizarClase(id, data) {
    return this.getClase(id).update(data)
  }

  getClasesporId(estudianteId: any) {
    return this.afs.doc<any>(`users/${estudianteId}`).valueChanges();
  }


}
