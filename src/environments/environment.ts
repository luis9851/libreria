// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,

  dialogflow: { 
      angularBot: '83ef8292f8a24c9b14df34751e497043651f0f97'
  },
  firebase: {
    apiKey: 'AIzaSyBicowszoZIpChqlGWgTucENkYFZMgozG8',
    authDomain: 'dwi9a-40583.firebaseapp.com',
    databaseURL: '<your-database-url>',
    projectId: 'dwi9a-40583',
    storageBucket: 'gs://dwi9a-40583.appspot.com',
    messagingSenderId: '932182395719'
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
