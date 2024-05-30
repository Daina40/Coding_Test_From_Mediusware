# filters.py
import django_filters
from .models import Product, ProductVariantPrice

class ProductFilter(django_filters.FilterSet):
    price_from = django_filters.NumberFilter(field_name="productvariantprice__price", lookup_expr='gte')
    price_to = django_filters.NumberFilter(field_name="productvariantprice__price", lookup_expr='lte')
    date = django_filters.DateFilter(field_name='created_at', lookup_expr='date')

    class Meta:
        model = Product
        fields = ['title', 'productvariant__variant', 'price_from', 'price_to', 'date']
