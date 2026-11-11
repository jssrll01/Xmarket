import React from 'react';
import OppList from '../components/OppList';
export default function Freelance() {
  return <OppList title="Freelance work" rpc="freelance_list" kind="freelance" empty="No freelance work available right now." />;
}
