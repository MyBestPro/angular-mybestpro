namespace MyBestPro.controller  {

    'use strict';

    export interface ILogScope extends ng.IScope {
        displayMode: boolean;
        messages: Array<any>;
    }

    export class Log {
        public $inject: Array<string> = ['$scope', 'MBPLog'];

        constructor (public $scope: ILogScope, private log: MyBestPro.lib.Log) {
            $scope.displayMode = log.getDisplayMode();
            $scope.messages = log.getHistory();
            log.onReceivedLog(
                function(level: string, data: any): void {
                    $scope.messages.push({
                        level: level,
                        data: JSON.stringify(data),
                    });
                }
            );
            log.onChangeStatus(
                function(displayMode: boolean) : void {
                    $scope.displayMode = displayMode;
                }
            );
        }
    }
}
