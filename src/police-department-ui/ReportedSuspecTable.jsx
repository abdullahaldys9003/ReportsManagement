import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';

const ReportedSuspecTable = ({ reportedPersons = [], onRemove }) => {
  return (
    <div style={{ 
      marginTop: '16px', 
      padding: '16px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '4px',
      backgroundColor: 'white'
    }}>
      <h6 style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '16px',
        fontSize: '1.125rem',
        fontWeight: 'bold'
      }}>
        <PersonIcon /> المبلغ عنهم المضافين
      </h6>
      
      {reportedPersons.length === 0 ? (
        <p style={{ 
          textAlign: 'center', 
          padding: '16px 0',
          color: '#666',
          fontSize: '0.875rem'
        }}>
          لم يتم إضافة أي مبلغ عنه بعد
        </p>
      ) : (
        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>الاسم الكامل</th>
                <th style={thStyle}>الرقم الوطني</th>
                <th style={thStyle}>الهاتف</th>
                <th style={thStyle}>العمر</th>
                <th style={thStyle}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {reportedPersons.map((person, index) => (
                <tr 
                  key={person.id || index}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <td style={tdCenter}>{index + 1}</td>
                  <td style={tdRight}><strong>{person.fullName}</strong></td>
                  <td style={tdRight}>{person.nationalId}</td>
                  <td style={tdRight}>{person.phone}</td>
                  <td style={tdCenter}>{person.age}</td>
                  <td style={tdCenter}>
                    <button 
                      onClick={() => onRemove(person.id)}
                      style={deleteButtonStyle}
                      title="حذف"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// أنماط متكررة لجعل الكود أنظف
const thStyle = { padding: '8px', textAlign: 'right', border: '1px solid #ddd' };
const tdRight = { padding: '12px', textAlign: 'right', border: '1px solid #ddd' };
const tdCenter = { padding: '12px', textAlign: 'center', border: '1px solid #ddd' };
const deleteButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#d32f2f',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px'
};

export default ReportedSuspecTable;