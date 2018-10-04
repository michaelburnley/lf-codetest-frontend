import React, { Component } from 'react';

const Slide = ({ image, title, subtitle, pauseSlides }) => {
  const styles = {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 60%',
    width: '100%',
    height: '790px'
  }
  
  return (
    <div onMouseOver={pauseSlides} style={styles} className="slide">
      <div>{title}</div>
      <div>{subtitle}</div>
    </div>
  )
}

const Indicator = ({ slides, current_slide, timer}) => {
  return(
    <div>
      <div>Number of slides: {slides}</div>
      <div>Current Slide: {current_slide + 1}</div>
      <div>Time to Change: {timer}</div>
    </div>
  )
}

const Navigation = ({ changeSlide, text }) => {
  return(
    <div>
      <div onClick={changeSlide} className={text}>{text}</div>
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
          subtitle: "I am a sentence below the title."
        },
        {
          image: "/slide2.jpg",
          title: "Second Slide",
          subtitle: "I am a sentence below the title."
        },
        {
          image: "/slide3.jpg",
          title: "Third Slide",
          subtitle: "I am a sentence below the title."
        },
      ]
    };
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.pauseSlides = this.pauseSlides.bind(this);
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
    a < 3 ? this.setState({ slide: a }) : this.setState({ slide: 0 });
  }

  prevSlide() {
    let a = this.state.slide - 1;
    a < 0 ? this.setState({ slide: 2 }) : this.setState({ slide: a });
  }

  render() {
    return(
      <div className="wrapper">
        <Navigation 
          changeSlide={this.nextSlide} 
          text="next" />
        <Navigation 
          changeSlide={this.prevSlide} 
          text="prev" />
        <Indicator
          slides={this.state.images.length}
          current_slide={this.state.slide} />

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
    );
  }

}

export default Carousel;