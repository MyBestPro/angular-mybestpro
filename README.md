# angular-mybestpro

AngularJS module integrate MyBestPro elements

## Installation

### Load the module

```javascript
angular.module('myApp', [
    'MyBestPro'
]);
```

### Provider MBPLog

#### Configuration

Set the log level

```javascript
angular.module('myApp')
    .config(['MBPLogProvider', function (MBPLogProvider) {
        MBPLogProvider.setLevel(MBPLogProvider.LOG_DEBUG);
    }]);
```

Available values :
* LOG_INACTIVE
* LOG_ERROR
* LOG_WARNING
* LOG_INFO
* LOG_LOG
* LOG_DEBUG

#### Usage

```javascript
MBPLog.info('My info');
MBPLog.error('My error');
MBPLog.log('My log');
MBPLog.warn('My warn');

MBPLog.time('timerName');
// ...
MBPLog.timeEnd('timerName');
```

This module provides a directive to show log :
```html
<mbp-log></mbp-log>
```

The "showing status" is managable with the method :
```javascript
MBPLog.setDisplayMode(true);
```


### Provider IndexedDB

#### TODO

### MBPNotificationPush

Use the Phonegap Plugin : https://github.com/phonegap/phonegap-plugin-push

#### Configuration

Example :

```javascript
angular.module('myApp')
    .config(['MBPNotificationPushProvider', function (MBPNotificationPushProvider) {
        MBPNotificationPushProvider.setConfiguration({
            android: {
                senderID: 'XXXXXXXXX',
                icon: 'notification',
                iconColor: 'purple',
                sound: true,
                vibrate: true,
                clearNotifications: true,
                forceShow: false,
                topics: []
            },
            ios: {
                senderID: '',
                alert: false,
                badge: false,
                sound: false,
                clearBadge: false,
                gcmSandbox: false,
                topics: [],
                categories: {}
            },
            windows: {}
        });
    }]);
```

For more detail, take a look at https://github.com/phonegap/phonegap-plugin-push

#### Usage

Events :

```javascript
MBPNotificationPush.init()
    .then(function() {
        MBPNotificationPush.onRegistration(function(data) {
            // do what you want with data
        });
        MBPNotificationPush.onNotification(function(data) {
            // do what you want with data
        });
        MBPNotificationPush.onError(function(data) {
            // do what you want with data
        });
    });
```
