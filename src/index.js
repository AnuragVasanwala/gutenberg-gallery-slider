/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
registerBlockType( 'rt-gallery-slider/gallery-slider', {
	/** Attributes or say configurations for the Block */
	attributes: {
		showArrows: {
			type: 'boolean',
			default: true
		},
		showIndicators: {
			type: 'boolean',
			default: true
		},
		autoTransition: {
			type: 'boolean',
			default: true
		},
		transitionEffect: {
			type: 'string',
			default: "fade"
		},
		transitionTimeMs: {
			type: 'number',
			default: 5000
		},
		medias: {
			type: 'array',
    		default: []
		},
		captions: {
			type: 'array',
    		default: []
		},
		caption_location: {
			type: 'array',
    		default: []
		},
		slides: {
			type: 'object',
    		default: {
				mediaList: {
					type: 'array',
					default: []
				},
				ctaList: {
					captionList: {
						type: 'array',
						default: []
					},
					locationList: {
						type: 'array',
						default: []
					}
				}
			}
		}
	},
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );
