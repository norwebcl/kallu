const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./kallu-a0431-db29c8eeec96.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "xxx"
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

    await admin.auth().deleteUser(userId)
      .then(function () {
        console.log('Successfully deleted user');
      })
      .catch(function (error) {
        console.log('Error deleting user:', error);
      });
      return;
  });

async function registroNotiCorreo(email, displayName, password) {
  const mailOptions = {
    from: `${APP_NAME} <contacto@kallu.cl>`,
    to: email,
  };

  mailOptions.subject = `${displayName} has sido registrado correctamente en la App Web de KALLU The Language Company!`;
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
    cid: 'logo'
  }];
  await mailTransport.sendMail(mailOptions);
  console.log('Correo enviado correctamente a:', email);
  return null;

}

