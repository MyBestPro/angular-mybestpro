declare namespace MyBestPro.component {
    function Log(): ng.IDirective;
}
declare namespace MyBestPro.controller {
    class Log {
        $scope: MyBestPro.ILogScope;
        private log;
        $inject: Array<string>;
        constructor($scope: MyBestPro.ILogScope, log: MyBestPro.lib.Log);
    }
}
declare namespace MyBestPro {
    interface ILogScope extends ng.IScope {
        displayMode: boolean;
        messages: Array<any>;
    }
}
declare namespace MyBestPro.lib {
    class IndexedDB implements ng.IServiceProvider {
        private $indexedDBProvider;
        private log;
        static $inject: Array<string>;
        tables: any;
        databaseName: any;
        databaseVersion: number;
        protected logPrefix: string;
        constructor($indexedDBProvider: any, log: MyBestPro.lib.Log);
        $get: Array<any>;
        traceDebug(message: string, ...args: any[]): void;
        traceInfo(message: string, ...args: any[]): void;
        addTable(tableName: string, tableConfig: any): IndexedDB;
        setDB(databaseName: string, databaseVersion: number): IndexedDB;
        upgradeDatabase(that: MyBestPro.lib.IndexedDB, db: IDBDatabase): void;
        upgradeTable(db: IDBDatabase, table: any, tableName: string): void;
        initDatabase(): void;
    }
}
declare namespace MyBestPro.lib {
    class Log implements ng.IServiceProvider {
        static $inject: Array<string>;
        LOG_INACTIVE: number;
        LOG_ERROR: number;
        LOG_WARNING: number;
        LOG_INFO: number;
        LOG_LOG: number;
        LOG_DEBUG: number;
        private level;
        private displayMode;
        private messages;
        private callbackReceivedLog;
        private callbackChangeStatus;
        private consoles;
        private levels;
        $get(): any;
        debug(...args: any[]): void;
        info(...args: any[]): void;
        error(...args: any[]): void;
        log(...args: any[]): void;
        warn(...args: any[]): void;
        setLevel(level: number): void;
        setDisplayMode(enabled: boolean): void;
        getDisplayMode(): boolean;
        time(timerName: string, level?: number): void;
        timeEnd(timerName: string, level?: number): void;
        onReceivedLog(callbackReceivedLog: Function): void;
        onChangeStatus(callbackChangeStatus: Function): void;
        getHistory(): any;
        private message(level, data);
    }
}
declare namespace MyBestPro.lib {
    class NotificationPush implements ng.IServiceProvider {
        private log;
        static $inject: Array<string>;
        protected logPrefix: string;
        private configurations;
        constructor(log: MyBestPro.lib.Log);
        $get: Array<any>;
        traceDebug(message: string, ...args: any[]): void;
        traceInfo(message: string, ...args: any[]): void;
        traceError(message: string, ...args: any[]): void;
        /**
         * Activate sound for all devices
         * @returns {NotificationPush}
         */
        activateSound(): NotificationPush;
        /**
         * Deactivate sound for all devices
         * @returns {NotificationPush}
         */
        deactivateSound(): NotificationPush;
        /**
         * To subscribe to a GcmPubSub topic for all devices
         * @returns {NotificationPush}
         */
        addTopic(topic: any): NotificationPush;
        /**
         * Setting this uses GCM for notifications instead of native
         * @param senderID
         * @returns {NotificationPush}
         */
        setIosSenderID(senderID: string): NotificationPush;
        /**
         * The device shows an alert on receipt of notification.
         * Note: the value you set this option to the first time you call
         * the init method will be how the application always acts.
         * Once this is set programmatically in the init method it can only
         * be changed manually by the user in Settings>Notifications>App Name.
         * This is normal iOS behaviour.
         * @returns {NotificationPush}
         */
        activateIosAlert(): NotificationPush;
        /**
         * The device no shows an alert on receipt of notification.
         * @returns {NotificationPush}
         */
        deactivateIosAlert(): NotificationPush;
        /**
         * The device sets the badge number on receipt of notification.
         * Note: the value you set this option to the first time you call
         * the init method will be how the application always acts.
         * Once this is set programmatically in the init method it can only
         * be changed manually by the user in Settings>Notifications>App Name.
         * This is normal iOS behaviour.
         * @returns {NotificationPush}
         */
        activateIosBadge(): NotificationPush;
        /**
         * The device not sets the badge number on receipt of notification.
         * @returns {NotificationPush}
         */
        deactivateIosBadge(): NotificationPush;
        /**
         * The device plays a sound on receipt of notification.
         * Note: the value you set this option to the first time you call
         * the init method will be how the application always acts. O
         * nce this is set programmatically in the init method it can only be
         * changed manually by the user in Settings>Notifications>App Name.
         * This is normal iOS behaviour.
         * @returns {NotificationPush}
         */
        activateIosSound(): NotificationPush;
        /**
         * The device not plays a sound on receipt of notification.
         * @returns {NotificationPush}
         */
        deactivateIosSound(): NotificationPush;
        /**
         * The badge will be cleared on app startup.
         * @returns {NotificationPush}
         */
        activateIosClearBadge(): NotificationPush;
        /**
         * The badge will not be cleared on app startup.
         * @returns {NotificationPush}
         */
        deactivateIosClearBadge(): NotificationPush;
        /**
         * Whether to use sandbox GCM setting.
         * @returns {NotificationPush}
         */
        activateIosGcmSandbox(): NotificationPush;
        /**
         * Whether to use prod GCM setting.
         * @returns {NotificationPush}
         */
        deactivateIosGcmSandbox(): NotificationPush;
        /**
         * To subscribe to a GcmPubSub topic.
         * Note: only usable in conjunction with senderID.
         * @returns {NotificationPush}
         */
        addIosTopic(topic: any): NotificationPush;
        /**
         * Set full ios configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        setIosConfiguration(configuration: any): NotificationPush;
        /**
         * Maps to the project number in the Google Developer Console.
         * @param senderID: string
         * @returns {NotificationPush}
         */
        setAndroidId(senderID: string): NotificationPush;
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
        setAndroidIcon(iconName: string, iconBackgroundColor: string): NotificationPush;
        /**
         * It plays the sound specified in the push data or the default
         * system sound.
         * @returns {NotificationPush}
         */
        activateAndroidSound(): NotificationPush;
        /**
         * It not plays the sound specified in the push data or the default
         * system sound.
         * @returns {NotificationPush}
         */
        deactivateAndroidSound(): NotificationPush;
        /**
         * The device vibrates on receipt of notification.
         * @returns {NotificationPush}
         */
        activateAndroidVibrate(): NotificationPush;
        /**
         * The device not vibrates on receipt of notification.
         * @returns {NotificationPush}
         */
        deactivateAndroidVibrate(): NotificationPush;
        /**
         * The app clears all pending notifications when it is closed.
         * @returns {NotificationPush}
         */
        activateAndroidClearNotification(): NotificationPush;
        /**
         * The app no clears all pending notifications when it is closed.
         * @returns {NotificationPush}
         */
        deactivateAndroidClearNotification(): NotificationPush;
        /**
         * Will always show a notification, even when the app is on the
         * foreground.
         * @returns {NotificationPush}
         */
        activateAndroidForceShow(): NotificationPush;
        /**
         * Will not always show a notification, even when the app is on the
         * foreground.
         * @returns {NotificationPush}
         */
        deactivateAndroidForceShow(): NotificationPush;
        /**
         * To subscribe to a GcmPubSub topic.
         * @returns {NotificationPush}
         */
        addAndroidTopic(topic: any): NotificationPush;
        /**
         * Set full android configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        setAndroidConfiguration(configuration: any): NotificationPush;
        /**
         * Set full windows configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        setWindowsConfiguration(configuration: any): NotificationPush;
        /**
         * Set full configuration
         * @param configuration
         * @returns {NotificationPush}
         */
        setConfiguration(configuration: any): NotificationPush;
    }
}
