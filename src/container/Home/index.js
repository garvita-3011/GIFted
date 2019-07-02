import React from 'react';
import Service from '../../service';
import LazyLoadImage from '../../components/LazyImg';
import './style.scss';

export default class Home extends React.Component {
  state = {
    trending: [],
    playingId: ''
  }

  componentDidMount () {
    this.getTrendingGIFs();
  }

  getTrendingGIFs = async () => {
    const trending = await Service.fetchTrendingGIFs();
    this.setState({
      trending: trending.data
    });
  }

  animateSrc = (item) => {
    const { playingId } = this.state;
    this.setState({
      playingId: playingId !== item.id ? item.id : ''
    });
  }

  searchGIF = (event) => {
    console.log('event', event.target.value)
  }

  render () {
    const { trending, playingId } = this.state;
    return (
      <div>
        <div>
          <input type="text" placeholder="Search.." onChange={this.searchGIF} />
        </div>
        <div className="main-container">
          {trending.length ? trending.map(item => {
            const imgSrc = item.id === playingId ? 'fixed_height' : 'fixed_height_still';
            return (
              <LazyLoadImage src={item.images[imgSrc].url} alt="gif" onClick={this.animateSrc.bind(this, item)} clsName="gif-view" />
            );
          })
            : null
          }
        </div>
      </div>
    );
  }
}
