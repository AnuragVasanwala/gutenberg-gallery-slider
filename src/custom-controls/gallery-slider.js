/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './gallery-slider-style.scss';

import { MediaPlaceholder, URLInput, PlainText, RichText } from '@wordpress/block-editor';

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
                    id
                    onSelect={(value) => {

                        /** Retrive original title */
                        var new_captions = [];

                        for (let index = 0; index < value.length; index++) {
                            const element = value[index];
                            new_captions.push(element.title);
                        }

                        /** Generate default caption location */
                        var new_caption_location = [];

                        for (let index = 0; index < value.length; index++) {
                            const element = [ 0, 0 ];
                            new_caption_location.push(element);
                        }

                        /** Set captions & medias */
                        setAttributes({ caption_location: new_caption_location });
                        setAttributes({ captions: new_captions });
                        setAttributes({ medias: value });
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
                    value={attributes.medias}
                />
            );
        }
    }
    else {
        resultant_DOM.push(
            <RichText.Content tagName="p" value={attributes.test_content} />
        );
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

    const { medias, captions, caption_location, setState } = params;
    const new_caption_list = [...captions];
    const new_caption_location_list = [...caption_location];

    /** Return if no media are present */
    if (medias === undefined) return;

    /** Enumrate through all medias */
    for (let index = 0; index < medias.length; index++) {
        const media_item = medias[index];

        //console.log(" + + + + + translate3d(" + new_caption_location_list[index][0] + "px, " + new_caption_location_list[index][1] + "px, 0)");
        
        var tx="translate3d(" + new_caption_location_list[index][0] + "px, " + new_caption_location_list[index][1] + "px, 0)";
        //var tx="translate3d(0, 0, 0)";
        if (media_item.type === "image") {
            if (component_selected) {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <img className="gs-img" src={media_item.url} />
                        <div id={"gallery-slider-slide-ct-" + index} className="textEditor" key={"gallery-slider-slide-ct-" + index}
                            style={{transform:tx}}

                            onMouseDown={(e) => dragStart(e, index)}
                            onMouseUp={(e) => dragEnd(e, index)}
                            onMouseMove={(e) => drag(e, index, setAttributes, params)}>

                            <RichText key={"gallery-slider-slide-ct-" + index}
                                tagName="p"
                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]}
                                
                                className={"textEditorX"}
                                

                                onChange={(content) => {
                                    var newCaption = content;
                                    new_caption_list[index] = newCaption;
                                    setAttributes({ captions: new_caption_list });
                                }}
                            />
                        </div>

                    </div>
                );
            } else {
                // <div className="text">{params.captions[index]}</div>
                // style={"translate3d(" + caption_location[index][0] + "px, " + caption_location[index][1] + "px, 0)"}
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index}>
                        <img className="gs-img" src={media_item.url} />
                        <div id={"gallery-slider-slide-ct-" + index} className="textEditor" key={"gallery-slider-slide-ct-" + index}
                            style={{transform:tx}}
                            >

                        <RichText.Content key={"gallery-slider-slide-ct-" + index}
                                tagName="p"
                                
                                className={"textEditorX"}

                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]}
                            />
                        </div>
                    </div>
                );
            }
        } else {
            if (component_selected) {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} onMouseUp={(e) => dragEnd(e, index)}>
                        <video controls className="gs-video" src={media_item.url} />
                        <div id={"gallery-slider-slide-ct-" + index} className="textEditor" key={"gallery-slider-slide-ct-" + index}
                            style={{transform:tx}}

                            onMouseDown={(e) => dragStart(e, index)}
                            onMouseUp={(e) => dragEnd(e, index)}
                            onMouseMove={(e) => drag(e, index, setAttributes, params)}>

                            <RichText key={"gallery-slider-slide-ct-" + index}
                                tagName="p"
                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]}
                                
                                className={"textEditorX"}

                                onChange={(content) => {
                                    var newCaption = content;
                                    new_caption_list[index] = newCaption;
                                    setAttributes({ captions: new_caption_list });
                                }}
                            />
                        </div>

                    </div>
                );
            } else {
                resultant_DOM.push(
                    <div className="rt_gallery_slider fadeIn" key={"gallery-slider-slide-" + index} >
                        <video controls className="gs-video" src={media_item.url} />
                        <div id={"gallery-slider-slide-ct-" + index} className="textEditor" key={"gallery-slider-slide-ct-" + index}
                            style={{transform:tx}}
                            >
                            <RichText.Content key={"gallery-slider-slide-ct-" + index}
                                tagName="p"

                                className={"textEditorX"}
                                
                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]}/>
                        </div>
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
    var slides = document.getElementsByClassName("rt_gallery_slider");

    /** Map index inside boundry */
    if (slide_index < 0) { slide_index = slides.length - 1 }
    if (slide_index >= slides.length) { slide_index = 0 }

    active = false;

    /** Stop Video */
    if (slides.length > 0 && slides[slide_index].childNodes[0].tagName.toLowerCase() == "video") {
        slides[slide_index].childNodes[0].pause();
    }

    increment_by = parseInt(increment_by);
    slide_index += increment_by;
    slide_loop(false, true);
}

