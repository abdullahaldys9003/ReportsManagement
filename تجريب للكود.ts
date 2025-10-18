const handleCreateReport = async ({ values, table }) => {
  const newValidationErrors = validateReport(values);
  if (Object.keys(newValidationErrors).length > 0) {
    setValidationErrors(newValidationErrors);
    return;
  }
  
  setValidationErrors({});
  
  // تجهيز البيانات الأساسية للبلاغ
  const reportData = {
    description: values.description,
    status_report: values.status_report || "opened",
    main_id: values.main_id,
    sub_id: values.sub_id,
    districts_reports: values.districts_reports,
    neighborhoods_reports: values.neighborhoods_reports,
    archive: 0
  };
  
  // تجهيز مصفوفة المبلغين (باستخدام Spread Operator)
  const reportersData = [
    ...reporters.map(reporter => reporter.data),
    {
      name_reporter: values.name_reporter,
      phone_reporter: values.phone_reporter,
      email_reporter: values.email_reporter,
      id_national_reporter: values.id_national_reporter,
      districts_reporter: values.districts_reporter,
      neighborhoods_reporter: values.neighborhoods_reporter,
      address_reporter: values.address_reporter
    }
  ];
  
  // تجهيز مصفوفة المبلغ عنهم (باستخدام Spread Operator)
  const reportedPersonsData = [
    ...suspects.map(suspect => suspect.data),
    {
      full_name: values.fullName,
      phone: values.phone,
      gender: values.gender,
      age: values.age,
      national_id: values.nationalId,
      address: values.address,
      district_suspects: values.district_suspects,
      neighborhood_suspects: values.neighborhood_suspects
    }
  ];
  
  await createReport(reportData, reportersData, reportedPersonsData);
  table.setCreatingRow(null);
};