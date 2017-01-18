
$('document').ready(function () {
    var carousel = {
        init : function () {
            carousel.slideMath();
            carousel.directionalNav();
            carousel.pager();
            carousel.wresize();
            carousel.slideWidthMove();
        },
        videoContainer : $('.video-slider'),
        slide : $('.video-slider li'),
        slideMath : function () {
            var slideLength = carousel.slide.length;
            var videoContainerWidth = 100 * slideLength+'%';
            var slideWidth = 100 / slideLength+'%';

            carousel.slide.width(slideWidth) ;
            carousel.videoContainer.css({width: videoContainerWidth, "marginLeft": "-100%"});
        },
         slideWidthMove : function () {
             return carousel.slide.outerWidth();
         },
        wresize : function(){
            $(window).resize(function () {
            });
        },
        slideLeft : function(){
            carousel.videoContainer.animate({
                left: "-"+carousel.slideWidthMove()
            }, 200, function () {
                $('.video-slider li:first-child').appendTo(carousel.videoContainer);
                $(carousel.videoContainer).css('left', '');
            });
        },
        slideRight : function(){
            carousel.videoContainer.animate({
                left: "+"+carousel.slideWidthMove()
            }, 200, function () {
                $('.video-slider li:last-child').prependTo(carousel.videoContainer);
                $(carousel.videoContainer).css('left', '');
            });
        },
        directionalNav : function () {
            var nextArrow = $('.next');
            var previousArrow = $('.previous');

            $('.video-slider li:last-child').prependTo(carousel.videoContainer);

            nextArrow.on('click', function () {
                carousel.slideLeft();
            });
            previousArrow.on('click', function () {
                carousel.slideRight();
            });
        }
    };
    carousel.init();
});

