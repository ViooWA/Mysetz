const features = [
  {
    name: "OpenAI",
    method: "GET",
    description: "AI/OpenAI",
    endpoint: "../api/ai.js",
    query: "text=Halo"
  },
  {
    name: "BlackBox",
    method: "GET",
    description: "AI/BlackBox",
    endpoint: "../api/blackbox.js",
    query: "text=Halo"
  },
  {
    name: "LuminAI",
    method: "GET",
    description: "AI/LuminAI",
    endpoint: "../api/luminai.js",
    query: "text=Halo"
  }
];

const featureContainer = document.getElementById("features");

function redirectToEndpoint(endpoint, query) {
  const fullUrl = `${endpoint}?${query}`;
  location.href = fullUrl;
}

features.forEach((feature) => {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h3>${feature.name}</h3>
    <p>${feature.description}</p>
    <button onclick="redirectToEndpoint('${feature.endpoint}', '${feature.query}')">
      ${feature.method}
    </button>
  `;

  featureContainer.appendChild(card);
});