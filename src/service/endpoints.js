const API_KEY = '7QwOE8gjcAZEZ8xatNszCAomGan35hXk';

const ENDPOINTS = {
  trending: `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit={limit}&rating=G`,
  search: `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q={searchKey}&limit={limit}&offset={offset}&rating=G&lang=en`
};

export default ENDPOINTS;
