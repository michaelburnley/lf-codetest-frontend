import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

// Stateless Components

// Slide
// Handles slide movement and renders textblocks/images
const Slide = ({ data, pauseSlides, translate }) => {  
  const styles = { 
    transform: `translateX(-${translate}%`
  };
  return (
    <div onMouseOver={pauseSlides} onMouseLeave={pauseSlides} className="slide" style={styles}>
      <TextBlocks data={data}/>
      <img src={data.image} alt={data.title}/>
    </div>
  )
}

// Timer
// Renders time change
const Timer = ({ timeLeft }) => (
  <div>Time to Slide Change: {timeLeft / 1000}s</div>
)

// TextBlocks
// Renders text that sits within the Slide component
const TextBlocks = ({ data: { title, subtitle }}) => (
    <div className="text-blocks">
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
    </div>
  )

// SlideIndicator
// Renders thumbnails of images and attaches click handler for slide selection
const SlideIndicator = ({ onClick, data: { image, title }, classes }) => {
  return(
    <div className={classes} onClick={onClick}>
      <img className="thumbnail" src={image} alt={title} />
    </div>
  )
}

// Navigation
// Renders navigation arrows through FontAwesome component and attaches
// click handler for slide movement
const Navigation = ({ changeSlide, text, icon }) => {
  return(
    <div className={text}>
      <FontAwesomeIcon icon={icon} onClick={changeSlide} />
    </div>
  )
}

// Stateful Components

// Carousel
// Handles all functions for stateless components
// Images are currently stored in `public` folder and stored in a state array
class Carousel extends Component {
  constructor() {
    super();
    this.state = {
      slide: 0,       // current slide
      interval: 5000, // time between slides
      timeLeft: 5000, // countdown timer
      paused: false,  // flag for hover-over pause
      translate: 0,   // movement in percentage for slides 
      images: [
        {
          image: "/slide1.jpg",
          title: "First Slide",
          subtitle: "I am a sentence below the title.",
        },
        {
          image: "/slide2.jpg",
          title: "Second Slide",
          subtitle: "I am a sentence below the title.",
        },
        {
          image: "/slide3.jpg",
          title: "Third Slide",
          subtitle: "I am a sentence below the title.",
        },
      ] // image data array
    };
  }

  // Starts timer as soon as component loads
  componentDidMount = () => {
    this.timer();
  }

  // Attaches two interval timers to `this` keyword
  timer = () => {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, this.state.interval);
    this.countdown = setInterval(() => {
      this.setState({ timeLeft: this.state.timeLeft - 1000})
    }, 1000);
  }

  // Removes timers and resets `timeLeft` variable
  clearTimers = () => {
    clearInterval(this.sliderInterval);
    clearInterval(this.countdown);
    this.setState({ timeLeft: this.state.interval });
  }

  // Helper function for running both above methods
  restartTimers = () => {
    this.clearTimers();
    this.timer();
  }

  // Checks `paused` flag and sets timers accordingly
  pauseSlides = () => {
    if(!this.state.paused) {
      this.clearTimers();
    } else {
      this.timer();
    }
    this.setState({ paused: !this.state.paused });
  }

  // nextSlide and prevSlide
  // Resets timers and performs necessary `Slide` calculations
  // Local state used to limit `setState` calls
  nextSlide = () => {
    this.restartTimers();
    let state = {
      slide: this.state.slide + 1,
      translate: this.state.translate
    };
    state.slide < this.state.images.length ? state.translate += 100 : state.slide = state.translate = 0;
    this.setState(state);
  }

  prevSlide = () => {
    this.restartTimers();
    let state = {
      slide: this.state.slide - 1,
      translate: this.state.translate
    }
    state.translate === 0 && state.slide < 0 ? state = { translate: 200, slide: this.state.images.length -1} : state.translate -= 100;
    this.setState(state);
  }

  // Simple slide translation calculation for SlideIndicator
  goToSlide = (slideNumber) => {
    this.restartTimers();
    let state = { 
      slide: slideNumber,
      translate: slideNumber * 100 
    }
    this.setState(state);
  }

  render() {
    return(
      <div className="wrapper">
        <Timer 
          timeLeft={this.state.timeLeft} />
        <div id="navigation">
          <Navigation 
            changeSlide={this.prevSlide} 
            text="prev"
            icon={faAngleLeft} />
          <Navigation 
            changeSlide={this.nextSlide} 
            text="next"
            icon={faAngleRight} />
        </div>
        <div id="slideWrapper" style={{
          display: 'inline-flex'
        }}>
          {
            this.state.images.map((data, i) => (
              <Slide 
                data={data}
                pauseSlides={this.pauseSlides}
                translate={this.state.translate}
                key={i} />
            ))
          }
        </div>
        <div id="indicatorWrapper">
          {
            this.state.images.map((data, i) => (
              <SlideIndicator
                classes={ this.state.slide === i ? "indicator active" : "indicator" } 
                data={data}
                key={i}
                onClick={e => this.goToSlide(i)} />
            ))
          }
        </div>
      </div>
    );
  }

}

export default Carousel;