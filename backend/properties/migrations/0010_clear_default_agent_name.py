from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0009_limit_property_types_to_apartment_and_shop"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sitesettings",
            name="agent_name",
            field=models.CharField(blank=True, default="", max_length=120),
        ),
    ]
