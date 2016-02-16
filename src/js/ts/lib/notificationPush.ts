namespace MyBestPro.lib {

    'use strict';

    export class NotificationPush implements ng.IServiceProvider {

        public static $inject: Array<string> = ['MBPLogProvider'];

        protected logPrefix: string = 'MBPNotificationPush: ';

        private configurations: any = {
            android: {
                senderID: '',
                icon: '',
                iconColor: '',
                sound: true,
                vibrate: true,
                clearNotifications: true,
                forceShow: false,
                topics: [],
            },
            ios: {
                senderID: '',
                alert: false,
                badge: false,
                sound: false,
                clearBadge: false,
                gcmSandbox: false,
                topics: [],
                categories: { },
            },
            windows: { },
        };

        constructor(
            private log: MyBestPro.lib.Log
        ) {

        }

        public $get: Array<any> = [
            '$window',
            '$q',
            'MBPLog',
            function(
                $window: any,
                $q: ng.IQService
            ): any {
                return {
                    notification: null,
                    configurations: this.configurations,
                    /**
                     * Note: like all plugins you must wait until you receive
                     * the deviceready event before calling init().
                     * @returns {IPromise}
                     */
                    init: function (): ng.IPromise<any> {
                        let defer: ng.IDeferred<any> = $q.defer();
                        if (typeof $window.cordova === 'undefined') {
                            defer.reject('Environment not integrate cordova');
                            this.traceError(
                                'Environment not integrate cordova'
                            );
                            return defer.promise;
                        }
                        this.traceInfo('Initialize notification push');
                        this.traceDebug(
                            'Using configuration - ',
                            this.configurations
                        );
                        this.notification = PushNotification.init(
                            this.configurations
                        );
                        defer.resolve(this);
                        return defer.promise;
                    },
                    hasInitialized: function(): boolean {
                        return this.notification !== null;
                    },
                    hasPermission: function(): boolean {
                        if (!this.hasInitialized()) {
                            this.traceError(
                                'You have not initialized notification push'
                            );
                            return false;
                        }
                        return this.notification.hasPermission();
                    },
                    /**
                     * The event registration will be triggered on each
                     * successful registration with the 3rd party push service.
                     * @param callback
                     * @returns {NotificationPush}
                     */
                    onRegistration: function(
                        callback: Function
                    ): NotificationPush {
                        this.on('registration', callback);
                        return this;
                    },
                    /**
                     * The event error will trigger when an internal error
                     * occurs and the cache is aborted.
                     * @param callback
                     * @returns {NotificationPush}
                     */
                    onError: function(callback: Function): NotificationPush {
                        this.on('error', callback);
                        return this;
                    },
                    /**
                     * The event notification will be triggered each time a
                     * push notification is received by a 3rd party push
                     * service on the device.
                     * @param callback
                     * @returns {NotificationPush}
                     */
                    onNotification: function(
                        callback: Function
                    ): NotificationPush {
                        this.on('notification', callback);
                        return this;
                    },
                    /**
                     * @param eventName
                     * @param callback
                     * @returns {NotificationPush}
                     */
                    on: function(
                        eventName: string,
                        callback: Function
                    ): NotificationPush {
                        if (!this.hasInitialized()) {
                            this.traceError(
                                'You have not initialized notification push'
                            );
                            return this;
                        }
                        this.notification.on(eventName, callback);
                        return this;
                    },
                    /**
                     * Removes a previously registered callback for an event.
                     * @param eventName
                     * @param callback
                     * @returns {NotificationPush}
                     */
                    off: function(
                        eventName: string,
                        callback: Function
                    ): NotificationPush {
                        if (!this.hasInitialized()) {
                            this.traceError(
                                'You have not initialized notification push'
                            );
                            return this;
                        }
                        this.notification.off(eventName, callback);
                        return this;
                    },
                    /**
                     * The unregister method is used when the application no
                     * longer wants to receive push notifications.
                     * Beware that this cleans up all event handlers previously
                     * registered, so you will need to re-register
                     * them if you want them to function again without an
                     * application reload.
                     *
                     * If you provide a list of topics as an optional parameter
                     * then the application will unsubscribe from
                     * these topics but continue to receive other push messages.
                     *
                     * @param successHandler
                     * @param errorHandler
                     * @param topics
                     * @returns {NotificationPush}
                     */
                    unregister: function(
                        successHandler: Function,
                        errorHandler: Function,
                        topics: Array<any>
                    ): NotificationPush {
                        if (!this.hasInitialized()) {
                            this.traceError(
                                'You have not initialized notification push'
                            );
                            return this;
                        }
                        this.notification.unregister(
                            successHandler,
                            errorHandler,
                            topics
                        );
                        return this;
                    },
                    /**
                     * Set the badge count visible when the app is not running
                     * (iOS only)
                     * @param successHandler
                     * @param errorHandler
                     * @param count
                     * @returns {NotificationPush}
                     */
                    setApplicationIconBadgenumber: function(
                        successHandler: Function,
                        errorHandler: Function,
                        count: number
                    ): NotificationPush {
                        if (!this.hasInitialized()) {
                            this.traceError(
                                'You have not initialized notification push'
                            );
                            return this;
                        }
                        this.notification.setApplicationIconBadgenumber(
                            successHandler,
                            errorHandler,
                            count
                        );
                        return this;
                    },
                    /**
                     * Get the current badge count visible when the app is not
                     * running (iOS only)
                     * @param successHandler
                     * @param errorHandler
                     * @returns {NotificationPush}
                     */
                    getApplicationIconBadgenumber: function(
                        successHandler: Function,
                        errorHandler: Function
                    ): NotificationPush {
                        if (!this.hasInitialized()) {
                            this.traceError(
                                'You have not initialized notification push'
                            );
                            return this;
                        }
                        this.notification.getApplicationIconBadgenumber(
                            successHandler,
                            errorHandler
                        );
                        return this;
                    },
                    /**
                     * Tells the OS that you are done processing a background
                     * push notification. (iOS Only)
                     * @param successHandler
                     * @param errorHandler
                     * @returns {NotificationPush}
                     */
                    finish: function(
                        successHandler: Function,
                        errorHandler: Function
                    ): NotificationPush {
                        if (!this.hasInitialized()) {
                            this.traceError(
                                'You have not initialized notification push'
                            );
                            return this;
                        }
                        this.notification.finish(successHandler, errorHandler);
                        return this;
                    },
                };
            },
        ];

        public traceDebug(message: string, ...args: any[]): void {
            this.log.debug(this.logPrefix + message);
            if (arguments.length) {
                this.log.debug(arguments);
            }
        }

        public traceInfo(message: string, ...args: any[]): void {
            this.log.info(this.logPrefix + message);
            if (arguments.length) {
                this.log.info(arguments);
            }
        }

        public traceError(message: string, ...args: any[]): void {
            this.log.error(this.logPrefix + message);
            if (arguments.length) {
                this.log.error(arguments);
            }
        }

        /**
         * Activate sound for all devices
         * @returns {NotificationPush}
         */
        public activateSound(): NotificationPush {
            return this
                .activateAndroidSound()
                .activateIosSound();
        }

        /**
         * Deactivate sound for all devices
         * @returns {NotificationPush}
         */
        public deactivateSound(): NotificationPush {
            return this
                .deactivateAndroidSound()
                .deactivateIosSound();
        }

        /**
         * To subscribe to a GcmPubSub topic for all devices
         * @returns {NotificationPush}
         */
        public addTopic(topic: any): NotificationPush {
            return this
                .addAndroidTopic(topic)
                .addIosTopic(topic);
        }

        /**
         * Setting this uses GCM for notifications instead of native
         * @param senderID
         * @returns {NotificationPush}
         */
        public setIosSenderID(senderID: string): NotificationPush {
            this.configurations.ios.senderID = senderID;
            return this;
        }

        /**
         * The device shows an alert on receipt of notification.
         * Note: the value you set this option to the first time you call
         * the init method will be how the application always acts.
         * Once this is set programmatically in the init method it can only
         * be changed manually by the user in Settings>Notifications>App Name.
         * This is normal iOS behaviour.
         * @returns {NotificationPush}
         */
        public activateIosAlert(): NotificationPush {
            this.configurations.ios.alert = true;
            return this;
        }

        /**
         * The device no shows an alert on receipt of notification.
         * @returns {NotificationPush}
         */
        public deactivateIosAlert(): NotificationPush {
            this.configurations.ios.alert = false;
            return this;
        }

        /**
         * The device sets the badge number on receipt of notification.
         * Note: the value you set this option to the first time you call
         * the init method will be how the application always acts.
         * Once this is set programmatically in the init method it can only
         * be changed manually by the user in Settings>Notifications>App Name.
         * This is normal iOS behaviour.
         * @returns {NotificationPush}
         */
        public activateIosBadge(): NotificationPush {
            this.configurations.ios.badge = true;
            return this;
        }

        /**
         * The device not sets the badge number on receipt of notification.
         * @returns {NotificationPush}
         */
        public deactivateIosBadge(): NotificationPush {
            this.configurations.ios.badge = false;
            return this;
        }

        /**
         * The device plays a sound on receipt of notification.
         * Note: the value you set this option to the first time you call
         * the init method will be how the application always acts. O
         * nce this is set programmatically in the init method it can only be
         * changed manually by the user in Settings>Notifications>App Name.
         * This is normal iOS behaviour.
         * @returns {NotificationPush}
         */
        public activateIosSound(): NotificationPush {
            this.configurations.ios.sound = true;
            return this;
        }

        /**
         * The device not plays a sound on receipt of notification.
         * @returns {NotificationPush}
         */
        public deactivateIosSound(): NotificationPush {
            this.configurations.ios.sound = false;
            return this;
        }

        /**
         * The badge will be cleared on app startup.
         * @returns {NotificationPush}
         */
        public activateIosClearBadge(): NotificationPush {
            this.configurations.ios.clearBadge = true;
            return this;
        }

        /**
         * The badge will not be cleared on app startup.
         * @returns {NotificationPush}
         */
        public deactivateIosClearBadge(): NotificationPush {
            this.configurations.ios.clearBadge = false;
            return this;
        }

        /**
         * Whether to use sandbox GCM setting.
         * @returns {NotificationPush}
         */
        public activateIosGcmSandbox(): NotificationPush {
            this.configurations.ios.gcmSandbox = true;
            return this;
        }

        /**
         * Whether to use prod GCM setting.
         * @returns {NotificationPush}
         */
        public deactivateIosGcmSandbox(): NotificationPush {
            this.configurations.ios.gcmSandbox = false;
            return this;
        }

        /**
         * To subscribe to a GcmPubSub topic.
         * Note: only usable in conjunction with senderID.
         * @returns {NotificationPush}
         */
        public addIosTopic(topic: any): NotificationPush {
            this.configurations.ios.topics.push(topic);
            return this;
        }

        /**
         * Set full ios configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        public setIosConfiguration(configuration: any): NotificationPush {
            this.configurations.ios = configuration;
            return this;
        }

        /**
         * Maps to the project number in the Google Developer Console.
         * @param senderID: string
         * @returns {NotificationPush}
         */
        public setAndroidId(senderID: string): NotificationPush {
            this.configurations.android.senderID = senderID;
            return this;
        }

        /**
         * https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/
         * API.md#android
         * http://developer.android.com/reference/android/graphics/Color.html
         * #parseColor(java.lang.String)
         * @param iconName: string - The name of a drawable resource to use as
         * the small-icon. The name should not include the extension.
         * @param iconBackgroundColor: string - Sets the background color of
         * the small icon on Android 5.0 and greater.
         * @returns {NotificationPush}
         */
        public setAndroidIcon(
            iconName: string,
            iconBackgroundColor: string
        ): NotificationPush {
            this.configurations.android.icon = iconName;
            return this;
        }

        /**
         * It plays the sound specified in the push data or the default
         * system sound.
         * @returns {NotificationPush}
         */
        public activateAndroidSound(): NotificationPush {
            this.configurations.android.sound = true;
            return this;
        }

        /**
         * It not plays the sound specified in the push data or the default
         * system sound.
         * @returns {NotificationPush}
         */
        public deactivateAndroidSound(): NotificationPush {
            this.configurations.android.sound = false;
            return this;
        }

        /**
         * The device vibrates on receipt of notification.
         * @returns {NotificationPush}
         */
        public activateAndroidVibrate(): NotificationPush {
            this.configurations.android.vibrate = true;
            return this;
        }

        /**
         * The device not vibrates on receipt of notification.
         * @returns {NotificationPush}
         */
        public deactivateAndroidVibrate(): NotificationPush {
            this.configurations.android.vibrate = false;
            return this;
        }

        /**
         * The app clears all pending notifications when it is closed.
         * @returns {NotificationPush}
         */
        public activateAndroidClearNotification(): NotificationPush {
            this.configurations.android.clearNotifications = true;
            return this;
        }

        /**
         * The app no clears all pending notifications when it is closed.
         * @returns {NotificationPush}
         */
        public deactivateAndroidClearNotification(): NotificationPush {
            this.configurations.android.forceShow = false;
            return this;
        }

        /**
         * Will always show a notification, even when the app is on the
         * foreground.
         * @returns {NotificationPush}
         */
        public activateAndroidForceShow(): NotificationPush {
            this.configurations.android.forceShow = true;
            return this;
        }

        /**
         * Will not always show a notification, even when the app is on the
         * foreground.
         * @returns {NotificationPush}
         */
        public deactivateAndroidForceShow(): NotificationPush {
            this.configurations.android.forceShow = false;
            return this;
        }

        /**
         * To subscribe to a GcmPubSub topic.
         * @returns {NotificationPush}
         */
        public addAndroidTopic(topic: any): NotificationPush {
            this.configurations.android.topics.push(topic);
            return this;
        }

        /**
         * Set full android configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        public setAndroidConfiguration(configuration: any): NotificationPush {
            this.configurations.android = configuration;
            return this;
        }

        /**
         * Set full windows configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        public setWindowsConfiguration(configuration: any): NotificationPush {
            this.configurations.windows = configuration;
            return this;
        }

        /**
         * Set full configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        public setConfiguration(configuration: any): NotificationPush {
            this.configurations = configuration;
            return this;
        }
    }
}
angular.module('MyBestPro')
    .provider('MBPNotificationPush', MyBestPro.lib.NotificationPush);
