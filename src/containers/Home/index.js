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

  /*
  * returns a list of trending gifs
  */
  getTrendingGIFs = async () => {
    try {
      const trending = await Service.fetchTrendingGIFs();
      this.setState({
        gifs: trending.data,
        loading: false,
        offset: 0,
        customSearch: false,
        error: false
      });
    } catch (e) {
      this.setState({
        error: true,
        loading: false
      });
    }
  }

  /*
  * sets the value of search string as entered in input box, resets gifs list to trending if search is empty
  */

  searchGIF = (event) => {
    this.setState({
      searchString: event.target.value
    }, () => {
      // eslint-disable-next-line react/destructuring-assignment
      if (!this.state.searchString) {
        this.getTrendingGIFs();
      }
    });
  }

  /*
  * clears the search input box and resets the gifs list to trending
  */

  clearSearch = () => {
    this.setState({
      searchString: '',
      customSearch: false
    }, () => {
      this.getTrendingGIFs();
    });
  }

  /*
  * search button click
  */

  onClick = () => {
    this.getGIF(false);
  }

  /*
  * search button enter key press
  */

  enterPressed = (event) => {
    const code = event.keyCode || event.which;
    if (code === 13) {
      this.getGIF(false);
    }
  }

  /*
  * hits GIPHY search API to return the list if gifs matching search text
  * Empty state rendred if no matching gif is found.
  */

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
        loading: false,
        error: false
      });
    } catch (e) {
      this.setState({
        gifs: [],
        error: true,
        loading: false
      });
    }
  }

  /*
  * on scroll down fetches next set of gifs matching the search string.
  */

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

  /*
  * renders the loading state
  */

  renderLoader = () => (
    <div className="loader-container">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" alt="" />
    </div>
  )

  /*
  * renders the empty state
  */

  renderNoResultsFound = () => (
    <div className="empty-state-container">
      <i className="material-icons">sentiment_dissatisfied</i>
      <span>OOPS! No results Found. Please try some other text.</span>
    </div>
  )

  /*
  * renders the error state
  */

  renderError = () => (
    <div className="empty-state-container">
      <i className="material-icons">error</i>
      <span>OOPS! Something went wrong. Please try after some time.</span>
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
            <i
              className={`material-icons ${searchString.length ? 'opaque' : ''}`}
              onClick={this.clearSearch}
              role="presentation"
            >
              clear
            </i>
          </div>
          <button onClick={this.onClick} type="submit" className={`button ${buttonClass}`}>Search</button>
        </div>

        <div className="gif-header">
            Showing
          {' '}
          {customSearch ? `results for "${searchString}"...` : '"trending" GIFs...'}
        </div>
        {loading && this.renderLoader()}
        {error && this.renderError()}
        {((!gifs || !gifs.length) && !error && !loading) ? this.renderNoResultsFound() : null}
        {gifs && gifs.length ? <GIFView gifs={gifs} /> : null}
      </Fragment>
    );
  }
}
