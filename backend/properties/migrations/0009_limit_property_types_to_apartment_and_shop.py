from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0008_alter_property_property_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="property",
            name="property_type",
            field=models.CharField(
                choices=[("Apartment", "Apartment"), ("Shop", "Shop")],
                max_length=20,
            ),
        ),
    ]
