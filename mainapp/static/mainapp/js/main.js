function loadSearch() {
  recipe_title = document.getElementById("id_text").value;
  var xhr = new XMLHttpRequest();
    xhr.open('GET', '/search/api/' + recipe_title);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {      
        var data = JSON.parse(xhr.responseText);
        recipes = data["recipes"]
        console.log(recipes);

       card_row_div = document.getElementById("card_row");
       card_row_div.innerHTML = "";
       for (let i=0; i < recipes.length ; ++i){
          var id = recipes[i].id;
    		  var img = recipes[i].image;
    		  var name = recipes[i].name;
    		  var description = recipes[i].description;
    		  addSearch(id, img, name, description);
    	  }
      }
    };
    xhr.send();   	
}

function addSearch(id, img, name, description){	
  	var html =  `<div id="favourite-cards" class="col mb-4">
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

  	card_row_div = document.getElementById("card_row");
  	card_row_div.innerHTML += html;
}

function loadChat(userMessage) {
  const xhr = new XMLHttpRequest();
  const url = "/api/chat";
  recipe_title = document.getElementById("id_text").value;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  payload = {"prompt_text": userMessage};

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
      chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to the bottom of the chat container
    }, index * 30); // Adjust typing speed by modifying the interval time (currently set to 30ms)
  });
}

function handleUserInput() {
  const userMessage = userInput.value.trim();

  if (userMessage !== '') {
    addMessageToChat(userMessage, 'user');
    userInput.value = '';

    // Simulate AI response (replace with your own logic)
    const aiResponse = loadChat(userMessage);
     // Delay before showing AI response (currently set to 1 second)
  }
}

function getAIResponse(userMessage) {
  // Replace this with your AI model or API integration logic
  // For this example, a random response is generated
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

function loadBreakfastOwl() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "popular/breakfast/api");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      popular_breakfast = data["breakfasts"];
      var old_data = JSON.parse(localStorage.getItem("id"));
      for (let i=0; i < popular_breakfast.length; ++i) {
        var id = popular_breakfast[i].id;
        var img = popular_breakfast[i].image;
        var name = popular_breakfast[i].name;
        var description = popular_breakfast[i].description;
        if (old_data !== null) {
          if (old_data.includes(id)){
            var like_class = "bi-heart-fill";
            var bg_color = "color: rgb(210, 48, 64);" 
          }
          else{
            var like_class = "bi-heart";
            var bg_color = "color: rgb(210, 210, 210);"
          }
        }
        else{
            var like_class = "bi-heart";
            var bg_color = "color: rgb(210, 210, 210);"
          }
        addPopularBreakfast(id, like_class, bg_color, img, name, description);
      }
      setupBreakfastCarousel();
    }
  };
  xhr.send();
}


function addPopularBreakfast(id, like_class, bg_color, image, name, description) {
  var html = `<div class="item">
                <i onclick="setFavourite(` + id + `)" class="bi 
                ` + like_class + ` favourite-icon favourite-item-` + id +`" style="font-size: 1.5rem;` + bg_color + `"></i>
                <div class="card-body image-wrapper shadow">
                  <img class="card-img-top" src="` + image + `" alt="Card image cap">
                </div>
                <div class="owl-text">
                  <a class="card-title" href="/detail/` + id + `">` + name + `</a>
                </div>
              </div>`
  popular_breakfast_div = document.getElementById("breakfast-owl");
  popular_breakfast_div.innerHTML += html;
}



function loadLunchOwl() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "popular/lunch/api");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      popular_lunch = data["lunches"]
      console.log(popular_lunch)

      document.getElementById("lunch-owl").innerHTML = "";
      var old_data = JSON.parse(localStorage.getItem("id"));
      for (let i=0; i < popular_lunch.length; ++i) {
        var id = popular_lunch[i].id;
        var img = popular_lunch[i].image;
        var name = popular_lunch[i].name;
        var description = popular_lunch[i].description;
        if (old_data !== null) {
          if (old_data.includes(id)){
            var like_class = "bi-heart-fill"; 
            var bg_color = "color: rgb(210, 48, 64);"
          }
          else{
            var like_class = "bi-heart";
            var bg_color = "color: rgb(210, 210, 210);"
          }
        }
        else {
          var like_class = "bi-heart";
          var bg_color = "color: rgb(210, 210, 210);"
        }
        addPopularLunch(id, like_class, bg_color, img, name, description);
      }
     setupLunchCarousel(); 
    }
  };
  xhr.send();
}

function checkOldData(data) {
  if (data !== null) {
    console.log("old", data);
    return "true";
  }
  else{
    return "false";
  }
}


function setFavourite(recipe_id){
  if (typeof(Storage) !== "undefined") {
    old_data = JSON.parse(localStorage.getItem("id"));
    if (old_data.includes(recipe_id)){
      
      console.log("inside if");
      console.log("old_data = " + old_data);

      // removing one data from given index
      var index = old_data.indexOf(recipe_id);
      old_data.splice(index , 1);

      var new_data = JSON.stringify(old_data);
      localStorage.setItem("id", new_data);
      console.log("webstorage= " + new_data);

      // changing like element class
      item_div = document.getElementsByClassName("favourite-item-" + recipe_id);
      for (let i=0; i < item_div.length; i++) {
        item_div[i].classList.remove("bi-heart-fill");
        item_div[i].classList.add("bi-heart");
        item_div[i].classList.add(".favourite-icon");
        item_div[i].style.color = "#d2d2d2";
      }
      console.log(item_div);
    }else{
      console.log("inside else");

      // inserting new data
      console.log(typeof(old_data));
      old_data.push("id", recipe_id);
      var new_data = JSON.stringify(old_data);
      console.log(localStorage.getItem("id"));
      console.log("webstorage= " + new_data); 

      localStorage.setItem("id", new_data);

      // changing like element class
      item_div = document.getElementsByClassName("favourite-item-" + recipe_id);
      for (let i=0; i < item_div.length; i++) {
        item_div[i].classList.remove("bi-heart");
        item_div[i].classList.add("bi-heart-fill");
        item_div[i].style.color = "rgb(255, 48, 64)";
      }
      console.log(item_div);
    }  
  }
}

function getFavourite(){
  id = localStorage.getItem("id");
  console.log(id);
  var favourites = []
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/favourites/api");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      favourites = data["favourites"];
      console.log(favourites);

      for(let i=0; i < favourites.length; i++) {
        if(id.includes(favourites[i].id)) {
          var id = favourites[i].id;
          var name = favourites[i].name;
          var description = favourites[i].description;
          var image = favourites[i].image;
          addFavourites(id, image, name, description);
        }
      }
    }
  };
  xhr.send();
}

function addFavourites(id, img, name, description) {
  var html = `<div class="card">
                <div class="card-body image-wrapper">
                  <img class="card-img-top" src="` + img + `" alt="Card image cap">
                </div>
                <a class="card-title" href="/detail/` + id + `">` + name + `</a>
              </div>`
  fav_div = document.getElementById("favourite");
  console.log(fav_div);
  fav_div.innerHTML = html;
}

function addPopularLunch(id, like_class, bg_color, image, name, description) {
  var html = `<div class="item">
                <i onclick="setFavourite(` + id + `)" class="bi 
                ` + like_class + ` favourite-icon favourite-item-` + id +`" style="font-size: 1.5rem;` + bg_color + `"></i>
                <div class="card-body image-wrapper shadow">
                  <img class="card-img-top" src="` + image + `" alt="Card image cap">
                </div>
                <div class="owl-text">
                  <a class="card-title" href="/detail/` + id + `">` + name + `</a>
                </div>
              </div>`
  popular_lunch_div = document.getElementById("lunch-owl");
  popular_lunch_div.innerHTML += html;

}

function setupBreakfastCarousel() {
  var owl = $('#breakfast-owl')
  owl.owlCarousel({
          loop:true,
          margin:10,
          nav:true,
          lazyLoad: true,
          responsive:{
              0:{
                  items:1
              },
              600:{
                  items:3
              },
              1000:{
                  items:4
              }
          }
      })
}

function setupLunchCarousel() {
  $('#lunch-owl').owlCarousel({
          loop:true,
          margin:10,
          nav:true,
          lazyLoad: true,
          responsive:{
              0:{
                  items:1
              },
              600:{
                  items:3
              },
              1000:{
                  items:4
              }
          }
      })
}

function setupDinnerCarousel() {
  $('#dinner-owl').owlCarousel({
          loop:true,
          margin:10,
          nav:true,
          lazyLoad: true,
          responsive:{
              0:{
                  items:1
              },
              600:{
                  items:3
              },
              1000:{
                  items:4
              }
          }
      })
}

function loadDinnerOwl() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "popular/dinner/api");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      popular_dinner = data["dinners"];
      console.log("dinner working")

      document.getElementById("dinner-owl").innerHTML = "";
      var old_data = JSON.parse(localStorage.getItem("id"));
      for (let i=0; i < popular_dinner.length; ++i) {
        var id = popular_dinner[i].id;
        var img = popular_dinner[i].image;
        var name = popular_dinner[i].name;
        var description = popular_dinner[i].description;
        if (old_data !== null) {
          if (old_data.includes(id)){
            var like_class = "bi-heart-fill"; 
            var bg_color = "color: rgb(210, 48, 64);";
          }
          else{
            var like_class = "bi-heart";
            var bg_color = "color: rgb(210, 210, 210);";
          }
        }
        else{
          var like_class = "bi-heart";
          var bg_color = "color: rgb(210, 210, 210);";
        }
        addPopularDinner(id, like_class, bg_color, img, name, description);
      }
      setupDinnerCarousel();
    }
  };
  xhr.send();
}

function addPopularDinner(id, like_class, bg_color, image, name, description) {
  
  var html = `<div class="item">
                <i onclick="setFavourite(` + id + `)" class="bi 
                ` + like_class + ` favourite-icon favourite-item-` + id +`" style="font-size: 1.5rem;` + bg_color + `"></i>
                <div class="card-body image-wrapper shadow">
                  <img class="card-img-top" src="` + image + `" alt="Card image cap">
                </div>
                <div class="owl-text">
                  <a class="card-title" href="">` + name + `</a>
                </div>
              </div>`
  popular_dinner_div = document.getElementById("dinner-owl");
  popular_dinner_div.innerHTML += html;
}

$.fn.isInViewport = function() {
  var elementTop = $(this).offset().top;
  var elementBottom = elementTop + $(this).outerHeight();

  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  return elementBottom >= viewportTop && elementTop <= viewportBottom;
};

var is_lunch_owl_loaded = false;
var is_dinner_owl_loaded = false;

$(window).on('resize scroll', function() {
  var lunchCarousel = $("#lunch-owl");
  var dinnerCarousel = $("#dinner-owl");
  
  
  if (lunchCarousel.isInViewport()) {
    if (is_lunch_owl_loaded === false) {
      loadLunchOwl();
      is_lunch_owl_loaded = true;
    }
    else{
      console.log("not loading lunch carousel");
    }
  }

  if (dinnerCarousel.isInViewport()) {
    if (is_dinner_owl_loaded === false) {
      loadDinnerOwl();
      is_dinner_owl_loaded = true; 
    }
    else{
      console.log("not loading dinner carousel")
    }
  }
});

window.onload = function() {
  loadBreakfastOwl();
}