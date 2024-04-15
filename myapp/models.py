from django.db import models

# Create your models here.

class Author(models.Model):
    author_id = models.AutoField(primary_key=True)
    email = models.CharField(max_length=45)
    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=45)

    class Meta:
        db_table = 'authors'  # The name of the table this model corresponds to
        # If your database schema is named 'paper_pilot' you may need to prefix the table name
        # with the schema name like 'paper_pilot.authors'. This depends on your DB setup.

    def __str__(self):
        return self.name

