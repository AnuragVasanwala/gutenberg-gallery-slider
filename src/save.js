/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/** My custom Gallery Slider */
import {gallery_slider} from './custom-controls/gallery-slider';

/** Gallery Slider Component */
import GallerySlider from './components/gallery-slider';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( props ) {
	//{ gallery_slider(false, false, props.attributes) }
	return (
		<div { ...useBlockProps.save() }>
			<GallerySlider 
							autoTransition={props.autoTransition}
							transitionTime={props.transitionTimeMs}

							showArrows={props.showArrows}
							showIndicators={props.showIndicators}

							editable={false} // only for editor
							
							slides={props.slides} // [ mediaList ]
							
							/>
		</div>
	);
}


