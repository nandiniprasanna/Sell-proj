/**
 * 
 */

angular.module('selling-point.loginService',[]).
factory('AuthenticationService',function(Base64,$http, $cookieStore, $rootScope, $timeout,$log){
	var service={};
	
	service.Login=function(userinfoData,callback){
		
		
		/* $timeout(function(){
			
			
			 var response = { success: username === 'admin' && password === 'admin' };
              if(!response.success) {
                  response.message = 'Username or password is incorrect';
              }
              callback(response);
		},1000)*/
			
		$http({
				method:"post",
				url:"rest/api/user/login",
				data:userinfoData,
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
		})
		
               .success(function (response) {
                   callback(response);
               });
		$log.info(service);
		
	};
	
	
	service.setCredentials=function(username,password,email,firstname){
	
		var authdata=Base64.encode(username+':'+password);
		//alert(firstname);
		
		//alert(authdata);
		//$scope.usernames=setCredentials.userName;
		
		$rootScope.globals={
				currentUser:{
						username:username,
						firstname:firstname,
						authdata:authdata
						
				}
		};
		   $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
		   $http.defaults.headers.common['RemoteUser'] =username;
		   $http.defaults.headers.common['RemoteEmail'] =email;
		   $http.defaults.headers.common['RemoteFirstName'] =firstname;
		$log.info("cookie:"+$rootScope.globals);
		$cookieStore.put('globals',$rootScope.globals);
		
		
		
	};
	service.clearCredentials=function(){
		$rootScope.globals={};
		$cookieStore.remove("globals");
		 $http.defaults.headers.common.Authorization = 'Basic ';
	}
	return service;
	
	
})

  

.factory("userService",function($http,$log,$timeout){
	return{
		insertUser:function(userdata){
			return $http({
				method:"post",
				url:"rest/api/user/save",
				data:userdata,
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
			});
			
		},
		updateUser:function(userinfo){
			return $http({
				method:"put",
				url:"rest/api/user/update",
				data:userinfo,
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
			});
		},
		usrList:function(){
			return $http({
				method:"get",
				url:"rest/api/user/allusers",
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
			})
		},
		editUserAccount:function(editUserid){
			return $http({
				method:"get",
				url:"rest/api/user/find/"+editUserid,
				dataType:"json",
				headers:{
					"Content-Type":"application/json"
				}
			})
		},
		deleteuserAccount:function(deleteUserid){
			return $http({
				method:"delete",
				url:"rest/api/user/delete/"+deleteUserid,
				dataType:"json",
				headers:{
					"Content-Type":"application/json"
				}
			})
		},
		forgotpasssent:function(passwordEmail){
			return $http({
				method:"post",
				url:"rest/api/user/forgotPassword/"+passwordEmail,
				dataType:"json",
				headers:{
					"Content-Type":"application/json"
				}
			})
		},
		vaildNotifyid:function(randid){
			return $http({
				method:"post",
				url:"rest/api/user/verifyNotification/"+randid,
				dataType:"json",
				headers:{
					"Content-Type":"application/json"
				}
			})
		},
		updatePassword:function(randid,datas){
			return $http({
				method:"post",
				url:"rest/api/user/resetPassword?id="+randid,
				dataType:"json",
				data:datas,
				headers:{
					"Content-Type":"application/json"
				}
			})
		}
	}
})

.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    }
});
