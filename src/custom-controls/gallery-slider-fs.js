/** Maintains index of slide in view */
var slide_index = 0;

/** Auto transition config */
var transition_timer;

document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById('gallery-slider-next-btn').addEventListener('click', function (eventObj) {
        increment_slide(1);
    });

    document.getElementById('gallery-slider-prev-btn').addEventListener('click', function (eventObj) {
        increment_slide(-1);
    });

    var elements = document.getElementsByClassName("indicator");

    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', seek_slide);
    });

    slide_loop();
});

/**
 * Brings the slide in view by increment/decrement number
 * @param {int} increment_by Slides to be increment or Decrement
 */
function increment_slide(increment_by) {
    increment_by = parseInt(increment_by);
    slide_index += increment_by;
    slide_loop( false );
}

/**
 * Brings specified slide into view
 */
function seek_slide() {
    var slide_number = parseInt(this.getAttribute("target"));
    slide_number = parseInt(slide_number);
    slide_index = slide_number;
    slide_loop();
}

/**
 * Performs auto and user specified transition
 */
 function slide_loop( auto_increment_slide = true ) {
    /** Retrive slides and indicators */
    var slides = document.getElementsByClassName("rt_gallery_slider");
    var indicators = document.getElementsByClassName("indicator");

    /** Retrive transition configurations */
    var transition_time = document.getElementById("transition_time_ms");
    
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
    if (slides.length === 0) return;

    /** Clear slides & indicators from view */
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";

        if ( indicators.length > 0 ) {
            indicators[i].className = indicators[i].className.replace(" active", "");
        }
    }

    /** Map index inside boundry */
    if (slide_index < 0) { slide_index = slides.length - 1 }
    if (slide_index >= slides.length) { slide_index = 0 }

    /** Assign new slide and highlight indicator */
    slides[slide_index].style.display = "block";

    if ( indicators.length > 0 ) {
        indicators[slide_index].className += " active";
    }

    /** Increment slide index by one */
    if ( auto_increment_slide === true ) {
        slide_index++;
    }
}