# api/models.py
from django.db import models
from django.contrib.auth.models import User

class Form(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    form_name = models.CharField(max_length=255)

    def __str__(self):
        return self.form_name

class Block(models.Model):
    form = models.ForeignKey(Form, related_name="blocks", on_delete=models.CASCADE)
    block_name = models.CharField(max_length=255)

    def __str__(self):
        return self.block_name

class Field(models.Model):
    block = models.ForeignKey(Block, related_name="fields", on_delete=models.CASCADE)
    field_name = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50)

    def __str__(self):
        return self.field_name