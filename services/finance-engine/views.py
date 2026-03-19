import pickle, base64
from django.http import JsonResponse

def restore_session(request):
    # M5-L12: Falha real de desserialização insegura
    if request.method == 'POST':
        data = base64.b64decode(request.POST.get('payload'))
        pickle.loads(data) # RCE HERE
        return JsonResponse({'status': 'state_restored'})
