const features = [
  {
    name: "OpenAI",
    method: "GET",
    description: "AI/openai",
    category: "AI",
    endpoint: "../api/openai.js",
    query: "text=Hai%20kamu"
  },
  {
    name: "BlackBox",
    method: "GET",
    description: "AI/blackbox",
    category: "AI",
    endpoint: "../api/blackbox.js",
    query: "text=Hai%20kamu"
  },
  {
    name: "LuminAI",
    method: "GET",
    description: "AI/luminai",
    category: "AI",
    endpoint: "../api/luminai.js",
    query: "text=Hai%20kamu"
  },
  {
    name: "SimiSimi",
    method: "GET",
    description: "AI/simisimi",
    category: "AI",
    endpoint: "../api/simisimi.js",
    query: "text=Hai%20kamu"
  },
  {
    name: "Google-Search",
    method: "GET",
    description: "Search/google",
    category: "Search",
    endpoint: "../api/google.js",
    query: "text=Kylian%20Mbappe"
  },
  {
    name: "NPM Search",
    method: "GET",
    description: "Search/npm",
    category: "Search",
    endpoint: "../api/npm.js",
    query: "text=axios"
  },
  {
    name: "Pinterest",
    method: "GET",
    description: "Search/pinterest",
    category: "Search",
    endpoint: "../api/pinterest.js",
    query: "text=Kylian%20Mbappe"
  },
  {
    name: "Wikimedia",
    method: "GET",
    description: "Search/wikimedia",
    category: "Search",
    endpoint: "../api/wikimedia.js",
    query: "text=Harimau"
  }
];

function createCategorySection(categoryName) {
  const categorySection = document.createElement("div");
  categorySection.classList.add("col-12", "mb-4");

  categorySection.innerHTML = `
    <h3 class="text-center gradient-text">${categoryName}</h3>
    <div class="row g-4 category-cards"></div>
  `;

  return categorySection;
}

function redirectToEndpoint(endpoint, query, method) {
  const fullUrl = `${endpoint}?${query}`;
  if (method === "GET") {
    window.open(fullUrl, "_blank");
  } else if (method === "POST") {
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(new URLSearchParams(query))),
    })
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .catch((error) => console.error("Error:", error));
  }
}

const featureContainer = document.getElementById("feature-list");
const categories = [...new Set(features.map((feature) => feature.category))];

categories.forEach((category) => {
  const categorySection = createCategorySection(category);
  const categoryCards = categorySection.querySelector(".category-cards");

  features
    .filter((feature) => feature.category === category)
    .forEach((feature) => {
      const card = document.createElement("div");
      card.classList.add("col-lg-4", "col-md-6", "col-sm-12");

      card.innerHTML = `
        <div class="card text-center shadow">
          <div class="card-header gradient-bg">${feature.name}</div>
          <div class="card-body">
            <p class="card-text">${feature.description}</p>
            <button class="btn gradient-button" onclick="redirectToEndpoint('${feature.endpoint}', '${feature.query}', '${feature.method}')">
              ${feature.method}
            </button>
          </div>
        </div>
      `;

      categoryCards.appendChild(card);
    });

  featureContainer.appendChild(categorySection);
});
