angular.module("selling-point.configController",[]).
controller("projectmasterCtrl", function($scope, $http, $log, $timeout,
			dataServices, $location) {
	$scope.successStatus = '';
	$scope.successStatuscode = '';
	$scope.errorStatus = '';
	$scope.serverError=""
		$scope.accLen = {};
		dataServices.accountList().then(function(response) {
			$log.info(response.data);
			$scope.accountList = response.data;
			$scope.accLen = response.data.length;
			if ($scope.accLen == 0) {
				alert("no account found. please create account");
				$location.path("/services/createAccount");
			}

		}, function(response) {
			// second function handles error
			if (response.status == 500) {
				$scope.serverError = response.statusText;
			}
			$log.info(response);
		})

		$scope.accProjectlst = function() {
		
			if ($scope.accountName.id) {
		
				dataServices.setAccountid($scope.accountName.id);
				dataServices.projectLst($scope.accountName.id).then(
						function(response) {
							// First function handles success
							$log.info(response.data);
							$scope.displayProject = response.data;
							$scope.projlenth = response.data.length;

						}, function(response) {
							if (response.status == 500) {
								$scope.errorStatus = response.statusText;
							}
						})
			}

		}
		$scope.deleteProjectid="";
		$scope.deleteProject=function(projectId,idx){
			
			$scope.deleteProjectid=projectId;
			if($scope.deleteProjectid){
				dataServices.projectDelete($scope.deleteProjectid).success(
						function(deleteresponse){
					
					$log.info("response"+deleteresponse);
							
					 if(deleteresponse.statusCode==200){
							$scope.successStatus = deleteresponse.message
						  $scope.displayProject.splice(idx, 1);
							
					  }else if(deleteresponse.statusCode==400){
						  $scope.errorStatus = response.message
					  }
					
					
				}).error(function(deleteresponse){
					if (deleteresponse.status == 500) {
								$scope.errorStatus = deleteresponse.statusText;
							}
				});
				$timeout(callAtTimeout,5000);
			}
		}
		function callAtTimeout() {
			$scope.successStatus = '';
			$scope.successStatuscode = '';
			$scope.errorStatus = '';
			$scope.serverError=""
		}
		

	})
	
	.controller("allAccountsCtrl",function($scope, $http, $log, $timeout,dataServices, $location){
		$scope.successStatus = '';
		$scope.successStatuscode = '';
		$scope.errorStatus = '';
		$scope.serverError = "";
		$scope.accLen = {};
		dataServices.accountList().then(function(response) {
			$log.info(response.data);
			$scope.accountList = response.data;
			$scope.accLen = response.data.length;
			if ($scope.accLen == 0) {
				alert("no account found. please create account");
				$location.path("/services/createAccount");
			}

		}, function(response) {
			// second function handles error
			if (response.status == 500) {
				$scope.serverError = response.statusText;
			}
			$log.info(response);
		})
		
		$scope.deleteAccount=function(deleteAccId,idx){
			if(deleteAccId){
				dataServices.accountDelete(deleteAccId).success(function(response){
					if(response.statusCode==200){
						$scope.successStatus = response.message
						$scope.accountList.splice(idx, 1);
				  }else if(response.status==400){
					  $scope.errorStatus = response.message
				  }
				}).error(function(response){
					if (response.status == 500) {
							$scope.serverError = response.statusText;
						}
				})	
				$timeout(callAtTimeout, 5000)
			}
		}
		
		function callAtTimeout() {
			$scope.successStatus = '';
			$scope.successStatuscode = '';
			$scope.errorStatus = '';
			$scope.serverError=""
		}
	})
	
	
	.controller("createaccountCtrl", function($scope, $http, $log, $timeout,$routeParams,dataServices) {
		
		$scope.editAccountId="";
		$scope.editAccountId=$routeParams.showId;
		$scope.account = {};
		$scope.successStatus = '';
		$scope.successStatuscode = '';
		$scope.errorStatus = '';
		$scope.addAccount = function() {
			 if ($scope.accountFrm.$invalid) {
					
	             
	             angular.forEach($scope.accountFrm.$error, function (field) {
	               angular.forEach(field, function(errorField){
	                 errorField.$setTouched();
	               })
	             });
	           
	         }
			
		
			if ($scope.accountFrm.$valid) {
				var accountInfo = JSON.stringify($scope.account);
				$log.info(accountInfo);
				// alert(accountInfo);
				dataServices.addAcct(accountInfo).success(function(response) {
					$log.info(response);
				  if(response.statusCode==201){
						$scope.successStatus = response.message
						
						//$scope.reset();
				  }else if(response.statusCode==400){
					  $scope.errorStatus = response.message
				  }
					
				}).error(function(response) {
					$log.info(response);
					if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
					
					
				});

				$timeout(callAtTimeout, 10000)

			}
			
			
		}
		$scope.editAccount = function() {
			if ($scope.accountFrm.$valid) {
				

				var accountInfo = JSON.stringify($scope.account);
				$log.info(accountInfo);
				// alert(accountInfo);
				dataServices.updateAccount(accountInfo).success(function(response) {
					$log.info(response);
				  if(response.statusCode==201){
						$scope.successStatus = response.message
						
				  }else if(response.statusCode==400){
					  $scope.errorStatus = response.message
				  }
					
				}).error(function(response) {
					$log.info(response);
					if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
					
					
				});

				$timeout(callAtTimeout, 5000)

			}
		}

		if($scope.editAccountId){
				dataServices.getEditAccountData($scope.editAccountId).then(function(response){
				$scope.account=response.data;
				
			},function(response){
				$log.info(response);
					if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
			})
		}
		$scope.reset = function() {
			$scope.account = {};
		}
		function callAtTimeout() {
			$scope.successStatus = '';
			$scope.successStatuscode = '';
			$scope.errorStatus = '';
		}

	})
	.controller("createprojectCtrl",function($scope, $http, $log, $timeout, dataServices,$location,$routeParams,$rootScope)
	{
		
		
		$scope.ccmList=[{"name":"Git Lab"},{"name":"Mercurial"}];
		$scope.buildAutomationlist=[{"name":"Jenkins"}];
		$scope.buildRepositoryList=[{"name":"Nexus"}];
		$scope.unitTestList=[{"name":"Junit"}];
		
		
		$rootScope.preprojectid="";
		$rootScope.versionCtrl="";
		
		
		$scope.project = {};
					$scope.editProjectId="";
					$scope.editProjectId=$routeParams.showId;
					
					if($scope.editProjectId){
						dataServices.editProjectDetail($scope.editProjectId).then(function(response){
							$log.info(response);
							
							$scope.project=response.data;
							
						},function(response){
							$log.info(response);
							if (response.status == 500) {
								$scope.errorStatus = response.statusText;
							}
						})
						
					}
								
					$scope.projectd = dataServices.getAccountid();
			//alert($scope.projectd);
					
					$scope.createProject = function() {
						$scope.loadingData=true;
						
						 if ($scope.projectCreateFrm.$invalid) {
							
							 $scope.loadingData=false;
				             angular.forEach($scope.projectCreateFrm.$error, function (field) {
				               angular.forEach(field, function(errorField){
				                 errorField.$setTouched();
				               })
				             });
				           
				         }
						
						
						 
												
						$scope.project.accountId = {
							id : $scope.projectd
						}

						
						if($scope.projectCreateFrm.$valid){
							
							var projectInfo = JSON.stringify($scope.project);
						//alert(projectInfo);
							dataServices
									.addProject(projectInfo)
									.success(
											function(response) {
												$log.info(response);
												if(response.statusCode==201){
													$scope.successStatus = response.message;
													//$scope.reset();
													$rootScope.preprojectid=response.result.id;
													//$log.info("PID:"+preprojectid);
												
													$rootScope.versionCtrl=response.result.versionControl;
													//$log.info("VID:"+versionCtrl);
													 $scope.loadingData=false;
													$location.path("/services/connector");
												}else if(response.statusCode==400){
													$scope.errorStatus = response.message;
												}
																					
											})
									.error(
											function(response) {
												$log.info(response);
												if (response.status == 500) {
													 $scope.loadingData=false;
													$scope.errorStatus = response.statusText;
												}
											});

								$timeout(callAtTimeout, 5000)
						}

					}
					$scope.updateProject=function(){
						if($scope.projectCreateFrm.$valid){
							var editprojectInfo = JSON.stringify($scope.project);
						$log.info("JSON"+editprojectInfo);
							dataServices.updateProjectInfo(editprojectInfo).success(function(response){
								$log.info(response);
								if(response.statusCode==201){
									$scope.successStatus = response.message;
								
								}else if(response.statusCode==400){
									$scope.errorStatus = response.message;
								}
								
							}).error(function(response){
								$log.info(response);
								
								if (response.status == 500) {
									$scope.errorStatus = response.statusText;
								}
							})
							
							$timeout(callAtTimeout, 20000)
						}
						
					}
					
					
					$scope.reset = function() {
					//	$scope.project = {};
					}
					function callAtTimeout() {
						$scope.successStatus = '';
						$scope.successStatuscode = '';
						$scope.errorStatus = '';
					}
					$scope.chkdateErr = function(startdate, enddate) {

						$scope.errMessage = "";
						var curDate = new Date();
						var day = curDate.getDate();
						var monthIndex = curDate.getMonth();
						var year = curDate.getFullYear();
					}
					
					
					$scope.checkErr = function(startDates,endDates) {
						var startDate=new Date(startDates);
						var endDate=new Date(endDates);
						
				        $scope.errMessage = '';
				        var curDate = new Date();
				        
				     
				        if(new Date(startDate) > new Date(endDate)){
				          $scope.errMessage = 'End Date should be greater than start date';
				          return false;
				        }
				       /* if(new Date(startDate) < curDate){
				           $scope.errMessage = 'Start date should not be before today.';
				           return false;
				        }*/
				    };
					
					
			})
			
			
	.controller("workspaceListCtrl",function($scope, $http, $log, $timeout,dataServices,$location,$routeParams){
		
		
						$scope.successStatus = '';
						$scope.successStatuscode = '';
						$scope.errorStatus = '';
						$scope.allprojectlen={};
						
						
					/*	$scope.getBranchList=function(wrkspacid){
							dataServices.getBranchName(wrkspacid).then(function(response){
								
								$scope.branchLstItem=response.data;
								
								$log.info($scope.branchLstItem);
								
							},function(response){
							if (response.status == 500) {
									$scope.errorStatus = response.statusText;
								}
							})	
						}*/
						
						
						dataServices.allprojects().then(function(response){
							
							$scope.allprojectDisplay=response.data;
							$scope.allprojectlen=response.data.length;
							//alert($scope.allprojectlen);
							if($scope.allprojectlen==0){
								alert("please create project");
								$location.path("/services");
							}
							
						},function(response){
							if (response.status == 500) {
									$scope.errorStatus = response.statusText;
								}
						})	
						
						
						
						$scope.prjtWorkspacelst=function(){
							//alert($scope.name.id);
							if($scope.name.id){
							
								dataServices.getWorkspaceItem($scope.name.id).then(function(response){
									
									
									$scope.workspacelst=response.data;
									
									$scope.workspacelstlen=response.data.length;
									
									
								},function(response){
									if (response.status == 500) {
										$scope.errorStatus = response.statusText;
									}
								})
							}
						}
						$scope.deleteWorkspace=function(deleteWorkspaceid,idx){
						//	alert(deleteWorkspaceid);
							if(deleteWorkspaceid){
								dataServices.deleteWorkspaceItem(deleteWorkspaceid).success(function(response){
									$log.info("DW:"+response);
									if(response.statusCode==200){
										$scope.successStatus = response.message
										$scope.workspacelst.splice(idx, 1);
									  }else if(response.status==400){
										  $scope.errorStatus = response.message
									  }
								}).error(function(response){
									if (response.status == 500) {
										$scope.errorStatus = response.statusText;
									}
								})
							}
							
						}
						
						
	})				
	
	.controller("workspaceCtrl",function($scope, $http, $log, $timeout,dataServices,$location,$routeParams){
		
		/* temp drop down list */
		$scope.workspace={};
		$scope.workspaceId={};
		$scope.projectId={};
		
		
		$scope.addbranchworkspaceId=$routeParams.showId;
		
		if($scope.addbranchworkspaceId){
			dataServices.getWorkspacedata($scope.addbranchworkspaceId).then(function(response){
				$log.info("EditW:"+response.data);
				//$scope.workspace=response.data;	
				
				$scope.WorkspaceName=response.data.name;
				$scope.projectName=response.data.projectId.name;
				$scope.workspaceId.id =response.data.id;
				$scope.projectId.id=response.data.projectId.id;
				
				
				if($scope.projectId.id){
					
					
					dataServices.allserviceTag($scope.projectId.id).then(function(response){
						
						var branches=response.data.branchList ;
							var tags=response.data.tagList;
							
							$scope.AllserviceTag=branches.concat(tags);
							
						},function(response){
							$log.info(response);
							if (response.status == 500) {
								$scope.errorStatus = response.statusText;
							}
						});
				}
				
				//$scope
				
			},function(response){
				if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
			})
		}
		
		/* all project list */
		dataServices.allprojects().then(
				function(response){
					$scope.workspaceprojects=response.data;
			
		},function(response){
			$log.info(response);
			if (response.status == 500) {
				$scope.errorStatus = response.statusText;
			}
		});
		/* Select All Template */
		dataServices.allTemplate().then(function(response){
			
			$scope.templateList=response.data;
			
		},function(response){
			$log.info(response);
			if (response.status == 500) {
				$scope.errorStatus = response.statusText;
			}
		});
		
		/* all service list */
		$scope.projectBasedserviceTag=function(){
			
			$scope.val=$scope.workspace.projectId.id;
			
		if($scope.val){
				dataServices.allserviceTag($scope.val).then(function(response){
			
		var branches=response.data.branchList ;
			var tags=response.data.tagList;
			
			$scope.AllserviceTag=branches.concat(tags);
			
		},function(response){
			$log.info(response);
			if (response.status == 500) {
				$scope.errorStatus = response.statusText;
			}
		});
		}
		}
		

		//$scope.featureMgmtList=[{"name":"ClearQuest"},{"name":"Bugzilla"},{"name":"JIRA"}];
		$scope.featureMgmtList=[{"name":"Bugzilla"}];
		
		
		
		$scope.ccmList=[{"name":"Git Lab"},{"name":"Mercurial"}];
		$scope.buildAutomationlist=[{"name":"Jenkins"}];
		$scope.buildRepositoryList=[{"name":"Nexus"}];
		$scope.unitTestList=[{"name":"Junit"}];
		/* temp drop down list end */
		$scope.crearteWorkspace=function(){
			
			
			$scope.loadingData=true;
			
			 if ($scope.workspaceFrm.$invalid) {
				
				 $scope.loadingData=false;
	             angular.forEach($scope.workspaceFrm.$error, function (field) {
	               angular.forEach(field, function(errorField){
	                 errorField.$setTouched();
	               })
	             });
	           
	         }
		
			 if($scope.workspaceFrm.$valid){
			
			var	workspaceinfo=JSON.stringify($scope.workspace);
		//alert(workspaceinfo);
			dataServices.addWorkspace(workspaceinfo).success(function(response){
				$log.info(response);
				if(response.statusCode==201){
					$scope.loadingData=false;
					$scope.successStatus = response.message;
					$scope.reset();
					}else if(response.statusCode==400){
						$scope.errorStatus = response.message;
					}
		   		}).error(function(response){
		   			$scope.loadingData=false;
		   			$log.info(response);
					if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
				});
			
				$timeout(callAtTimeout, 10000)
			}
		}
	
		
		$scope.addBranch=function(){
			
			$scope.loadingData=true;
			
			 if ($scope.workspaceFrm.$invalid) {
				
				 $scope.loadingData=false;
	             angular.forEach($scope.workspaceFrm.$error, function (field) {
	               angular.forEach(field, function(errorField){
	                 errorField.$setTouched();
	               })
	             });
	           
	         }
			
			
			$scope.workspace.workspaceId=$scope.workspaceId;
			$scope.workspace.projectId=$scope.projectId;
			var	addbranchinfo=JSON.stringify($scope.workspace);
			if ($scope.workspaceFrm.$valid) {
				dataServices.addBranchItem(addbranchinfo).success(function(response){
					$log.info(response);
					if(response.statusCode==201){
						 $scope.loadingData=false;
						$scope.successStatus = response.message;
						$scope.addbranchresult();
						}else if(response.statusCode==400){
							$scope.errorStatus = response.message;
						}
			   		}).error(function(response){
			   		 $scope.loadingData=false;
			   			$log.info(response);
						if (response.status == 500) {
							$scope.errorStatus = response.statusText;
						}
					});
				
			}
					//$timeout(callAtTimeout, 10000)
		}
		
		$scope.EditWorkspace=function(){
			var	editworkspaceinfo=JSON.stringify($scope.workspace);
			dataServices.editWorkspaceItem(editworkspaceinfo).success(function(response){
				$log.info("EW:"+response);
				$scope.successStatus = response.message;
				
			}).error(function(response){
				if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
			})
			$timeout(callAtTimeout, 5000)
		}
		
		
		
		
		$scope.addbranchresult=function(){
			alert("Branch created successfully");
			$scope.workspace = {};
			$scope.workspaceId={};
			$scope.projectId={};
			$location.path("/services/allWorkspace");
		}
		$scope.reset = function() {
			$scope.workspace = {};
			$location.path("/services/allWorkspace");
		}
		function callAtTimeout() {
			$scope.successStatus = '';
			$scope.errorStatus = '';
		}
		
	})
	.controller("preferenceCtrl",function($scope,$rootScope,$http, $log, $timeout,dataServices,$location){
		$scope.predata={};
		$scope.successStatus = '';
		$scope.errorStatus = '';
		var userid=$rootScope.globals.currentUser.username
		$scope.preid="";
		$scope.preferenceAccountlist="";
		$scope.preAccountId="";
		$scope.preProjectId="";
		$scope.preWorkspaceId="";
		$rootScope.preferenceProjectName="";
		$rootScope.preferenceWorkspaceName=""
			$rootScope.preworkspaceid="";
				$rootScope.preprojectid="";	
				//alert($rootScope.globals.currentUser.username);
	

		
		dataServices.getPreferenceId(userid).then(function(response){
			$log.info(response.data);
			//alert(response.data);
			$log.info(response.data.preferenceId);
			if(response.data.preferenceId){
				$scope.preid=response.data.preferenceId;
				
				$scope.preAccountId=response.data.accountId;
				if($scope.preAccountId){
					sltacctlst();
				}
				
				$scope.preProjectId=response.data.projectId;
				$scope.preWorkspaceId=response.data.workspaceId;
				if($scope.preWorkspaceId){
					sltWrkItem();
				}
				
				$rootScope.preworkspaceid=response.data.workspaceId;
				$rootScope.preprojectid=response.data.projectId;	
				
				
				$rootScope.preferenceProjectName=response.data.projectName;
				$rootScope.preferenceWorkspaceName=response.data.workspaceName;
			
					
					if(response.data.accountId) {
						
						dataServices.setAccountid(response.data.accountId);
						dataServices.projectLst(response.data.accountId).then(
								function(response) {
									// First function handles success
					
									$scope.projlenth = response.data.length;
									
									if($scope.projlenth>0){
										$log.info("PROJECT"+response.data);
										$scope.displayProjectlst = response.data;
										$scope.projlenth = response.data.length;
										if($scope.preProjectId){
											var searchprojectValue =$scope.preProjectId;
											
										    projectindex = -1;

											_.each($scope.displayProjectlst, function(data, idx) { 
																	
											   if (_.isEqual(data.id,searchprojectValue)) {
																   
												   projectindex = idx;
											      return;
											     
											   }
											});
											
											$scope.projectName=$scope.displayProjectlst[projectindex] ;
										}
										
										
									}
									else{
										$scope.errorStatus = "No project found";
									}
									

								}, function(response) {
									if (response.status == 500) {
										$scope.errorStatus = response.statusText;
									}
								})
					
				}
				
			}else{
				
				//default account set
				
				dataServices.accountList().then(function(response){
					
					$scope.preferenceAccountlist=response.data;
					$log.info("Response"+response.data)
					
					if($scope.preAccountId){
						
						var searchValue =$scope.preAccountId;
					    index = -1;
						_.each($scope.preferenceAccountlist, function(data, idx) { 
												
						   if (_.isEqual(data.id, searchValue)) {
											   
						      index = idx;
						      return;
						     
						   }
						});
		
						$log.info("index"+index);
						$scope.accountidname=$scope.preferenceAccountlist[index];
						
					}
					
				},function(response){
					if (response.status == 500) {
						$scope.serverError = response.statusText;
					}
					$log.info(response);
				});
				
				sltWrkItem();
				
			}
			
		},function(response){
			if (response.status == 500) {
				$scope.serverError = response.statusText;
			}
			$log.info(response);
		})
		$scope.getworkspaceidItem="";
		
		$scope.getWorkpsacebasedPrjt=function(){
			
			$scope.projectid=$scope.projectName.id;
			//alert($scope.projectid);
			
			if($scope.projectid){
				
				dataServices.getWorkspaceItem($scope.projectid).then(function(response){
					
					$scope.getworkspaceidItem=response.data[0].id;
					
					
				},function(response){
					if (response.status == 500) {
						$scope.serverError = response.statusText;
					}
				}) 
				
				dataServices.workSpacelst().then(function(response){
					
					$scope.preferenceWorkspaces=response.data;
					
					
					if($scope.preferenceWorkspaces.length>0){
						
						var searchWorkspaceValue =$scope.getworkspaceidItem;
					
					   chworkspaceindex = -1;
						_.each($scope.preferenceWorkspaces, function(data, idx) { 
								//	alert()			
						   if (_.isEqual(data.id, searchWorkspaceValue)) {
											
											chworkspaceindex = idx;
						      return;
						     
						   }
						});
					
						$scope.workspaceName=$scope.preferenceWorkspace[chworkspaceindex];

					}
					
				},function(response){
					if (response.status == 500) {
						$scope.serverError = response.statusText;
					}
					$log.info(response);
				})
			}else{
				sltWrkItem();
			}
		}
		function sltacctlst(){
			dataServices.accountList().then(function(response){
				
				$scope.preferenceAccountlist=response.data;
				$log.info("Response"+response.data)
				
				if($scope.preAccountId){
					
					var searchValue =$scope.preAccountId;
				    index = -1;
					_.each($scope.preferenceAccountlist, function(data, idx) { 
											
					   if (_.isEqual(data.id, searchValue)) {
										   
					      index = idx;
					      return;
					     
					   }
					});
	
					$log.info("index"+index);
					$scope.accountidname=$scope.preferenceAccountlist[index];
					
				}
				
			},function(response){
				if (response.status == 500) {
					$scope.serverError = response.statusText;
				}
				$log.info(response);
			});
		}	
		
		function sltWrkItem(){
			
			dataServices.workSpacelst().then(function(response){
				
				$scope.preferenceWorkspace=response.data;
				
				if($scope.preferenceWorkspace.length>0){
					
					var searchWorkspaceValue =$scope.preWorkspaceId;
				    workspaceindex = -1;
					_.each($scope.preferenceWorkspace, function(data, idx) { 
											
					   if (_.isEqual(data.id, searchWorkspaceValue)) {
										   
						   workspaceindex = idx;
					      return;
					     
					   }
					});
					
					$scope.workspaceName=$scope.preferenceWorkspace[workspaceindex];
	
				}
				
			},function(response){
				if (response.status == 500) {
					$scope.serverError = response.statusText;
				}
				$log.info(response);
			})
		}
		
		$scope.preAccProjctlst=function(){
			
			if ($scope.accountidname.id) {
				
				dataServices.setAccountid($scope.accountidname.id);
				dataServices.projectLst($scope.accountidname.id).then(
						function(response) {
							// First function handles success
							$log.info(response.data);
							$scope.displayProjectlst = response.data;
							$scope.projlenth = response.data.length;

						}, function(response) {
							if (response.status == 500) {
								$scope.errorStatus = response.statusText;
							}
						})
			}
		}
		
	$scope.addPreference=function(){
		
		$scope.predata.accountId=$scope.accountidname.id;
		$scope.predata.accountName=$scope.accountidname.accountName;
		$scope.predata.projectId=$scope.projectName.id;
		$scope.predata.projectName=$scope.projectName.name;
		$scope.predata.workspaceId=$scope.workspaceName.id;
		$scope.predata.workspaceName=$scope.workspaceName.name;
		$scope.versionName=$scope.workspaceName.versionControl;
		
		$scope.predata.userId=$rootScope.globals.currentUser.username;
		$scope.predata.type="user";	
		var predataInfo=JSON.stringify($scope.predata);
		if($scope.predata.accountId){
			
			dataServices.addPreference(predataInfo).then(function(response){
				$log.info(response);
				
				if(response.data.statusCode==201){
					$scope.successStatus = response.data.message;
					
					if(response.data.preferenceId){
						$scope.preid=response.data.preferenceId;
						$rootScope.preferenceProjectName=response.data.projectName;
						$rootScope.preferenceWorkspaceName=response.data.workspaceName;
						$rootScope.preworkspaceid=response.data.workspaceId;
						$rootScope.preprojectid=response.data.projectId;
						
					}
					$scope.reset();
					}else if(response.data.statusCode==400){
						$scope.errorStatus = response.data.message;
					}
				
			},function(response){
				if (response.status == 500) {
					$scope.errorStatus = response.statusText;
				}
			});
			
			$timeout(callAtTimeout, 10000)
		}
			
	}	
	
$scope.updatePreference=function(){
	$rootScope.preferenceProjectName="";
	$rootScope.preferenceWorkspaceName="";
		$scope.predata.accountId=$scope.accountidname.id;
		$scope.predata.accountName=$scope.accountidname.accountName;
		$scope.predata.projectId=$scope.projectName.id;
		$scope.predata.projectName=$scope.projectName.name;
		$scope.predata.workspaceId=$scope.workspaceName.id;
		$scope.predata.workspaceName=$scope.workspaceName.name;
		

		$scope.predata.userId=$rootScope.globals.currentUser.username;
		$scope.predata.type="user";	
		$scope.predata.preferenceId=$scope.preid;
		var preupdateInfo=JSON.stringify($scope.predata);
		
		if($scope.predata.preferenceId){
			
			dataServices.modifyPreference(preupdateInfo).then(function(response){
				$log.info("Modify:"+response.data);
				
				if(response.data.statusCode==201){
					$scope.successStatus = response.data.message;
					
					if(response.data.result.preferenceId){
						
						$scope.preid=response.data.preferenceId;
						$rootScope.preferenceProjectName=response.data.result.projectName;
						$rootScope.preferenceWorkspaceName=response.data.result.workspaceName;
						$rootScope.preworkspaceid=response.data.result.workspaceId;
						$rootScope.preprojectid=response.data.result.projectId;	
						
						
					}
					$scope.reset();
					}else if(response.data.statusCode==400){
						$scope.errorStatus = response.data.message;
					}
				
			},function(response){
				if (response.status == 500) {
					$scope.errorStatus = response.statusText;
				}
			});
			
			$timeout(callAtTimeout, 10000)
		}
			
	}	
	$scope.reset = function() {
		$scope.predata={};
	}
	function callAtTimeout() {
		$scope.successStatus = '';
		$scope.errorStatus = '';
	}
	
})
.controller("CCMbranchManagementCtrl",function($scope,$rootScope, $http, $log, $timeout,dataServices,$location){
	$scope.chkconnector=1;
	$scope.configTool="";
	$scope.workspaceid=$rootScope.preworkspaceid;
	$scope.projectid=$rootScope.preprojectid;
	
	
	if($scope.workspaceid)
	{
	dataServices.getWorkspacedata($scope.workspaceid).then(function(response){
		$scope.dataLoading=true;
		
		$scope.workspaceInfo=response.data;	
		$scope.configTool=response.data.versionControl;
		
		
	
		
			dataServices.CCMConnectordata($scope.workspaceid,$scope.projectid,$scope.configTool).then(function(response){
			
			
		
			if(response.status==200)
				{
			
					$scope.CCMconnectLst=response.data.connector;
					$scope.connectorID=response.data.id;
					//alert($scope.connectorID);
			
						$scope.Request_body=JSON.stringify($scope.CCMconnectLst);
			
						
								$log.info($scope.CCMconnectLst);
								dataServices.CCMbranchList($scope.Request_body).then(function(response){
									//if(response.data.statusCode==200){
										$log.info(response.data);
										$scope.ccmbranchdata = response.data;
										$scope.authData=$scope.CCMconnectLst;
										$log.info("LogINFO"+$scope.authData);
										$scope.dataLoading=false;
										////$scope.ccmbranchdata = JSON.stringify($scope.ccmbranchdata1);
									//}
							
						},function(response){
							if (response.status == 500) {
								$scope.errorStatus = response.statusText;
								$scope.dataLoading=false;
								
							}
						});
						
						
						
				}
			else{
				
				
					$location.path("/services/connector");
					alert("Please create configuration for Version control");
				
			}
			
	
			},function(response){
				if (response.status == 500) {
					$scope.errorStatus = response.statusText;
					$scope.dataLoading=false;
				}
			});
		
		
	},function(response){
		if (response.status == 500) {
			$scope.errorStatus = response.statusText;
			$scope.dataLoading=false;
		}
	});

	}else{

		$timeout(redrctPage,1000)
	    

	    

	}
//	$scope.Request_body ={ "configTool" : "Git Lab" , "loginId" : "senthilraja.l@in.unisys.com" ,  "oAuthToken" : "CXYyv3MEAzCyDKz5yfvr", "url" : "http://192.63.247.105" , "repository" : "DevOps-Workbench"}
		
	function redrctPage(){
		
		$location.path("/services/preference");
		alert("Please set Preference / Workspace before this operation")
	}
	

	$scope.deleteBranch=function(branchName,projId,idx){
		/*alert(branchName);
		alert(projId);
		alert(idx);*/
		if(branchName !='' && projId!='')
			{
			 dataServices.deleteBranchService(branchName,projId).then(function(response){
				
				// alert(response.data.statusCode);
				 if(response.data.statusCode==400){
					$scope.successStatus=response.data.message;
					
					for(var i = $scope.ccmbranchdata.length; i--;) {
						if($scope.ccmbranchdata[i].repoId === projId){
							for(var j = $scope.ccmbranchdata[i].branchList.length; j--;){
								if($scope.ccmbranchdata[i].branchList[j] === branchName) {
						        	  $log.info("dltindx:   "+j);
						        	  $scope.ccmbranchdata[i].branchList.splice(j, 1);
						          }
							}
						}
					          
					}
				 }
				 
			 },function(response){
				 if (response.status == 500) {
						$scope.errorStatus = response.statusText;
						
					}
			 })
			}
		 
	}

	
	
})




