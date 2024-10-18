"use strict";

let finalTestimonialId = null;
let isFetching = false;
let amountOfTestimonials = 5;

// avoid CORS issue in dev
const proxyUrl = 'https://api.allorigins.win/raw?url=';
let hasNext = true;



// fetch testimonials
async function fetchTestimonials(amount){
  if (isFetching || !hasNext) return;
  isFetching = true;

  let api = `https://api.frontendexpert.io/api/fe/testimonials?limit=${amount}`;

  if(finalTestimonialId){
    api += `&after=${finalTestimonialId}`;
  }

  try {
    console.log(api)
    const response = await fetch(proxyUrl + encodeURIComponent(api));

    if(!response.ok){
      throw new Error("Could not fetch testimonials");
    }

    const testimonialsData = await response.json();
    const testimonials = testimonialsData.testimonials;

    displayTestimonials(testimonials);

    if(testimonials.length > 0){
      finalTestimonialId = testimonials[testimonials.length - 1].id;
    }

    hasNext = testimonialsData.hasNext;

    if (!hasNext) {
      console.log("There are no more testimonials to fetch.");
      window.removeEventListener('scroll', handleScroll);
    }

  } catch (error) {
      console.error(error.message);
  
  } finally {
    isFetching = false;
  } 

}


// display testimonials

function displayTestimonials(testimonialsData){
  const testimonialContainer = document.getElementById('testimonial-container');

  testimonialsData.forEach(testimonial => {
    const newDiv = document.createElement('div');
    newDiv.classList.add('testimonial');

    const newParagraph = document.createElement('p');
    newParagraph.classList.add('testimonial-message');
    newParagraph.textContent = testimonial.message;

    newDiv.appendChild(newParagraph);
    testimonialContainer.appendChild(newDiv);
    console.log(testimonial.id)
  })
}


// handle scroll
function handleScroll() {
  const scrollableHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

  if(scrollTop + clientHeight >= scrollableHeight - 30){
    fetchTestimonials(amountOfTestimonials);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, JavaScript is running!");

  // Add your JS code below here
  fetchTestimonials(amountOfTestimonials)
  window.addEventListener('scroll', handleScroll);
});