import React from 'react';
import ReportForm from './ReportForm';

export default function OrderReport() {
  return (
    <ReportForm
      category="order"
      title="Order & Product Report"
      description="Report issues with an order, delivery, or received product. Include your order number for faster handling."
    />
  );
}
