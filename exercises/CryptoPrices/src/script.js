"use strict";

// avoid CORS in dev
const proxyUrl = 'https://api.allorigins.win/raw?url=';

// variables for fetching
let numberOfCrypto = 10;
let page = 1;
let isFetching = false;

// DOM elements
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');

// EVENT LISTENERS

nextBtn.addEventListener('click', () => {
  page+=1;
  fetchPrices(numberOfCrypto, page);
  btnStates()
  console.log(page);
});


backBtn.addEventListener('click', () => {
  page-=1;
  fetchPrices(numberOfCrypto, page);
  btnStates()
  console.log(page);
});


// modify state of buttons
function btnStates() {
  if (page === 1) {
    backBtn.setAttribute('disabled', true);
    backBtn.classList.add('disabled');
  } else {
    backBtn.removeAttribute('disabled');
    backBtn.classList.remove('disabled');
  }
}

// fetch crypto prices
async function fetchPrices(coins, page){
  if (isFetching) return;
  isFetching = true;

  let api = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coins}&page=${page}&sparkline=false&locale=en`;

  try {
    console.log(api)

    // avoid CORS in dev
    const response = await fetch(proxyUrl + encodeURIComponent(api));
    
    // const response = await fetch(encodeURIComponent(api));

    if(!response.ok){
      throw new Error("Could not fetch crypto");
    }

    const cryptoData = await response.json();
    console.log(cryptoData);

    if (cryptoData.length < 10) {
      nextBtn.setAttribute('disabled', true);
      nextBtn.classList.add('disabled');
    } else {
      nextBtn.removeAttribute('disabled');
      nextBtn.classList.remove('disabled');
    }

    displayCrypto(cryptoData);

  } catch (error) {
      console.error(error.message);
  
  } finally {
    isFetching = false;
  } 

}


// display crypto
function displayCrypto(cryptoData){
  const cryptoTableBody = document.getElementById('tableBody');

  cryptoTableBody.innerHTML = '';

  cryptoData.forEach(crypto => {

    // whole row
    const row = document.createElement('tr');
    row.classList.add('tableRow');

    // NAME 
    // NAME 
    // NAME
    const nameSection = document.createElement('td');
    nameSection.classList.add('tableData');

    // create a div to encapsulate image and spans
    const nameOuterDiv = document.createElement('div');
    nameOuterDiv.classList.add('nameOuterDiv');

    // create image for crypto icon
    const cryptoIcon = document.createElement('img');
    cryptoIcon.classList.add('imageSize');
    cryptoIcon.src = crypto.image;

    // create a div to encapsulate name + symbol
    const nameInnerDiv = document.createElement('div');
    nameInnerDiv.classList.add('nameInnerDiv');

    // create new span for name
    const realName = document.createElement('span');
    realName.textContent = crypto.name;

    // create new span for symbol text
    const symbol = document.createElement('span');
    symbol.textContent = crypto.symbol.toUpperCase();

    // append both spans to the inner div
    nameInnerDiv.append(symbol);
    nameInnerDiv.append(realName);

    // append image and inner div to outer div
    nameOuterDiv.appendChild(cryptoIcon);
    nameOuterDiv.appendChild(nameInnerDiv);

    nameSection.append(nameOuterDiv);

    // PRICE 
    // PRICE 
    // PRICE
    const priceSection = document.createElement('td');
    priceSection.classList.add('tableData');

    // create span for the actual price number
    const priceNum = document.createElement('span');
    priceNum.textContent = crypto.current_price.toFixed(2);

    // spans for price's highs and lows
    const priceHigh = document.createElement('span');
    priceHigh.textContent = "H: " + crypto.high_24h.toFixed(2);
    priceHigh.classList.add('priceHigh');

    const priceLow = document.createElement('span');
    priceLow.textContent = "L: " + crypto.low_24h;
    priceLow.classList.add('priceLow');

    // store spans in div
    const highLowSpans = document.createElement('div');
    highLowSpans.append(priceHigh);
    highLowSpans.append(priceLow);

    // append price and div to the table data
    priceSection.append(priceNum);
    priceSection.append(highLowSpans);

    // MARKET CAP
    // MARKET CAP
    // MARKET CAP

    // create new td for market cap
    const marketCapSection = document.createElement('td');
    marketCapSection.classList.add('tableData');

    // create span for the number
    const marketCapNum = document.createElement('span');
    marketCapNum.textContent = crypto.market_cap.toLocaleString();

    // append span to table data
    marketCapSection.append(marketCapNum);

    // append all three sections to the row
    row.appendChild(nameSection);
    row.appendChild(priceSection);
    row.appendChild(marketCapSection);

    // append row to table body
    cryptoTableBody.appendChild(row);
  })
}


// DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, JavaScript is running!");

  // Add your JS code below here
  fetchPrices(numberOfCrypto, page);
  btnStates();
});