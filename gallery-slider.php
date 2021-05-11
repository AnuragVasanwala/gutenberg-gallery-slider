<?php
/**
 * Plugin Name:       Gallery Slider
 * Description:       Image and Video slider with some fancy features!
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.5
 * Author:            Anurag Vasanwala, rtCamp
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gallery-slider
 *
 * @package           rt-gallery-slider
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function rt_gallery_slider_gallery_slider_block_init() {
	register_block_type_from_metadata( __DIR__ );

	/** Slider fonrt-end Scripts */
	wp_enqueue_script( 'gallery-slider-script', plugins_url( 'src/custom-controls/gallery-slider-fs.js', __FILE__ ), array(), '1.0.27', true );
}
add_action( 'init', 'rt_gallery_slider_gallery_slider_block_init' );
