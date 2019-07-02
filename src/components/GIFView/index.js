import React from 'react';
import LazyLoadImage from '../LazyImg';
import './style.scss';

export default class GIFView extends React.Component {
  state = {
    playingId: '',
    isHovered: {},
    imageLoaded: {}
  }

  animateSrc = (item) => {
    const { playingId } = this.state;
    this.setState({
      playingId: playingId !== item.id ? item.id : ''
    });
  }

  handleMouseEnter = index => {
    const { imageLoaded } = this.state;
    if (index in imageLoaded) {
      this.setState(prevState => ({ isHovered: { ...prevState.isHovered, [index]: true } }));
    }
  };

  handleMouseLeave = index => {
    const { imageLoaded } = this.state;
    if (index in imageLoaded) {
      this.setState(prevState => ({ isHovered: { ...prevState.isHovered, [index]: false } }));
    }
  };

  onImgLoaded = (index) => {
    this.setState(prevState => ({ imageLoaded: { ...prevState.imageLoaded, [index]: true } }));
  }

  render () {
    const { gifs } = this.props;
    const { playingId, isHovered } = this.state;
    return (
      <div className="main-container">
        {gifs.map((item, index) => {
          const isPlaying = item.id === playingId;
          const imgSrc = isPlaying ? 'fixed_height' : 'fixed_height_still';
          const elevationClass = isPlaying ? 'elevation' : '';
          return (
            <div
              key={item.id}
              className="gif-container"
              onClick={this.animateSrc.bind(this, item)}
              onMouseEnter={() => this.handleMouseEnter(index)}
              onMouseLeave={() => this.handleMouseLeave(index)}
              role="presentation"
            >
              {isHovered[index]
                && (
                  <div className="gif-overlay">
                    <i className="material-icons">{!isPlaying ? 'play_arrow' : 'pause'}</i>
                  </div>
                )
              }
              <LazyLoadImage
                src={item.images[imgSrc].url}
                alt="gif"
                clsName={`gif-view ${elevationClass}`}
                onImgLoaded={this.onImgLoaded}
                title={item.title}
                index={index}
              />
            </div>
          );
        })
        }
      </div>
    );
  }
}
