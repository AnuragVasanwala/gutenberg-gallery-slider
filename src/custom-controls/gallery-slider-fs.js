/** Maintains index of slide in view */
var slide_index = 0;

/** Auto transition config */
var transition_timer;

/** Attach handlers on DOM Loaded */
document.addEventListener('DOMContentLoaded', function (event) {
    /** Attach Navigation Handler */
    if (document.getElementById('gallery-slider-next-btn') !== null ){
        document.getElementById('gallery-slider-next-btn').addEventListener('click', function (eventObj) {
            increment_slide(1);
        });
    
        document.getElementById('gallery-slider-prev-btn').addEventListener('click', function (eventObj) {
            increment_slide(-1);
        });
    }
    
    /** Attach Video Auto-PlayPause Handler */
    var slides = document.getElementsByClassName("rt-gallery-slider");
    for (var i = 0; i < slides.length; i++) {
        if (slides[i].childNodes[0].tagName.toLowerCase() == "video") {
            slides[i].childNodes[0].addEventListener('mouseenter', function (eventObj) {
                play_video(false);
            });
            slides[i].childNodes[0].addEventListener('mouseleave', function (eventObj) {
                play_video();
            });
        }
    }

    /** Attach Indicator Handler */
    var indicators = document.getElementsByClassName("rt-gallery-slider-indicator");
    for (var i = 0; i < indicators.length; i++) {
        indicators[i].addEventListener('click', seek_slide);
    }

    /** Start `slide_loop` for Auto Transition */
    slide_loop();
    
    console.log("Document Ready!");
});


/**
 * Brings the slide in view by increment/decrement number
 * @param {int} increment_by Slides to be increment or Decrement
 */
 function increment_slide(increment_by) {
    var slides = document.getElementsByClassName("rt-gallery-slider");

    /** Map index inside boundry */
    if (slide_index < 0) { slide_index = slides.length - 1 }
    if (slide_index >= slides.length) { slide_index = 0 }
    
    /** Stop Video */
    if (slides.length > 0 && slides[slide_index].childNodes[0].tagName.toLowerCase() == "video"){
        slides[slide_index].childNodes[0].pause();
    }

    increment_by = parseInt(increment_by);
    slide_index += increment_by;
    slide_loop(false, true);
}

/**
 * Brings specified slide into view
 */
function seek_slide() {
    var slides = document.getElementsByClassName("rt-gallery-slider");

    /** Map index inside boundry */
    if (slide_index < 0) { slide_index = slides.length - 1 }
    if (slide_index >= slides.length) { slide_index = 0 }
    
    /** Stop Video */
    if (slides.length > 0 && slides[slide_index].childNodes[0].tagName.toLowerCase() == "video"){
        slides[slide_index].childNodes[0].pause();
    }
    
    var slide_number = parseInt(this.getAttribute("target"));
    slide_number = parseInt(slide_number);
    slide_index = slide_number;
    slide_loop(true, true);
}

/**
 * Performs auto and user specified transition
 */
function slide_loop(auto_increment_slide = true, force = false) {
    /** Retrive slides and indicators */
    var slides = document.getElementsByClassName("rt-gallery-slider");
    var indicators = document.getElementsByClassName("rt-gallery-slider-indicator");

    /** Retrive transition configurations */
    var transition_time = document.getElementById("transition_time_ms");
    var transition_disabled = document.getElementById("transition_disabled");

    /** Create timer only if auto_transition is enabled */
    if (transition_time === null || transition_time.value >= 2000 || slides.length === 0) {
        /** Clear old timer and register new one */
        clearTimeout(transition_timer);

        if (transition_time === null) {
            transition_timer = setTimeout(slide_loop, 2000); // Change image every 2 seconds
        }
        else {
            transition_timer = setTimeout(slide_loop, transition_time.value); // Change image every 2 seconds
        }
    }

    /** Return if no slides are available */
    if (slides.length === 0 || transition_disabled !== null) return;

    /** Clear slides & indicators from view */
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";

        if (indicators.length > 0) {
            indicators[i].className = indicators[i].className.replace(" rt-gallery-slider-indicator-active", "");
        }
    }

    /** Map index inside boundry */
    if (slide_index < 0) { slide_index = slides.length - 1 }
    if (slide_index >= slides.length) { slide_index = 0 }

    /** Assign new slide and highlight indicator */
    slides[slide_index].style.display = "block";

    if (indicators.length > 0) {
        indicators[slide_index].className += " rt-gallery-slider-indicator-active";
    }

    if (slides[slide_index].childNodes[0].tagName.toLowerCase() == "video"){
        clearTimeout(transition_timer);
        
        slides[slide_index].childNodes[0].currentTime = 0;
        var promise = slides[slide_index].childNodes[0].play();
        
        if (promise !== undefined) {
            promise.catch(error => {
                slides[slide_index].childNodes[0].setAttribute("controls","controls");
            }).then(() => {
                slides[slide_index].childNodes[0].removeAttribute("controls");
            });
        }

        slides[slide_index].childNodes[0].onended = function(){increment_slide(1);};
        return;
    }

    /** Increment slide index by one */
    if (auto_increment_slide === true) {
        slide_index++;
    }
}

/**
 * Play or pause video on given slide
 * @param {int} index Slide Index
 * @param {boolean} play Play?
 */
function play_video(play = true) {
    /** Retrive slides */
    var slides = document.getElementsByClassName("rt-gallery-slider");
    var promise;

    if ( play ) {
        promise = slides[slide_index].childNodes[0].play();
    } else {
        promise = slides[slide_index].childNodes[0].pause();
    }

    if (promise !== undefined) {
        promise.catch(error => {
            slides[slide_index].childNodes[0].setAttribute("controls", "controls");
        }).then(() => {
            slides[slide_index].childNodes[0].removeAttribute("controls");
        });
    }
}