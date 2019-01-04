'use strict';
angular.module('gujaratSamachar.main')
    .controller('storyBoxController', storyBoxController);

storyBoxController.$inject = ['sectionFlagDataService', '$log', 'GENERAL_CONFIG', 'mainService', '$scope', '$q', '$filter', 'categoryDataService'];

function storyBoxController(sectionFlagDataService, $log, GENERAL_CONFIG, mainService, $scope, $q, $filter, categoryDataService) {
	var vm = this;
	var sectionFlags;
    vm.topStoriesSliderConfig = {
        autoplay: true,
        infinite: true,
        arrows: false,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true
                }
            }
        ],
        method: {},
    };

    var sectionIds = {};
    vm.showLoader = true
    // sectionFlags : Return Section info(name, _id, value)(Sections: Top Stories, Top Sub-Stories, Top Read News, Latest News) 
    sectionFlagDataService.sectionFlags().then(function(response) {
        sectionFlags = response;
        var promises = {
            topStories: mainService.stories().get({ sectionId: sectionFlags.topStories._id, type: sectionFlags.topStories.value }).$promise,
            topSubStories: mainService.stories().get({ sectionId: sectionFlags.topSubStories._id, type: sectionFlags.topSubStories.value }).$promise,
        }
        $q.all(promises).then(function(responses) {
            if (responses.topStories.data) {
                var topStories = responses.topStories.data;
                vm.topStories = topStories;
                if (vm.topStories.length > 0) {
                    vm.topStories = $filter('imagePathFilter')(vm.topStories);
                }
                vm.topStories = vm.topStories.map(function(topStories){
                    if(!topStories.categorySlug)
                        topStories.slug = topStories.magazineSlug;
                    else
                        topStories.slug = topStories.categorySlug;
                    return topStories;
                });
                vm.topStorySliderLoaded = true;
            }
            if (responses.topSubStories.data) {
                vm.topSubStories = responses.topSubStories.data;
                 if (vm.topSubStories) {
                    vm.topSubStories = $filter('imagePathFilter')(vm.topSubStories,'thumbImage');
                }
                vm.topSubStories = vm.topSubStories.map(function(topSubStories){
                    if(!topSubStories.categorySlug)
                        topSubStories.slug = topSubStories.magazineSlug;
                    else
                        topSubStories.slug = topSubStories.categorySlug;
                    return topSubStories;
                })
                vm.topSubStories = $filter('arrayChunk')(vm.topSubStories, 2);                
               
            }
        });
    });
}