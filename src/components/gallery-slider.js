import React from 'react';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
 import '../custom-controls/gallery-slider-style.scss';

 /** Block Editor components */
 import { MediaPlaceholder, RichText } from '@wordpress/block-editor';

 /** Maintain state whether Block is selected or not */
let component_selected;

/** 
 * Props
 *  - autoTransition                [ true / false ]
 *  - transitionTime (miliseconds)  [ unsigned int ]
 *  - showArrows                    [ true / false ]
 *  - showIndicators                [ true / false ]
 *  - isEditable                    [ true / false ]
 *  - slides
 *      - mediaList                [ array        ]
 *      - ctaList
 *          - captionList          [ array        ]
 *          - locationList         [ array        ]
 * 
 * Events
 *  - onChange( updatedSlides )
 */

class GallerySlider extends React.Component {
    /**
     * Initialise properties
     * @param {*} props Properties
     */
    constructor(props) {
        super(props);
        
        /**
         * Set initial state
         */
        this.state = {
            // Control letiables
            currentSlide: 0,
            transitionState    :   'onHold',   // 'onHold', 'playing'

            // Timer
            timer: null,

            // Slides
            slides: props.slides,
        };
        console.log(this.props);
    }

    testcall(x){
        console.log(x);
    }

    render() {
        console.log("render");
        return(
            <RichText key="x44rf" />
        );
    }
    
    // befroe render
    static getDerivedStateFromProps(props, state) {
        // return {favoritecolor: props.favcol };
        console.log("getDerivedStateFromProps");
        console.log(props);
        console.log(state);
        // clearInterval(state.timer);
        
        // return { timer: () => setInterval(() => {
        //     let newval = this.state.currentSlide + 1;
        //     this.setState({currentSlide:newval});
        //  }, props.transitionTime) }
        return null;
    }

    // after render : only once 
    componentDidMount() {
        // console.log("didMount");
        
        //  this.setState({timer: setTimeout(() => {
        //     let newval = this.state.currentSlide + 1;
        //     this.setState({currentSlide:newval});
        //  }, this.props.transitionTime)
        // });
        console.log("after render");
    }

    // after component state change
    componentDidUpdate(prevProps) {
        // clearTimeout(this.transitionTimer);
          
        //   this.transitionTimer = setTimeout(() => {
            
        //     let newval = this.state.currentSlide + 1;
        //     this.setState({currentSlide:newval});

        //   }, this.props.transitionTime);


        //   this.isSelected = this.props.isSelected;
        //   this.isSelected = this.props.isSelected;
      }
    
      // before component unmount
      componentWillUnmount() {
          clearTimeout(this.transitionTimer);
      }
}

export default GallerySlider;