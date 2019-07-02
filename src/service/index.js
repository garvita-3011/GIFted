import ENDPOINTS from './endpoints';

export default class Service {
  static async get (url, headers) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          ...headers
        }
      });
      const response = await res.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('error', error);
      return null;
    }
  }

  static fetchTrendingGIFs () {
    return Service.get(ENDPOINTS.trending);
  }

  static fetchSearchedGIF ({ searchString, offset, limit }) {
    let url = ENDPOINTS.search;
    url = url.replace('{searchKey}', searchString).replace('{offset}', offset).replace('{limit}', limit);
    return Service.get(url);
  }
}
