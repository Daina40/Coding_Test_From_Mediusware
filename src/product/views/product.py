from django.views import generic
from product.models import Product, Variant
from product.filters import ProductFilter
from django.core.paginator import Paginator

class CreateProductView(generic.TemplateView):
    template_name = 'products/create.html'
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super(CreateProductView, self).get_context_data(**kwargs)
        variants = Variant.objects.filter(active=True).values('id', 'title')
        context['product'] = True
        context['variants'] = list(variants.all())

        # Add the filter form
        product_filter = ProductFilter(self.request.GET, queryset=Product.objects.all())
        paginator = Paginator(product_filter.qs, 10)
        page = self.request.GET.get('page')
        context['filter_form'] = product_filter.form
        context['products'] = paginator.get_page(page)

        return context

