from django.http import JsonResponse

def api_data(request):
    return JsonResponse({"message": "Hello from backend!", "status": "success"})
