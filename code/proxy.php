<?php
// proxy.php

// السماح بالوصول من أي موقع (CORS)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// التأكد من أن الرابط موجود ومُعالج بشكل آمن
if (isset($_GET['url'])) {
    $url = filter_var($_GET['url'], FILTER_VALIDATE_URL);

    if ($url) {
        // استخدام cURL لجلب البيانات من API الخارجي
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // فقط أثناء التطوير
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response !== false && $httpCode === 200) {
            echo $response;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'فشل في الاتصال بـ API الخارجي']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'الرابط غير صالح']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'لم يتم تمرير عنوان URL']);
}
?>