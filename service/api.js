import axios from 'axios';
import { createItems } from '../src/index';
import { Notification } from '../src/index';

export async function instance(name, page) {
  const BASE_URL = 'https://pixabay.com/api/';

  const options = {
    params: {
      key: '34500293-b03de9e828113a4f3f2acb0b8',
      q: name,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: page,
      per_page: 40,
    },
  };
  try {
    const response = await axios.get(BASE_URL, options);
    Notification(response.data.hits.length, response.data.total);

    createItems(response.data);
  } catch (error) {
    console.log(error);
  }
}
