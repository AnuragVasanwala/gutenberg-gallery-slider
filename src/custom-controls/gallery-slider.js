/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './gallery-slider-style.scss';

import { MediaPlaceholder, URLInput, PlainText } from '@wordpress/block-editor';

var component_selected;

export default function gallery_slider(is_editor_block, isSelected, attributes, setAttributes = null) {
    var resultant_DOM = [];
    component_selected = isSelected;

    //clearTimeout( transition_timer );

    if (is_editor_block && setAttributes !== null) {
        const ALLOWED_MEDIA_TYPES = ['image', 'video'];

        if (isSelected) {
            resultant_DOM.push(
                <MediaPlaceholder key="gallery-slider-mph"
                    onSelect={(value) => { setAttributes({ medias: value }) }}
                    render={({ open }) => {
                        // return <img
                        //     src='' alt='x123'
                        //     onClick={open}
                        // />;
                    }}
                    allowedTypes={ALLOWED_MEDIA_TYPES}
                    multiple={'add'}
                />
            );
        }
    }

    resultant_DOM.push(
        <div key="gallery-slider-container" className="slideshow-container">
            {render_medias(attributes, setAttributes)}
            {render_arrows(attributes.show_arrows)}
        </div>
    );

    resultant_DOM.push(<br key="gallery-slider-linebreak" />);

    resultant_DOM.push(
        <div key="gallery-slider-indicators-container" className="slideshow-indicators">
            {render_indicators((attributes.medias !== undefined) ? attributes.medias.length : 0, attributes.show_indicators)}
        </div>
    );

    if (attributes.auto_transition == false) {
        attributes.transition_time_ms = 0;
    }

    resultant_DOM.push(
        <input type="hidden" key="gallery-slider-congif-transition_time_ms" id="transition_time_ms" name="transition_time_ms" value={attributes.transition_time_ms} />
    );

    return resultant_DOM;
}

function render_arrows(show_arrows) {
    var resultant_DOM = [];

    if (show_arrows === true) {
        resultant_DOM.push(<p key="gallery-slider-nav-next-btnx" id={"gallery-slider-prev-btn"} className="prev" onClick={() => increment_slide(-1)}>&#10094;</p>);
        resultant_DOM.push(<p key="gallery-slider-nav-prev-btnx" id={"gallery-slider-next-btn"} className="next" onClick={() => increment_slide(1)}>&#10095;</p>);
    }

    return resultant_DOM;
}

function render_medias(params, setAttributes) {
    //const { medias, captions, setState } = params;
    
    if (params.medias === undefined) return;
    
    var resultant_DOM = [];
    //captions = (captions === undefined)?[]:captions;

    for (let index = 0; index < params.medias.length; index++) {
        const element = params.medias[index];
        //params.captions.push(element.title);

        if (element.type === "image") {
            if (component_selected) {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <img src={element.url} />
                        <div className="textEditor">
                            <PlainText
                                className="textEditor"
                                value={ "hello" }
                                onChange={ ( content ) => {
                                    console.log(content);
                                    
                                 } }
                            />
                        </div>
                    </div>
                );
            } else {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <img src={element.url} />
                        <div className="text">{element.title}</div>
                    </div>
                );
            }
            


        } else {
            resultant_DOM.push(
                <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                    <video src={element.url} />
                    <div className="text">{element.title}</div>
                </div>
            );
        }
    }
    return resultant_DOM;
}

function render_indicators(n, show_indicators) {
    var resultant_DOM = [];

    if (show_indicators === true) {
        for (let index = 0; index < n; index++) {
            const element = n;
            resultant_DOM.push(<span key={"gallery-slider-indicator-" + index} className="indicator" target={index} onClick={() => seek_slide(index)} />)
        }
    }

    return resultant_DOM;
}

/** EDITOR FRONT-END SIDE SCRIPTS ---------------------------------------------------- */
/** Maintains index of slide in view */
var slide_index = 0;

/** Auto transition config */
var transition_timer;

slide_loop();

/**
 * Brings the slide in view by increment/decrement number
 * @param {int} increment_by Slides to be increment or Decrement
 */
function increment_slide(increment_by) {
    increment_by = parseInt(increment_by);
    slide_index += increment_by;
    slide_loop(false, true);
}

/**
 * Brings specified slide into view
 * @param {int} slide_number Slide to bring into view
 */
function seek_slide(slide_number) {
    slide_number = parseInt(slide_number);
    slide_index = slide_number;
    slide_loop(true, true);
}

/**
 * Performs auto and user specified transition
 */
function slide_loop(auto_increment_slide = true, force = false) {
    /** Retrive slides and indicators */
    var slides = document.getElementsByClassName("rt_gallery_slider");
    var indicators = document.getElementsByClassName("indicator");

    /** Retrive transition configurations */
    var transition_time = document.getElementById("transition_time_ms");

    /** Create timer only if auto_transition is enabled */
    if (transition_time === null || transition_time.value >= 2000 || slides.length === 0) {
        /** Clear old timer and register new one */
        clearTimeout(transition_timer);

        if (transition_time === null || (component_selected && !force)) {
            transition_timer = setTimeout(slide_loop, 2000); // Change image every 2 seconds
        }
        else {
            transition_timer = setTimeout(slide_loop, transition_time.value); // Change image every 2 seconds
        }
    }
    console.log(component_selected);
    if ( component_selected && !force ) return;

    /** Return if no slides are available */
    if (slides.length === 0) return;

    /** Clear slides & indicators from view */
    for (var i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";

        if (indicators.length > 0) {
            indicators[i].className = indicators[i].className.replace(" active", "");
        }
    }

    /** Map index inside boundry */
    if (slide_index < 0) { slide_index = slides.length - 1 }
    if (slide_index >= slides.length) { slide_index = 0 }

    /** Assign new slide and highlight indicator */
    slides[slide_index].style.display = "block";

    if (indicators.length > 0) {
        indicators[slide_index].className += " active";
    }

    /** Increment slide index by one */
    if (auto_increment_slide === true) {
        slide_index++;
    }
}


/** ------------- Popover ----------------- */
import { Button, Popover } from '@wordpress/components';
import { withState } from '@wordpress/compose';
 
const MyPopover = withState( {
    isVisible: false,
} )( ( { isVisible, setState } ) => {
    const toggleVisible = () => {
        setState( ( state ) => ( { isVisible: ! state.isVisible } ) );
    };
    return (
        <Button isSecondary onClick={ toggleVisible }>
            Toggle Popover!
            { isVisible && <Popover>Popover is toggled!</Popover> }
        </Button>
    );
} );