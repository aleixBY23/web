# Generated by Django 4.2 on 2023-08-23 22:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Web_App', '0015_server_expiration_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='server',
            name='password',
            field=models.TextField(null=True),
        ),
    ]
