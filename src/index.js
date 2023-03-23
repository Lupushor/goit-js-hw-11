import './css/style.css';
import axios from 'axios';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import { instance } from '../service/api';

const refs = {
  searchForm: document.querySelector('.search-form'),
  inputText: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let page = 1;

refs.loadMoreBtn.style.display = 'none';
refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();

  page = 1;

  refs.gallery.innerHTML = '';

  const name = refs.inputText.value.trim();

  if (name !== '') {
    instance(name);
    // createItems(data);
  } else {
    refs.loadMoreBtn.style.display = 'none';
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

// async
function onLoadMore() {
  const name = refs.inputText.value.trim();

  page += 1;

  instance(name, page);

  // const data = await instance(name, page);
  // createItems(data, true);
}

async function instance(name, page) {
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
    notification(response.data.hits.length, response.data.total);

    createItems(response.data);
  } catch (error) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    // console.log(error);
    // console.log(error.message);
  }
}

function createItems(photos) {
  const markup = photos.hits
    .map(
      item => `<a class ="photo-link" href="${item.largeImageURL}">
    <div class="photo-card">
        <div class="photo">
     <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/>
        </div>
     <div class="info">
       <p class="info-item">
         <b>Likes: ${item.likes}</b>
       </p>
       <p class="info-item">
         <b>Views: ${item.views}</b>
       </p>
       <p class="info-item">
         <b>Comments: ${item.comments}</b>
       </p>
       <p class="info-item">
         <b>Downloads: ${item.downloads}</b>
       </p>
     </div>
     </div>
   </a>`
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  simpleLightbox.refresh();
}

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function notification(length, totalHits) {
  if (length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (page === 1) {
    refs.loadMoreBtn.style.display = 'flex';

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (page >= Math.ceil(totalHits / 40)) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  const scrolled = window.scrollY;

  const threshold = height - screenHeight / 4;

  const position = scrolled + screenHeight;

  if (position >= threshold) {
    onLoadMore();
  }
}

(() => {
  window.addEventListener('scroll', checkPosition);
  window.addEventListener('resize', checkPosition);
})();
