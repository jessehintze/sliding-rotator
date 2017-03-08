// wishlist
//    slide to the end instead so there is no space at the end
//    rotate all the way through
//    when you resize make it so you don't have to start over // redraw slider
//    on touch have it move with finger
// get a slide count, work off pager

(function($){
    $.fn.mwCarousel = function(options){
        var defaults = {
            mode: 'single', // The options are single or multi. Single has one slider per viewport multi will have as many as will fit.
            speed: 200,
            pager: true,
            directionNav: false
        };
        var settings = $.extend({}, defaults, options);
        return this.each(function() {
            var sliderContainer = $(this);
            var slide =  sliderContainer.children();
            var windowLoad = window.innerWidth;
            sliderContainer.wrap('<div class="slide-viewport"></div>');
            // figure out how many visible slides there are
            var slideWidth = slide.outerWidth();
            var sliderOuterWrapperWidth = $('.slide-viewport').outerWidth();
            var visibleSlides = Math.floor(sliderOuterWrapperWidth / slideWidth);

            // how many slides in each carousel
            var slideCount = slide.length;
            var slideViewCount = Math.ceil(slideCount / visibleSlides) ;
            var carousel = {
                init : function () {
                    carousel.wresize();
                    if (settings.directionNav){
                        carousel.directionalNav();
                    }
                    carousel.touchEvent();
                    if(settings.mode === 'single'){
                        if(windowLoad < 768){
                            carousel.slideMath();
                        }
                    } else if (settings.mode === 'multi'){
                        carousel.slideMathCarousel();
                    }
                    if(settings.pager){
                        carousel.pager();
                    }
                    carousel.slideSetup();
                },
                slideSetup : function () {
                    slide.eq(0).addClass('current');
                    sliderContainer.css({left: -sliderOuterWrapperWidth})
                },
                slideMath : function () {
                    carousel.cloneSlides();
                    var slideLength = sliderContainer.find('li').length;
                    var sliderContainerWidth = 100 * slideLength+'%';
                    // equally divide each slide so that they scale down responsively
                    var slideWidth = 100 / slideLength+'%';
                    // set the slide width
                    sliderContainer.find('li').width(slideWidth);
                    // set the container width
                    sliderContainer.css({width: sliderContainerWidth});
                },
                // set the width of the slider containers
                slideMathCarousel : function () {
                    carousel.cloneSlides();
                    var slideLength = sliderContainer.find('li').length;
                    var slideWidth = slide.outerWidth();
                    // factor this in to add a clone before and after
                    // var sliderContainerWidth = slideWidth * slideLength + (slideWidth * 2) +'px';
                    var sliderContainerWidth = slideWidth * slideLength +'px';
                    sliderContainer.css({width: sliderContainerWidth});
                },
                cloneSlides : function(){
                    var slice = visibleSlides,
                        sliceAppend  = slide.slice(0, slice).clone().addClass('clone'),
                        slicePrepend = slide.slice(-slice).clone().addClass('clone');
                    sliderContainer.append(sliceAppend).prepend(slicePrepend);
                },
                // return the distance the slide should travel based off of the slider viewport
                slideWidthCarousel : function () {
                    var visibleSlidesMovement = visibleSlides * slideWidth;
                    return visibleSlidesMovement;
                },
                wresize : function(){
                    $(window).resize(function () {
                        var wwindow = window.innerWidth;
                        if(settings.mode === 'single') {
                            $(sliderContainer).css('left', '');
                            $('.pager li').removeClass('active');
                            $('.pager li:first-child').addClass('active');
                            slide.removeClass('current');
                            slide.eq(0).addClass('current');
                            setTimeout(function () {
                                if (wwindow > 767) {
                                    sliderContainer.css({width: ''});
                                    slide.css({width: ''});
                                } else if (wwindow < 768) {
                                    carousel.slideMath();
                                }
                            }, 500);
                        }
                    });
                },
                animateLeft : function(){
                    sliderContainer.animate({
                        left: "-="+carousel.slideWidthCarousel()
                    }, settings.speed);
                },
                animateRight : function(){
                    sliderContainer.animate({
                        left: "+="+carousel.slideWidthCarousel()
                    }, settings.speed);
                },
                slideLeft : function () {
                    var currentIndex = sliderContainer.find('.current').index();
                    // get the position of the of carousel wrapper and if it's larger than the width send it back to the start
                    var sliderPosition = sliderContainer.position().left;
                    var sliderWidth = sliderContainer.outerWidth();
                    var slideWidth = slide.outerWidth();

                    // if position is > container send it to the right

                    var positionStop = -(sliderWidth - carousel.slideWidthCarousel() - slideWidth);
                    if(sliderPosition >= positionStop){
                        sliderContainer.parent().find('.pager li').removeClass('active');
                        sliderContainer.parent().find('.pager li').eq(currentIndex + 1).addClass('active');
                        sliderContainer.find('.current').next().addClass('current');
                        slide.eq(currentIndex).removeClass('current');
                        carousel.animateLeft();
                    } else {
                        sliderContainer.parent().find('.pager li').removeClass('active');
                        sliderContainer.parent().find('.pager li').eq(0).addClass('active');
                        sliderContainer.animate({
                            left:  0
                        }, settings.speed);
                        slide.eq(0).addClass('current');
                        slide.eq(currentIndex).removeClass('current');
                    }
                },
                slideRight : function () {
                    var slideCount = slide.length;
                    var currentIndex = sliderContainer.find('.current').index();
                    var sliderPosition = sliderContainer.position().left;
                    sliderContainer.parent().find('.pager li').removeClass('active');
                    sliderContainer.parent().find('.pager li').eq(currentIndex - 1).addClass('active');
                    if(sliderPosition < 0){
                        sliderContainer.find('.current').prev().addClass('current');
                        slide.eq(currentIndex).removeClass('current');
                        carousel.animateRight();
                    } else {
                        // do some math to land on the last page of slides for multimode

                        // check to see what group of slides you are on.
                        // set a reference for what group of slides you are on
                        // probably through a pager is the best way
                        // if on the last slide navigate to the end then reset the position to the beginning

                        var slideContainerWidth = sliderContainer.outerWidth();
                        var viewPortCount = Math.floor(slideContainerWidth / carousel.slideWidthCarousel());
                        if(settings.mode === 'multi'){
                            if (viewPortCount <= 3) {
                                sliderContainer.animate({
                                    left: -(carousel.slideWidthCarousel() * viewPortCount)
                                }, settings.speed);
                            } else {
                                sliderContainer.animate({
                                    left: -(carousel.slideWidthCarousel() * viewPortCount - slide.outerWidth())
                                }, settings.speed);
                            }
                        } else {
                            sliderContainer.animate({
                                left:  -(carousel.slideWidthCarousel() * slideCount - slide.outerWidth())
                            }, settings.speed);
                        }

                    }
                    slide.eq(slideCount -1).addClass('current');
                    slide.eq(currentIndex).removeClass('current');
                },
                directionalNav : function () {
                    sliderContainer.parent().append('<div class="direction-nav"><span class="previous">Previous</span><span class="next">Next</span></div>');
                    var nextArrow = $('.next');
                    var previousArrow = $('.previous');
                    sliderContainer.parent().find(nextArrow).on('click', function () {
                        carousel.slideLeft();
                    });
                    sliderContainer.parent().find(previousArrow).on('click', function () {
                        carousel.slideRight();
                    });
                },
                pager : function () {
                    var pager = $('.pager');
                    sliderContainer.after('<ul class="pager"></ul>');
                    var thisPager = sliderContainer.parent().find('.pager');
                    if(settings.mode === 'multi'){
                        for(var i = 0; i < slideViewCount; i++){
                            thisPager.append('<li></li>');
                        }
                    } else {
                        slide.each(function () {
                            thisPager.append('<li></li>');
                        });
                    }
                    $('.pager li:first-child').addClass('active');
                    $('.pager li').on('click', function () {
                        var pagerIndex = $(this).index();
                        if($(this).hasClass('active')){
                            return;
                        } else {
                            slide.removeClass('current');
                            slide.eq(pagerIndex).addClass('current');
                            if(settings.mode === 'multi') {
                                sliderContainer.animate({
                                    left: -(carousel.slideWidthCarousel() * pagerIndex) - carousel.slideWidthCarousel()
                                }, 200);
                            } else {
                                sliderContainer.animate({
                                    left: -carousel.slideWidthCarousel() * (pagerIndex + 1)
                                }, 200);
                            }
                            sliderContainer.parent().find('.pager li').removeClass('active');
                            $(this).addClass('active');
                        }
                    });
                },
                touchEvent : function () {
                    var csAnimating = 0,
                        sigtouchstartx,
                        sigtouchmovex,
                        sigmovex;
                    sliderContainer.on('touchstart', slide.find('current') , function(event){
                        sigtouchstartx =  event.originalEvent.touches[0].pageX;
                    }).on('touchmove', slide, function(event){
                        sigtouchmovex = event.originalEvent.touches[0].pageX;
                        sigmovex = (sigtouchmovex - sigtouchstartx);
                        // sliderContainer.css('left',sigmovex);
                    }).on('touchend', slide.find('current'), function(){
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
    };
    $('.video-slider').mwCarousel({
        speed: 200,
        pager: true,
        mode: 'multi',
        directionNav: true
    });
    $('.img-slider').mwCarousel({
        speed: 200,
        pager: true,
        mode: 'single',
        directionNav: true
    });
}(jQuery));

