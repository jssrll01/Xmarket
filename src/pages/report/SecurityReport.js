import React from 'react';
import ReportForm from './ReportForm';

export default function SecurityReport() {
  return (
    <ReportForm
      category="security"
      title="Account Security Report"
      description="Report unauthorized access, password issues, or suspicious activity on your account. We'll take this seriously."
    />
  );
}
