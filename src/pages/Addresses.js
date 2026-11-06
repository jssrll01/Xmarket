import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddressBook from '../components/AddressBook';

export default function Addresses() {
  const nav = useNavigate();
  return <AddressBook mode="page" onClose={() => nav(-1)} />;
}
