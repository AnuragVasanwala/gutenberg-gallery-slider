/** Block Editor components */
import { MediaPlaceholder, RichText } from '@wordpress/block-editor';

export function GallerySlider({
    autoTransition = true,
    transitionTime = 5000,

    showArrows = true,
    showIndicators = true,

    slides,
    onChange
}) {

    /**
     * Variables
     */
    const resultantDOM = [];

    /**
     * Initialize slides array with newely selected media
     * @param {mixed} selectedMediaList Media array with id and url, atleast
     */
    const mediaSelected = (selectedMediaList) => {
        slides.mediaList = selectedMediaList;
        onChange(slides);
    }
    
    /** Show MediaPlaceholder if no media is selected; Default at new block creating */
    if ( slides.mediaList == undefined || slides.mediaList.length == undefined || slides.mediaList.length === 0 ) {
        resultantDOM.push( <MediaPlaceholder onSelect={mediaSelected} /> );
        return resultantDOM;
    }





    return resultantDOM;
}

export default GallerySlider;