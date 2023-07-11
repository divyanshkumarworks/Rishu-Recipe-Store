from django.shortcuts import render
from .models import Recipe
from django.http import JsonResponse
import json
import chromadb
from django.views.decorators.csrf import csrf_exempt
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma 
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain import OpenAI, VectorDBQA
from langchain.chains import RetrievalQAWithSourcesChain, RetrievalQA
from langchain.document_loaders import DirectoryLoader, TextLoader
import magic
import os
import nltk
from langchain.chat_models import ChatOpenAI
from recipe_store.secrets import SECRET_KEY 

openai_api_key = SECRET_KEY
loader = DirectoryLoader(r'C:\Users\rishu\recipe_store\recipe_txt', glob='*.txt', loader_cls=TextLoader)
documents = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
docsearch = Chroma.from_documents(texts, embeddings,  persist_directory='db')
# Create your views here.

def home_page(request):
	return render(request, "mainapp/base.html")

def search_page(request):
	foods = Recipe.objects.all()
	context = {
		"foods": foods
	}
	return render(request, "mainapp/search_page.html", context)

def favourite_page(request):
	return render(request, "mainapp/favourites.html")

def detail_page(request, id):
	recipe = Recipe.objects.get(id=id)
	context = {
		"food": recipe,
		}

	return render(request, "mainapp/detail.html", context)

def chatgpt_page(request):
	return render(request, "mainapp/chatgpt_page.html")

def get_all_search_api(request, recipe_title):
	recipes = Recipe.objects.filter(name__icontains=recipe_title)

	data = {
		"recipes": []
	}

	for recipe in recipes:
		data["recipes"].append(
				{
					"id": recipe.id,
					"name": recipe.name,
					"prep_time": recipe.prep_time,
					"description": recipe.description,
					"steps": recipe.steps,
					"image": recipe.image,
					"date_added": recipe.date_added
				}
			)

	return JsonResponse(data)

def get_popular_breakfast_api(request):
	breakfast_id = [78, 97, 93, 9, 13, 21]

	data = {
			"breakfasts": []
		}

	for item in breakfast_id:
		recipes = Recipe.objects.filter(id=item)

		for breakfast in recipes:
			data["breakfasts"].append(
					{
						"id": breakfast.id,
						"name": breakfast.name,
						"image": breakfast.image,
						"description": breakfast.description
					}
				)

	return JsonResponse(data)

def get_popular_lunch_api(request):
	lunch_id = [143, 229, 161, 235, 110, 192]

	data = {
		"lunches": []
	}

	for item in lunch_id:
		recipes = Recipe.objects.filter(id=item)

		for lunch in recipes:
			data["lunches"].append(
					{
						"id": lunch.id,
						"name": lunch.name,
						"image": lunch.image,
						"description": lunch.description
					}
				)

	return JsonResponse(data)

def get_popular_dinner_api(request):
	dinner_id = [193, 226, 225, 167, 331, 332, 133]

	data = {
		"dinners": []
	}

	for item in dinner_id:
		recipes = Recipe.objects.filter(id=item)

		for dinner in recipes:
			data["dinners"].append(
					{
						"id": dinner.id,
						"name": dinner.name,
						"image": dinner.image,
						"description": dinner.description
					}
				)

	return JsonResponse(data)

def get_all_ingredients_api(request, id):
	recipe = Recipe.objects.get(id=id)
	ingredients = recipe.ingredients.all()
	data = {
		"recipe" : []
	}

	for ingredient in ingredients:
		data["recipe"].append(
				{
					"ingredient_name": ingredient.ingredient_name
				}
			)

	return JsonResponse(data)

def get_all_steps_api(request, id):
	recipe = Recipe.objects.get(id=id)
	steps = recipe.steps.split(";")
	i = 1

	data = {
		"steps": []
	}

	for step in steps:
		data["steps"].append(
				{
					"step": "step-" + str(i) + ": " + step
				}
			)
		i += 1

	return JsonResponse(data)

def get_recipe_detail_api(request, id):
	recipes = Recipe.objects.filter(id=id)

	data = {
		"favourites": []
	}

	for recipe in recipes:
		data["favourites"].append(
				{
					"id": recipe.id,
					"name": recipe.name,
					"description": recipe.description,
					"image": recipe.image
				}
			)

	return JsonResponse(data)

@csrf_exempt
def chat_api(request):
	if request.method == "POST":
		data = json.loads(request.body)
		prompt_text = data["prompt_text"]
		query = prompt_text
		# turbo_llm = ChatOpenAI(
		# 	temperature = 0.6,
		# 	model_name = "gpt-3.5-turbo"
		# 	)
		retriever = docsearch.as_retriever(search_kwargs={"k": 2})
		chain = RetrievalQA.from_chain_type(llm=OpenAI(temperature=1), chain_type="stuff", retriever=retriever, return_source_documents=True)
		result = chain(query)
		# response = answer
		
		print(result["source_documents"])

		data = {
			"response": result["result"],
			"recipes": []
		}	

		for item in result["source_documents"]:
			recipe_id = item.metadata["source"][-6:-4]
			recipe = Recipe.objects.get(id=recipe_id)

			data["recipes"].append(
					{
						"id": recipe.id,
						"description": recipe.description,
						"image": recipe.image,
						"prep_time": recipe.prep_time,
						"name": recipe.name
					}
				)		

		return JsonResponse(data)







