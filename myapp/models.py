from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.IntegerField()
    first_name = models.CharField(max_length=45)
    last_name = models.CharField(max_length=45)
    password = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    class Meta:
        db_table = 'users'
    def __str__(self):
        return self.name

class Author(models.Model):
    author_id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=45)
    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=45)

    class Meta:
        db_table = 'authors'

    def __str__(self):
        return self.name

