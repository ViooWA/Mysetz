const features = [
  {
    name: "OpenAI",
    method: "GET",
    description: "AI/OpenAI",
    endpoint: "../api/ai.js"
  }
];

const featureContainer = document.getElementById("features");

function redirectToEndpoint(endpoint) {
  location.href = endpoint;
}

features.forEach((feature) => {
  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <h3>${feature.name}</h3>
    <p>${feature.description}</p>
    <button onclick="redirectToEndpoint('${feature.endpoint}')">
      ${feature.method}
    </button>
  `;

  featureContainer.appendChild(card);
});