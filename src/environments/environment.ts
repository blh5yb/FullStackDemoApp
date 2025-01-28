// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth_api: 'https://76t9d1d6e0.execute-api.us-east-2.amazonaws.com/demo_app/express_auth',
  variants_api: 'https://oerqjspvjc.execute-api.us-east-2.amazonaws.com/demo_app/flask-api',
  greeting_api: 'https://w2p5wlkwe2.execute-api.us-east-2.amazonaws.com/dev',
  email_api: 'https://lirs3mrska.execute-api.us-east-2.amazonaws.com/demo_app',
  //email_api: 'http://localhost:8080',
  host_email: 'blhykes@gmail.com',
  //dev-auth_api: 'http://localhost:3000/express_auth',
  //variants_api: 'http://localhost:5002/flask-api',
  demo_auth: {
    "email": "blhyk.es@gmail.com",
    "password": "testpass1"
  },
  firebase: {
    apiKey: "AIzaSyCQqbOBbSvHE39rOKU0vWFQ2V08tfBV1wU",
    authDomain: "barryhykesdemo.firebaseapp.com",
    projectId: "barryhykesdemo",
    storageBucket: "barryhykesdemo.firebasestorage.app",
    messagingSenderId: "246242893197",
    appId: "1:246242893197:web:f9acad58614d8eec4831c4",
    measurementId: "G-4PWTTSNQ9W"
  },
  max_variants: 5
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
