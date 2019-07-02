import React, { Fragment } from 'react';
import debounce from 'lodash.debounce';
import Service from '../../service';
import './style.scss';
import GIFView from '../../components/GIFView';


export default class Home extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      gifs: [],
      searchString: '',
      loading: true,
      error: false,
      offset: 0,
      customSearch: false,
      limit: 25
    };

    window.onscroll = debounce(this.onScroll, 100);
  }

  componentDidMount () {
    this.getTrendingGIFs();
  }

  getTrendingGIFs = async () => {
    try {
      const trending = await Service.fetchTrendingGIFs();
      this.setState({
        gifs: trending.data,
        loading: false,
        offset: 0
      });
    } catch (e) {
      this.setState({
        error: true,
        loading: false
      });
    }
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
      loading: !loadMore
    });
    if (loadMore) {
      offset += limit + 1;
    }
    try {
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
    } catch (e) {
      this.setState({
        error: true,
        loading: false
      });
    }
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
      (window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight) && customSearch
    ) {
      this.getGIF(true);
    }
  }

  renderLoader = () => (
    <div className="loader-container">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="" />
    </div>
  )

  render () {
    const {
      gifs, searchString, customSearch, loading, error
    } = this.state;
    const buttonClass = searchString ? 'button-active' : 'button-disabled';
    return (
      <Fragment>
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
          {customSearch ? `results for "${searchString}"...` : '"trending" GIFs...'}
        </div>
        {gifs.length && !loading ? <GIFView gifs={gifs} /> : this.renderLoader()}
        {(!gifs.length && error) && this.renderErrorState()}
      </Fragment>
    );
  }
}
