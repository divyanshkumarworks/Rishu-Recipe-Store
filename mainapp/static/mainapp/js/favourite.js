function getRecipeDetailAndRenderElement(recipe_id) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      favourites = data["favourites"];

      const id = favourites[0].id;
      const name = favourites[0].name;
      const img = favourites[0].image;
      console.log(img)
      const description = favourites[0].description;
      addFavourites(id, img, name, description);
    }
  };
  xhr.open("GET", "/api/detail/" + recipe_id);
  xhr.send();
}


function getFavourite(){
  old_data = JSON.parse(localStorage.getItem("id"));
  console.log(old_data);
  for (let i=0; i < old_data.length; i++) {  
    getRecipeDetailAndRenderElement(old_data[i]);
  }
}

function addFavourites(id, img, name, description) {
  var html = `<div id="favourite-cards" class="col mb-4">
                <div class="card" style="border-radius:0%;">
                  <div class="card-body image-wrapper">
                    <img class="card-img-top" src="` + img + `" alt="Card image cap">
                  </div>
                  <div class="card-text">
                    <div style="height:45px">
                      <a class="card-title" href="">` + name + `</a>
                    </div>
                    <p>` + description + `</p>
                  </div>
                </div>  
              </div>`

  fav_div = document.getElementById("firstdiv");
  fav_div.innerHTML += html;
}

window.onload = function() {
  getFavourite();
}
