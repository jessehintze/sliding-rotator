$('document').ready(function () {
    var carousel = {



        init : function (sliderClass, sliderWrapperClass) {
            carousel.directionalNav();
            // carousel.wresize();
            carousel.slideWidthMove();
            carousel.touchEvent();
            // carousel.pager();
            carousel.slideMathCarousel();
            // carousel.cloneSlides();
            carousel.slideSetup();
            var wwindow = window.innerWidth;
            // if(wwindow < 768){
            //     carousel.slideMath();
            // }
        },
        sliderOuterWrapper : $('.video-wrapper'),
        videoContainer : $('.video-slider'),
        slide : $('.video-slider li'),
        slideSetup : function () {
            carousel.slide.eq(0).addClass('current');
            carousel.slide.first().addClass('first');
            carousel.slide.last().addClass('last');
        },
        slideMath : function () {
            var slideLength = carousel.slide.length;
            var videoContainerWidth = 100 * slideLength+'%';
            var slideWidth = 100 / slideLength+'%';
            carousel.slide.width(slideWidth) ;
            carousel.videoContainer.css({width: videoContainerWidth});
        },
        slideMathCarousel : function () {
            var slideLength = carousel.slide.length;
            var slideWidth = carousel.slide.outerWidth();
            // factor this in to add a clone before and after
            // var videoContainerWidth = slideWidth * slideLength + (slideWidth * 2) +'px';
            var videoContainerWidth = slideWidth * slideLength +'px';
            carousel.videoContainer.css({width: videoContainerWidth});
        },
        slideWidthMove : function () {
            return carousel.slide.outerWidth();
        },
        slideWidthCarousel : function () {
            var slideWidth = carousel.slide.outerWidth();
            var sliderOuterWrapperWidth = carousel.sliderOuterWrapper.outerWidth();
            var visibleSlides = Math.floor(sliderOuterWrapperWidth / slideWidth);
            var visibleSlidesMovement = visibleSlides * slideWidth;
            return visibleSlidesMovement;
        },
        wresize : function(){
            $(window).resize(function () {
                var wwindow = window.innerWidth;
                $(carousel.videoContainer).css('left', '');
                $('.pager li').removeClass('active');
                $('.pager li:first-child').addClass('active');
                carousel.slide.removeClass('current');
                carousel.slide.eq(0).addClass('current');
                setTimeout(function () {
                    if(wwindow > 767){
                        carousel.videoContainer.css({width: ''});
                        carousel.slide.css({width: ''});
                    } else if (wwindow < 768){
                        carousel.slideMath();
                    }
                }, 500);
            });
        },
        animateLeft : function(){
            carousel.videoContainer.animate({
                left: "-="+carousel.slideWidthCarousel()
            }, 200);
        },
        animateRight : function(){
            carousel.videoContainer.animate({
                left: "+="+carousel.slideWidthCarousel()
            }, 200);
        },
        slideLeft : function () {
            var currentIndex = carousel.videoContainer.find('.current').index();
            // get the position of the of carousel wrapper and if it's larger than the width send it back to the start
            var sliderPosition = carousel.videoContainer.position().left;
            var sliderWidth = carousel.videoContainer.outerWidth();
            var slideWidth = carousel.slide.outerWidth();
            var positionStop = -(sliderWidth - carousel.slideWidthCarousel() - slideWidth);
            if(sliderPosition >= positionStop){
                $('.pager li').eq(currentIndex + 1).addClass('active');
                carousel.videoContainer.find('.current').next().addClass('current');
                carousel.slide.eq(currentIndex).removeClass('current');
                carousel.animateLeft();
            } else {
                $('.pager li').eq(0).addClass('active');
                carousel.videoContainer.animate({
                    left:  0
                }, 300);
                carousel.slide.eq(0).addClass('current');
                carousel.slide.eq(currentIndex).removeClass('current');
            }
        },
        slideRight : function () {
            var slideCount = carousel.slide.length;
            var currentIndex = carousel.videoContainer.find('.current').index();
            $('.pager li').removeClass('active');
            $('.pager li').eq(currentIndex - 1).addClass('active');

            var sliderPosition = carousel.videoContainer.position().left;


            if(sliderPosition < 0){
                carousel.animateRight();
            } else {
                carousel.videoContainer.animate({
                    left:  - carousel.slideWidthMove() * slideCount + carousel.slideWidthMove()
                }, 300);
            }
        },
        directionalNav : function () {
            var nextArrow = $('.next');
            var previousArrow = $('.previous');
            nextArrow.on('click', function () {
                carousel.slideLeft();
            });
            previousArrow.on('click', function () {
                carousel.slideRight();
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
                if($(this).hasClass('active')){
                    return;
                } else {
                    carousel.slide.removeClass('current');
                    carousel.slide.eq(pagerIndex).addClass('current');
                    carousel.videoContainer.animate({
                        left: -carousel.slideWidthMove() * pagerIndex
                    }, 200);
                    $('.pager li').removeClass('active');
                    $(this).addClass('active');
                }
            })
        },
        touchEvent : function () {
            var csAnimating = 0,
                sigtouchstartx,
                sigtouchmovex,
                sigmovex;
            carousel.videoContainer.on('touchstart', carousel.slide.find('current') , function(event){
                sigtouchstartx =  event.originalEvent.touches[0].pageX;
            }).on('touchmove', carousel.slide, function(event){
                sigtouchmovex = event.originalEvent.touches[0].pageX;
                sigmovex = (sigtouchmovex - sigtouchstartx);
                // carousel.videoContainer.css('left',sigmovex);
            }).on('touchend', carousel.slide.find('current'), function(event){
                if(sigtouchmovex<sigtouchstartx && sigtouchmovex!=undefined && csAnimating==0 && sigmovex< -125){
                    carousel.slideLeft();
                }else if(sigtouchmovex>sigtouchstartx && sigtouchmovex!=undefined && csAnimating==0 && sigmovex>125){
                    carousel.slideRight();
                }
                sigtouchmovex = 0;
                sigtouchstartx = 0;
                sigmovex = 0;
            });
        }
    };
    carousel.init();
});

