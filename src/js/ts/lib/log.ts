module MyBestPro.lib
{

    export class Log implements ng.IServiceProvider
    {
        public static $inject = [];

        public LOG_INACTIVE = -1;

        public LOG_ERROR = 0;
        public LOG_WARNING = 1;
        public LOG_INFO = 2;
        public LOG_LOG = 3;
        public LOG_DEBUG = 4;

        private level = 3;
        private displayMode = true;
        private messages = [];

        private callbackReceivedLog : Function;
        private callbackChangeStatus : Function;

        private consoles = {
            0: console.error,
            1: console.warn,
            2: console.info,
            3: console.log,
            4: console.debug,
        };
        private levels = {
            0: 'error',
            1: 'warning',
            2: 'info',
            3: 'log',
            4: 'debug',
        };

        constructor()
        {

        }

        public $get(): any
        {
            return {
                LOG_INACTIVE: this.LOG_INACTIVE,
                LOG_ERROR: this.LOG_ERROR,
                LOG_WARNING: this.LOG_WARNING,
                LOG_INFO: this.LOG_INFO,
                LOG_LOG: this.LOG_LOG,
                LOG_DEBUG: this.LOG_DEBUG,
                level: this.level,
                levels: this.levels,
                consoles: this.consoles,
                messages: this.messages,
                callbackReceivedLog: this.callbackReceivedLog,
                callbackChangeStatus: this.callbackChangeStatus,
                debug: this.debug,
                info: this.info,
                error: this.error,
                warn: this.warn,
                log: this.log,
                time: this.time,
                timeEnd: this.timeEnd,
                message: this.message,
                displayMode: this.displayMode,
                setDisplayMode: this.setDisplayMode,
                onReceivedLog: this.onReceivedLog,
                onChangeStatus: this.onChangeStatus,
                getHistory: this.getHistory,
                getDisplayMode: this.getDisplayMode
            }
        }

        public debug() : void
        {
            this.message(this.LOG_DEBUG, arguments)
        }

        public info() : void
        {
            this.message(this.LOG_INFO, arguments)
        }

        public error() : void
        {
            this.message(this.LOG_ERROR, arguments)
        }

        public log() : void
        {
            this.message(this.LOG_LOG, arguments)
        }

        public warn() : void
        {
            this.message(this.LOG_WARNING, arguments)
        }

        public setLevel(level : number) : void
        {
            this.level =  level;
        }

        public setDisplayMode(enabled : boolean) : void
        {
            this.displayMode = enabled;
            if (this.callbackChangeStatus) {
                this.callbackChangeStatus.apply(this, [enabled]);
            }
        }

        public getDisplayMode() : boolean
        {
            return this.displayMode;
        }

        public time(timerName : string, level : number = this.LOG_DEBUG) : void
        {
            if (level > this.level) {
                return;
            }
            console.time(timerName);
        }

        public timeEnd(timerName : string, level : number = this.LOG_DEBUG) : void
        {
            if (level > this.level) {
                return;
            }
            console.timeEnd(timerName);
        }

        private message(level : number, data : any) : void
        {
            if (level > this.level) {
                return;
            }
            this.messages.push({ level: this.levels[level], data: data});
            this.consoles[level].apply(console, data);
            if (this.callbackReceivedLog) {
                this.callbackReceivedLog.apply(this, [this.levels[level], data]);
            }
        }

        public onReceivedLog(callbackReceivedLog : Function)
        {
            this.callbackReceivedLog = callbackReceivedLog;
        }

        public onChangeStatus(callbackChangeStatus : Function)
        {
            this.callbackChangeStatus = callbackChangeStatus;
        }

        public getHistory()
        {
            return this.messages;
        }
    }

}

angular.module('MyBestPro').provider('MBPLog', MyBestPro.lib.Log);