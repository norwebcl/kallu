const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);

var serviceAccount = require("./kallu-a0431-db29c8eeec96.json");
// var serviceAccount = require("./northsec-77-firebase-adminsdk-me3jh-2503c851e2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kallu-a0431.firebaseio.com"
});

const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'KALLU The Language Company';

exports.notifyUser = functions.firestore
  .document('visitas/{visitaId}')
  .onCreate(event => {

    const notificacion = event.data();
    const userId = notificacion.userIdNoti

    // Message details for end user
    const payload = {
      notification: {
        title: 'Tienes una nueva visita!',
        body: `${notificacion.nombre} ha llegado a su hogar, por favor recíbalo!`,
        icon: 'https://i.stack.imgur.com/34AD2.jpg'
      }
    }

    // ref to the parent document
    const db = admin.firestore()
    const userRef = db.collection('users').doc(userId)


    // get users tokens and send notifications
    return userRef.get()
      .then(snapshot => snapshot.data())
      .then(user => {

        const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []

        if (!tokens.length) {
          throw new Error('El usuario no tiene tokens!')
        }

        return admin.messaging().sendToDevice(tokens, payload)
      })
      .catch(err => console.log(err))
  });


exports.visitaNotiCorreo = functions.firestore
  .document('visitas/{visitaId}')
  .onCreate(event => {

    const notificacion = event.data();

    // [END onCreateTrigger]
    // [START eventAttributes]
    const email = notificacion.emailNotificacion; // The email of the user.
    const displayName = notificacion.nombreNotificacion; // The display name of the user.
    const nombreVisita = notificacion.nombre;
    // [END eventAttributes]

    return visitaNotiCorreo(email, displayName, nombreVisita);
  });


async function visitaNotiCorreo(email, displayName, nombreVisita) {
  const mailOptions = {
    from: `${APP_NAME} <contacto@kallu.cl>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `${nombreVisita} está llegando a su hogar!`;
  // mailOptions.subject = `Welcome to ${APP_NAME}!`;
  // mailOptions.text = `Hola ${displayName || ''}! Te escribimos desde ${APP_NAME} para informarle que su visita ${nombreVisita} ha llegado a su hogar, por favor recíbalo.`;
  mailOptions.html = `Hola ${displayName || ''}! <br><br> Te escribimos desde ${APP_NAME} para informarle que su visita ${nombreVisita} ha llegado a su hogar, por favor recíbalo. <br><br> Saludos desde el Equipo KALLU The Language Company! <br><a href="https://app.northsecurity.cl">https://app.northsecurity.cl</a><br> <img  style="width:100px;" src="cid:logo">`;
  mailOptions.attachments = [{
    filename: 'logo_nuevo.png',
    path: 'https://app.northsecurity.cl/assets/logo_nuevo.png',
    cid: 'logo' //same cid value as in the html img src
  }];
  await mailTransport.sendMail(mailOptions);
  console.log('Correo enviado correctamente a:', email);
  return null;
}

exports.crearUsuario = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const mail = snap.get('email');
    const displayName = snap.get('displayName');
    const password = snap.get('password');
    await admin.auth().createUser({
      uid: userId,
      disabled: false,
      displayName: snap.get('displayName'),
      email: snap.get('email'),
      password: snap.get('password'),
    });
    console.log('Usuario agregado correctamente:', mail);
    return registroNotiCorreo(mail, displayName, password);
  });

exports.eliminarUsuario = functions.firestore
  .document('users/{userId}')
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    // await admin.auth().createUser({
    //   uid: userId,
    //   disabled: false,
    //   displayName: snap.get('displayName'),
    //   email: snap.get('email'),
    //   password: snap.get('password'),
    // });
    // console.log('Usuario agregado correctamente:', mail);

    await admin.auth().deleteUser(userId)
      .then(function () {
        console.log('Successfully deleted user');
      })
      .catch(function (error) {
        console.log('Error deleting user:', error);
      });
      return;
    // return registroNotiCorreo(mail, displayName, password);
  });

async function registroNotiCorreo(email, displayName, password) {
  const mailOptions = {
    from: `${APP_NAME} <contacto@kallu.cl>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `${displayName} has sido registrado correctamente en la App Web de KALLU The Language Company!`;
  // mailOptions.html = `Hola ${displayName || ''}! <br><br> Te escribimos desde ${APP_NAME} para informarte que te has registrado correctamente en nuestra app. <br><br> Tus datos de acceso son: <br> Usuario: ${email} <br> Contraseña: ${password} <br> Link: <a href="https://app.kallu.cl">https://app.kallu.cl</a>  <br><br> Saludos desde el Equipo KALLU The Language Company!<br> <img style="width:100px;" src="cid:logo">`;
  mailOptions.html = `Dear ${displayName || ''}! <br><br> 

  Welcome to ${APP_NAME} <br> 
  
  This is a message to confirm your request in our App.<br>
  
  The details are:<br>
  User: ${email}<br>
  Password: ${password}<br>
  Link: <a href="https://app.kallu.cl">https://app.kallu.cl</a><br><br>
  
  Regards<br>
  
  Hola ${displayName || ''}! <br><br> Te escribimos desde ${APP_NAME} para informarte que te has registrado correctamente en nuestra app. <br><br> Tus datos de acceso son: <br> Usuario: ${email} <br> Contraseña: ${password} <br> Link: <a href="https://app.kallu.cl">https://app.kallu.cl</a>  <br><br> Saludos desde el Equipo KALLU The Language Company!<br> <img style="width:100px;" src="cid:logo">`;
  
  mailOptions.attachments = [{
    filename: 'login-logo.png',
    path: 'https://kallu.cl/web/wp-content/login-logo.png',
    cid: 'logo' //same cid value as in the html img src
  }];
  await mailTransport.sendMail(mailOptions);
  console.log('Correo enviado correctamente a:', email);
  return null;

}

