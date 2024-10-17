"use strict";

let finalTestimonialId = null;
let isFetching = false;
let amountOfTestimonials = 5;


// fetch testimonials
async function fetchTestimonials(amount){
  if (isFetching) return;
  isFetching = true;

  let api = `https://api.frontendexpert.io/api/fe/testimonials?limit=${amount}`;

  if(finalTestimonialId){
    api += `&after=${lastTestimonialId}`;
  }

  try {
    const response = await fetch(api);

    if(!response.ok){
      throw new Error("Could not fetch testimonials");
    }

    const testimonials = await response.json();

    displayTestimonials(testimonials);

    if(testimonials.length > 0){
      lastTestimonialId = (testimonials.length - 1).id;
    }

    if (testimonials.length < amountOfTestimonials){
      window.removeEventListener('scroll', handleScroll);
    }

  } catch (error) {
      console.log(error.message);
  
  } finally {
    isFetching = false;
  } 

}


// display testimonials

function displayTestimonials(testimonialsData){
  const testimonialContainer = document.getElementById('testimonials-container');
  const template = document.getElementById('testimonial-template');

  testimonialsData.forEeach(testimonial => {
    const clonedTestimonial = template.content.cloneNode(true);
    clonedTestimonial.classList.remove('hidden');
    clonedTestimonial.querySelector('testimonial-message').textContent = testimonial.message;

    testimonialContainer.appendChild(testimonial);
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
  window.addEventListener('scroll', handleScroll);
  fetchTestimonials(amountOfTestimonials)
});