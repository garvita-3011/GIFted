import ENDPOINTS from './endpoints';

export default class Service {
  static async get (url, params = {}, headers) {
    let httpURL = url;
    if (params.queryParams) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in params.queryParams) {
        if (params.queryParams[key]) {
          httpURL = httpURL.replace(`?${key}`, params.queryParams[key]);
        }
      }
    }
    try {
      const res = await fetch(httpURL, {
        method: 'GET',
        headers: {
          ...headers
        }
      });
      const response = await res.text();
      return JSON.parse(response);
    } catch (error) {
      console.log('error', error);
    }
  }

  static fetchTrendingGIFs () {
    return Service.get(ENDPOINTS.trending);
  }
}
