namespace MyBestPro.lib {

    'use strict';

    export class Log implements ng.IServiceProvider {
        public static $inject: Array<string> = [];

        public LOG_INACTIVE: number = -1;

        public LOG_ERROR: number = 0;
        public LOG_WARNING: number = 1;
        public LOG_INFO: number = 2;
        public LOG_LOG: number = 3;
        public LOG_DEBUG: number = 4;

        private level: number = 3;
        private displayMode: boolean = true;
        private messages: Array<any> = [];

        private callbackReceivedLog: Function;
        private callbackChangeStatus: Function;

        private consoles: any = {
            0: console.error,
            1: console.warn,
            2: console.info,
            3: console.log,
            4: console.debug,
        };
        private levels: any = {
            0: 'error',
            1: 'warning',
            2: 'info',
            3: 'log',
            4: 'debug',
        };

        public $get(): any {
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
                getDisplayMode: this.getDisplayMode,
            };
        }

        public debug(...args: any[]) : void {
            this.message(this.LOG_DEBUG, arguments);
        }

        public info(...args: any[]) : void {
            this.message(this.LOG_INFO, arguments);
        }

        public error(...args: any[]) : void {
            this.message(this.LOG_ERROR, arguments);
        }

        public log(...args: any[]) : void {
            this.message(this.LOG_LOG, arguments);
        }

        public warn(...args: any[]) : void {
            this.message(this.LOG_WARNING, arguments);
        }

        public setLevel(level: number) : void {
            this.level =  level;
        }

        public setDisplayMode(enabled: boolean) : void {
            this.displayMode = enabled;
            if (this.callbackChangeStatus) {
                this.callbackChangeStatus.apply(this, [enabled]);
            }
        }

        public getDisplayMode() : boolean {
            return this.displayMode;
        }

        public time(timerName: string, level: number = this.LOG_DEBUG) : void {
            if (level > this.level) {
                return;
            }
            console.time(timerName);
        }

        public timeEnd(
            timerName: string,
            level: number = this.LOG_DEBUG
        ) : void {
            if (level > this.level) {
                return;
            }
            console.timeEnd(timerName);
        }

        public onReceivedLog(callbackReceivedLog: Function): void {
            this.callbackReceivedLog = callbackReceivedLog;
        }

        public onChangeStatus(callbackChangeStatus: Function): void {
            this.callbackChangeStatus = callbackChangeStatus;
        }

        public getHistory(): any {
            return this.messages;
        }

        private message(level: number, data: any): void {
            if (level > this.level) {
                return;
            }
            this.messages.push({ level: this.levels[level], data: data});
            this.consoles[level].apply(console, data);
            if (this.callbackReceivedLog) {
                this.callbackReceivedLog.apply(
                    this,
                    [this.levels[level], data]
                );
            }
        }
    }
}

angular.module('MyBestPro').provider('MBPLog', MyBestPro.lib.Log);