.controller("newbranchCtrl", function($scope,$rootScope, $http, $log, $timeout,dataServices,$location) {
	 $scope.successStatus="";
	 $scope.errorStatus="";
	 $scope.workspaceid=$rootScope.preworkspaceid;
	 $scope.projectid=$rootScope.preprojectid;
	 
	 
	 /* get request body */

	    dataServices.getWorkspacedata($scope.workspaceid).then(function(response){
		$scope.workspaceInfo=response.data;	
		$scope.configTool=response.data.versionControl;
		
		dataServices.CCMConnectordata($scope.workspaceid,$scope.projectid,$scope.configTool).then(function(response){
			if(response.status==200)
			{
				$scope.repositoryCCMconnectLst=response.data.connector;
				$scope.repositoryRequest_body=JSON.stringify($scope.repositoryCCMconnectLst);
				$log.info($scope.repositoryCCMconnectLst);
				
				 dataServices.getRepository($scope.repositoryRequest_body).then(function(response){
				    	$scope.repositoryLst=response.data;
				    	
				    },function(response){
				    	if (response.status == 500) {
							$scope.errorStatus = response.statusText;
						}
				    })
			}
			
			},function(response){
				if (response.status == 500) {
					$scope.errorStatus = response.statusText;
				}
			});
		
	
		
	},function(response){
		if (response.status == 500) {
			$scope.errorStatus = response.statusText;
		}
	});
	 
	 /* get request body end */
	
	   
	    
		
	 $scope.getClonebranch=function(){
	
	    	if($scope.projectId.id){
	    		dataServices.findCloneBranch($scope.projectId.id,$scope.repositoryRequest_body).then(function(response){
	    			
	    			$scope.cloneList=response.data;
	    			
	    		},function(response){
	    			if (response.status == 500) {
	    				$scope.errorStatus = response.statusText;
	    			}
	    		})
	    	}
	    }
	 
	 
	 
	 $scope.checkEnableBuild=function(){
	   
	  if($scope.buildcheck==true)
	  {
	 
	 
		 dataServices.getWorkspacedata($scope.workspaceid).then(function(response){
			$scope.workspaceInfo=response.data;	
			$scope.configTool=response.data.buildAutomation;
			
			dataServices.CCMConnectordata($scope.workspaceid,$scope.projectid,$scope.configTool).then(function(response){
				
				if(response.status==200)
				{
					$scope.CCMconnectLst=response.data.connector;
					$scope.CCMconnectid=response.data.id;
					$scope.Request_body=JSON.stringify($scope.CCMconnectLst);
					$log.info($scope.CCMconnectLst);
						
						$scope.authData=$scope.CCMconnectLst;
						
							
							
							
				}
				else{
					$timeout(redrctPage,1000)
				}
				
		
				},function(response){
					if (response.status == 500) {
						$scope.errorStatus = response.statusText;
					}
				});
			
		
			
		},function(response){
			if (response.status == 500) {
				$scope.errorStatus = response.statusText;
			}
		});

	  }	 
	 
}
/* end check box conditin*/

	
	
	$scope.uploadedFile = function(element) {
		 $scope.$apply(function($scope) {
		   $scope.files = element.files;         
		 });
		}
	

	$scope.addFile = function() {
	
		
		dataServices.uploadfile($scope.files,$scope.Request_body,$scope.branchName,$scope.projectId.id,
		   function( msg ) // success
		   {
				  
		   },
		   function( msg ) // error
		   {
			   
		   }).then(function(response){
			   $log.info("Success"+response.data);
			   $scope.successStatus = response.data.message;
			   $scope.reset();
			  
		   },function(response){
			  
			   if (response.status == 500) {
					$scope.errorStatus = response.statusText;
				}
		   })
		   $timeout(callAtTimeout, 10000)

		  
		}
	
		 $scope.reset = function() {
				$scope.stream="";
				$scope.branchName="";
				$scope.buildcheck="";
			}
		function callAtTimeout() {
			$scope.successStatus = '';
			$scope.errorStatus = '';
			}
		function redrctPage(){
			
			//$location.path("/services/buildAutomationConnector");
			//alert("please create connector");
		}

})
.controller("connectorCtrl",function($scope,$rootScope, $http, $log, $timeout,dataServices,$location,$routeParams){
	$scope.successStatus="";
	$scope.errorStatus="";

	$scope.connectorWrkspace=$rootScope.preworkspaceid;
	$scope.connectorPrjtid=$rootScope.preprojectid;
	$scope.connectorData={};
	$scope.connectorData.configTool="";
	$scope.workItemId={};
	 $scope.fullconnectorData={};
	 
	 $scope.connectorid=$routeParams.showId;
	 
	
	 
		if($scope.connectorData.configTool==""){
			 $scope.connectorData.configTool=$rootScope.versionCtrl;
			// alert($scope.connectorData.configTool);
		}
		
	 
	// alert($scope.connectorData.configTool);
	 $scope.connectionType="password";
	
	
/*	dataServices.getWorkspacedata($scope.connectorWrkspace).then(function(response){
		$scope.workspaceInfo=response.data;	
		$scope.connectorData.configTool=response.data.versionControl;
		
	},function(response){
		if (response.status == 500) {
			$scope.errorStatus = response.statusText;
		}
	});*/
	 $scope.connectorData.functionArea="";
	

	
	
	$scope.funtionAreaLst=[{"name":"CCM"},{"name":"buildAutomation"},{"name":"featureManagement"}];
	$scope.accType=[{"name":"Private"},{"name":"Public"}];
//	$scope.connType=[{"name":"password"},{"name":"oAuthToken"}];
	$scope.connType=["password"];
	 
	 $scope.workspaceId={"id":$scope.connectorWrkspace};
	 $scope.projectId={"id":$scope.connectorPrjtid};
	 $scope.workItemId.workspaceId= $scope.workspaceId;
	 $scope.workItemId.projectId= $scope.projectId;
	if($scope.connectorData.functionArea=="")
		{
			$scope.connectorData.functionArea="Version Control";
			//alert($scope.connectorData.functionArea);
		}
	 $scope.connectorData.connectionType="password";
	// alert($scope.connectorid);
	 if($scope.connectorid){
		
		 dataServices.geteditConnectorItem($scope.connectorid).then(function(response){
			 $scope.connectorData=response.data.connector;
		 },function(response){
			 if (response.status == 500) {
			      $scope.errorStatus = response.statusText;
		        }
		 })
	 }
	
	$scope.addConnector=function(){
		$scope.loadingData=true;
		 if ($scope.connectorFrm.$invalid) {
			 $scope.loadingData=false;
             angular.forEach($scope.connectorFrm.$error, function (field) {
               angular.forEach(field, function(errorField){
                 errorField.$setTouched();
               })
             });
           
         }
		
		 if($scope.connectorFrm.$valid){
			
			 $scope.fullconnectorData=$scope.connectorData;
			// alert(JSON.stringify($scope.fullconnectorData));
			// var datas=JSON.stringify($scope.fullconnectorData)+","+'"workspaceId":'+JSON.stringify($scope.workspaceId)+',"projectId":'+ JSON.stringify($scope.projectId);
			 var datas=JSON.stringify($scope.fullconnectorData)+',"projectId":'+ JSON.stringify($scope.projectId);
			var dataItem='{'+ '"connector":'+datas+'}';
						 
			dataServices.addConnectorService(dataItem).then(function(response){
				{
					if(response.data.statusCode==201){
						$scope.successStatus = response.data.message;
						$scope.connectorData={};
						
						$scope.loadingData=false;
					
						if(response.data.others.BuildAutomation){
							//alert("build");
							 $scope.connectorData.configTool=response.data.others.BuildAutomation;
							 $scope.connectorData.connectionType="password";
							 $scope.connectorData.functionArea="BuildAutomation";
						}
						else if(response.data.others.CodeQuality){
							//alert("code");
							 $scope.connectorData.configTool=response.data.others.CodeQuality;
							 $scope.connectorData.connectionType="password";
							 $scope.connectorData.functionArea="CodeQuality";
						}
						else {
							$scope.loadingData=false;
							alert("project created successfully");
							$timeout(redirectPage,1000);
						}
						
						//alert(response.data.others.BuildAutomation)
						//else{
							//alert("project created successfully");
							
						//	$timeout(redirectPage,2000);
						//}
							
						$timeout(callAtTimeout, 5000)
					}
					else if(response.data.statusCode==400){
						$scope.loadingData=false;
						$scope.errorStatus=response.data.message;
					}
					 
					
				}
				
			},function(response){
				if (response.status == 500) {
					$scope.loadingData=false;
			      $scope.errorStatus = response.statusText;
		        }
			})
			
		 }
		 function redirectPage(){
			 $scope.loadingData=false;
			 $location.path("/services/");
		 }
		 function callAtTimeout(){
			 $scope.successStatus="";
				$scope.errorStatus="";
				//$location.path("/services/CCMbranchManagement");
		 }
	}
	
	/* edit connector start*/
	$scope.updateConnectorItem=function(){
		$scope.loadingData=true;
		 if ($scope.connectorFrm.$invalid) {
			 $scope.loadingData=false;
            angular.forEach($scope.connectorFrm.$error, function (field) {
              angular.forEach(field, function(errorField){
                errorField.$setTouched();
              })
            });
          
        }
		
		 if($scope.connectorFrm.$valid){
			
			 
			
			 $scope.fullconnectorData=$scope.connectorData;
			 
			 var datas=JSON.stringify($scope.fullconnectorData)+","+'"workspaceId":'+JSON.stringify($scope.workspaceId)+',"projectId":'+ JSON.stringify($scope.projectId)+',"id":'+JSON.stringify($scope.connectorid);
			var dataItem='{'+ '"connector":'+datas+'}';
						
			dataServices.editConnectorService(dataItem).then(function(response){
				{
					if(response.data.statusCode==201){
						$scope.successStatus = response.data.message;
						$scope.loadingData=false;
					
						$timeout(callAtTimeout, 3000)
					}
					else if(response.data.statusCode==400){
						$scope.loadingData=false;
						$scope.errorStatus=response.data.message;
					}
					 
					
				}
				
			},function(response){
				if (response.status == 500) {
					$scope.loadingData=false;
			      $scope.errorStatus = response.statusText;
		        }
			})
			
		 }
		 
		 function callAtTimeout(){
			 $scope.successStatus="";
				$scope.errorStatus="";
				$location.path("/services/CCMbranchManagement");
		 }
	}
	/* edit connector end */
	
})
.controller("buildAutomationConnectorCtrl",function($scope,$rootScope, $http, $log, $timeout,dataServices,$location,$routeParams){
	$scope.successStatus="";
	$scope.errorStatus="";
	$scope.connectorWrkspace=$rootScope.preworkspaceid;
	$scope.connectorPrjtid=$rootScope.preprojectid;
	$scope.connectorData={};
	$scope.workItemId={};
	 $scope.fullconnectorData={};
	 $scope.connectorid=$routeParams.showId;
	
	dataServices.getWorkspacedata($scope.connectorWrkspace).then(function(response){
		$scope.workspaceInfo=response.data;	
		$scope.connectorData.configTool=response.data.buildAutomation;
		
	},function(response){
		if (response.status == 500) {
			$scope.errorStatus = response.statusText;
		}
	});
	
	$scope.funtionAreaLst=[{"name":"CCM"},{"name":"buildAutomation"},{"name":"featureManagement"}];
	$scope.accType=[{"name":"Private"},{"name":"Public"}];
	$scope.connType=[{"name":"password"},{"name":"oauth"}];
	 
	 $scope.workspaceId={"id":$scope.connectorWrkspace};
	 $scope.projectId={"id":$scope.connectorPrjtid};
	 $scope.workItemId.workspaceId= $scope.workspaceId;
	 $scope.workItemId.projectId= $scope.projectId;
	 $scope.connectorData.functionArea="buildAutomation";
	 
	 if($scope.connectorid){
			
		 dataServices.geteditConnectorItem($scope.connectorid).then(function(response){
			 $scope.connectorData=response.data.connector;
		 },function(response){
			 if (response.status == 500) {
			      $scope.errorStatus = response.statusText;
		        }
		 })
	 }
	
	$scope.addConnector=function(){
		 if ($scope.connectorFrm.$invalid) {
				
             
             angular.forEach($scope.connectorFrm.$error, function (field) {
               angular.forEach(field, function(errorField){
                 errorField.$setTouched();
               })
             });
           
         }
		
		 if($scope.connectorFrm.$valid){
			
			 $scope.fullconnectorData=$scope.connectorData;
			 var datas=JSON.stringify($scope.fullconnectorData)+","+'"workspaceId":'+JSON.stringify($scope.workspaceId)+',"projectId":'+ JSON.stringify($scope.projectId);
			var dataItem='{'+ '"connector":'+datas+'}';
						 
			
			
			dataServices.addConnectorService(dataItem).then(function(response){
				{
					if(response.data.statusCode==201){
						$scope.successStatus = response.data.message;
						 $timeout(callAtTimeout, 3000)
						
					}
					else if(response.data.statusCode==400){
						$scope.errorStatus=response.data.message;
					}
					
					
				}
				
			},function(response){
				if (response.status == 500) {
			      $scope.errorStatus = response.statusText;
		        }
			})
			
		 }
		 
		 function callAtTimeout(){
			 $scope.successStatus="";
				$scope.errorStatus="";
				$location.path("/services/newbranch");
		 }
	}
	
	
	/* edit connector start*/
	$scope.updateConnectorItem=function(){
		 if ($scope.connectorFrm.$invalid) {
		            
            angular.forEach($scope.connectorFrm.$error, function (field) {
              angular.forEach(field, function(errorField){
                errorField.$setTouched();
              })
            });
          
        }
		
		 if($scope.connectorFrm.$valid){
			
			 
			
			 $scope.fullconnectorData=$scope.connectorData;
			 
			 var datas=JSON.stringify($scope.fullconnectorData)+","+'"workspaceId":'+JSON.stringify($scope.workspaceId)+',"projectId":'+ JSON.stringify($scope.projectId)+',"id":'+JSON.stringify($scope.connectorid);
			var dataItem='{'+ '"connector":'+datas+'}';
						
			dataServices.editConnectorService(dataItem).then(function(response){
				{
					if(response.data.statusCode==201){
						$scope.successStatus = response.data.message;
					
						$timeout(callAtTimeout, 3000)
					}
					else if(response.data.statusCode==400){
						$scope.errorStatus=response.data.message;
					}
					 
					
				}
				
			},function(response){
				if (response.status == 500) {
			      $scope.errorStatus = response.statusText;
		        }
			})
			
		 }
		 
		 function callAtTimeout(){
			 $scope.successStatus="";
				$scope.errorStatus="";
				$location.path("/services/newbranch");
		 }
	}
	/* edit connector end */
	
	
})

