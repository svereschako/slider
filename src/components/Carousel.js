/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import '../index.scss';
import Arrow from './Arrow'
import CarouselSlide from './CarouselSlide'
import CarouselIndicator from './CarouselIndicator'
import {getWidth, once, getCoordsFromEvent} from '../utils'

// Carousel wrapper component
class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.goToSlide = this.goToSlide.bind(this);
    this.goToPrevSlide = this.goToPrevSlide.bind(this);
    this.goToNextSlide = this.goToNextSlide.bind(this);
    this.startHandler = this.startHandler.bind(this);
    this.endHandler = this.endHandler.bind(this);
    this.moveHandler = this.moveHandler.bind(this);      

    this.state = {
      activeIndex: 0,
      threshold: 50,
      clientX: 0,
      translate: 0,
      transition: 0.45,
      next: null,
      prev: null,
      currentTarget: null                         
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

  startHandler(e) {
    e.preventDefault();                    
    this.setState({
      clientX: getCoordsFromEvent(e).clientX,
      next: once(this.goToNextSlide),
      prev: once(this.goToPrevSlide)
    });
    if(e.touches && e.touches.length > 1) {      
      let currentTarget = e.touches[0].target;
      if(currentTarget.className.indexOf("carousel__slide--active") ==-1){
        while(currentTarget.className.indexOf("carousel__slide--active") ==-1)
          currentTarget = currentTarget.parentNode;
      }
      this.currentTarget = currentTarget;
      currentTarget.ontouchmove = this.moveHandler;
      document.ontouchend = this.endHandler;
      document.ontouchcancel = this.endHandler;
      return;
    }

    // Add the move and end listeners
    if (window.PointerEvent) {      
      this.currentTarget = e.currentTarget;
      e.currentTarget.onpointermove = this.moveHandler;
      document.onpointerup = this.endHandler;
      document.onpointercancel = this.endHandler;        
      //console.log(e.target);
    } else {
      // Add Mouse Listeners      
      this.currentTarget = e.currentTarget;    
      e.currentTarget.onmousemove = this.moveHandler;
      document.onmouseup = this.endHandler;
    }         
  }
  
  moveHandler(e) {    
    //let next = once(this.goToNextSlide);
    //let prev = once(this.goToPrevSlide);    
    if(Math.abs(getCoordsFromEvent(e).pageX-this.state.clientX) > this.state.threshold){
      if (getCoordsFromEvent(e).pageX > this.state.clientX){
        this.state.next(e);
      }             
      else 
        this.state.prev(e);        
      }              
  }  
  
  endHandler(e) {
    e.preventDefault();

    if(e.touches && e.touches.length > 0) {      
      this.currentTarget.ontouchmove = null;
      document.ontouchend = null;
      document.ontouchcancel = null;
      return;
    }
    // Remove Event Listeners
    if (window.PointerEvent) {            
      this.currentTarget.onpointermove = null;
      document.onpointerup = null;
      document.onpointercancel = null;            
      //console.log(e.target, e.currentTarget);
    } else {
      // Remove Mouse Listeners                 
        this.currentTarget.onmousemove = null;        
        document.onmouseup = null;          
    }
  }

  render() {
    let slides;
    if (window.PointerEvent){
      slides = this.props.slides.map((slide, index) =>
        <CarouselSlide
          key={index}
          index={index}
          activeIndex={this.state.activeIndex}
          slide={slide}
          onPointerDown={e => this.startHandler(e)}                        
          width={getWidth()/2}                             
        />
      );
    } else {
      slides = this.props.slides.map((slide, index) =>
        <CarouselSlide
          key={index}
          index={index}
          activeIndex={this.state.activeIndex}
          slide={slide}          
          onMouseDown={e => this.startHandler(e)}
          onTouchStart={e => this.startHandler(e)}                        
          width={getWidth()/2}                             
        />
      );
    }     
    return (
      <div className="carousel"
        css={css`
              width: ${getWidth()/2}px;
        `}
      >
        <Arrow direction={"left"} handleClick={e => this.goToPrevSlide(e)} />
        <div className="carousel_slides"
          css={css`
                transform: translateX(-${this.state.translate}px);
                transition: transform ease-out ${this.state.transition}s;
                width: ${getWidth()*this.props.slides.length}px;                                
                display: flex;                
              `}    
        >               
          {slides}
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


  

    
    
            
