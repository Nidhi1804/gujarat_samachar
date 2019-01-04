/*=============== Header Fixed Start ===============*/

$(window).scroll(function(){
    if ($(window).scrollTop() >= 150) {
       $('.main-navigation').addClass('fixed-header');
    }
    else {
       $('.main-navigation').removeClass('fixed-header');
    }
    if ($(window).scrollTop() >= 150) {
       $('#header').addClass('fixed-header');
    }
    else {
       $('#header').removeClass('fixed-header');
    }
  });

/*=============== Header Fixed End ===============*/


  $(document).ready(function(){  
    $(document).on('click','.main-navigation a', function(){
        $(".navbar-collapse").removeClass("in");
    });
    $(document).on('click','.dropdownTitle', function(){
        $(".navbar-collapse").addClass("in");
    });
  });

  $(document).ready(function(){  
    $(document).on('click','.navbar-toggle', function(){
        $(".navbar-collapse").toggleClass("in");
        $('.subMenu.main-more').removeClass("subMenuMoreOpen");
        $(".navbar-toggle").toggleClass("open");
        $(".icon-bar").toggleClass("close");
    });
  });

/*=============== NavSearch ===============*/
  var removeClass = true;

  $(document).on('click','.navSearch a', function(){
    $(".search-input").toggleClass('open');
    removeClass = false;
  });

// when clicking the div : never remove the class
$(".search-input").click(function() {
    removeClass = false;
});

// when click event reaches "html" : remove class if needed, and reset flag
$("html").click(function () {
    if (removeClass) {
        $(".search-input").removeClass('open');
    }
    removeClass = true;
});


/*=============== Responsive submenu ===============*/

$(document).ready(function(){
  if ($(window).width() <= 991){
    $(document).on('click','.subMenu', function(){
      $(this).toggleClass("subMenuOpen");
    });
    $(document).on('click','.subMenu.main-more', function(){
      $(this).removeClass("subMenuOpen");
    });
    $(document).on('click','.subMenu.main-more', function(){
      $(this).toggleClass("subMenuMoreOpen");
    });
    $(document).on('click','.subMenu-more.subMenu', function(){
        $('.main-more').toggleClass("moreOpen");
    });


    $(document).on('click','.city-sport0, .city-sport1', function(){
        $('.more_sub_category .subMenu-more').toggleClass("more_first");
    });

  } 
});
/*=============== Responsive submenu ===============*/
