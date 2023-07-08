loadIngredients(document.food_id);
loadSteps(document.food_id);

function loadIngredients(recipe_id) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/detail/ingredients/" + recipe_id);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var data = JSON.parse(xhr.responseText);
			recipe = data["recipe"]
			
			for(let i=0; i < recipe.length; i++) {
				var ing_name = recipe[i].ingredient_name;
				addIngredients(ing_name);
			}
		}
	};
	xhr.send();
}

function addIngredients(ing_name) {
	var html = `<li>` + ing_name + `</li>`
	ingredients_div = document.getElementById("ingredients")
	ingredients_div.innerHTML += html
}

function loadSteps(recipe_id) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/api/detail/steps/" + recipe_id);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			var data = JSON.parse(xhr.responseText);
			steps = data["steps"]
			console.log(steps)
			for (let i=0; i < steps.length - 1; i++) {
				addSteps(steps[i].step);
			}		
		}
	};
	xhr.send();
}	

function addSteps(steps) {
	var html = `<li>` + steps + `</li><br>`
	steps_div = document.getElementById("steps");
	steps_div.innerHTML += html;
}