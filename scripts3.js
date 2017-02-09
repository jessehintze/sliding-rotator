$('document').ready(function () {
    var carousel = {
        init : function () {
            carousel.directionalNav();
            carousel.wresize();
            carousel.slideWidthMove();
            carousel.touchEvent();
            carousel.pager();
            var wwindow = window.innerWidth;
            if(wwindow < 768){
                carousel.slideMath();
            }
        },
        videoContainer : $('.video-slider'),
        slide : $('.video-slider li'),
        slideMath : function () {
            var slideLength = carousel.slide.length;
            var videoContainerWidth = 100 * slideLength+'%';
            var slideWidth = 100 / slideLength+'%';
            carousel.slide.eq(0).addClass('current');
            carousel.slide.width(slideWidth) ;
            carousel.videoContainer.css({width: videoContainerWidth});
        },
         slideWidthMove : function () {
             return carousel.slide.outerWidth();
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
                left: "-="+carousel.slideWidthMove()
            }, 200);
        },
        animateRight : function(){
            carousel.videoContainer.animate({
                left: "+="+carousel.slideWidthMove()
            }, 200);
        },
        slideLeft : function () {
            var slideCount = carousel.slide.length;
            var currentIndex = carousel.videoContainer.find('.current').index();
            $('.pager li').removeClass('active');
            $('.pager li').eq(currentIndex + 1).addClass('active');
            if(currentIndex +1 < slideCount){
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
            if(currentIndex > 0){
                carousel.videoContainer.find('.current').prev().addClass('current');
                carousel.slide.eq(currentIndex).removeClass('current');
                carousel.animateRight();
            } else {
                carousel.videoContainer.animate({
                    left:  - carousel.slideWidthMove() * slideCount + carousel.slideWidthMove()
                }, 300);
                carousel.slide.eq(slideCount -1).addClass('current');
                carousel.slide.eq(currentIndex).removeClass('current');
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
            carousel.videoContainer.on('touchstart', carousel.slide , function(event){
                sigtouchstartx =  event.originalEvent.touches[0].pageX;
            }).on('touchmove', carousel.slide, function(event){
                sigtouchmovex = event.originalEvent.touches[0].pageX;
                sigmovex = (sigtouchmovex - sigtouchstartx);
                // carousel.videoContainer.css('left',sigmovex);
            }).on('touchend', carousel.slide, function(){
                if(sigtouchmovex<sigtouchstartx && sigtouchmovex!=undefined && csAnimating==0 && sigmovex< -125){
                    carousel.slideLeft();
                }else if(sigtouchmovex>sigtouchstartx && sigtouchmovex!=undefined && csAnimating==0 && sigmovex>125){
                    carousel.slideRight();
                }
                sigtouchmovex = 0;
                sigtouchstartx = 0;
                sigmovex = 0;
                // $btn.off();

            });
        }
    };
    carousel.init();
});

