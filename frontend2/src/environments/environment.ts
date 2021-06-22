// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl:'http://localhost:3000',
  disable_one_signal: true,
  onesignal_app_id: 'e1d054bc-5963-4134-8292-e8b753a51d3e',
  google_recaptcha_site_key:'6LfimLYaAAAAAFWq11jk57EgOkEJdY46njnxkD8X',
  fallback_language: 'en',
  language: 'ro',
  sms_verification: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
