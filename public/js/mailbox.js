var app = angular.module('mailbox', ['ui.router', 'ngSanitize']);

app.controller('MailController', ['$scope', '$http', function($scope, $http) {

    var mails = [];

    $http.get("/mails")
        .success(function(response) {
            $scope.mails = response;
        });

}]);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
        .state('inbox', {
            url: "/",
            templateUrl: "inbox.html"
        })

    .state('maildetail', {
        url: "/:mailID",
        templateUrl: "read-mail.html",
        controller: function($scope, $stateParams, $http, $sce) {
            // get the id
            var id = $stateParams.mailID;
            console.log(id);

            $http.get("/mails/" + id)
                .success(function(response) {
                    $scope.mailDetail = response;
                });

            $scope.toTrustedHTML = function(html) {
                return $sce.trustAsHtml(html);
            }
        }
    })

});