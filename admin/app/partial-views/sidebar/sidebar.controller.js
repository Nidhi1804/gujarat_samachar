'use strict';
angular.module('gujaratSamachar.user')
	.controller('SidebarController', SidebarController);

SidebarController.$inject = ['$log', '$state', 'toastr', '$scope', 'AdminService', 'localStorageService'];

function SidebarController($log, $state, toastr, $scope, AdminService, localStorageService) {
	var vm = this;
	getLoginUserDetails();

	function getLoginUserDetails() {
		let getUserDetails = localStorageService.getLoggedInUserInfo();
		let userDetails = JSON.parse(getUserDetails);
		vm.loginUserGroup = userDetails.userGroup;
	}
	$scope.$on('$includeContentLoaded', function () {
		Layout.initSidebar(); // init sidebar
		$('body').removeClass('page-sidebar-closed');
		$('.page-sidebar-menu').removeClass('page-sidebar-menu-closed');
	});
	vm.menuList = [{
		name: 'Dashboard',
		iconClass: 'icon-home',
		state: '.dashboard',
		submenu: []
	},
	{
		name: 'Article manager',
		iconClass: 'icon-puzzle',
		state: 'javascript:;',
		submenu: [{
			name: 'Show Articles',
			state: '.articleList.id({pageId:1,sectionId:"all", searchText:"", reporter:"",category:""})'
		},
		{
			name: 'Create Article',
			state: '.addArticle'
		}
		]
	},
	{
		name: 'Advertise',
		iconClass: 'fa fa-buysellads',
		state: 'javascript:;',
		submenu: [{
			name: 'Manage Advertise',
			state: '.getAdvertiseList({pageIndex:1})'
		},
		{
			name: 'Add Advertise',
			state: '.addAdvertise'
		}
		]
	},
	{
		name: 'Slide Show',
		iconClass: 'icon-camera',
		state: 'javascript:;',
		submenu: [{
			name: 'Manage Slide Show',
			state: '.slideShowList({pageId:1, searchText: ""})'
		},
		{
			name: 'Add Slide Show',
			state: '.addSlideShow'
		}
		]
	},
	{
		name: 'Photo Gallery',
		iconClass: 'icon-picture',
		state: 'javascript:;',
		submenu: [{
			name: 'Manage Photo Gallery',
			state: '.photoGalleryList({pageId:1, searchText: ""})'
		},
		{
			name: 'Add Photo Gallery',
			state: '.addPhotoGallery'
		}
		]
	},
	{
		name: 'Video Gallery',
		iconClass: 'fa fa-play-circle-o',
		state: 'javascript:;',
		submenu: [{
			name: 'Manage Video Gallery',
			state: '.videoGalleryList({pageId:1, searchText: ""})'
		},
		{
			name: 'Add Video Gallery',
			state: '.addVideoGallery'
		}
		]
	},
	{
		name: 'Category Manager',
		iconClass: 'icon-diamond',
		state: 'javascript:;',
		submenu: [{
			name: 'Main Categories',
			state: '.categoryList({searchText:""})'
		},
		{
			name: 'Add Main Category',
			state: '.addCategory'
		},
		{
			name: 'Add Sub Category',
			state: '.addSubCategory'
		},
		]
	},
	// {
	// 	name: 'City Manager',
	// 	iconClass: 'icon-diamond',
	// 	state: 'javascript:;',
	// 	submenu: [
	// 		{ name: 'Cities', state: '.cityList({searchText:""})' },
	// 		{ name: 'Add City', state: '.addCity' }
	// 	]
	// },
	{
		name: 'Section manager',
		iconClass: 'icon-list',
		state: 'javascript:;',
		submenu: [{
			name: 'Show Sections',
			state: '.sectionList({pageId:1})'
		},
		{
			name: 'Create Section',
			state: '.addSection'
		}
		]
	},
	{
		name: 'Static Page Manager',
		iconClass: 'icon-notebook',
		state: 'javascript:;',
		submenu: [{
			name: 'Manage pages',
			state: '.pageList'
		}]
	},
	{
		name: 'User Management',
		iconClass: 'icon-user',
		state: 'javascript:;',
		submenu: [{
			name: 'Manage Users',
			state: '.userList.id({pageId:1,searchText:"",group:""})'
		},
		{
			name: 'Add User',
			state: '.addUser'
		}
		]
	},
	{
		name: 'Settings',
		iconClass: 'icon-settings',
		state: 'javascript:;',
		submenu: [{
			name: 'Manage Configuration',
			state: '.manageConfig'
		},
		{
			name: 'Manage IP List',
			state: '.allowIpList({pageIndex:1})'
		},
		{
			name: 'Add IP',
			state: '.addAllowIp'
		},
		{
			name: 'Subscribers',
			state: '.subscriberList'
		}
		]
	},
	{
		name: 'Report',
		iconClass: 'fa fa-flag-o',
		state: 'javascript:;',
		submenu: [{
			name: 'Report List',
			state: '.googleAnalytics'
		}]
	}
	]
	getArticleSectionFlags();

	function getArticleSectionFlags() {
		AdminService.sectionFlags().get(function (response) {
			vm.sectionFlags = response.data;
			let index = vm.menuList.findIndex(item => item.name === 'Static Page Manager');
			if (vm.loginUserGroup !== 'Administrator') {
				vm.menuList.splice(index, 1);
			}
			let userMgmtIndex = vm.menuList.findIndex(item => item.name === 'User Management');
			if (vm.loginUserGroup !== 'Administrator') {
				vm.menuList.splice(userMgmtIndex, 1);
			}
			let reportIndex = vm.menuList.findIndex(item => item.name === 'Report');
			if (vm.loginUserGroup !== 'Administrator') {
				vm.menuList.splice(reportIndex, 1);
			}
			let settingIndex = vm.menuList.findIndex(item => item.name === 'Settings');
			let userGroupsArr = ['Administrator', 'Manager'];
			let findUserGroupIndex = userGroupsArr.findIndex(item => item === vm.loginUserGroup);
			if (findUserGroupIndex === -1) {
				vm.menuList.splice(settingIndex, 1);
			}
			vm.menuList.forEach(function (menuItem) {
				if (menuItem.name == "Article manager") {
					vm.sectionFlags.forEach(function (section) {
						menuItem.submenu.push({
							name: section.name + ' Articles',
							state: '.articleList.id({pageId:1,searchText:"", reporter:"",category:"",sectionId:"' + section._id + '"})'
						});
					})
					menuItem.submenu.push({
						name: 'Breaking News Articles',
						state: '.breakingNewsList'
					});
				}
			});
		})
	}
}