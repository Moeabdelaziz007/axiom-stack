# دليل الحصول على Page Access Token عبر Graph API Explorer

## الطريقة الأسهل والأسرع (بدون OAuth معقد)

### الخطوة 1: افتح Graph API Explorer

افتح الرابط التالي في متصفحك:
<https://developers.facebook.com/tools/explorer/>

### الخطوة 2: اختر التطبيق

- في القائمة المنسدلة العلوية "Meta App"، اختر **Axiom ID** (App ID: 1300380538557381)

### الخطوة 3: احصل على User Access Token مع الصلاحيات

1. اضغط على زر **"Get Token"** → **"Get User Access Token"**
2. في النافذة المنبثقة، اختر الصلاحيات التالية:
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`  
   - ✅ `pages_manage_posts` (إذا متاح)
   - ✅ `instagram_basic`
   - ✅ `instagram_content_publish` (إذا متاح)
   - ✅ `pages_manage_metadata`

3. اضغط **"Generate Access Token"**
4. وافق على الصلاحيات في النافذة المنبثقة

### الخطوة 4: احصل على Page Access Token

1. بعد الحصول على User Access Token، في حقل الطلب (Request field) اكتب:

   ```
   me/accounts
   ```

2. اضغط **"Submit"** أو **"Send"**
3. ستحصل على استجابة JSON تحتوي على قائمة بالصفحات التي تديرها
4. **انسخ `access_token`** من الصفحة التي تريد النشر عليها (مثلاً صفحة "StayX")
5. **انسخ `id`** (هذا هو `META_PAGE_ID`)

### الخطوة 5: تحويل Token إلى Long-Lived (صالح 60 يومًا)

1. في Graph API Explorer، في حقل الطلب اكتب:

   ```
   oauth/access_token?grant_type=fb_exchange_token&client_id=1300380538557381&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_PAGE_TOKEN
   ```

   (استبدل `YOUR_APP_SECRET` و `SHORT_LIVED_PAGE_TOKEN` بالقيم الفعلية)

2. اضغط **"Submit"**
3. **انسخ قيمة `access_token`** من الاستجابة - هذا هو الـ Long-Lived Token

### الخطوة 6: أضف القيم إلى .env

```dotenv
META_ACCESS_TOKEN=YOUR_LONG_LIVED_PAGE_ACCESS_TOKEN
META_PAGE_ID=YOUR_FACEBOOK_PAGE_ID
```

---

## ملاحظات مهمة

### إذا كانت الصلاحيات غير متاحة في وضع التطوير

- استخدم الصلاحيات الأساسية المتاحة فقط (`pages_show_list`, `pages_read_engagement`)
- ستحصل على Page Access Token يمكن استخدامه للقراءة
- للنشر، قد تحتاج إلى نقل التطبيق إلى **Live Mode** بعد المراجعة

### بديل أسرع (للاختبار فقط)

- استخدم **Test User** أو **Test Page** من إعدادات التطبيق
- في Development Mode، يمكنك النشر على صفحات الاختبار دون مراجعة

### تجديد Token تلقائي

- الـ Page Access Token الناتج من Long-Lived User Token قد لا ينتهي أبدًا
- لكن يُوصى بتجديده كل 60 يومًا للتأكد من صلاحيته
