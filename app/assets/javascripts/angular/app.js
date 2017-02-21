angular
    .module('app', [
        'ngRoute',
        'ngResource'
    ])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        var authToken = $('meta[name="csrf-token"]').attr("content");
        $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = authToken;


        $routeProvider
            .when('/', {
                templateUrl: '/templates/home/index.html',
                controller: 'HomeCtrl'
            })
            .when('/products/new', {
                templateUrl: '/templates/product/new.html',
                controller: 'ProductAddCtrl'
            })
            .when('/products', {
                templateUrl: '/templates/product/list.html',
                controller: 'ProductListCtrl'
            })
            .when('/products/:id', {
                templateUrl: '/templates/product/edit.html',
                controller: 'ProductEditCtrl'
            })
    }])
    .controller('HomeCtrl', ['$scope', 'Home', function($scope, Home){
        $scope.name = '';

        $scope.name = Home.query().$promise.then(function(data) {
            console.log(data.txt, data.name)
        });

    }])
    .controller('ProductAddCtrl', ['$scope', 'Products', '$location', function($scope, Products, $location) {

        $scope.create = function(data) {
            Products.create({
                product: data
            }).$promise.then(function(data) {
                console.log(data);
                $location.path('/products')
            });
        }
    }])
    .controller('ProductListCtrl', ['$scope', 'Products', 'Product', '$location', function($scope, Products, Product, $location){
        $scope.products = [];

        Products.query().$promise.then(function(data) {
            $scope.products = data;
        });

        $scope.remove  = function(id) {
            if (confirm('Are you sure?')) {
                Product.delete({ id: id }).$promise.then(function(data) {
                    Products.query().$promise.then(function(products) {
                        $scope.products = products;
                    });
                });
            }
        }

        $scope.edit = function(id) {
            return $location.path('products/' + id);
        }
    }])
    .controller('ProductEditCtrl', ['$scope', 'Product', '$routeParams', '$location', function($scope, Product, $routeParams, $location){
        $scope.product = Product.get({ id: $routeParams.id });

        $scope.update = function() {
            Product.update({ id: $scope.product.id }, { product: $scope.product }).$promise.then(function(data) {
                $location.path('/products');
            });
        }

    }])
    .factory('Products', ['$resource', function($resource){
        return $resource('/products.json', {}, {
            create: { method: 'POST' },
            query:  { method: 'GET', isArray: true }
        })
    }])
    .factory('Product', ['$resource', function($resource){
        return $resource('/products/:id.json', {}, {
            update: { method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params: { id: '@id' } }
        });
    }])
    .factory('Home', ['$resource', function($resource){
        return $resource('/hey.json', {}, {
            query: { method: 'GET', isArray: false }
        })
    }]);