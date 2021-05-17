/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './gallery-slider-style.scss';

/** Block Editor components */
import { MediaPlaceholder, RichText } from '@wordpress/block-editor';

/** Maintain state whether Block is selected or not */
let component_selected;

/** Export functions and variables that are going to be accessed from other modules */
export { GallerySliderX, move_slide, remove_current_slide, slide_index_in_view }

/**
 * Renders Gallery Slider
 * @param {boolean} is_editor_block Renders for Editor if `true`, else for save
 * @param {boolean} isSelected Flag indicated whether block is selected or not
 * @param {*} attributes Attributes like medias, captions, locations, etc.
 * @param {*} setAttributes Function pointer to set updated values of attributes
 * @returns 
 */
function GallerySliderX({is_editor_block, isSelected, attributes, setAttributes = null}) {
    /** Rendered DOM of Gallery Slider */
    let resultant_DOM = [];

    component_selected = isSelected;

    /** Show MediaPlaceholder if medias.length === 0 */
    if (attributes.medias.length == 0) {
        clearTimeout(transition_timer);
        resultant_DOM.push(
            <MediaPlaceholder key="gallery-slider-mph"
                allowedTypes={['image', 'video']}   // Media Types
                multiple={'add'}                    // Append Mode

                onSelect={(new_selection) => {
                    /** Update Captions */
                    let new_captions = [];
                    for (let index = 0; index < new_selection.length; index++) {
                        const element = new_selection[index];
                        new_captions.push(element.title);
                    }

                    /** Generate default caption location */
                    let new_caption_location = [];
                    for (let index = 0; index < new_selection.length; index++) {
                        const element = [0, 0];
                        new_caption_location.push(element);
                    }

                    /** Set captions & medias */
                    setAttributes({ caption_location: new_caption_location });
                    setAttributes({ captions: new_captions });
                    setAttributes({ medias: new_selection });
                }}

                value={attributes.medias}           // Set existing selected medias to MediaUploader
            />
        );

        /**
         * Do not process further and immidiatly return MediaPlaceholder
         * because there are no medias to be processed.
         */
        return resultant_DOM;
    }

    /** Render Medias and Arrows */
    resultant_DOM.push(
        <div key="gallery-slider-container" className="rt-gallery-slider-container">
            {render_medias(attributes, setAttributes)}
            {render_arrows(attributes.show_arrows)}
        </div>
    );

    /** Render Indicators */
    resultant_DOM.push(
        <div key="gallery-slider-indicators-container" className="rt-gallery-slider-indicator-container">
            {render_indicators((attributes.medias !== undefined) ? attributes.medias.length : 0, attributes.show_indicators)}
        </div>
    );

    /** Set transition_time to ZERO if auto_transition is disabled  */
    if (attributes.auto_transition == false) {
        attributes.transition_time_ms = 0;
    }

    /** Set hidden field for transition configurations */
    if (isSelected) {
        /** Clear timer to halt transition on block selection */
        clearTimeout(transition_timer);

        /** Provides feedback to external script 'gallery-slider-fs' to halt transition */
        resultant_DOM.push(
            <input type="hidden" key="gallery-slider-congif-transition_disabled" id="transition_disabled" name="transition_disabled" value={true} />
        );

        /** Clear transition time */
        resultant_DOM.push(
            <input type="hidden" key="gallery-slider-congif-transition_time_ms" id="transition_time_ms" name="transition_time_ms" value={0} />
        );
    }
    else {
        /** Set specified transition time */
        resultant_DOM.push(
            <input type="hidden" key="gallery-slider-congif-transition_time_ms" id="transition_time_ms" name="transition_time_ms" value={attributes.transition_time_ms} />
        );
    }

    return resultant_DOM;
}

/**
 * Renders arrows
 * @param {boolean} show_arrows Show or Hide navigation arrows
 * @returns DOM Array of Navigation Arrows
 */
