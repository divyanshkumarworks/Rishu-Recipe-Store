from bs4 import BeautifulSoup
import requests
from recipe_store.wsgi import *
from mainapp.models import Ingredient, Recipe
from django.db import transaction
import random
import time
import csv
from mainapp.models import Recipe

page_number = 11
id_count = 1
while page_number <= 43:

	print(" scraping page " + str(page_number))

	gallery = "https://foodviva.com/gallery/page/" + str(page_number) + "/"

	source_code = requests.get(gallery).text 

	soup = BeautifulSoup(source_code, "lxml")

	for links in soup.find_all("div", class_="gal_font"):

		url = links.a["href"]

		source = requests.get(url).text

		soup = BeautifulSoup(source, "lxml")


		title = soup.find("h1", class_="entry-title").span.text

		desc = soup.find("div", id="css_fv_recipe_desc").text

		img_src = soup.find("img", class_="aligncenter")["src"]
		prep = random.randint(20, 40)

		print()
		print('#new recipe')
		print()

		print(title, desc, img_src, prep)

		with transaction.atomic():
			print(title + "added")
			recipe = Recipe(name=title, image=img_src, prep_time=prep, description=desc)
			recipe.save()

		count = 1

		direction = ""

		for step_div in soup.find_all("div", class_="step_desc"):

			direction += step_div.text + ";"
			count += 1
			time.sleep(1)

		recipe.steps = direction
		recipe.save()

		table = soup.find("table", class_="css_fv_recipe_table")

		for span in table.find_all("span"):

			ingredient = span.text

			try:
				with transaction.atomic():
					ingredient = Ingredient(ingredient_name=ingredient)
					ingredient.save()
					recipe.ingredients.add(ingredient)
			except Exception as e:
				ing = Ingredient.objects.get(ingredient_name=ingredient)
				recipe.ingredients.add(ing.id)

			print(str(ingredient) + " added")
			time.sleep(1)

		time.sleep(1)

	page_number += 1


# recipes = Recipe.objects.all()

# for recipe in recipes:
# 	recipe_id = recipe.id
# 	title = recipe.name
# 	preparation_time = recipe.prep_time
# 	description = recipe.description
# 	steps = recipe.steps.split(";")
# 	ingredients = recipe.ingredients.all()
# 	ing = "Ingredients: "
# 	count_steps = 1
# 	# if recipe.id == 1:
# 	# 	print(steps[:-1])

# 	text_file = f"C:/Users/rishu/recipe_store/recipe_txt/{recipe_id}.txt"
# 	with open(text_file, "w") as file:
# 		file.write(f"Title: {title}\n\n")
# 		file.write(f"prep time: {preparation_time}\n\n")
# 		file.write(f"Description: {description}\n\n")
# 		for ingredient in ingredients:
# 			ing += ingredient.ingredient_name + ", "

# 		file.write(f"Ingredient: {ing[:-2]}\n\n")
# 		file.write(f"Directions:\n")

# 		for step in steps[:-1]:
# 			file.write(f"step-{count_steps}: {step}\n")

# 			count_steps += 1
		
# 		# file.write(f"\n")
# 		# file.write(f"Link: http://www.rishurecipestore.online/detail/{recipe_id}")

# 		file.close()
# 		print(f"file {recipe_id}.txt created")