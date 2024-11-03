async function trendingStocks(n) {
  if (n === 0) return [];

  const symbolsResponse = await fetch('https://api.frontendexpert.io/api/fe/stock-symbols');
  const symbolsData = await symbolsResponse.json();
  const topSymbols = symbolsData.slice(0, n).map(stock => stock.symbol);

  const pricesResponse = fetch(`https://api.frontendexpert.io/api/fe/stock-prices?symbols=${JSON.stringify(topSymbols)}`);
  const marketCapsResponse = fetch('https://api.frontendexpert.io/api/fe/stock-market-caps');

  const [pricesData, marketCapsData] = await Promise.all([pricesResponse, marketCapsResponse]).then(responses => 
    Promise.all(responses.map(response => response.json()))
  );

  const pricesMap = new Map(pricesData.map(stock => [stock.symbol, stock]));
  const marketCapsMap = new Map(marketCapsData.map(stock => [stock.symbol, stock]));

  return symbolsData.slice(0, n).map(stock => ({
    name: stock.name,
    symbol: stock.symbol,
    price: pricesMap.get(stock.symbol).price,
    '52-week-high': pricesMap.get(stock.symbol)['52-week-high'],
    '52-week-low': pricesMap.get(stock.symbol)['52-week-low'],
    'market-cap': marketCapsMap.get(stock.symbol)['market-cap']
  }));
}