/** @jsx jsx */
import React from 'react';
import ReactDOM from 'react-dom';
import { css, jsx } from '@emotion/core';
import './index.scss';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

const carouselContainer = document.querySelector(".carousel-container");
const getWidth = () => window.innerWidth;
function once(fn, context) { 
    var result;
    return function() { 
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
}

// Data for carousel
const carouselSlidesData = [
  {    
    url: "https://images.unsplash.com/photo-1542261777448-23d2a287091c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
  }, {    
    url: "https://images.unsplash.com/photo-1542241647-9cbbada2b309?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1049&q=80"
  }, {    
    url: "https://images.unsplash.com/photo-1542137722061-efd1cbdf156c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
  }, {    
    url: "https://images.unsplash.com/photo-1414438992182-69e404046f80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1162&q=80"
  }, {    
    url: "https://images.unsplash.com/photo-1542332213-31f87348057f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
  }, {    
    url: "https://images.unsplash.com/photo-1542500186-6edb30855637?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
  }, {    
    url: "https://images.unsplash.com/photo-1542395975-d6d3ddf91d6e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
  }
];

class CarouselLeftArrow extends React.Component {
  render() {
    return (
      <a
        href="#"
        className="carousel__arrow carousel__arrow--left"
        onClick={this.props.onClick}
      >
        <span className="fa fa-2x fa-angle-left" />
      </a>
    );
  }
}

class CarouselRightArrow extends React.Component {
  render() {
    return (
      <a
        href="#"
        className="carousel__arrow carousel__arrow--right"
        onClick={this.props.onClick}
      >
        <span className="fa fa-2x fa-angle-right" />
      </a>
    );
  }
}

class CarouselIndicator extends React.Component {
  render() {
    return (
      <li>
        <a
          className={
            this.props.index == this.props.activeIndex
              ? "carousel__indicator carousel__indicator--active"
              : "carousel__indicator"
          }
          onClick={this.props.onClick}
        />
      </li>
    );
  }
}


class CarouselSlide extends React.Component {  
  render() {
    return (
      <div
        className={
          this.props.index == this.props.activeIndex
            ? "carousel__slide carousel__slide--active"
            : "carousel__slide"
        }
        onPointerDown={this.props.onPointerDown}
        css={css`
              background-image: url('${this.props.slide.url}');
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              width: ${this.props.width}px;
        `}             
      >              
      </div>
    );
  }
}

// Carousel wrapper component
class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.goToSlide = this.goToSlide.bind(this);
    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    this.pointerDownHandler = this.pointerDownHandler.bind(this);      

    this.state = {
      activeIndex: 0,
      threshold: 50,
      clientX: 0,
      translate: 0,
      transition: 0.45,
      next: null,
      prev: null                         
    };
  }

  goToSlide(index) {
    this.setState({
      activeIndex: index,
      translate: index * getWidth()
    });
  }

  goToPrevSlide(e) {
    e.preventDefault();
    let index = this.state.activeIndex;
    let { slides } = this.props;
    let slidesLength = slides.length;    

    if (index < 1) {
      index = slidesLength;
    }

    --index;   

    this.setState({
      activeIndex: index,
      translate: index * getWidth()     
    });
  }

  goToNextSlide(e) {
    e.preventDefault();
    let index = this.state.activeIndex;
    let { slides } = this.props;
    let slidesLength = slides.length - 1;    

    if (index === slidesLength) {
      index = -1;      
    }

    ++index;    

    this.setState({
      activeIndex: index,
      translate: index * getWidth()      
    });    
  }  

  pointerDownHandler(e) {
    e.preventDefault();            
    this.setState({
      clientX: e.clientX,
      next: once(this.goToNextSlide),
      prev: once(this.goToPrevSlide)
    });
    let currentTarget = e.currentTarget; 
    currentTarget.onpointermove = this.pointerMoveHandler.bind(this);
    document.onpointerup = e => {
        //console.log(currentTarget);         
        currentTarget.onpointermove = null;
        document.onpointerup = null;
    };         
  }
  
  pointerMoveHandler(e) {    
    let next = once(this.goToNextSlide);
    let prev = once(this.goToPrevSlide);
    if(Math.abs(e.pageX-this.state.clientX) > this.state.threshold){
      if (e.pageX > this.state.clientX){
        this.state.next(e);
      }             
      else 
        this.state.prev(e);        
      }              
  }
  
  render() {      
    return (
      <div className="carousel">
        <CarouselLeftArrow onClick={e => this.goToPrevSlide(e)} />
        <div className="carousel_slides"
          css={css`
                transform: translateX(-${this.state.translate}px);
                transition: transform ease-out ${this.state.transition}s;
                width: ${getWidth()*this.props.slides.length}px;                                
                display: flex;                
              `}    
        >               
          {this.props.slides.map((slide, index) =>
            <CarouselSlide
              key={index}
              index={index}
              activeIndex={this.state.activeIndex}
              slide={slide}
              onPointerDown={e => this.pointerDownHandler(e)}
              width={getWidth()}                             
            />
          )}
        </div>

        <CarouselRightArrow onClick={e => this.goToNextSlide(e)} />

        <ul className="carousel__indicators">
          {this.props.slides.map((slide, index) =>
            <CarouselIndicator
              key={index}
              index={index}
              activeIndex={this.state.activeIndex}
              isActive={this.state.activeIndex==index} 
              onClick={e => this.goToSlide(index)}
            />
          )}
        </ul>
      </div>
    );
  }
}

// Render Carousel component
ReactDOM.render(<Carousel slides={carouselSlidesData} />, carouselContainer);
