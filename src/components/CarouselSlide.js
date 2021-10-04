/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import '../index.scss';

class CarouselSlide extends React.Component {  
  render() {
    let div;
    if(this.props.slide.imgUrl){
      div = <div
        className={
          this.props.index == this.props.activeIndex
            ? "carousel__slide carousel__slide--active"
            : "carousel__slide"
        }
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}        
        onPointerDown={this.props.onPointerDown}         
        css={css`
              background-image: url('${this.props.slide.imgUrl}');
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              width: ${this.props.width}px;
        `}             
      >              
      </div>
    }
    if(this.props.slide.txt){
      div = <div
        className={
          this.props.index == this.props.activeIndex
            ? "carousel__slide carousel__slide--active"
            : "carousel__slide"
        }
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}        
        onPointerDown={this.props.onPointerDown} 
        css={css`
              width: ${this.props.width}px;
        `}               
      >
        <span className="carousel-slide__content">{this.props.slide.txt}</span>              
      </div>
    }
    if(this.props.slide.vidUrl){
      div = <div
        className={
          this.props.index == this.props.activeIndex
            ? "carousel__slide carousel__slide--active"
            : "carousel__slide"
        }
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}        
        onPointerDown={this.props.onPointerDown} 
        css={css`
              width: ${this.props.width}px;
        `}               
      >
        <iframe src={this.props.slide.vidUrl} width="100%" height="100%" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameBorder="0">
        </iframe>             
      </div>
    }
    return (
      div
    );
  }
}

export default CarouselSlide
