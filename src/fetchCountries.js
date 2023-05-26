import axios from 'axios';

axios.defaults.baseURL = "https://pixabay.com/api/";
const API_KEY = "36454342-dbf92e03a878d62005382d68a";

async function fetchPixabay(query, page) {
  const url = `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  const response = await axios.get(url);
  return response;
}

export { fetchPixabay };