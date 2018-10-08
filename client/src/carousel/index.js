import React, { Component } from 'react';

const Slide = ({ data, pauseSlides, translate }) => {  
  const styles = { 
    transform: `translateX(-${translate}%`,
  };
  return (
    <div onMouseOver={pauseSlides} onMouseLeave={pauseSlides} className="slide" style={styles}>
      <TextBlocks data={data}/>
      <img src={data.image} alt={data.title}/>
    </div>
  )
}

const TextBlocks = ({ data: { title, subtitle }}) => (
    <div className="text-blocks">
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle}</div>
    </div>
  )

const SlideIndicator = ({ current_slide, timer, onClick }) => {
  return(
    <div id="indicator" onClick={onClick}>
      <div>Current Slide: {current_slide + 1}</div>
      <div>Time to Change: {timer / 1000}s</div>
    </div>
  )
}

const Navigation = ({ changeSlide, text }) => {
  return(
    <div className={text}>
      <div onClick={changeSlide}>{text}</div>
    </div>
  )
}


class Carousel extends Component {
  constructor() {
    super();
    this.state = {
      slide: 0,
      interval: 5000,
      timeLeft: 5000,
      paused: false,
      translate: 0,
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
      ]
    };
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.pauseSlides = this.pauseSlides.bind(this);
    this.goToSlide = this.goToSlide.bind(this);
    this.timer = this.timer.bind(this);
    this.clearTimers = this.clearTimers.bind(this);
    this.restartTimers = this.restartTimers.bind(this);
  }

  componentDidMount() {
    this.timer();
  }

  timer() {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, this.state.interval);
    this.countdown = setInterval(() => {
      this.setState({ timeLeft: this.state.timeLeft - 1000})
    }, 1000);
  }

  clearTimers() {
    clearInterval(this.sliderInterval);
    clearInterval(this.countdown);
    this.setState({ timeLeft: this.state.interval });
  }

  restartTimers() {
    this.clearTimers();
    this.timer();
  }

  pauseSlides() {
    if(!this.state.paused) {
      this.clearTimers();
    } else {
      this.timer();
    }
    this.setState({ paused: !this.state.paused });
  }

  nextSlide() {
    this.restartTimers();
    let state = {
      slide: this.state.slide + 1,
      translate: this.state.translate
    };
    state.slide < this.state.images.length ? state.translate += 100 : state.slide = state.translate = 0;
    this.setState(state);
  }

  prevSlide() {
    this.restartTimers();
    let state = {
      slide: this.state.slide - 1,
      translate: this.state.translate
    }
    state.translate === 0 && state.slide < 0 ? state = { translate: 200, slide: this.state.images.length -1} : state.translate -= 100;
    this.setState(state);
  }

  goToSlide(slideNumber) {
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
        <div id="navigation">
          <Navigation 
            changeSlide={this.nextSlide} 
            text="next" />
          <Navigation 
            changeSlide={this.prevSlide} 
            text="prev" />
        </div>
        {
          this.state.images.map((data, i) => (
            <SlideIndicator
              current_slide={this.state.slide} 
              key={i}
              timer={this.state.timeLeft}
              onClick={e => this.goToSlide(i)} />
          ))
        }
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
      </div>
    );
  }

}

export default Carousel;