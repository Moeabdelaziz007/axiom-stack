# Secret Agent Cloud Function for Automated 
# Secret Lifecycle Management
import base64
import json
import os
import requests
from google.cloud import secretmanager


# تهيئة العميل مرة واحدة عالمياً لإعادة الاستخدام في "التشغيل الساخن" 
# (Warm Starts)
secret_client = secretmanager.SecretManagerServiceClient()

# يتم حقن المفتاح الرئيسي كمتغير بيئة عند نشر الوظيفة
# هذا أفضل من جلبه في كل مرة، ويتبع مبدأ حقن التبعية [41, 42]
RENDER_API_KEY = os.environ.get("RENDER_API_KEY")
GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID")



def secret_agent_handler(event, context):
    """
    نقطة الدخول للوكيل؛ يتم تشغيلها بواسطة Pub/Sub عبر Eventarc.
    'event' هو قاموس (dict) يحتوي على رسالة Pub/Sub.
    """
    
    # 1. الاستلام والتحليل (Parse)
    try:
        # Extract Pub/Sub data from 
        # the event
        pubsub_data = event['data']['message']['data']
        decoded_data = base64.b64decode(pubsub_data).decode('utf-8')
        secret_metadata = json.loads(decoded_data)
        secret_name_full = secret_metadata['name']  
        # (مثل "projects/PID/secrets/render-sync-DISCORD")
        secret_name_short = secret_name_full.split('/')[-1]
        
        # التحقق من أننا نهتم فقط بإضافة إصدار جديد
        event_type = event['data']['message']['attributes'].get('eventType')
        if event_type != 'SECRET_VERSION_ADD':
            print(f"Ignoring event type {event_type} for {secret_name_short}.")
            return ('Ignored non-ADD event', 204)
            
    except Exception as e:
        print(f"Error parsing Pub/Sub message: {e}")
        # إرجاع خطأ لإعادة المحاولة (Retry) بواسطة Pub/Sub
        raise e
    
    print(f"Processing SECRET_VERSION_ADD event for: {secret_name_short}")
    
    # 2. التوجيه الذكي (Routing)
    labels = secret_metadata.get('labels', {})
    sync_target = labels.get('sync-target')
    render_service_id = labels.get('render-service-id')
    render_env_var_key = labels.get('render-env-var-key')
    
    if sync_target != 'render' or not render_service_id or not render_env_var_key:
        print(f"Secret {secret_name_short} is not tagged "
              f"correctly for Render sync. Skipping.")
        # إرجاع نجاح (204) لعدم إعادة المحاولة (No-Retry)
        return ('Skipped non-render secret', 204)
    
    if not RENDER_API_KEY:
        print("CRITICAL ERROR: RENDER_API_KEY env var is not set for the agent.")
        raise Exception("Agent configuration error")
    
    print(f"Routing {secret_name_short} -> Render Service ID: "
          f"{render_service_id} (Env Var: {render_env_var_key})")
    
    # 3. جلب قيمة السر الجديد
    try:
        # "الاسم" (name) من الحمولة هو اسم السر، نضيف 'versions/latest'
        version_path = f"{secret_name_full}/versions/latest"
        response = secret_client.access_secret_version(name=version_path)
        new_secret_value = response.payload.data.decode("UTF-8")
        
    except Exception as e:
        print(f"Failed to access secret value for {secret_name_short}: {e}")
        # هذا خطأ يتطلب إعادة المحاولة (Retry)
        raise e
    
    # 4. الدفع وإعادة النشر (Push & Redeploy)
    try:
        headers = {
            "Authorization": f"Bearer {RENDER_API_KEY}",  # [26]
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # الخطوة أ: تحديث متغير البيئة
        update_url = (f"https://api.render.com/v1/services/"
                      f"{render_service_id}/env-vars/{render_env_var_key}")
        update_payload = {"value": new_secret_value}
        
        print(f"Pushing new value for {render_env_var_key} to Render "
              f"service {render_service_id}...")
        update_resp = requests.put(update_url, headers=headers, 
                                   json=update_payload)
        update_resp.raise_for_status()  # إيقاف التنفيذ إذا فشل التحديث
        
        print(f"Successfully updated env var. Triggering deploy...")
        
        # الخطوة ب: تشغيل إعادة النشر (الحاسمة)
        deploy_url = (f"https://api.render.com/v1/services/"
                      f"{render_service_id}/deploys")
        # يمكننا إرسال جسم فارغ أو تحديد 'clearCache'
        deploy_payload = {"clearCache": "do_not_clear"}
        
        deploy_resp = requests.post(deploy_url, headers=headers, 
                                    json=deploy_payload)
        deploy_resp.raise_for_status()  # إيقاف التنفيذ إذا فشل النشر
        
        print(f"SUCCESS: Synced {secret_name_short} and "
              f"triggered deploy for service {render_service_id}.")
        return (f"Successfully synced {secret_name_short}", 200)
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling Render API: {e}")
        if e.response is not None:
            print(f"Render API Response: {e.response.text}")
        # هذا خطأ يتطلب إعادة المحاولة
        raise e