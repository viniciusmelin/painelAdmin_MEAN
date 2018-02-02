angular.module('primeiraApp').config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider,$urlRouterProvider){
        $stateProvider.state('dashboard',{
            url: '/dashboard',
            templateUrl: "dashboard/dashboard.html"
        }).state('billingCycle',{
            url: "/billingCycles?page",
            templateUrl: "billingCycle/tabs.html"
        })

        $urlRouterProvider.otherwise('/dashboard')
    }
]).run([
    '$rootScope',
    '$http',
    '$location',
    '$window',
    'auth',
    function($rootScope, $http,$location,$window, auth)
    {
        validateUser()
        $rootScope.$on('$locationChangeStart', ()=>validateUser())

        function validateUser()
        {
            const user = auth.getUser()
            const authPage = '/auth.html'
            const isAutoPage = $window.location.href.includes(authPage)

            if(!user && !isAutoPage)
            {
                $window.location.href = authPage
            }
            else if(user && !user.isValid)
            {
                user.isValid = true
                $http.defaults.headers.commom.Authorization = user.token
                isAutoPage ? $window.location.href = '/' : $location.path('/dashboard')
            }
        }
    }
])