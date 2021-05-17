import React from 'react';

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
            // Control Variables
            currentSlide: 0,
            transitionState    :   'onHold',   // 'onHold', 'playing'

            // Timer
            timer: null,

            // Slides
            slides: props.slides,
        };
    }

    render() {
        return (
            <MediaPlaceholder onSelect={(newSlection) => {this.props.onChange(newSlection)}} />
        );
    }

    changeColor = () => {
        this.setState({ color: "blue" });
        this.props.onChange(this.state.slides);
    }
    // // befroe render
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
    }

    // after render
    componentDidMount() {
        console.log("didMount");
        
         this.setState({timer: setTimeout(() => {
            let newval = this.state.currentSlide + 1;
            this.setState({currentSlide:newval});
         }, this.props.transitionTime)
        });
    }

    componentDidUpdate(prevProps) {
        console.log("updated...");
        console.log(prevProps);
          clearTimeout(this.doneTimeout);
          
          this.doneTimeout = setTimeout(() => {
            
            let newval = this.state.currentSlide + 1;
            this.setState({currentSlide:newval});

          }, this.props.transitionTime);
      }
    
      componentWillUnmount() {
          clearTimeout(this.doneTimeout);
      }
}

export default GallerySlider;