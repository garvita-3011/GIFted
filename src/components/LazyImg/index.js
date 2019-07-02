import React from 'react';
import PropTypes from 'prop-types';
import scrollListener from './scrollListener';
import './style.scss';

const imageLoaded = {};
class LazyLoadImage extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      loadImg: !!imageLoaded[props.src]
    };
    this.cachedImg = !!imageLoaded[props.src];
    this._elem = null;
    this.loadImage = this.loadImage.bind(this);
    this.onEleLoad = this.onEleLoad.bind(this);
    this.onImgLoaded = this.onImgLoaded.bind(this);
    if (!this.state.loadImg) {
      this.listenerId = scrollListener.subscribe(this.loadImage);
    }
    this.yPosition = null;
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { loadImg } = this.state;
    const { src } = this.props;
    return nextState.loadImg !== loadImg || nextProps.src !== src;
  }

  componentWillUnmount () {
    if (this.listenerId) {
      scrollListener.unsubscribe(this.listenerId);
    }
  }

  onEleLoad (e) {
    this._elem = e;
    this.loadImage();
  }

  loadImage () {
    const { loadImg } = this.state;
    const { src } = this.props;
    if (loadImg) {
      return;
    }
    if (!this._elem) {
      return;
    }
    setTimeout(() => {
      if (!this._elem) {
        return;
      }
      const windowHeight = window.innerHeight;
      const relativePosition = (this._elem.getBoundingClientRect && this._elem.getBoundingClientRect()) || {};
      const yoffset = relativePosition.y || 0;
      if (windowHeight >= yoffset) {
        this.setState({ loadImg: true });
        if (this.listenerId) {
          scrollListener.unsubscribe(this.listenerId);
        }
        imageLoaded[src] = true;
      }
    });
  }

  onImgLoaded () {
    const { index, onImgLoaded } = this.props;
    this._elem.classList.add('loaded');
    onImgLoaded && onImgLoaded(index);
  }

  render () {
    const props = {
      onError: this.onImgLoadError
    };

    const {
      src, clsName, onClick, title = ''
    } = this.props;
    const { loadImg } = this.state;

    if (loadImg) {
      props.src = src;
    }
    return (
      <img
        {...props}
        className={`${clsName} lazy-img-loader`}
        style={{ height: '200px', width: '300px' }}
        ref={this.onEleLoad}
        onClick={onClick}
        alt={title}
        role="presentation"
        onLoad={this.onImgLoaded}
      />
    );
  }
}

export default LazyLoadImage;
