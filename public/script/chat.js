document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = './index.html';
});
document.addEventListener("DOMContentLoaded", async () => {
  const chatWindow = document.getElementById("chatWindow");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const emojiBtn = document.getElementById("emojiBtn");
  const voiceBtn = document.getElementById("voiceBtn");
  const typingIndicator = document.getElementById("typingIndicator");
  const emojiPicker = document.getElementById("emojiPicker");
  const emptyPlaceholder = document.getElementById("emptyPlaceholder");
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  let userIP = "anonymous";
  
  try {
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    userIP = ipResponse.data.ip;
  } catch (error) {
    console.error("Gagal mendapatkan IP pengguna:", error);
  }
  if (savedTheme) {
    root.classList.toggle('light', savedTheme === 'light');
    themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
  }
  themeToggle.addEventListener('click', () => {
    const isLight = root.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
  });
  const scrollToBottom = () => {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };
  const updatePlaceholder = () => {
    const hasMessages = chatWindow.querySelectorAll(".chat-message").length > 0;
    emptyPlaceholder.style.display = hasMessages ? "none" : "flex";
  };
  const typeMessage = (text, sender) => {
    return new Promise((resolve) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("chat-message", `${sender}-message`);
      messageDiv.innerHTML = `
        <p></p>
        <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      `;
      chatWindow.appendChild(messageDiv);
      updatePlaceholder();
      scrollToBottom();
      const p = messageDiv.querySelector("p");
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          p.textContent += text[i];
          i++;
          scrollToBottom();
        } else {
          clearInterval(typingInterval);
          resolve();
        }
      }, 42);
    });
  };
  const addMessage = async (message, sender = "user") => {
    if (sender === "bot") {
      await typeMessage(message, sender);
    } else {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("chat-message", `${sender}-message`);
      messageDiv.innerHTML = `
        <p>${message}</p>
        <span class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      `;
      chatWindow.appendChild(messageDiv);
      updatePlaceholder();
      scrollToBottom();
    }
  };
  const updateStatus = (statusText, isTyping = false) => {
    const statusElement = document.querySelector(".status");
    const statusIcon = statusElement.querySelector(".circle");
    const statusTextElement = statusElement.querySelector(".status-text");
    if (isTyping) {
      statusElement.classList.add("typing");
      statusElement.classList.remove("online");
      statusTextElement.textContent = statusText || "Mengetik...";
    } else {
      statusElement.classList.remove("typing");
      statusElement.classList.add("online");
      statusTextElement.textContent = statusText || "Online";
    }
  };
  const sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    userInput.value = "";
    updateStatus("Mengetik...", true);
    typingIndicator.style.display = "flex";
    try {
      const prompt = "Gunakan bahasa Indonesia seperti Kamu dan Aku. Nama kamu Vioo, yang diciptakan oleh Sanjaya.";
      const requestData = {
        content: text,
        user: userIP,
        prompt: prompt,
      };
      const response = await axios.post("https://luminai.my.id/", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response || !response.data || !response.data.result) {
        throw new Error("Invalid response from server");
      }
      updateStatus("Online");
      await addMessage(response.data.result, "bot");
    } catch (error) {
      updateStatus("Online");
      await addMessage("Ups, ada kesalahan waktu memproses permintaanmu.", "bot");
    } finally {
      typingIndicator.style.display = "none";
    }
  };
  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Browser kamu tidak mendukung voice recognition.");
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.onstart = () => {
      console.log("Voice recognition started.");
    };
    recognition.onspeechend = () => {
      recognition.stop();
    };
    recognition.onerror = () => {
      addMessage("Maaf, aku tidak bisa memahami suaramu. Coba lagi.", "bot");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
    };
    recognition.start();
  };
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  voiceBtn.addEventListener("click", startVoiceRecognition);
  emojiBtn.addEventListener("click", () => {
    emojiPicker.style.display = (emojiPicker.style.display === "none" || emojiPicker.style.display === "") ? "flex" : "none";
  });
  emojiPicker.querySelectorAll(".emoji").forEach(emoji => {
    emoji.addEventListener("click", (event) => {
      const selectedEmoji = event.target.textContent;
      userInput.value += selectedEmoji;
      emojiPicker.style.display = "none";
    });
  });
  document.getElementById("clearChat").addEventListener("click", function() {
    const chatMessages = document.querySelectorAll(".chat-message");
    chatMessages.forEach((message) => {
      message.classList.add("fade-out");
    });
    setTimeout(function() {
      document.getElementById("chatWindow").innerHTML = "";
      updatePlaceholder();
    }, 500);
  });
  updatePlaceholder();
});            