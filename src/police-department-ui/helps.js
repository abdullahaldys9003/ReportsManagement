export function getNeighborhoodOptions(neighborhoods, districtId) {
  // التحقق من صحة المدخلات
  if (!neighborhoods || !Array.isArray(neighborhoods)) {
    console.warn('neighborhoods is not a valid array:', neighborhoods);
    return [];
  }
  
  if (!districtId) {
    console.warn('districtId is empty:', districtId);
    return [];
  }
  
  const districtIdNum = Number(districtId);
  
  const result = neighborhoods
    .filter(n => n && Number(n.district_id) === districtIdNum)
    .map(n => ({
      value: n.neighborhood_id,
      label: n.neighborhood_name
    }));
  
  console.log('Input - districtId:', districtId, 'neighborhoods count:', neighborhoods.length);
  console.log('Output - filtered neighborhoods:', result.length);
  
  return result;
}
