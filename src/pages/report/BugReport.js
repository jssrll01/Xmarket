import React from 'react';
import ReportForm from './ReportForm';

export default function BugReport() {
  return (
    <ReportForm
      category="bug"
      title="Bug & Technical Report"
      description="Report crashes, broken features, or anything not working as expected. We'll investigate and get back to you."
    />
  );
}
