import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { instance } from '../service/api';

const searchForm = document.querySelector('#search-form');
const inputText = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;

loadMoreBtn.style.display = 'none';
searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();

  page = 1;

  gallery.innerHTML = '';

  const name = inputText.value.trim();

  if (name !== '') {
    const data = await instance(name);
    createItems(data);
  } else {
    loadMoreBtn.style.display = 'none';
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function onLoadMore() {
  const name = inputText.value.trim();
  page += 1;
  const data = await instance(name, page);
  createItems(data, true);
}

export function createItems(photos, append = false) {
  const markup = photos.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<a class ="photo-link" href="${largeImageURL}">
    <div class="photo-card">
        <div class="photo">
     <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </div>
     <div class="info">
       <p class="info-item">
         <b>Likes: ${likes}</b>
       </p>
       <p class="info-item">
         <b>Views: ${views}</b>
       </p>
       <p class="info-item">
         <b>Comments: ${comments}</b>
       </p>
       <p class="info-item">
         <b>Downloads: ${downloads}</b>
       </p>
     </div>
     </div>
   </a>`
    )
    .join('');
  if (append) {
    gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    gallery.innerHTML = markup;
  }
  simpleLightbox.refresh();
}

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function Notification(length, totalHits) {
  if (length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (page === 1) {
    loadMoreBtn.style.display = 'flex';

    Notify.success(`Hooray! We found ${totalHits} images.`);
  } else if (page >= Math.ceil(totalHits / 40)) {
    loadMoreBtn.style.display = 'none';
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
