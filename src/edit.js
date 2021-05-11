/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

// /**
//  * React hook that is used to mark the block wrapper element.
//  * It provides all the necessary props like the class name.
//  *
//  * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
//  */
//  import { useState } from '@wordpress/element';
//  import { withState } from '@wordpress/compose';
// import { registerBlockType } from '@wordpress/blocks';

/** React Components for WordPress */
import { Panel, PanelBody, PanelRow, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';

/** Inspector Panel */
import { InspectorControls,	useBlockProps } from '@wordpress/block-editor';

/** Icons */
import { more, cog, tool, group, flipHorizontal } from '@wordpress/icons';

/** My custom Gallery Slider */
import gallery_slider from './custom-controls/gallery-slider';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

function render_inspection_panel(attributes, setAttributes) {
	var resultant_DOM = [];
	const { show_arrows, show_indicators, auto_transition, transition_effect, transition_time_ms, setState } = attributes;
	
	/** Tick marks for Transition Time */
	const ticks = [
		{
			value: 2500,
			label: __('Fast', 'gallery-slider'),
		},
		{
			value: 7500,
			label: __('Normal', 'gallery-slider'),
		},
		{
			value: 15000,
			label: __('Slow', 'gallery-slider'),
		}
	];

	resultant_DOM.push(
		<InspectorControls key="rt-gallery-slider-setting">
			<Panel>
				<PanelBody title={__('View Settings', 'gallery-slider')} icon={tool} initialOpen={true}>
					<PanelRow>
						<ToggleControl
							label={__('Show Arrows', 'gallery-slider')}
							checked={show_arrows}
							onChange={ value => { setAttributes({ show_arrows: value }); }}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Indicators', 'gallery-slider')}
							checked={show_indicators}
							onChange={ value => { setAttributes({ show_indicators: value }); }}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Transition', 'gallery-slider')} icon={flipHorizontal} initialOpen={false}>
					<PanelRow>
						<SelectControl
							label={__('Transition Effect:', 'gallery-slider')}
							value={ transition_effect }
							onChange={ value => { setAttributes({ transition_effect: value }); }}
							options={[
								{ value: null, label: __('Select transition effect', 'gallery-slider'), disabled: true },
								{ value: 'fade', label: __('Fade', 'gallery-slider') },
								// { value: 'slide', label: __('Slide', 'gallery-slider') },
							]}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Auto Transition', 'gallery-slider')}
							checked={auto_transition}
							onChange={ value => { setAttributes({ auto_transition: value }); }}
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={__('Transition Time (milliSeconds)', 'gallery-slider')}
							value={transition_time_ms}
							min={2500}
							max={15000}
							onChange={ value => { setAttributes({ transition_time_ms: value }); }}
							disabled={!auto_transition}
							marks = { ticks }
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
		</InspectorControls>
	)
	return resultant_DOM;
}

export default function Edit({ attributes, setAttributes, isSelected }) {
	return (
		<div {...useBlockProps()}>
			{ render_inspection_panel(attributes, setAttributes) }
			{ gallery_slider(true, isSelected, attributes, setAttributes) }
		</div>
	);
}