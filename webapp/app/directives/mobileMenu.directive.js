angular.module('gujaratSamachar')
    .directive('mobileMenu', function($window, $timeout) {
        return {
            link: function(scope, element) {
                var windowWidth = $window.innerWidth;
                $timeout(function() {
                    jQuery(document).ready(function() {
                        $(".navbar button.navbar-toggle").click(function() {
                            if ($(window).width() <= 992) {
                                $(".navbar-nav .dropdownSubmenu").children('.dropdown-toggle').removeAttr('data-toggle');
                            }
                        })
                        $('.navbar-nav .dropdownSubmenu .em-level').click(function() {
                            if ($(window).width() <= 992) {
                                if ($(this).hasClass('active')) {
                                    $(this).removeClass('active');
                                    $(this).next('.dropdown-menu').slideUp();
                                } else {
                                    $(this).addClass('active')
                                    $(this).next('.dropdown-menu').slideDown();
                                }
                            }
                        })
                    });
                    $(window).resize(function() {
                        if ($(window).width() >= 992) {
                            $('.navbar-nav .dropdownSubmenu .em-level').removeClass('active').next('.dropdown-menu').slideUp();
                        }
                    })
                }, 2500);
            }
        };
    });