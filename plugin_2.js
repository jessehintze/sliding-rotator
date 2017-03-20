// wishlist
//    slide to the end instead so there is no space at the end
//    rotate all the way through
//    when you resize make it so you don't have to start over // redraw slider
//    on touch have it move with finger
// get a slide count, work off pager
// add a destroy function
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

            // global width varibles
            var slideWidth = slide.outerWidth();
            var sliderOuterWrapperWidth = $('.slide-viewport').outerWidth();

            // figure out how many visible slides there are
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
                    carousel.cloneSlides();
                    carousel.touchEvent();
                    if(settings.mode === 'single'){
                        // if(windowLoad < 768){
                        //     carousel.slideMath();
                        // }
                        carousel.slideMath();

                    } else if (settings.mode === 'multi'){
                        carousel.slideMathCarousel();
                    }
                    if(settings.pager){
                        carousel.pager();
                    }
                    carousel.slideSetup();
                },
                slideSetup : function () {
                    // move the slider left to account for the cloned slides
                    sliderContainer.css({left: -sliderOuterWrapperWidth})
                },
                // set the width of the individual image slider containers
                slideMath : function () {
                    var slideLength = sliderContainer.find('li').length;
                    var sliderContainerWidth = 100 * slideLength+'%';
                    // equally divide each slide so that they scale down responsively
                    var singleSlideWidth = 100 / slideLength+'%';
                    // set the slide width
                    sliderContainer.find('li').width(singleSlideWidth);
                    // set the container width
                    sliderContainer.css({width: sliderContainerWidth});
                },
                // set the width of the multiple slider containers
                slideMathCarousel : function () {
                    var slideLength = sliderContainer.find('li').length;
                    var singleSlideWidth = slide.outerWidth();
                    var sliderContainerWidth = singleSlideWidth * slideLength +'px';
                    sliderContainer.css({width: sliderContainerWidth});
                },
                cloneSlides : function(){
                    // select the slides that are in the viewport and put them at the start and end
                    var slice = visibleSlides,
                        sliceAppend  = slide.slice(0, slice).clone().addClass('clone'),
                        slicePrepend = slide.slice(-slice).clone().addClass('clone');
                    sliderContainer.append(sliceAppend).prepend(slicePrepend);
                },
                // return the distance the slide should travel based off of the slider viewport
                slideWidthCarousel : function () {
                    var thisSlideWidth = slide.outerWidth();
                    var thisVisibleSlides = Math.floor(sliderOuterWrapperWidth / thisSlideWidth);
                    var visibleSlidesMovement = thisVisibleSlides * thisSlideWidth;
                    return visibleSlidesMovement;
                },
                wresize : function(){
                    $(window).resize(function () {
                        var wwindow = window.innerWidth;
                        if(settings.mode === 'single') {
                            // need to fix position so it doesn't move on resize
                            // $(sliderContainer).css('left', -sliderOuterWrapperWidth);
                            // $('.pager li').removeClass('active');
                            // $('.pager li:first-child').addClass('active');

                            setTimeout(function () {
                                // if (wwindow > 767) {
                                //     sliderContainer.css({width: ''});
                                //     slide.css({width: ''});
                                // } else if (wwindow < 768) {
                                //     carousel.slideMath();
                                // }
                                carousel.slideMath();

                            }, 500);
                            carousel.repositionSlider();

                        }
                    });
                },
                repositionSlider : function () {
                    // get what count visible slide is on

                    var checkViewportWidth = $('.slide-viewport').outerWidth();
                    var slideIndex = sliderContainer.parent().find('.pager li.active').index();
                    var positionMath = -(slideIndex + 1) * checkViewportWidth;

                    sliderContainer.css('left', positionMath)

                },
                animateLeft : function(after){
                    sliderContainer.animate({
                        left: "-="+carousel.slideWidthCarousel()
                    }, settings.speed, function () {
                        sliderContainer.css('left', after)
                    });
                },
                animateRight : function(after){
                    sliderContainer.animate({
                        left: "+="+carousel.slideWidthCarousel()
                    }, settings.speed, function () {
                        sliderContainer.css('left', after)
                    });
                },
                slideLeft : function () {
                    var thisPager = sliderContainer.parent().find('.pager li');
                    var currentIndex = sliderContainer.parent().find('.active').index();
                    var lastIndex = sliderContainer.parent().find('.pager li').last().index();

                    if(currentIndex === lastIndex){
                        carousel.animateLeft(-sliderOuterWrapperWidth);
                        thisPager.removeClass('active');
                        thisPager.eq(0).addClass('active');
                    } else {
                        carousel.animateLeft();
                        thisPager.removeClass('active');
                        thisPager.eq(currentIndex + 1).addClass('active');
                    }
                },
                slideRight : function () {
                    var thisPager = sliderContainer.parent().find('.pager li');
                    var currentIndex = sliderContainer.parent().find('.active').index();
                    var lastIndex = sliderContainer.parent().find('.pager li').last().index();

                    if(currentIndex + lastIndex  === lastIndex){
                        carousel.animateRight(-(sliderOuterWrapperWidth * slideViewCount));
                        thisPager.removeClass('active');
                        thisPager.eq(lastIndex).addClass('active');

                    } else {
                        carousel.animateRight();
                        thisPager.removeClass('active');
                        thisPager.eq(currentIndex - 1).addClass('active');
                    }
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

