/**
 * يحول مصفوفة عناصر إلى قائمة خيارات للاستخدام في select
 * @param {Array} items - مصفوفة البيانات الأصلية
 * @param {string} valueKey - اسم الخاصية التي ستصبح value
 * @param {string} labelKey - اسم الخاصية التي ستصبح label
 * @param {boolean} includeAllOption - هل تضيف خيار "جميع العناصر" أم لا
 * @returns {Array} قائمة خيارات بصيغة { value, label }
 */
const mapToSelectOptions = (items, valueKey, labelKey, includeAllOption = true) => {
  const options = items.map(item => ({
    value: item[valueKey],
    label: item[labelKey]
  }));

  if (includeAllOption) {
    options.unshift({ value: "", label: "جميع العناصر" });
  }

  return options;
};

export { mapToSelectOptions };





/**
 * فلترة العناصر بناءً على معرف محدد ثم إرجاع { value, label }
 * @param {Array} items - مصفوفة البيانات الأصلية
 * @param {string|number} id - المعرّف المطلوب الفلترة بناءً عليه
 * @param {string} valueKey - اسم الخاصية التي ستصبح value
 * @param {string} labelKey - اسم الخاصية التي ستصبح label
 * @returns {Array<{value:any,label:string}>} العناصر المطابقة بصيغة { value, label }
 */
const filterByIdWithValueLabel = (items, id, valueKey, labelKey) => {

  if (!id) return items.map(item => ({
    value: item[valueKey],
    label: item[labelKey]
  }));

  return items
    .filter(item => String(item[valueKey]) === String(id))
    .map(item => ({
      value: item[valueKey],
      label: item[labelKey]
    }));
};

export { filterByIdWithValueLabel };