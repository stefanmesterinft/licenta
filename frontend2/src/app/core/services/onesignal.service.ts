import {Injectable} from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from '@services/auth.service';
import { environment } from '../../../environments/environment';
let OneSignal;

@Injectable()
export class OneSignalService {
    oneSignalInit: any;
    oneSignalId: any; // store OneSignalId in localStorage

    constructor(
        private authService: AuthService,
        private storageService: StorageService
        ) {
        console.log('OneSignal Service Init');
    }
    
    // Call this method to start the onesignal process.
    public init() {
        this.oneSignalInit = this.storageService.get('oneSignalInit');
        this.oneSignalId = this.storageService.get('oneSignalId');

        this.oneSignalInit ? console.log('Already Initialized') : 
        this.addScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js', 
        (callback) => {
            console.log('OneSignal Script Loaded');
            this.initOneSignal();
        })
    }

    addScript(fileSrc, callback) {
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = callback;
        script.src = fileSrc;
        head.appendChild(script);
    }

    initOneSignal() {
        OneSignal = window['OneSignal'] || [];
        OneSignal.sendTag('user_id', this.authService.getId(), (tagsSent) => {
            // Callback called when tags have finished sending
            console.log('OneSignal Tag Sent', tagsSent);
        });
        console.log('Init OneSignal');
        OneSignal.push(['init', {
            appId: environment.onesignal_app_id,
            autoRegister: true,
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
                enable: false,
            },
        }]);
        console.log('OneSignal Initialized');
        this.checkIfSubscribed();
    }

    subscribe() {
        OneSignal.push(() => {
            console.log('Register For Push');
            OneSignal.push(['registerForPushNotifications'])
            OneSignal.on('subscriptionChange', (isSubscribed) => {
                console.log('The user\'s subscription state is now:', isSubscribed);
                this.listenForNotification();
                OneSignal.getUserId().then((userId) => {
                    console.log('User ID is', userId);
                    this.oneSignalId = userId;
                    this.storageService.set('oneSignalUser', this.oneSignalId)
                    this.updateLocalUserProfile();
                });
            });
        });
    }

    listenForNotification() {
        console.log('Initalize Listener');
        OneSignal.on('notificationDisplay', (event) => {
            console.log('OneSignal notification displayed:', event);
            this.listenForNotification();
        });
    }

    getUserID() {
        OneSignal.getUserId().then((userId) => {
            console.log('User ID is', userId);
            this.oneSignalId = userId;
            this.storageService.set('oneSignalUser', this.oneSignalId)
        });
    }

    checkIfSubscribed() {
        OneSignal.push(() => {
            /* These examples are all valid */
            OneSignal.isPushNotificationsEnabled((isEnabled) => {
                if (isEnabled) {
                    this.storageService.set('oneSignalInit', 'inited')
                    console.log('Push notifications are enabled!');
                    this.getUserID();
                } else {
                    console.log('Push notifications are not enabled yet.');
                    this.subscribe();
                }
            }, (error) => {
                console.log('Push permission not granted');
            });
        });
    }

    updateLocalUserProfile() {
        // Store OneSignal ID in your server for sending push notificatios.
    }
}