function render_arrows(show_arrows) {
    /** Rendered DOM for arrows */
    let resultant_DOM = [];

    if (show_arrows === true) {
        resultant_DOM.push(<p key="gallery-slider-nav-next-btnx" id={"gallery-slider-prev-btn"} className="rt-gallery-slider-btn-previous" onClick={() => increment_slide(-1)}>&#10094;</p>);
        resultant_DOM.push(<p key="gallery-slider-nav-prev-btnx" id={"gallery-slider-next-btn"} className="rt-gallery-slider-btn-next" onClick={() => increment_slide(1)}>&#10095;</p>);
    }

    return resultant_DOM;
}

/**
 * Renders Indicator Dots
 * @param {int} indicator_count Number of indicators
 * @param {Boolean} show_indicators Show/Hide indicators
 * @returns DOM Array of Indicators
 */
function render_indicators(indicator_count, show_indicators) {
    let resultant_DOM = [];

    if (show_indicators === true) {
        for (let index = 0; index < indicator_count; index++) {
            resultant_DOM.push(<span key={"gallery-slider-indicator-" + index} className="rt-gallery-slider-indicator" target={index} onClick={() => seek_slide(index)} />)
        }
    }

    return resultant_DOM;
}

/**
 * Renders media (images & video)
 * @param {*} params Attributes
 * @param {*} setAttributes Function to set attribute values
 * @returns DOM Array of Medias
 */
function render_medias(params, setAttributes) {
    /** Rendered DOM for medias */
    let resultant_DOM = [];

    /** Existing attributes */
    const { medias, captions, caption_location } = params;
    const new_caption_list = [...captions];
    const new_caption_location_list = [...caption_location];

    /** Return if no media are present */
    if (medias === undefined) return;

    /** Enumrate through all medias */
    for (let index = 0; index < medias.length; index++) {
        const media_item = medias[index];

        /** Workaround for a problem: new_caption_location_list.length < media.length */
        if (new_caption_location_list.length !== medias.length) continue;

        /** Retrive old translation */
        xOffset[index] = new_caption_location_list[index][0];
        yOffset[index] = new_caption_location_list[index][1];
        let old_tarnslation = "translate3d(" + new_caption_location_list[index][0] + "px, " + new_caption_location_list[index][1] + "px, 0)";

        if (media_item.type === "image") {
            if (component_selected) {
                resultant_DOM.push(
                    <div className="rt-gallery-slider fadeIn" key={"gallery-slider-slide-" + index}
                        onMouseLeave={() => drag_end(null, index)}
                        onMouseUp={(e) => drag_end(e, index)}
                        onMouseDown={(e) => drag_start(e, index)}
                        onMouseMove={(e) => drag(e, index, setAttributes, params)}
                    >
                        <img className="rt-gallery-slider-img" src={media_item.url} />
                        <div id={"gallery-slider-slide-ct-" + index} className="rt-gallery-slider-editor" key={"gallery-slider-slide-ct-" + index}
                            style={{ transform: old_tarnslation }}
                        >
                            <RichText key={"gallery-slider-slide-ct-" + index}
                                tagName="p"
                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]}

                                className={"rt-gallery-slider-editor-control"}

                                onChange={(updated_text) => {
                                    let newCaption = updated_text;
                                    new_caption_list[index] = newCaption;
                                    setAttributes({ captions: new_caption_list });
                                }}
                            />
                        </div>
                    </div>
                );
            } else {
                resultant_DOM.push(
                    <div className="rt-gallery-slider fadeIn" key={"gallery-slider-slide-" + index}>
                        <img className="rt-gallery-slider-img" src={media_item.url} />
                        <div id={"gallery-slider-slide-ct-" + index} className="rt-gallery-slider-editor" key={"gallery-slider-slide-ct-" + index}
                            style={{ transform: old_tarnslation }}
                        >
                            <RichText.Content key={"gallery-slider-slide-ct-" + index}
                                tagName="p"

                                className={"rt-gallery-slider-editor-control"}

                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]}
                            />
                        </div>
                    </div>
                );
            }
        } else { // Media == VIDEO
            if (component_selected) {
                resultant_DOM.push(
                    <div className="rt-gallery-slider fadeIn" key={"gallery-slider-slide-" + index} onMouseUp={(e) => drag_end(e, index)}
                        onMouseLeave={() => drag_end(null, index)}
                        onMouseUp={(e) => drag_end(e, index)}
                        onMouseDown={(e) => drag_start(e, index)}
                        onMouseMove={(e) => drag(e, index, setAttributes, params)}
                    >
                        <video controls className="rt-gallery-slider-video" src={media_item.url}
                            onMouseEnter={() => play_video(index, false)}
                            onMouseLeave={() => play_video(index)}
                        />
                        <div id={"gallery-slider-slide-ct-" + index} className="rt-gallery-slider-editor" key={"gallery-slider-slide-ct-" + index}
                            style={{ transform: old_tarnslation }}

                        >
                            <RichText key={"gallery-slider-slide-ct-" + index}
                                tagName="p"
                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]}

                                className={"rt-gallery-slider-editor-control"}

                                onChange={(updated_text) => {
                                    let newCaption = updated_text;
                                    new_caption_list[index] = newCaption;
                                    setAttributes({ captions: new_caption_list });
                                }}
                            />
                        </div>

                    </div>
                );
            } else {
                resultant_DOM.push(
                    <div className="rt-gallery-slider fadeIn" key={"gallery-slider-slide-" + index}>
                        <video controls className="rt-gallery-slider-video" src={media_item.url}
                            onMouseEnter={() => play_video(index, false)}
                            onMouseLeave={() => play_video(index)}
                        />
                        <div id={"gallery-slider-slide-ct-" + index} className="rt-gallery-slider-editor" key={"gallery-slider-slide-ct-" + index}
                            style={{ transform: old_tarnslation }}
                        >
                            <RichText.Content key={"gallery-slider-slide-ct-" + index}
                                tagName="p"

                                className={"rt-gallery-slider-editor-control"}

                                id={"gallery-slider-slide-ct-rt-" + index} key={"gallery-slider-slide-ct-rt-" + index}
                                value={(new_caption_list[index] === null) ? "" : new_caption_list[index]} />
                        </div>
                    </div>
                );
            }
        }
    }

    return resultant_DOM;
}

