function loadChat(userQuery) {
  const xhr = new XMLHttpRequest();
  const url = "/api/chat";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  payload = {"prompt_text": userQuery};

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      response = data["response"];
      recipes = data["recipes"];
      
      showTypingAnimation();
      setTimeout(() => {
        addMessageToChat(response, 'ai');
      }, 1000);

      for (let i=0; i < recipes.length ; ++i){
          var id = recipes[i].id;
          var img = recipes[i].image;
          var name = recipes[i].name;
          var description = recipes[i].description;
          addChatCards(id, img, name, description);
        }
    }
    else if (xhr.status === 400) {
      alert("not working")
    }

  };

  const data = JSON.stringify(payload);
  xhr.send(data);
}
  
function addResponse(results){
  var html =  `<h4 class="text-muted">Search Results:</h4>
              <p>` + results + `</p>`
  chat_response_div = document.getElementById("ai");
  chat_response_div.innerHTML += html;
}  

function addChatCards(id, img, name, description){
  var html = `<div id="favourite-cards" class="col mb-4">
                <div class="card" style="border-radius:0%;">
                  <div class="card-body image-wrapper">
                    <img class="card-img-top" src="` + img + `" alt="Card image cap">
                  </div>
                  <div class="card-text">
                    <a class="card-title" href="/detail/` + id + `">` + name + `</a>
                    <p class="card-box">` + description + `</p>
                  </div>
                </div>
              </div>`
  chat_card_div = document.getElementById("chat_card_row");
  chat_card_div.innerHTML += html;
}

const chatOutput = document.getElementById('chat-output');
const userInput = document.getElementById('user-input');

function addMessageToChat(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add(`${sender}-message`);
  messageElement.innerHTML = message;
  chatOutput.appendChild(messageElement);

  if (sender === 'ai') {
    typeResponse(message, messageElement);
  }
}

function typeResponse(response, element) {
  const characters = response.split('');
  element.textContent = ''; // Clear the initial text

  characters.forEach((character, index) => {
    setTimeout(() => {
      element.textContent += character;
      chatOutput.scrollTop = chatOutput.scrollHeight; 
    }, index * 30);
  });
}

function handleUserInput() {
  const userMessage = userInput.value.trim();

  if (userMessage !== '') {
    addMessageToChat(userMessage, 'user');
    userInput.value = '';

    const aiResponse = loadChat(userMessage);
  }
}

function getAIResponse(userMessage) {
  const responses = [
    "I'm sorry, I cannot generate that response at the moment.",
    "Could you please rephrase your question?",
    "I'm still learning and may not have the answer to that.",
    "That's an interesting question. Let me think...",
    "I'm glad you asked! Here's the answer...",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function showTypingAnimation() {
  const typingAnimation = document.createElement('div');
  typingAnimation.classList.add('typing-animation');
  typingAnimation.innerHTML = '...';
  chatOutput.appendChild(typingAnimation);
  chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to the bottom of the chat container
}

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleUserInput();
  }
});

function addMessageToChat(message, sender) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');

  const messageElement = document.createElement('div');
  messageElement.classList.add(`${sender}-message`);
  messageElement.innerHTML = message;

  messageContainer.appendChild(messageElement);
  chatOutput.appendChild(messageContainer);

  if (sender === 'ai') {
    typeResponse(message, messageElement);
  }
}