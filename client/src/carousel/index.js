import React, { Component } from 'react';

const Slide = ({ image, title, subtitle, pauseSlides }) => {  
  return (
    <div onMouseOver={pauseSlides} className="slide">
      <div className="text-blocks">
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>
      <img src={image} alt={title}/>
    </div>
  )
}

const SlideIndicator = ({ current_slide, timer, onClick }) => {
  return(
    <div id="indicator" onClick={onClick}>
      <div>Current Slide: {current_slide + 1}</div>
      <div>Time to Change: {timer}</div>
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
      paused: false,
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
  }

  componentDidMount() {
    setInterval(() => {
      this.nextSlide();
    }, this.state.interval);
  }

  pauseSlides() {
    console.log("paused")
    this.setState({ paused: true });
  }

  nextSlide() {
    let a = this.state.slide + 1;
    a < this.state.images.length ? this.setState({ slide: a }) : this.setState({ slide: 0 });
  }

  prevSlide() {
    let a = this.state.slide - 1;
    a < 0 ? this.setState({ slide: this.state.images.length - 1 }) : this.setState({ slide: a });
  }

  goToSlide(slideNumber) {
    this.setState({ slide: slideNumber });
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
              onClick={e => this.goToSlide(i)} />
          ))
        }
        <div id="slideWrapper" style={{
          display: 'inline-flex'
        }}>
          {
            this.state.images.map((data, i) => (
              <Slide 
                image={data['image']}
                title={data['title']} 
                subtitle={data['subtitle']} 
                pauseSlides={this.pauseSlides}
                key={i} />
            ))
          }
        </div>
      </div>
    );
  }

}

export default Carousel;