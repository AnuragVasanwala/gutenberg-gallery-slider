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
                    onSelect={(value) => { 

                        /** Retrive original title */
                        var new_captions = [];

                        for (let index = 0; index < value.length; index++) {
                            const element = value[index];
                            new_captions.push(element.title);
                        }

                        /** Set captions & medias */
                        setAttributes({ captions: new_captions })
                        setAttributes({ medias: value })
                    }}
                    render={({ open }) => {
                        console.log(open);
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

    /** Render Medias and Arrows */
    resultant_DOM.push(
        <div key="gallery-slider-container" className="slideshow-container">
            {render_medias(attributes, setAttributes)}
            {render_arrows(attributes.show_arrows)}
        </div>
    );

    /** Render Indicators */
    resultant_DOM.push(
        <div key="gallery-slider-indicators-container" className="slideshow-indicators">
            {render_indicators((attributes.medias !== undefined) ? attributes.medias.length : 0, attributes.show_indicators)}
        </div>
    );

    console.log(attributes.transition_time_ms);
    /** Set transition_time to ZERO if auto_transition is disabled  */
    if (attributes.auto_transition == false) {
        attributes.transition_time_ms = 0;
    }

    /** Set hidden field for transition configurations */
    if (isSelected) {
        clearTimeout(transition_timer);
        resultant_DOM.push(
            <input type="hidden" key="gallery-slider-congif-transition_time_ms" id="transition_time_ms" name="transition_time_ms" value={0} />
        );
    }
    else {
        resultant_DOM.push(
            <input type="hidden" key="gallery-slider-congif-transition_time_ms" id="transition_time_ms" name="transition_time_ms" value={attributes.transition_time_ms} />
        );
    }

    return resultant_DOM;
}

/**
 * Renders arrows
 * @param {boolean} show_arrows Show or Hide navigation arrows
 * @returns 
 */
function render_arrows(show_arrows) {
    var resultant_DOM = [];

    if (show_arrows === true) {
        resultant_DOM.push(<p key="gallery-slider-nav-next-btnx" id={"gallery-slider-prev-btn"} className="prev" onClick={() => increment_slide(-1)}>&#10094;</p>);
        resultant_DOM.push(<p key="gallery-slider-nav-prev-btnx" id={"gallery-slider-next-btn"} className="next" onClick={() => increment_slide(1)}>&#10095;</p>);
    }

    return resultant_DOM;
}

/**
 * Renders media (images & video)
 * @param {*} params Attributes
 * @param {*} setAttributes Function to set attribute values
 * @returns 
 */
function render_medias(params, setAttributes) {
    var resultant_DOM = [];
    
    const { medias, captions, setState } = params;
    const new_caption_list = [...captions];
    
    /** Return if no media are present */
    if (medias === undefined) return;
    
    /** Enumrate through all medias */
    for (let index = 0; index < medias.length; index++) {
        const media_item = medias[index];
        
        if (media_item.type === "image") {
            if (component_selected) {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <img className="gs-img" src={media_item.url} />
                        <div className="textEditor">
                            <PlainText
                                className="textEditor"
                                value={ (new_caption_list[index] === null)?"":new_caption_list[index] }
                                onChange={ ( content ) => {
                                    var newCaption = content;
                                    new_caption_list[index] = newCaption;
                                    setAttributes({ captions: new_caption_list });
                                 } }
                            />
                        </div>
                    </div>
                );
            } else {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <img className="gs-img" src={media_item.url} />
                        <div className="text">{params.captions[index]}</div>
                    </div>
                );
            }
        } else {
            if (component_selected) {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <video className="gs-video" src={media_item.url} />
                        <div className="textEditor">
                            <PlainText
                                className="textEditor"
                                value={ (captions[index] === null)?"":captions[index] }
                                onChange={ ( content ) => {
                                    var newCaption = content;
                                    new_caption_list[index] = newCaption;
                                    setAttributes({ captions: new_caption_list });
                                 } }
                            />
                        </div>
                    </div>
                );
            } else {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <video className="gs-video" src={media_item.url} />
                        <div className="text">{params.captions[index]}</div>
                    </div>
                );
            }
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
console.log(transition_time);
    /** Create timer only if auto_transition is enabled */
    if (transition_time === null || transition_time.value >= 2000 || slides.length === 0) {
        /** Clear old timer and register new one */
        clearTimeout(transition_timer);

        if (transition_time === null || (component_selected && !force)) {
            transition_timer = setTimeout(slide_loop, 2000); // Change image every 2 seconds
            console.log("Timer for 2");
        }
        else {
            transition_timer = setTimeout(slide_loop, transition_time.value); // Change image every 2 seconds
            console.log("Timer for N");
        }
    }
    
    console.log(component_selected + " - " + !force);
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