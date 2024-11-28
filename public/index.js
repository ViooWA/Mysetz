const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
  menu.classList.toggle('flex');
});

const features = [
  {
    name: "OpenAI",
    method: "GET",
    description: "AI/openai",
    category: "AI",
    endpoint: "../api/FITUR.js",
    query: "endpoint=openai&text=Hai%20kamu"
  },
  {
    name: "BlackBox",
    method: "GET",
    description: "AI/blackbox",
    category: "AI",
    endpoint: "../api/FITUR.js",
    query: "endpoint=blackbox&text=Hai%20kamu"
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
  },
  {
    name: "Brat-Sticker",
    method: "GET",
    description: "Maker/brat",
    category: "Maker",
    endpoint: "../api/brat.js",
    query: "text=Halo%20kamu"
  },
  {
    name: "Yt-Comment",
    method: "GET",
    description: "Maker/ytcomment",
    category: "Maker",
    endpoint: "../api/ytcomment.js",
    query: "text=Halo%20kamu&avatar=https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg&username=Vioo"
  },
  {
    name: "Carbonify",
    method: "GET",
    description: "Maker/carbon",
    category: "Maker",
    endpoint: "../api/carbon.js",
    query: "text=Halo%20kamu"
  },
  {
    name: "Txt-Image",
    method: "GET",
    description: "Maker/txtimg",
    category: "Maker",
    endpoint: "../api/txtimg.js",
    query: "text=Halo%20kamu"
  },
  {
    name: "MediaFire",
    method: "GET",
    description: "Downloader/mediafire",
    category: "Downloader",
    endpoint: "../api/mediafire.js",
    query: "url=https://www.mediafire.com/file/o0008kd4n0q8dxa/Infinity-V1.0.0+.zip/file"
  },
  {
    name: "Tiktok",
    method: "GET",
    description: "Downloader/ttdl",
    category: "Downloader",
    endpoint: "../api/ttdl.js",
    query: "url=https://vm.tiktok.com/ZSjVn47bC/"
  },
  {
    name: "Instagram",
    method: "GET",
    description: "Downloader/igdl",
    category: "Downloader",
    endpoint: "../api/igdl.js",
    query: "url=https://www.instagram.com/p/DCQhOuXTRvE/?img_index=1&igsh=MWF2dXU3aWtpazY2NQ=="
  },
  {
    name: "Facebook",
    method: "GET",
    description: "Downloader/fbdl",
    category: "Downloader",
    endpoint: "../api/fbdl.js",
    query: "url=https://www.facebook.com/share/r/12BFZAtjpS8/?mibextid=qDwCgo"
  }
];

function createCategorySection(categoryName) {
  const categorySection = document.createElement("div");
  categorySection.classList.add("p-6", "rounded-lg", "shadow-lg", "bg-gray-800");

  categorySection.innerHTML = `
    <h2 class="text-2xl font-semibold gradient-text mb-4">${categoryName}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 category-cards"></div>
  `;

  return categorySection;
}

function redirectToEndpoint(endpoint, query, method) {
  const fullUrl = `${endpoint}?${query}`;

  if (method === "GET") {
    window.open(fullUrl, "_blank");
  } else if (method === "POST") {
    const data = Object.fromEntries(new URLSearchParams(query));
    axios.post(endpoint, data)
      .then((response) => {
        console.log("Response:", response.data);
        alert("Request berhasil! Lihat konsol untuk respons.");
      })
      .catch((error) => {
        console.error("Error:", error.message);
        if (error.response) {
          console.error("Detail Error:", error.response.data);
        }
        alert("Terjadi kesalahan! Lihat konsol untuk detail.");
      });
  }
}

const featureContainer = document.getElementById("feature");
const categories = [...new Set(features.map((feature) => feature.category))];

categories.forEach((category) => {
  const categorySection = createCategorySection(category);
  const categoryCards = categorySection.querySelector(".category-cards");

  features
    .filter((feature) => feature.category === category)
    .forEach((feature) => {
      const card = document.createElement("div");
      card.classList.add(
        "card",
        "rounded-lg",
        "shadow-md",
        "p-4",
        "hover:shadow-xl",
        "transition-all",
        "duration-300"
      );

      card.innerHTML = `
        <h3 class="text-lg font-bold mb-2">${feature.name}</h3>
        <p class="text-sm mb-4">${feature.description}</p>
        <div class="button-container">
          <button
            class="py-2 px-4 rounded-lg gradient-button"
            onclick="redirectToEndpoint('${feature.endpoint}', '${feature.query}', '${feature.method}')"
          >
            ${feature.method}
          </button>
        </div>
      `;

      categoryCards.appendChild(card);
    });

  featureContainer.appendChild(categorySection);
});