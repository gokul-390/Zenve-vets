/**
 * Doctor Profile Image Utility
 * Provides verified, high-resolution male and female veterinarian portraits
 * ensuring every doctor has an appropriate photo (him or her) displayed.
 */

export const MALE_DOCTOR_PHOTOS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
];

export const FEMALE_DOCTOR_PHOTOS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80',
];

const FEMALE_NAMES = new Set([
  'ananya', 'priya', 'meera', 'harpreet', 'isha', 'sneha', 'kavya', 'divya',
  'nidhi', 'sunita', 'pooja', 'aishwarya', 'ritika', 'tanya', 'swati', 'fathima',
  'fatima', 'shreya', 'neha', 'ritu', 'anjali', 'deepika', 'shruti', 'radhika',
  'preeti', 'rekha', 'anita', 'geeta', 'lakshmi', 'aarti', 'shilpa', 'rashmi',
  'sangeeta', 'aditi', 'sonam', 'sarah', 'emily', 'jessica', 'jennifer', 'mary',
  'lisa', 'anna', 'maria', 'rachel', 'amanda', 'kiran', 'shanti', 'vidya', 'uma',
  'jaya', 'maya', 'parvati', 'sarita', 'alka', 'renuka', 'bhavna', 'madhu',
  'pallavi', 'sapna', 'tanvi', 'komal', 'sheetal', 'payal', 'rupali', 'namrata',
  'simran', 'jaspreet', 'gurpreet', 'manpreet', 'amrit', 'tanya', 'sonia'
]);

const MALE_NAMES = new Set([
  'ram', 'vasanth', 'asish', 'ashish', 'dilip', 'arjun', 'vikram', 'sanjay',
  'aditya', 'dev', 'manish', 'suresh', 'nikhil', 'pranav', 'edwin', 'rahul',
  'rohan', 'amit', 'karan', 'deepak', 'rajesh', 'manoj', 'rakesh', 'vijay',
  'ajay', 'alok', 'sunil', 'vivek', 'gaurav', 'anand', 'abhishek', 'sandeep',
  'kunal', 'varun', 'mohit', 'rohit', 'siddharth', 'harsh', 'pankaj', 'tarun',
  'dinesh', 'mahesh', 'naresh', 'kamal', 'vinay', 'praveen', 'naveen', 'chetan',
  'ashok', 'ravi', 'raj', 'anil', 'krishna', 'ganesh', 'shiva', 'hari', 'vishal',
  'sachin', 'sourav', 'virat', 'dhoni', 'john', 'michael', 'david', 'james',
  'robert', 'alex', 'chris', 'daniel', 'sam'
]);

/**
 * Deterministic hash code from string
 */
function hashString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Determine gender of doctor based on name tokens
 * @param {string} name
 * @returns {'female' | 'male'}
 */
export function detectDoctorGender(name = '') {
  const cleanName = (name || '')
    .toLowerCase()
    .replace(/^dr\.?\s*/i, '')
    .replace(/[^a-z\s]/g, ' ')
    .trim();

  const tokens = cleanName.split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    if (FEMALE_NAMES.has(token)) return 'female';
  }
  for (const token of tokens) {
    if (MALE_NAMES.has(token)) return 'male';
  }

  // Fallback to deterministic hash if name is not in known dictionary
  const hash = hashString(cleanName || 'vet');
  return hash % 2 === 0 ? 'male' : 'female';
}

/**
 * Get an authentic fallback veterinarian portrait (him or her)
 * @param {object} doctor
 * @returns {string} URL
 */
export function getDoctorFallbackImage(doctor = {}) {
  const name = doctor.name || doctor.fullName || '';
  const gender = detectDoctorGender(name);
  const pool = gender === 'female' ? FEMALE_DOCTOR_PHOTOS : MALE_DOCTOR_PHOTOS;

  const key = doctor.id || name || 'zenve-doctor';
  const index = hashString(key) % pool.length;

  return pool[index];
}

/**
 * Get guaranteed doctor photo URL, falling back to appropriate portrait
 * @param {object} doctor
 * @returns {string} URL
 */
export function getDoctorImage(doctor = {}) {
  if (
    doctor &&
    typeof doctor.img === 'string' &&
    doctor.img.trim().length > 10 &&
    !doctor.img.includes('photo-1597223557154-721c1cecc4b0') // known 404 URL
  ) {
    return doctor.img.trim();
  }
  return getDoctorFallbackImage(doctor);
}

export default getDoctorImage;
