import React, { useMemo, useState } from 'react';
import {
  MapPin, Stethoscope, ShieldCheck,
  MessageCircle, CheckCircle2
} from 'lucide-react';
import { SearchIcon } from './Icons';
import '../csscomponents/SearchPage.css';

const doctors = [
  {
    name: 'Dr. Ananya Sharma',
    specialty: 'Small Animal Medicine',
    city: 'Bengaluru',
    initials: 'AS',
    color: '#DCE9E0',
    type: 'Doctors',
    verified: false,
    takeaway: true
  },
  {
    name: 'Dr. Arjun Mehta',
    specialty: 'Veterinary Surgery',
    city: 'Mumbai',
    initials: 'AM',
    color: '#E9DFD1',
    type: 'Doctors',
    verified: false,
    takeaway: true
  },
  {
    name: 'Dr. Priya Nair',
    specialty: 'Veterinary Dermatology',
    city: 'Kochi',
    initials: 'PN',
    color: '#E6DFEC',
    type: 'Doctors',
    verified: false,
    takeaway: false
  },
  {
    name: 'Dr. Vikram Singh',
    specialty: 'Equine Medicine',
    city: 'Jaipur',
    initials: 'VS',
    color: '#DCE5EF',
    type: 'Doctors',
    verified: false,
    takeaway: true
  }
];

const specialties = [
  'Dermatology', 'Surgery', 'Livestock', 'Equine',
  'Imaging', 'Nutrition', 'Wildlife', 'Preventive'
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All states');
  const [specialty, setSpecialty] = useState('');
  const [tab, setTab] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [takeawaysOnly, setTakeawaysOnly] = useState(false);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const text = `${doctor.name} ${doctor.specialty} ${doctor.city}`.toLowerCase();

      return (
        text.includes(query.toLowerCase()) &&
        (city === 'All states' || doctor.city === city) &&
        (!specialty ||
          doctor.specialty.toLowerCase().includes(specialty.toLowerCase())) &&
        (!verifiedOnly || doctor.verified) &&
        (!takeawaysOnly || doctor.takeaway) &&
        (tab === 'All' || tab === 'Doctors')
      );
    });
  }, [query, city, specialty, tab, verifiedOnly, takeawaysOnly]);

 
}