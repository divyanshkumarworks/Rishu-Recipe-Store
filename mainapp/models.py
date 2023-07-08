from django.db import models
from django.utils import timezone

class Ingredient(models.Model):
	ingredient_name = models.TextField(unique=True)

	def __str__(self):
		return self.ingredient_name



class Recipe(models.Model):
	name = models.CharField(max_length=20)
	prep_time = models.IntegerField(null=True)
	description = models.TextField()
	steps = models.TextField(blank=True)
	image = models.TextField(blank=True)
	date_added = models.DateTimeField(default=timezone.now)
	ingredients = models.ManyToManyField(Ingredient, related_name="Ingredient", blank=True)

	def __str__(self):
		return self.name

