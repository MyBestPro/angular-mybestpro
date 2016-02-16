namespace MyBestPro.component {

    'use strict';

    export function Log() : ng.IDirective {

        return {
            restrict: 'E',
            scope: {},
            template: ['<ul>',
                '<li ng-repeat="message in messages" ',
                ' ng-show="displayMode" class="mbp-log-{{ message.level }}">',
                '<strong ng-bind="message.level"></strong>',
                ' {{ message.data }}</li>',
            ].join(''),
            controller: MyBestPro.controller.Log,
        };

    }
}

angular.module('MyBestPro').directive('mbpLog', MyBestPro.component.Log);
