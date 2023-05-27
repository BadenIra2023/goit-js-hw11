import "./styles.css";
import { fetchPixabay } from "./fetchCountries";
import { createMarkupCards } from "./createMarkup";
import { Notify } from "notiflix/build/notiflix-notify-aio";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const input = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");

loadMore.addEventListener("click", onClickLoadMore);
input.addEventListener("submit", onInput);

let page = 1;
let perPage = 40;
let searchInputName = "";
loadMore.style.display = "none"
const instance = new SimpleLightbox(".gallery a");

async function onInput(event) {

  event.preventDefault();
  
  gallery.innerHTML = '';
 console.log(event)
 const {
    elements: { searchQuery },
  } = event.currentTarget;
  console.log(searchQuery)
  const inputName = searchQuery.value.trim();
  console.log(inputName)
  if (inputName === "")
  { 
    loadMore.style.display = "none"
    Notify.failure("The search bar cannot be empty. Please type criteria in the search bar.");
  }
  else {
   
  try { 
      const {data} = await fetchPixabay(inputName, page);
    
  if (data.totalHits === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  }
    
    if (data.totalHits <= 40) {
     gallery.insertAdjacentHTML('beforeend', createMarkupCards(data));
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.style.display = "none";
      instance.refresh();
  }
    
    
  else {
    searchInputName=inputName
   // console.log(data.totalHits)
    gallery.insertAdjacentHTML('beforeend', createMarkupCards(data));
    loadMore.style.display = "block"
    instance.refresh();

    }
  }
   catch (error) {
      console.log(error);
  }
    finally {input.reset()};
  }

}

async function onClickLoadMore() {
  page += 1;
 // console.log(searchInputName)
 // console.log(page)
  

  try {
    const data = await fetchPixabay(searchInputName, page);
    let showPages = Math.ceil(data.data.totalHits / perPage);
   // console.log(showPages)
   // console.log(page)
    gallery.insertAdjacentHTML('beforeend', createMarkupCards(data.data));
    if (showPages > page)
Notify.success(`Hooray! We found ${data.data.totalHits} images. Still available for viewing ${data.data.totalHits-40*page}`);
    else {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.style.display = "none";
    }

  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    }
  instance.refresh();
}