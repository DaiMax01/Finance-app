from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 10

    def paginate_queryset(self, queryset, request, view=None):
        # Check for the 'get_all' query parameter
        if request.query_params.get('get_all') == 'true':
            return None
        return super().paginate_queryset(queryset, request, view=view)
