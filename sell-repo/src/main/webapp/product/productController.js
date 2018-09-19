angular.module("selling-point.productModule", ['checklist-model']).controller("productListCtrl", function ($log, $scope, $rootScope, $location, productService, $http, $timeout, $routeParams) {
	$scope.categories = ["Books", "Electronics", "Fashion", "Sports", "Home, Kitchen", "Mobile Accessories", "Beauty, Health"];
	$scope.isLoading = false;
	productService.productList().then(function (response) {
		$log.info(response);
		$log.info(response.data);
		// alert(response.data);
		//alert(response);
		//	 alert(response.statusCode);
		// if(response.statusCode==201){
		$scope.allprolst = response.data;
		$scope.productlen = $scope.allprolst.length;
		//	alert("inside");
		// }
	}, function (response) {
		if (response.status == 500) {
			$scope.errorStatus = response.statusText;
		}
	});
	$scope.AddProduct = function () {
			if ($scope.addproductFrm.$valid) {
				var productDatas = JSON.stringify($scope.productData);
				var productDataInfo = productDatas;
				$log.info(productDataInfo);
				//alert(userdataInfo);
				productService.addProduct(productDataInfo).success(function (response) {
					$log.info(response);
					if (response.statusCode == 201) {
						$scope.successStatus = response.message;
						$scope.productData = {};
					}
					else if (response.statusCode == 400) {
						$scope.errorStatus = response.message
					}
					else if (response.statusCode == 206) {
						$scope.errorStatus = response.message
					}
				}).error(function (response) {
					if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
				})
				$timeout(callAtTimeout, 5000)
			}

			function callAtTimeout() {
				$scope.successStatus = '';
				$scope.errorStatus = '';
			}
		};
	$scope.generated=false;
	$scope.CPULoad = function () {
			$scope.isLoading = true;
			$scope.generated=false;
			productService.cpuLoad().success(function (response) {}).error(function (response) {})
			$scope.generated=true;
			$scope.isLoading = false;
		}
		/*	$scope.deleteUser=function(dltuserid,idx){
				if(dltuserid){
					userService.deleteuserAccount(dltuserid).success(function(response){
						if(response.statusCode==200){
							$scope.successStatus = response.message;
							$scope.alluserlst.splice(idx,1);
							
						}else if(response.status==400){
							  $scope.errorStatus = response.message
						  }
					}).error(function(response){
						if (response.status == 500) {
							$scope.errorStatus = response.statusText;
						}
					})
				}
			}*/
})