/**
 * Brings specified slide into view
 * @param {int} slide_number Slide to bring into view
 */
function seek_slide(slide_number) {
    var slides = document.getElementsByClassName("rt_gallery_slider");
    
    /** Map index inside boundry */
    if (slide_index < 0) { slide_index = slides.length - 1 }
    if (slide_index >= slides.length) { slide_index = 0 }
    
    active = false;

    /** Stop Video */
    if (slides.length > 0 && slides[slide_index].childNodes[0].tagName.toLowerCase() == "video") {
        slides[slide_index].childNodes[0].pause();
    }

    slide_number = parseInt(slide_number);
    slide_index = slide_number;
    slide_loop(true, true);
}

/**
 * Performs auto and user specified transition
 */
function slide_loop(auto_increment_slide = true, force = false) {
    active = false;

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
    if (component_selected && !force) return;

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

    if (slides[slide_index].childNodes[0].tagName.toLowerCase() == "video") {
        clearTimeout(transition_timer);
        console.log("##");
        slides[slide_index].childNodes[0].currentTime = 0;

        var promise = slides[slide_index].childNodes[0].play();

        if (promise !== undefined) {
            promise.catch(error => {
                slides[slide_index].childNodes[0].setAttribute("controls", "controls");
            }).then(() => {
                slides[slide_index].childNodes[0].removeAttribute("controls");
            });
        }

        slides[slide_index].childNodes[0].onended = function () { increment_slide(1); };
        return;
    }

    /** Increment slide index by one */
    if (auto_increment_slide === true) {
        slide_index++;
    }
}


/** ------------- Popover ----------------- */
import { Button, Popover } from '@wordpress/components';
import { withState } from '@wordpress/compose';

const MyPopover = withState({
    isVisible: false,
})(({ isVisible, setState }) => {
    const toggleVisible = () => {
        setState((state) => ({ isVisible: !state.isVisible }));
    };
    return (
        <Button isSecondary onClick={toggleVisible}>
            Toggle Popover!
            { isVisible && <Popover>Popover is toggled!</Popover>}
        </Button>
    );
});





var dragItem;
var container;

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset;
var yOffset;

document.addEventListener('DOMContentLoaded', function (event) {
    setTimeout(() => {
        console.log("DOC READY!");
        load_doc(10);
    }, 500);
});
function load_doc(numx) {


    dragItem = document.querySelector("#item");
    container = document.querySelector("#container");

    currentX = [];
    currentY = [];
    initialX = [];
    initialY = [];
    xOffset  = [];
    yOffset  = [];

    for (let c1 = 0; c1 < numx; c1++) {
        currentX.push(0);
        currentY.push(0);
        initialX.push(0);
        initialY.push(0);
        xOffset.push(0);
        yOffset.push(0);
    }
    // container.addEventListener("touchstart", dragStart, false);
    // container.addEventListener("touchend", dragEnd, false);
    // container.addEventListener("touchmove", drag, false);

    // container.addEventListener("mousedown", dragStart, false);
    // container.addEventListener("mouseup", dragEnd, false);
    // container.addEventListener("mousemove", drag, false);
}

function dragStart(e, index) {
    if (e.type === "touchstart") {
        initialX[index] = e.touches[0].clientX - xOffset[index];
        initialY[index] = e.touches[0].clientY - yOffset[index];
    } else {
        initialX[index] = e.clientX - xOffset[index];
        initialY[index] = e.clientY - yOffset[index];
    }

    active = false;
    dragItem = document.querySelector("#gallery-slider-slide-ct-rt-" + index);
    console.log("e.target === dragItem : " + (e.target === dragItem));
    if (e.target === dragItem) {
        active = true;
    }
    return active;
}

function dragEnd(e, index) {
    console.log("dEnd +");
    initialX[index] = currentX[index];
    initialY[index] = currentY[index];

    active = false;
    return true;
}

function drag(e, index, setAttributes, params) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX[index] = e.touches[0].clientX - initialX[index];
            currentY[index] = e.touches[0].clientY - initialY[index];
        } else {
            currentX[index] = e.clientX - initialX[index];
            currentY[index] = e.clientY - initialY[index];
        }

        xOffset[index] = currentX[index];
        yOffset[index] = currentY[index];

        container = document.querySelector("#gallery-slider-slide-ct-" + index);

        setTranslate(currentX[index], currentY[index], container, setAttributes, params, index);
    }
}

function setTranslate(xPos, yPos, el, sa, params, index) {
    const { caption_location, setState } = params;
    const new_caption_list = [...caption_location];
    var newCaption = getTranslate3d(el);
    new_caption_list[index] = newCaption;
    sa({ caption_location: new_caption_list });


    console.log("setTx = ");
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    console.log(getTranslate3d(el));
}

function getTranslate3d (el) {
    var values = el.style.transform.split(/\w+\(|\);?/);
    if (!values[1] || !values[1].length) {
        return [];
    }

    var result =  values[1].split(/,\s?/g);

    // result.splice(2,1); for 2D operation, remove Z (3rd Data)

    for (let c1 = 0; c1 < result.length; c1++) {
        result[c1] = parseInt(result[c1].replace('px',''));        
    }

    return result;
}