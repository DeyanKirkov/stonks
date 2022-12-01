const favouritesDiv = document.getElementById("favourites-list");
const searchInp = document.getElementById("stonk-search");
const resultsDiv = document.getElementById("results-list");
const contentDiv = document.getElementById("content");

const KEY = "&apikey=64PPOS456M2M9J85";
const url = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=";

const finnhubKey = "&token=ce4ckkqad3i3k9df9e00ce4ckkqad3i3k9df9e0g";
const finnhub = "https://finnhub.io/api/v1/search?q=apple";

const mockData = ["KO", "T", "CVX", "AXP", "MFST", "BAC", "KHC", "OXY"];
const favouritesArr = ["AAPL"];

searchInp.addEventListener("keyup", searchStonks);

function searchStonks(event) {
  clearSearch();
  if (searchInp.value)
    mockData.forEach((stonk) => {
      if (stonk.startsWith(searchInp.value.toUpperCase())) {
        const ul = document.createElement("ul");
        ul.innerText = stonk;
        ul.addEventListener("click", () => addFavourite(stonk));
        resultsDiv.appendChild(ul);
      }
    });
}

function addFavourite(stonk) {
  favouritesArr.push(stonk);
  // favouritesArr.sort();
  mockData.splice(
    mockData.findIndex((s) => s === stonk),
    1
  );
  clearSearch();
  searchInp.value = "";
  renderFavourites();
}

function renderFavourites() {
  favouritesDiv.innerHTML = "";

  favouritesArr.forEach((fav) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    const p = document.createElement("p");
    p.innerText = fav;
    p.addEventListener("click", () => loadContent(fav));
    div.appendChild(p);
    favouritesDiv.appendChild(div);
  });
}

function clearSearch() {
  resultsDiv.innerHTML = "";
}

async function loadContent(stonk) {
  contentDiv.innerHTML = "";

  addLoadingBar();
  const data = await fetchContent(stonk);
  removeLoadingBar();
  const p = document.createElement("p");
  p.innerText = `Name: ${data.Name}`;
  contentDiv.appendChild(p);
  const p2 = document.createElement("p");
  p2.innerText = `Description: ${data.Description}`;
  contentDiv.appendChild(p2);
  const p3 = document.createElement("p");
  p3.innerText = `Industry: ${data.Industry}`;
  contentDiv.appendChild(p3);
  const p4 = document.createElement("p");
  p4.innerText = `Bond: ${data.bond}`;
  contentDiv.appendChild(p4);
  const p5 = document.createElement("p");
  p5.innerText = `ESP: ${data.valueOne / data.valueTwo}`;
  contentDiv.appendChild(p5);
}

function addLoadingBar() {
  const div = document.createElement("div");
  div.id = "loading-bar";
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.backgroundColor = "red";
  contentDiv.appendChild(div);
}
function removeLoadingBar() {
  const bar = document.getElementById("loading-bar");
  bar.remove();
}

async function fetchContent(stonk) {
  const result = await fetch(`${url}${stonk}${KEY}`).then((res) => res.json());
  const bond = await fetchBond(stonk);
  result.bond = bond.description;
  result.valueOne = bond.valueOne;
  result.valueTwo = 23.52;

  return result;
}

async function fetchBond(stonk) {
  const result = await fetch(`${finnhub}${finnhubKey}`).then((res) =>
    res.json()
  );
  result.result[0].valueOne = 142;
  return result.result[0];
}

function main() {
  renderFavourites();
}

main();
