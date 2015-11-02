var  app = angular.module('mailer', []);

app.controller('MailController', ['$scope', '$http', function($scope, $http) {
	$scope.mail = {'from': 'YOUR EMAIL'};

	$scope.sendMail = function() {
		// console.log($scope.mail);

        $http.post('/send', $scope.mail)
            .then(function(response) {
                if(response.data == 'success') {
                    console.log('mail is sent successfully');
                    $scope.mail = null;
                    $scope.mail = {'from': 'YOUR EMAIL'};
                }
            }, function(err) {
                console.log('error: ' + err);
            });
	
	}
}]);
