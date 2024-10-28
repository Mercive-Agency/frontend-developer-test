document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, JavaScript is running!");

  // Add your JS code below here
});

const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&locale=en";
let currentPage = 1;

async function fetchCryptoData (page) {
  const response = await fetch (`${apiUrl}&page=${page}`);
  const data = await response.json()
  return data;
}

function updateTable (data) {
  const tbody = document.getElementById("crypto-tbody")
  tbody.innerHTML = "";

  data.forEach(coin => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${coin.symbol.toUpperCase()} <br> ${coin.name}</td>
          <td>${coin.current_price}</td>
          <td>${coin.market_cap.toLocaleString()}</td>
      `;
      tbody.appendChild(row)
  })
}

function updateButtons () {
  document.getElementById("back-button").disabled = currentPage === 1;
  document.getElementById("next-button").disabled = currentPage === 10;
}

document.getElementById("back-button").addEventListener("click", async () => {
  if (currentPage > 1) {
      currentPage--;
      const data = await fetchCryptoData(currentPage)
      updateTable(data)
      updateButtons();
  }
})

document.getElementById("next-button").addEventListener("click", async () => {
  currentPage++;
  const data = await fetchCryptoData(currentPage)
  updateTable(data)
  updateButtons();
});

window.addEventListener("load", async () => {
  const data = await fetchCryptoData(currentPage)
  updateTable(data)
  updateButtons()
})