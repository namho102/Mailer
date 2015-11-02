var  app = angular.module('mailer', []);

app.controller('MailController', ['$scope', '$http', function($scope, $http) {
	$scope.mail = {'from': 'wwwlewis@outlook.com'};

	$scope.sendMail = function() {
		// console.log($scope.mail);

        $http.post('/send', $scope.mail)
            .then(function(response) {
                if(response.data == 'success') {
                    console.log('mail is sent successfully');
                    $scope.mail = null;
                    $scope.mail = {'from': 'wwwlewis@outlook.com'};
                }
            }, function(err) {
                console.log('error: ' + err);
            });
	
	}
}]);
