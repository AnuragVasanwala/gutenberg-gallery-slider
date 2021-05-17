/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/** React Components for WordPress BlockControls and InspectorControls */
import { Panel, PanelBody, PanelRow, RangeControl, SelectControl, ToggleControl, ToolbarButton, ToolbarGroup } from '@wordpress/components';

/** Inspector Panel */
import { BlockControls, InspectorControls, MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';

/** Icons for BlockContorls and InspectorControls */
import { closeSmall, edit, flipHorizontal, plus, queryPaginationNext, queryPaginationPrevious, tool } from '@wordpress/icons';

/** My custom Gallery Slider */
//import { gallery_slider, move_slide, remove_current_slide } from './custom-controls/gallery-slider';

/** Gallery Slider Component */
//import GallerySlider from './components/test';
import GallerySlider from './components/gallery-slider';
//import {GallerySliderX} from './custom-controls/gallery-slider';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Builds BlockControls for configurations
 * @param {*} attributes Existing Attributes
 * @param {*} setAttributes Function pointer to update attributes
 * @returns DOM Array of BlockControls
 */
function render_block_controls(attributes, setAttributes) {
	/** Rendered DOM of InspectorControls */
	var resultantDOM = [];
	
	resultantDOM.push(
		<BlockControls>
			<ToolbarGroup label="Options">
				<MediaUploadCheck>
					<MediaUpload
						onSelect={(newSelection) => {
							let slides = [...attributes.slides];
							/** Update Captions */

							let newCaptions = [...slides.ctaList.captionList];
							for (let index = 0; index < newSelection.length; index++) {
								const element = newSelection[index];
								newCaptions.push(element.title);
							}

							/** Generate default caption location */
							let newCaptionLocation = [...slides.ctaList.location_list];
							for (let index = 0; index < newSelection.length; index++) {
								const element = [0, 0];
								newCaptionLocation.push(element);
							}

							/** Generate default caption location */
							let newMedias = [...slides.media_list];
							for (let index = 0; index < newSelection.length; index++) {
								newMedias.push(newSelection[index]);
							}

							/** Set captions & medias */
							slides = {
								mediaList: newMedias,
								ctaList: {
									captionList: newCaptions,
									locationList: newCaptionLocation
								}
							};

							setAttributes({ slides: slides });
						}
						}
						allowedTypes={['video', 'image']}
						multiple={'add'}                    // Append Mode

						render={({ open }) => (
							<ToolbarButton icon={plus} label="Add Slide" onClick={open} />
						)}
					/>
				</MediaUploadCheck>
				<MediaUploadCheck>
					<MediaUpload key="gallery-slider-mph"
						allowedTypes={['image', 'video']}   // Media Types
						multiple={'add'}                    // Append Mode

						onSelect={(updatedSelection) => {
							console.log(attributes);
							let slides = attributes.slides;

							/** Update Captions */
							let newCaptions = [slides.ctaList.captionList];
							for (let index = 0; index < updatedSelection.length; index++) {
								const element = updatedSelection[index];
								newCaptions.push(element.title);
							}

							/** Generate default caption location */
							let newCaptionLocation = [slides.ctaList.location_list];
							for (let index = 0; index < updatedSelection.length; index++) {
								const element = [0, 0];
								newCaptionLocation.push(element);
							}

							/** Set captions & medias */
							slides = {
								mediaList: updatedSelection,
								ctaList: {
									captionList: newCaptions,
									locationList: newCaptionLocation
								}
							};
							setAttributes({ slides: slides });
						}}

						render={({ open }) => (
							<ToolbarButton icon={edit} label="Edit Slides" onClick={open} />
						)}

						value={attributes.slides.mediaList.map != undefined && attributes.slides.mediaList.map((media) => {
							if (media !== undefined && media.id != undefined) {
								return media.id;
							}
						})}
					/>
				</MediaUploadCheck>
				
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarButton icon={queryPaginationPrevious} label="Move Previous" onClick={() => move_slide(attributes, setAttributes, -1)} />
				<ToolbarButton icon={queryPaginationNext} label="Move Next" onClick={() => move_slide(attributes, setAttributes, 1)} />
			</ToolbarGroup>
		</BlockControls>
	);

	// value={attributes.slides.media_list.map((media) => {
	// 	if (media !== undefined && media.id != undefined) {
	// 		return media.id;
	// 	}
	// })}

	// {(attributes.slides.media_list.length > 0)
	// 	&& <ToolbarButton icon={closeSmall} label="Remove Current Slide" onClick={() => remove_current_slide(attributes, setAttributes)} />
	// }

	return resultantDOM;
}

/**
 * Builds InspectorControls for configurations
 * @param {*} attributes Existing Attributes
 * @param {*} setAttributes Function pointer to update attributes
 * @returns DOM Array of InspectorControls
 */
function render_inspection_controls(attributes, setAttributes) {
	/** Rendered DOM of InspectorControls */
	const resultantDOM = [];

	/** Extract existing attributes */
	const { showArrows, showIndicators, autoTransition, transitionEffect, transitionTimeMs } = attributes;

	/** Tick marks for Transition Time */
	const tickMarks = [
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

	resultantDOM.push(
		<InspectorControls key="rt-gallery-slider-setting">
			<Panel>
				<PanelBody title={__('View Settings', 'gallery-slider')} icon={tool} initialOpen={true}>
					<PanelRow>
						<ToggleControl
							label={__('Show Arrows', 'gallery-slider')}
							checked={showArrows}
							onChange={isChecked => { setAttributes({ showArrows: isChecked }); }}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Indicators', 'gallery-slider')}
							checked={showIndicators}
							onChange={isChecked => { setAttributes({ showIndicators: isChecked }); }}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Transition', 'gallery-slider')} icon={flipHorizontal} initialOpen={false}>
					<PanelRow>
						<SelectControl
							label={__('Transition Effect:', 'gallery-slider')}
							value={transitionEffect}
							onChange={updatedEffect => { setAttributes({ transitionEffect: updatedEffect }); }}
							options={[
								{ value: null, label: __('Select transition effect', 'gallery-slider'), disabled: true },
								{ value: 'fade', label: __('Fade', 'gallery-slider') },
							]}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Auto Transition', 'gallery-slider')}
							checked={autoTransition}
							onChange={isChecked => { setAttributes({ autoTransition: isChecked }); }}
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={__('Transition Time (milliSeconds)', 'gallery-slider')}
							value={transitionTimeMs}
							min={2500}
							max={15000}
							onChange={updatedTime => { setAttributes({ transitionTimeMs: updatedTime }); }}
							disabled={!autoTransition}
							marks={tickMarks}
						/>
					</PanelRow>
				</PanelBody>
			</Panel>
		</InspectorControls>
	)
	return resultantDOM;
}

function testFunction(testData) {
	console.log("CallBack");
	console.log(testData);
}

export default function Edit({ attributes, setAttributes, isSelected }) {
	console.log("EDIT");
	console.log(attributes);
	//{gallery_slider(true, isSelected, attributes, setAttributes)}
	return (
		<div {...useBlockProps()}>
			{render_block_controls(attributes, setAttributes)}
			{render_inspection_controls(attributes, setAttributes)}
			hello
			<GallerySlider
							is_editor={attributes.autoTransition}
							transitionTime={attributes.transitionTimeMs}

							showArrows={attributes.showArrows}
							showIndicators={attributes.showIndicators}

							editable={true} // only for editor
							
							slides={attributes.slides} // [ mediaList ]
							
							onChange={(newSelection)=>{
								setAttributes({ medias: newSelection });
								console.log("attributes");
								console.log(attributes);
							}}
							/>
		</div>
	);
}