/**
 * Moves slide into gallery
 * @param {*} attributes Existing Attributes
 * @param {*} setAttributes Function pointer to update attributes
 * @param {int} index_increment Move slide by index_increment
 */
function move_slide(attributes, setAttributes, index_increment) {
    const { medias, captions, caption_location } = attributes;
    const updated_media_list = [...medias];
    const updated_caption_list = [...captions];
    const updated_caption_location_list = [...caption_location];

    /** BoundaryCheck: Do not move slide out of bounds */
    if (slide_index_in_view + index_increment < 0) return;
    if (slide_index_in_view + index_increment >= medias.length) return;

    /** Update Lists */
    let tmp = updated_media_list[slide_index_in_view + index_increment];
    updated_media_list[slide_index_in_view + index_increment] = updated_media_list[slide_index_in_view];
    updated_media_list[slide_index_in_view] = tmp;

    tmp = updated_caption_list[slide_index_in_view + index_increment];
    updated_caption_list[slide_index_in_view + index_increment] = updated_caption_list[slide_index_in_view];
    updated_caption_list[slide_index_in_view] = tmp;

    tmp = updated_caption_location_list[slide_index_in_view + index_increment];
    updated_caption_location_list[slide_index_in_view + index_increment] = updated_caption_location_list[slide_index_in_view];
    updated_caption_location_list[slide_index_in_view] = tmp;

    /** Set captions & medias */
    setAttributes({ caption_location: updated_caption_location_list });
    setAttributes({ captions: updated_caption_list });
    setAttributes({ medias: updated_media_list });

    /** Move to updated slide */
    increment_slide(index_increment);
}

/**
 * Removes slide in view
 * @param {*} attributes Existing Attributes
 * @param {*} setAttributes Function pointer to update attributes
 */
function remove_current_slide(attributes, setAttributes) {
    const { medias, captions, caption_location } = attributes;
    const updated_media_list = [...medias];
    const updated_caption_list = [...captions];
    const updated_caption_location_list = [...caption_location];

    /** Update Lists */
    updated_media_list.splice(slide_index_in_view, 1);
    updated_caption_list.splice(slide_index_in_view, 1);
    updated_caption_location_list.splice(slide_index_in_view, 1);

    /** Set captions & medias */
    setAttributes({ caption_location: updated_caption_location_list });
    setAttributes({ captions: updated_caption_list });
    setAttributes({ medias: updated_media_list });
}

/****************************************************************************************
 * Auto Transition and Navigation Functions
 ***************************************************************************************/
/** Maintains index of slide in view */
let slide_index_in_view = 0;

/** Auto transition config */
let transition_timer;

/**
 * Brings the slide in view by increment/decrement number
 * @param {int} increment_by Slides to be increment or Decrement
 */
