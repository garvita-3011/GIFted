import React from 'react';
import debounce from 'lodash.debounce';
import Service from '../../service';
import LazyLoadImage from '../../components/LazyImg';
import './style.scss';


export default class Home extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      gifs: [],
      playingId: '',
      searchString: '',
      loading: false,
      error: false,
      offset: 0,
      customSearch: false,
      limit: 25,
      isHovered: {}
    };

    window.onscroll = debounce(this.onScroll, 100);
  }

  componentDidMount () {
    this.getTrendingGIFs();
  }

  getTrendingGIFs = async () => {
    const trending = await Service.fetchTrendingGIFs();
    this.setState({
      gifs: trending.data,
      loading: false,
      offset: 0
    });
  }

  animateSrc = (item) => {
    const { playingId } = this.state;
    this.setState({
      playingId: playingId !== item.id ? item.id : ''
    });
  }

  searchGIF = (event) => {
    this.setState({
      searchString: event.target.value
    });
  }

  onClick = () => {
    this.getGIF(false);
  }

  getGIF = async (loadMore = false) => {
    const { searchString, limit } = this.state;
    if (!searchString) {
      return;
    }
    let { offset, gifs } = this.state;
    this.setState({
      loading: true
    });
    if (loadMore) {
      offset += limit + 1;
    }
    const searchResult = await Service.fetchSearchedGIF({ searchString, offset, limit });
    if (loadMore) {
      gifs.push(...searchResult.data);
    } else {
      gifs = searchResult.data;
    }
    this.setState({
      gifs,
      customSearch: true,
      offset,
      loading: false
    });
  }

  enterPressed = (event) => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      this.getGIF(false);
    }
  }

  onScroll = () => {
    const { loading, error, customSearch } = this.state;
    if (loading || error) {
      return;
    }
    if (
      window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight && customSearch
    ) {
      this.getGIF(true);
    }
  }

  handleMouseEnter = index => {
    this.setState(prevState => ({ isHovered: { ...prevState.isHovered, [index]: true } }));
  };

  handleMouseLeave = index => {
    this.setState(prevState => ({ isHovered: { ...prevState.isHovered, [index]: false } }));
  };


  render () {
    const {
      gifs, playingId, searchString, customSearch, isHovered
    } = this.state;
    const buttonClass = searchString ? 'button-active' : 'button-disabled';
    return (
      <div>
        <div className="search-box">
          <div className="input-div">
            <input
              type="text"
              onChange={this.searchGIF}
              value={searchString}
              id="search-input"
              placeholder="Search GIF"
              onKeyPress={this.enterPressed}
            />
          </div>
          <button onClick={this.onClick} type="submit" className={`button ${buttonClass}`}>Search</button>
        </div>

        <div className="gif-header">
            Showing
          {' '}
          {customSearch ? `"${searchString}"` : '"trending"'}
        </div>
        <div className="main-container">
          {gifs.length ? gifs.map((item, index) => {
            const isPlaying = item.id === playingId;
            const imgSrc = isPlaying ? 'fixed_height' : 'fixed_height_still';
            const imgOpacityClass = isPlaying ? 'opaque' : 'transparent';
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
                  clsName={`gif-view ${imgOpacityClass} ${elevationClass}`}
                />
              </div>
            );
          })
            : null
          }
        </div>
      </div>
    );
  }
}
