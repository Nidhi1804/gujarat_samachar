angular  
	.module('gujaratSamachar')
	.component('metaTagComponent', {
		templateUrl:'components/metaTag.view.html',
		bindings: {
			metakeywords: "=",
			placeholder:"@"
		},
		controllerAs:'vm',
		controller: function(AdminService, $q) {
			var vm          = this;
			vm.addTag       = addTag;
			vm.getMetaTags  = getMetaTags;
			function addTag(tag){
				AdminService.metaTags().save(tag, function(response){
					if(response.code == 200 && response.message == "Tag added successfully"){
						/* If new tag added in database than add newly created tag _id in 'vm.metakeywords' model */
						if(vm.metakeywords.length > 0){
							var length = vm.metakeywords.length;
							if(response.data.name == vm.metakeywords[length - 1].name){
								vm.metakeywords[length - 1]._id = response.data._id;
							}
						}
						if(vm.metaTag.length > 0){
							var length = vm.metaTag.length;
							if(response.data.name == vm.metaTag[length - 1].name){
								vm.metaTag[length - 1]._id = response.data._id;
							}
						}
					}
				});
			}
			function getMetaTags(query){
				var deferred = $q.defer();
				AdminService.metaTags().get({searchTag:query},function(response){
					if(response.code == 200 ){
						deferred.resolve(response.data)
					}
				})
				return deferred.promise;
			}
		}
	});