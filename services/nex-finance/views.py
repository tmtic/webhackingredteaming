import pickle, base64
from django.db import connection
from django.http import JsonResponse

def restore_snapshot(request):
    # M5-L12: Unsafe Deserialization (Pickle)
    if request.method == 'POST':
        data = base64.b64decode(request.POST.get('data'))
        pickle.loads(data) # RED TEAM TARGET
        return JsonResponse({'status': 'state_restored'})

def query_ledger(request):
    # M5-L14: ORM Injection (Raw SQL bypass)
    ref = request.GET.get('ref')
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM ledger WHERE ref_id = '{ref}'") # SQLi
    return JsonResponse({'status': 'queried'})
