import React, { useState, useEffect } from "react";
import axios from "axios";

function AlertsManager() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    alert_title: "",
    alert_message: "",
    checkpoint_id: ""
  });

  // تحميل النقاط والتنبيهات عند البداية
  useEffect(() => {
    fetchCheckpoints();
    fetchAlerts();
  }, []);

  const fetchCheckpoints = async () => {
    const res = await axios.get("/api/checkpoints"); // API لإرجاع نقاط التفتيش
    setCheckpoints(res.data);
  };

  const fetchAlerts = async () => {
    const res = await axios.get("/api/alerts"); // API لإرجاع التنبيهات
    setAlerts(res.data);
  };

  // إرسال تنبيه جديد
  const handleSendAlert = async () => {
    try {
      await axios.post("/api/alerts", newAlert); // إرسال التنبيه للـ API
      alert("تم إرسال التنبيه بنجاح!");
      setNewAlert({ alert_title: "", alert_message: "", checkpoint_id: "" });
      fetchAlerts(); // إعادة تحميل التنبيهات
    } catch (err) {
      console.error(err);
    }
  };

  // حذف تنبيه
  const handleDeleteAlert = async (id) => {
    try {
      await axios.delete(`/api/alerts/${id}`);
      fetchAlerts(); // إعادة تحميل التنبيهات
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>إدارة التنبيهات</h2>

      {/* نموذج إرسال تنبيه */}
      <div>
        <input
          type="text"
          placeholder="عنوان التنبيه"
          value={newAlert.alert_title}
          onChange={(e) => setNewAlert({ ...newAlert, alert_title: e.target.value })}
        />
        <input
          type="text"
          placeholder="محتوى التنبيه"
          value={newAlert.alert_message}
          onChange={(e) => setNewAlert({ ...newAlert, alert_message: e.target.value })}
        />
        <select
          value={newAlert.checkpoint_id}
          onChange={(e) => setNewAlert({ ...newAlert, checkpoint_id: e.target.value })}
        >
          <option value="">اختر النقطة أو القسم</option>
          {checkpoints.map((c) => (
            <option key={c.checkpoint_id} value={c.checkpoint_id}>
              {c.name}
            </option>
          ))}
        </select>
        <button onClick={handleSendAlert}>إرسال التنبيه</button>
      </div>

      {/* قائمة التنبيهات */}
      <ul>
        {alerts.map((alert) => (
          <li key={alert.alert_id}>
            <strong>{alert.alert_title}</strong> - {alert.alert_message} 
            <button onClick={() => handleDeleteAlert(alert.alert_id)}>حذف</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertsManager;