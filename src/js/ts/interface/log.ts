namespace MyBestPro {

    'use strict';

    export interface ILogScope extends ng.IScope {
        displayMode: boolean;
        messages: Array<any>;
    }
}
