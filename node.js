// مكتبة لتقليد FFT/IFFT (تحتاج إلى مكتبة رياضية)
const math = require('mathjs');

// البيانات الأصلية
const data = [1, 0, 1, 1, 0, 1, 0, 1];

// تحويل البيانات إلى إشارات فرعية
function ofdmEncode(data) {
  // إضافة إشارات فرعية (تحويل إلى الترددات)
  const freqDomain = math.fft(data);
  console.log("الإشارات في النطاق الترددي:", freqDomain);
  return freqDomain;
}

// استعادة البيانات من الإشارات الفرعية
function ofdmDecode(freqDomain) {
  // تحويل إلى الزمن (إشارة أصلية)
  const timeDomain = math.ifft(freqDomain);
  console.log("الإشارة المستعادة:", timeDomain);
  return timeDomain.map((bit) => Math.round(bit.re)); // تقريب الإشارات الثنائية
}

// ترميز الإشارة
const encodedSignal = ofdmEncode(data);

// فك الإشارة
const decodedSignal = ofdmDecode(encodedSignal);
console.log("البيانات النهائية:", decodedSignal);