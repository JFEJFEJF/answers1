const form = document.getElementById('upload-form');
const statusElement = document.getElementById('status');

// ضع هنا Token البوت الخاص بك
const BOT_TOKEN = '7288053522:AAHOPSlR81LWUYMY76Zm8vKzxI4-xj_klog';
// ضع هنا معرف الشات (chat_id) الذي تريد إرسال الملفات إليه (يمكن أن يكون معرف القناة أو معرف المستخدم)
const CHAT_ID = '6520553599';

const UPLOAD_CODE = ["AA11", "AM44", "MM94"];
let hasUploaded = false; // متغير لتتبع حالة الرفع

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];
    const studentName = document.getElementById('name').value;
    const studentClass = document.getElementById('class').value;
    const code = document.getElementById('code').value;

    // التحقق من الوقت
    const currentHour = new Date().getHours();
    if (currentHour < 21 || currentHour >= 23) {
        statusElement.textContent = 'الرفع متاح من الساعة 9 إلى 11 مساءً فقط!';
        return;
    }

    if (!file || !studentName || !studentClass) {
        statusElement.textContent = 'يرجى ملء جميع الحقول واختيار ملف!';
        return;
    }

    if (hasUploaded && !UPLOAD_CODE.includes(code)) {
        statusElement.textContent = 'لإعادة الرفع، يجب عليك إدخال كود صحيح!';
        return;
    }

    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('document', file);  // يمكن أيضًا استخدام 'photo' إذا كانت صورة
    formData.append('caption', `اسم الطالب: ${studentName}\nالصف: ${studentClass}`);

    statusElement.textContent = 'جارٍ رفع الملف...';

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.ok) {
            statusElement.textContent = 'تم رفع الملف بنجاح!';
            hasUploaded = true; // تعيين الحالة على تم الرفع
        } else {
            statusElement.textContent = `حدث خطأ: ${result.description}`;
        }
    } catch (error) {
        statusElement.textContent = 'فشل في الاتصال بالخادم.';
    }
});
