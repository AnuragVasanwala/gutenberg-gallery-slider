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
	attributes: {
		show_arrows: {
			type: 'boolean',
			default: true
		},
		show_indicators: {
			type: 'boolean',
			default: true
		},
		auto_transition: {
			type: 'boolean',
			default: true
		},
		transition_effect: {
			type: 'string',
			default: "fade"
		},
		transition_time_ms: {
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
		links: {
			type: 'array',
			default: []
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
