/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import '../index.scss';
import Arrow from './Arrow'
import CarouselSlide from './CarouselSlide'
import CarouselIndicator from './CarouselIndicator'
import {getWidth, once, touch2Mouse} from '../utils'

// Carousel wrapper component
class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.goToSlide = this.goToSlide.bind(this);
    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);      

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

  componentDidMount() {
    document.addEventListener("touchstart", touch2Mouse, true);
    document.addEventListener("touchmove", touch2Mouse, true);
    document.addEventListener("touchend", touch2Mouse, true);    
  }

  componentWillUnmount() {
    document.removeEventListener("touchstart", touch2Mouse, true);
    document.removeEventListener("touchmove", touch2Mouse, true);
    document.removeEventListener("touchend", touch2Mouse, true);
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

  mouseDownHandler(e) {
    e.preventDefault();            
    this.setState({
      clientX: e.clientX,
      next: once(this.goToNextSlide),
      prev: once(this.goToPrevSlide)
    });
    let currentTarget = e.currentTarget; 
    currentTarget.onmousemove = this.mouseMoveHandler.bind(this);    
    document.onmouseup = e => {
        //console.log(currentTarget);         
        currentTarget.onmousemove = null;
        document.onmouseup = null;
    };            
  }
  
  mouseMoveHandler(e) {    
    //let next = once(this.goToNextSlide);
    //let prev = once(this.goToPrevSlide);
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
        <Arrow direction={"left"} handleClick={e => this.goToPrevSlide(e)} />
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
              onMouseDown={e => this.mouseDownHandler(e)}              
              width={getWidth()}                             
            />
          )}
        </div>

        <Arrow direction={"right"} handleClick={e => this.goToNextSlide(e)} />

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

export default Carousel