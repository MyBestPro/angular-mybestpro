module MyBestPro.controller
{
    export class Log
    {
        public $inject = ['$scope', 'MBPLog'];

        constructor (public $scope, private MBPLog : MyBestPro.lib.Log)
        {
            $scope.displayMode = MBPLog.getDisplayMode();
            $scope.messages = MBPLog.getHistory();
            MBPLog.onReceivedLog(function(level, data) {
                $scope.messages.push({
                    level: level,
                    data: JSON.stringify(data)
                });
            });
            MBPLog.onChangeStatus(function(displayMode) {
                $scope.displayMode = displayMode;
            });
        }
    }
}