# Generated by Django 4.2 on 2023-08-28 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Web_App', '0020_remove_server_sino'),
    ]

    operations = [
        migrations.AddField(
            model_name='server',
            name='sino',
            field=models.TextField(default='prova'),
        ),
    ]