function increment_slide(increment_by) {
    let slides = document.getElementsByClassName("rt-gallery-slider");

    /** Map index inside boundry */
    if (slide_index_in_view < 0) { slide_index_in_view = slides.length - 1 }
    if (slide_index_in_view >= slides.length) { slide_index_in_view = 0 }

    active = false;

    /** Stop Video */
    if (slides.length > 0 && slides[slide_index_in_view].childNodes[0].tagName.toLowerCase() == "video") {
        slides[slide_index_in_view].childNodes[0].pause();
    }

    increment_by = parseInt(increment_by);
    slide_index_in_view += increment_by;
    slide_loop(false, true);
}

/**
 * Brings specified slide into view
 * @param {int} slide_number Slide to bring into view
 */
function seek_slide(slide_number) {
    let slides = document.getElementsByClassName("rt-gallery-slider");

    /** Map index inside boundry */
    if (slide_index_in_view < 0) { slide_index_in_view = slides.length - 1 }
    if (slide_index_in_view >= slides.length) { slide_index_in_view = 0 }

    active = false;

    /** Stop Video */
    if (slides.length > 0 && slides[slide_index_in_view].childNodes[0].tagName.toLowerCase() == "video") {
        slides[slide_index_in_view].childNodes[0].pause();
    }

    slide_number = parseInt(slide_number);
    slide_index_in_view = slide_number;
    slide_loop(true, true);
}

/**
 * Performs auto and user specified transition
 */
function slide_loop(auto_increment_slide = true, force = false) {
    active = false;

    /** Retrive slides and indicators */
    let slides = document.getElementsByClassName("rt-gallery-slider");
    let indicators = document.getElementsByClassName("rt-gallery-slider-indicator");

    /** Retrive transition configurations */
    let transition_time = document.getElementById("transition_time_ms");

    /** Create timer only if auto_transition is enabled */
    if (transition_time === null || transition_time.value >= 2000 || slides.length === 0) {
        /** Clear old timer and register new one */
        clearTimeout(transition_timer);

        if (transition_time === null || (component_selected && !force)) {
            transition_timer = setTimeout(slide_loop, 2000);
        }
        else {
            transition_timer = setTimeout(slide_loop, transition_time.value);
        }
    }

    /** Hold transition if user in block and didn't click navigation/indicators */
    if (component_selected && !force) return;

    /** Return if no slides are available */
    if (slides.length === 0) return;

    /** Clear slides & indicators from view */
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";

        if (indicators.length > 0) {
            indicators[i].className = indicators[i].className.replace(" rt-gallery-slider-indicator-active", "");
        }
    }

    /** Map index inside boundry */
    if (slide_index_in_view < 0) { slide_index_in_view = slides.length - 1 }
    if (slide_index_in_view >= slides.length) { slide_index_in_view = 0 }

    /** Assign new slide and highlight indicator */
    slides[slide_index_in_view].style.display = "block";

    if (indicators.length > 0) {
        indicators[slide_index_in_view].className += " rt-gallery-slider-indicator-active";
    }

    /** Video auto-play/pause */
    if (slides[slide_index_in_view].childNodes[0].tagName.toLowerCase() == "video") {
        /** Clear exiting timer */
        clearTimeout(transition_timer);

        /** Play video from initial position */
        slides[slide_index_in_view].childNodes[0].currentTime = 0;
        let promise = slides[slide_index_in_view].childNodes[0].play();

        /** Show video controls on error */
        if (promise !== undefined) {
            promise.catch(error => {
                slides[slide_index_in_view].childNodes[0].setAttribute("controls", "controls");
            }).then(() => {
                slides[slide_index_in_view].childNodes[0].removeAttribute("controls");
            });
        }

        /** Attach increment slide on video end */
        slides[slide_index_in_view].childNodes[0].onended = function () { increment_slide(1); };
        return;
    }

    /** Increment slide index by one */
    if (auto_increment_slide === true) {
        slide_index_in_view++;
    }
}

/****************************************************************************************
 * Drag Support Functions
 ***************************************************************************************/

/** Temporary storage for Translation / Drag Support */
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset;
let yOffset;

/** Block is limited to 20 slides */
init_variables(20);

/**
 * Initialise translation variables
 * @param {int} slide_count Number of Slides
 */
