import React, { useState } from "react";

const DateRangeFilter = ({ labelFrom = "من", labelTo = "إلى", onChange }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFromDate(value);
    onChange({ from: value, to: toDate });
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setToDate(value);
    onChange({ from: fromDate, to: value });
  };

  return (
    <div className="date-range-filter" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <label>{labelFrom}</label>
      <input type="date" value={fromDate} onChange={handleFromChange} />
      <label>{labelTo}</label>
      <input type="date" value={toDate} onChange={handleToChange} />
    </div>
  );
};

export default DateRangeFilter;




import React, { useState } from "react";
import DateRangeFilter from "./DateRangeFilter";

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const handleFilterChange = (range) => {
    setDateRange(range);
    console.log("الفترة المختارة:", range);
    // هنا يمكن عمل فلترة للبلاغات أو استدعاء API
  };

  return (
    <div>
      <h2>فلتر البلاغات حسب الفترة</h2>
      <DateRangeFilter onChange={handleFilterChange} />

      <p>
        من: {dateRange.from || "غير محدد"} / إلى: {dateRange.to || "غير محدد"}
      </p>

      {/* هنا يمكن تمرير dateRange لتصفية الجدول */}
    </div>
  );
};

export default ReportsPage;