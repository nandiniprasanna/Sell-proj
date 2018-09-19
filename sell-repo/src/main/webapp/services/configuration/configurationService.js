angular.module("selling-point.configServices", []).
// all services here started
factory("dataServices", function($http, $log, $q) {
	$log.info();

	var tempAccountid = '';

	return {
		setAccountid : function(tempid) {
			tempAccountid = tempid;
		},
		getAccountid : function() {
			return tempAccountid;
		},
		accountList : function() {
			return $http({
				method : 'get',
				url : 'rest/api/accounts/allaccounts'
			});

		},
		projectLst : function(accid) {
			return $http({
				method : 'get',
				url : 'rest/api/projects/findProjectsByAccount/' + accid,
			})

		},
		allprojects : function() {
			return $http({
				method : 'get',
				url : 'rest/api/projects/allprojects',
			})
		},
		allTemplate:function(){
			return $http({
				method:'get',
				url:'rest/api/ci/getJenkinsTemplateName',
			})
			
		},
		allserviceTag:function(projectid){
			return $http({
				method:'get',
				url:'rest/api/scm/findBranchesAndTags/'+projectid,
			})
		},
		addAcct : function(accdata) {
			return $http({
				method : "post",
				url : "rest/api/accounts/save ",
				data : accdata,
				dataType : 'json',
				headers : {
					"Content-Type" : "application/json"
				}
			})
		},
		getEditAccountData:function(editAccountId){
			return $http({
				method:"get",
				url:"rest/api/accounts/find/"+editAccountId,
				dataType:"json",
				headers : {
					"Content-Type" : "application/json"
				}
			})
		},
		updateAccount:function(accountInfo)	{
			return $http({
				method:"put",
				url:"rest/api/accounts/update",
				data:accountInfo,
				dataType:"json",
				headers : {
					"Content-Type" : "application/json"
				}
			})
		},
		accountDelete:function(deleteAccountId){
			return $http({
				method:"delete",
				url:"rest/api/accounts/delete/"+deleteAccountId,
				dataType:"json",
				headers : {
					"Content-Type" : "application/json"
				}
			})
		},
		addProject : function(projectInfo) {
			return $http({
				method : "post",
				url : "rest/api/projects/save",
				data : projectInfo,
				dataType : 'json',
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		editProjectDetail:function(editProjectId){
			return $http({
				method:"get",
				url:"rest/api/projects/find/"+editProjectId,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		updateProjectInfo:function(editprojectInfo){
			return $http({
				method:"put",
				data:editprojectInfo,
				url:"rest/api/projects/update",
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		projectDelete:function(deleteProjectId){
			return $http({
				method:"delete",
				url:"rest/api/projects/delete/"+deleteProjectId,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		addWorkspace : function(workspaceinfo) {
			return $http({
				method : "post",
				url : "rest/api/workspace/save",
				data : workspaceinfo,
				dataType : "json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		getWorkspaceItem : function(getWorkspacePrjtId){
			return $http({
				method:"get",
				url:"rest/api/workspace/findBranchesByProject/"+getWorkspacePrjtId,
				dataType : "json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		getWorkspacedata:function(workspaceId){
			return $http({
				method:"get",
				url:"rest/api/workspace/find/"+workspaceId,
				dataType : "json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		editWorkspaceItem:function(editworkspaceinfo){
			return $http({
				method:"put",
				url:"rest/api/workspace/update",
				data:editworkspaceinfo,
				dataType : "json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		
		addBranchItem:function(addbranchInfo){
			return $http({
			method : "post",
			url : "rest/api/features/save",
			dataType : "json",
			data : addbranchInfo,
			headers : {
				"content-type" : "application/json"
			}
			})
		},
		deleteWorkspaceItem:function(deleteWorkspaceid){
			return $http({
				method:"delete",
				url:"rest/api/workspace/delete/"+deleteWorkspaceid,
				dataType : "json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		workSpacelst : function() {
			return $http({
				method : "get",
				url : "rest/api/workspace/allWorkspaces",
				dataType : "json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		addPreference : function(predataInfo) {
			return $http({
				method : "post",
				url : "rest/api/preference/save",
				dataType : "json",
				data : predataInfo,
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		modifyPreference : function(preupdateInfo) {
			return $http({
				method : "put",
				url : "rest/api/preference/update",
				dataType : "json",
				data : preupdateInfo,
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		getPreferenceId : function(userId) {
			return $http({
				method : "get",
				url : "rest/api/preference/find/" + userId,
				dataType : "json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		CCMbranchList : function(branchInfo) {
			return $http({
				method : "post",
				url : "rest/api/scm/findAllBranchesForRepos/",
				dataType : "json",
				data : branchInfo,
				headers : {
					"content-type" : "application/json"
				}
			})
		},

		uploadfile : function(files, configItem,branchName,projectId, success, error) {
			$log.info("UPLOAD: " + files);
			$log.info("brnachName: " + branchName);
			$log.info("configItem: " + configItem);
			var url = 'rest/api/ci/createJob?branchName='+branchName+'&userId=admin&projectId='+projectId;
			var fd = new FormData();
			fd.append("config",configItem);
			if(files){
				fd.append("file", files[0]);
			}
			
			return	$http.post(url, fd, {
					withCredentials : false,
					headers : {
						'Content-Type' : undefined
					},
					transformRequest : angular.identity
				})
				/*.success(function(data) {
					console.log(data);
					alert("DATA"+data);
				}).error(function(data) {
					console.log(data);
					alert("DATAERROR" + data);
				});*/
			
			
		},
		
		CCMConnectordata:function(workspaceid,projectid,versionName){
			//alert(workspaceid);
			return $http({
				method:"get",
				url:"rest/api/connectors/fetchConnectors?wrkId="+workspaceid+"&projId="+projectid+"&configTool="+versionName,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		addConnectorService:function(connectItem){
			return $http({
				method:"post",
				url:"rest/api/connectors/save",
				data:connectItem,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		geteditConnectorItem:function(connectId){
			return $http({
				method:"get",
				url:"rest/api/connectors/find/"+connectId,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		editConnectorService:function(connectItem){
			return $http({
				method:"put",
				url:"rest/api/connectors/update",
				data:connectItem,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		getRepository:function(requestBody){
			return $http({
				method:"post",
				url:"rest/api/scm/findProjects",
				data:requestBody,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		findCloneBranch:function(projectid,requestBody){
			return $http({
				method:"post",
				url:"rest/api/scm/findBranchesByProjectId?projectId="+projectid,
				data:requestBody,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		},
		deleteBranchService:function(branchName,projId){
			var username='admin'
			return $http({
				method:"delete",
				url:"rest/api/ci/deleteJob?branchName="+branchName+"&userId=admin&projectId="+projId,
				dataType:"json",
				headers : {
					"content-type" : "application/json"
				}
			})
		}

	}/* common return end */

})