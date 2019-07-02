import React from 'react';
import PropTypes from 'prop-types';
import scrollListener from './scrollListener';
import style from './lazyload.scss';

const imageLoaded = {};
class LazyLoadImage extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string
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
    this.onImgLoadError = this.onImgLoadError.bind(this);
    if (!this.state.loadImg) {
      this.listenerId = scrollListener.subscribe(this.loadImage);
    }
    this.yPosition = null;
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.loadImg !== this.state.loadImg || nextProps.src !== this.props.src;
  }

  onEleLoad (e) {
    this._elem = e;
    this.loadImage();
  }

  loadImage () {
    if (this.state.loadImg) {
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
      const relativePosition = this._elem.getBoundingClientRect && this._elem.getBoundingClientRect() || {};
      const yoffset = relativePosition.y || 0;
      if (windowHeight >= yoffset) {
        this.setState({ loadImg: true });
        if (this.listenerId) {
          scrollListener.unsubscribe(this.listenerId);
        }
        imageLoaded[this.props.src] = true;
      }
    });
  }

  onImgLoadError () {
    this.props.onError && this.props.onError();
  }

  onImgLoaded () {
    this._elem.classList.add('loaded');
    this.props.onImgLoaded && this.props.onImgLoaded();
  }

  componentWillUnmount () {
    if (this.listenerId) {
      scrollListener.unsubscribe(this.listenerId);
    }
  }

  render () {
    const props = {
      onError: this.onImgLoadError
    };

    const { cachedImg, src, clsName } = this.props;
    const { loadImg } = this.state;

    if (!cachedImg) {
      props.onLoad = this.onImgLoaded;
    }

    if (loadImg) {
      props.src = src;
    }
    return <img {...props} className={clsName} style={{ height: '200px', width: '300px' }} ref={this.onEleLoad} onClick={this.props.onClick} />;
  }
}

export default LazyLoadImage;
