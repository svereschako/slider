/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import '../index.scss';

class CarouselSlide extends React.Component {  
  render() {
    let div;
    if(this.props.slide.url){
      div = <div
        className={
          this.props.index == this.props.activeIndex
            ? "carousel__slide carousel__slide--active"
            : "carousel__slide"
        }
        onMouseDown={this.props.onMouseDown}
        css={css`
              background-image: url('${this.props.slide.url}');
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center;
              width: ${this.props.width}px;
        `}             
      >              
      </div>
    }
    if(this.props.slide.content){
      div = <div
        className={
          this.props.index == this.props.activeIndex
            ? "carousel__slide carousel__slide--active"
            : "carousel__slide"
        }
        onMouseDown={this.props.onMouseDown}
        css={css`
              width: ${this.props.width}px;
        `}               
      >
        <p className="carousel-slide__content">{this.props.slide.content}</p>              
      </div>
    }
    return (
      div
    );
  }
}

export default CarouselSlide