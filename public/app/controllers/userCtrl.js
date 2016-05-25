angular.module('userCtrl', ['userService'])

// Create controller so we can use the data and render into view

.controller('UserController', function(User) {

    var vm = this;

    vm.processing = true;

    User.all()
        .success(function(data) {
             vm.users = data;
        })

})

.controller('UserCreateController', function(User, $locationm $window) {

    vam vm = this;

// Create new method to create user and store the token into the browser

    vm.signupUser = function() {
        vm.message = '';

        User.create(vm.userDate)
            .then(function(respons) {
                vm.userDate = {};
                vm.message = response.data.message;

                $window.localStorage.setItem('token', response.date.token);
                $location.path('/');
            })
    }
})