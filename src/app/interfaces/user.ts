export interface Roles {
    reader: boolean;
    author?: boolean;
    admin?: boolean;
}

export interface User {
    activo?: any;
    uid: string;
    email?: string;
    displayName?: string;
    fecha_creacion?: any;
    fcmTokens?: any;
    password?: any;
    tipo?: any;
    burn_user?: any;
    burn_password?: any;
    skype?: any;
    hangouts?: any;
    dia_uno?: any;
    dia_dos?: any;
    hora_uno?: any;
    hora_dos?: any;
    plan?: any;
    rut?: any;
    biografia?: any;
    clases_totales?: any;
    clases_actuales?: any;
    pais?: any;
  }