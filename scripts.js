$('document').ready(function () {
    var carousel = {
        init : function () {
            carousel.slideMath();
            carousel.pager();
            carousel.wresize();
            carousel.getSlideWidth();
        },
        videoContainer : $('.video-slider'),
        slide : $('.video-slider li'),
        slideMath : function () {
            var slideLength = carousel.slide.length;
            var videoContainerWidth = 100 * slideLength+'%';
            var slideWidth = 100 / slideLength+'%';
            carousel.slide.width(slideWidth) ;
            carousel.videoContainer.css({width: videoContainerWidth});
        },
         getSlideWidth : function () {
             return carousel.slide.outerWidth();
         },
        wresize : function(){
            $(window).resize(function () {
                $(carousel.videoContainer).css('left', '');
                $('.pager li').removeClass('active');
                $('.pager li:first-child').addClass('active');
            });
        },
        pager : function () {
            var pager = $('.pager');
            carousel.videoContainer.after('<ul class="pager"></ul>');
            carousel.slide.each(function () {
                $('.pager').append('<li></li>');
            });
            $('.pager li:first-child').addClass('active');

            $('.pager li').on('click', function () {
               var pagerIndex = $(this).index();
                carousel.videoContainer.animate({
                    left: -carousel.getSlideWidth() * pagerIndex
                }, 200, function () {
                });
                $('.pager li').removeClass('active');
                $(this).addClass('active');
            })
        }
    };
    carousel.init();
});

