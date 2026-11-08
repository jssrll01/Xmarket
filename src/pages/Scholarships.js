import React from 'react';
import OppList from '../components/OppList';
export default function Scholarships() {
  return <OppList title="Scholarships" rpc="scholarships_list" kind="scholarship" empty="No scholarships available right now." />;
}