function init_variables(slide_count) {
    currentX = [];
    currentY = [];
    initialX = [];
    initialY = [];
    xOffset = [];
    yOffset = [];

    for (let c1 = 0; c1 < slide_count; c1++) {
        currentX.push(0);
        currentY.push(0);
        initialX.push(0);
        initialY.push(0);
        xOffset.push(0);
        yOffset.push(0);
    }
}

/**
 * Marks DragStarted for the slide
 * @param {*} event_obj Event Object
 * @param {*} index Slide Index
 * @returns Event status
 */
function drag_start(event_obj, index) {
    if (event_obj.type === "touchstart") {
        initialX[index] = event_obj.touches[0].clientX - xOffset[index];
        initialY[index] = event_obj.touches[0].clientY - yOffset[index];
    } else {
        initialX[index] = event_obj.clientX - xOffset[index];
        initialY[index] = event_obj.clientY - yOffset[index];
    }

    active = true;
    return active;
}

/**
 * Marks DragEnded for the slide
 * @param {*} e Event Object
 * @param {*} index Slide Index
 * @returns Event execution status
 */
function drag_end(e, index) {
    initialX[index] = currentX[index];
    initialY[index] = currentY[index];

    active = false;
    return true;
}

/**
 * Performs drag operation
 * @param {*} event_obj Event Object
 * @param {*} index Slide Index
 * @param {*} setAttributes Function pointer to update attributes
 * @param {*} attributes Existing parameters
 */
function drag(event_obj, index, setAttributes, attributes) {
    /** Process only if DragStarted */
    if (active) {
        /** Supress default operation */
        event_obj.preventDefault();

        /** Touch (only first touch) / Mouse event */
        if (event_obj.type === "touchmove") {
            currentX[index] = event_obj.touches[0].clientX - initialX[index];
            currentY[index] = event_obj.touches[0].clientY - initialY[index];
        } else {
            currentX[index] = event_obj.clientX - initialX[index];
            currentY[index] = event_obj.clientY - initialY[index];
        }

        /** Set translation offset */
        xOffset[index] = currentX[index];
        yOffset[index] = currentY[index];

        /** Retrive drag container */
        let container = document.querySelector("#gallery-slider-slide-ct-" + index);

        /** Set translation */
        set_translate(currentX[index], currentY[index], container, setAttributes, attributes, index);
    }
}

/**
 * Updates translation into element
 * @param {*} xPosition X Offset
 * @param {*} yPosition Y Offset
 * @param {*} element Element to be translated
 * @param {*} setAttributes Function pointer to update translation
 * @param {*} attributes Existing parameters
 * @param {*} index Slide Index
 */
function set_translate(xPosition, yPosition, element, setAttributes, attributes, index) {
    const { caption_location } = attributes;
    const new_caption_location_list = [...caption_location];

    element.style.transform = "translate3d(" + xPosition + "px, " + yPosition + "px, 0)";

    let newCaption = get_translate_3d(element);
    new_caption_location_list[index] = newCaption;

    setAttributes({ caption_location: new_caption_location_list });
}

/**
 * Get Translate3D
 * @param {*} element Element to parse for `translate3d`
 * @returns array of translation as [x, y, z] in pixels
 */
function get_translate_3d(element) {
    /** Parse values */
    let values = element.style.transform.split(/\w+\(|\);?/);

    /** Return empty array, if 2nd element is null */
    if (!values[1] || !values[1].length) {
        return [0, 0, 0];
    }

    /** Split values by `,` */
    let result = values[1].split(/,\s?/g);

    /** Remove Z value */
    // result.splice(2,1); for 2D operation, remove Z (3rd Data)

    /** Remove `px` from string and convert to int */
    for (let c1 = 0; c1 < result.length; c1++) {
        result[c1] = parseInt(result[c1].replace('px', ''));
    }

    return result;
}

/**
 * Play or pause video on given slide
 * @param {int} index Slide Index
 * @param {boolean} play Play?
 */
function play_video(index, play = true) {
    /** Retrive slides */
    let slides = document.getElementsByClassName("rt-gallery-slider");

    let promise;

    if (play) {
        promise = slides[index].childNodes[0].play();
    } else {
        promise = slides[index].childNodes[0].pause();
    }

    if (promise !== undefined) {
        promise.catch(error => {
            slides[index].childNodes[0].setAttribute("controls", "controls");
        }).then(() => {
            slides[index].childNodes[0].removeAttribute("controls");
        });
    }
}