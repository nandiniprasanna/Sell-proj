angular.module('selling-point.productServices',[]).
factory('productService',function(Base64,$http, $cookieStore, $rootScope, $timeout,$log){
	return{
		productList:function(){
			return $http({
				method:"get",
				url:"rest/api/product/allproducts",
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
			})
		},
		addProduct:function(productData){
			return $http({
				method:"post",
				url:"rest/api/product/save",
				data:productData,
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
			});
		},
		cpuLoad:function(){
			return $http({
				method:"post",
				url:"rest/api/product/cpuload",				
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
			});
		}
	}
})