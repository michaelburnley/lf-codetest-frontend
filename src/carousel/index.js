import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './carousel.scss';

// Stateless Components

// Slide
// Handles slide movement and renders textblocks/images

const Slide = ({ data, pauseSlides, direction, slide }) => {  
  let style = {
    background: `url(${data.image})`,
    backgroundPosition: `${data.bp}`,
    backgroundSize: 'cover',
  }
  return (
    <TransitionGroup
      className="slide"
      childFactory={child => React.cloneElement(child, { classNames: "slide-" + direction + " slider" })} >
    <CSSTransition
      timeout={{
        enter: 500,
        exit: 500
      }}
      onEntered={(el) => {
        el.setAttribute("class", "slide-left slider");
      }}
      key={data.image}
      >
      <div
        onMouseOver={pauseSlides}
        onMouseLeave={pauseSlides}>
        <TextBlocks data={data}/>
        {
          data.button.forEach(btn => <FancyButton text={btn} />)
        }
        <img style={style} className={"slide-" + slide} src={data.image} alt={data.title}/>
      </div>
    </CSSTransition>
    </TransitionGroup>
  )
}

// Timer  
// Renders time change
const Timer = ({ timeLeft }) => (
  <div>Time to Slide Change: {timeLeft / 1000}s</div>
)

const FancyButton = ({ text }) => (
  <div className={"button "}>{text}</div>
);

// TextBlocks
// Renders text that sits within the Slide component
const TextBlocks = ({ data: { title, subtitle, button, classes }}) => (
    <div className={"text-blocks " + classes}>
      <div className="title">{title}</div>
      {
        button
      }
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
      slide: 1,       // current slide
      interval: 5000, // time between slides
      timeLeft: 5000, // countdown timer
      paused: false,  // flag for hover-over pause
      direction: "left",
      images: [
        {
          image: "/slide1.jpg",
          bp: '-82px',
          classes: "center",
          title: "Spring 2019",
          subtitle: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
          button: [
              <FancyButton text="Shop Womens" />,
              <FancyButton text="Shop Mens" />,
          ]
        },
        {
          image: "/slide2.jpg",
          bp: '-425px',
          classes: "left",
          title: "Back in Black",
          subtitle: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
          button: [
              <FancyButton text="Shop The Collection" />,
          ]
        },
        {
          image: "/slide3.jpg",
          bp: '-150px',
          classes: "right",
          title: "The New \"it\" Bag",
          subtitle: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
          button: [
              <FancyButton text="Shop Handbags" />,
          ]
        },
      ] // image data array
    };
    this.original_arr = this.state.images.slice();
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
    this.setState({ timeLeft: this.state.interval });
    clearInterval(this.countdown);
    clearInterval(this.sliderInterval);
  }

  // Helper function for running both above methods
  restartTimers = async () => {
    await this.clearTimers();
    await this.timer();
    // this.setState({ direction: "left"})
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
    let [first, ...rest] = this.state.images;
    let images = [...rest, first];
    let state = {
      slide: this.state.slide + 1,
      images: images,
      direction: "left"
    };
    state.slide > this.state.images.length && (state.slide = 1);
    this.setState(state);
    this.restartTimers();
  }

  prevSlide = () => {
    let last = this.state.images.slice(-1);
    let rest = this.state.images.slice(0, -1);
    let images = [...last, ...rest];
    let state = {
      slide: this.state.slide - 1,
      images: images,
      direction: "right"
    };
    state.slide < 0 && (state.slide = 3);
    this.setState(state);
    this.restartTimers();
  }

  // Simple slide translation calculation for SlideIndicator
  goToSlide = (slideNumber) => {
    let arr = this.state.images;
    let before = arr.splice(0, slideNumber);
    let images = [...arr, ...before];

    let state = { 
      slide: slideNumber + 1,
      images: images 
    }
    this.setState(state);
    this.restartTimers();
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
              key={i}
              slide={this.state.slide}
              pauseSlides={this.pauseSlides}
              direction={this.state.direction} />
          ))
         }
        </div>
        <div id="indicatorWrapper">
          {
            this.original_arr.map((data, i) => (
              <SlideIndicator
                classes={ this.state.slide === i + 1 ? "indicator active" : "indicator" } 
                data={data}
                key={i + 1}
                onClick={e => this.goToSlide(i)} />
            ))
          }
        </div>
      </div>
    );
  }

}

export default Carousel;