import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, MapPin, Building, Map, Flag,
} from 'lucide-react';
import { signUp } from '../lib/auth';
import { useToast } from '../components/Toast';
import AuthShell from '../components/auth/AuthShell';
import AuthField from '../components/auth/AuthField';
import PasswordField from '../components/auth/PasswordField';

export default function SignUp() {
  const nav = useNavigate();
  const { show: toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    username: '', firstName: '', middleName: '', lastName: '',
    email: '', phone: '', password: '', confirm: '',
    dateOfBirth: '', deliveryAddress: '', nearestLandmark: '',
    province: '', city: '', barangay: '',
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast('Passwords do not match');
    if (form.password.length < 6) return toast('Password must be at least 6 characters');
    setBusy(true);
    const { error } = await signUp(form);
    setBusy(false);
    if (error) return toast(error.message);
    toast('Account created! Check your email to verify.');
    nav('/signin');
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Join XMARKET and start shopping"
      footer={<>Already have an account? <Link to="/signin" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link></>}
    >
      <form onSubmit={onSubmit}>
        <AuthField icon={User} label="Username" placeholder="Choose a username" value={form.username} onChange={set('username')} required />
        <AuthField icon={User} label="First Name" placeholder="Juan" value={form.firstName} onChange={set('firstName')} required />
        <AuthField icon={User} label="Middle Name" placeholder="(optional)" value={form.middleName} onChange={set('middleName')} />
        <AuthField icon={User} label="Last Name" placeholder="Dela Cruz" value={form.lastName} onChange={set('lastName')} required />
        <AuthField icon={Mail} label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
        <AuthField icon={Phone} label="Mobile Number" type="tel" placeholder="09XX XXX XXXX" value={form.phone} onChange={set('phone')} required />
        <AuthField icon={Calendar} label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} required />
        <PasswordField label="Password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required />
        <PasswordField label="Confirm Password" placeholder="Re-enter your password" value={form.confirm} onChange={set('confirm')} required />
        <AuthField icon={MapPin} label="Delivery Address" placeholder="House #, Street" value={form.deliveryAddress} onChange={set('deliveryAddress')} required />
        <AuthField icon={MapPin} label="Nearest Landmark" placeholder="(optional)" value={form.nearestLandmark} onChange={set('nearestLandmark')} />
        <AuthField icon={Flag} label="Province" placeholder="Province" value={form.province} onChange={set('province')} required />
        <AuthField icon={Building} label="City / Municipality" placeholder="City or municipality" value={form.city} onChange={set('city')} required />
        <AuthField icon={Map} label="Barangay" placeholder="Barangay" value={form.barangay} onChange={set('barangay')} required />
        <button
          type="submit"
          className="btn-primary"
          disabled={busy}
          style={{ width: '100%', padding: 15, fontSize: 15, borderRadius: 14, marginTop: 6 }}
        >
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
}
