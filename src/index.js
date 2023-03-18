import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { instance } from '../service/api';

const searchForm = document.querySelector('#search-form');
const inputText = document.querySelector('input[type="text"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSubmit);

function onSubmit() {}
