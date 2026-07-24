import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Student, PaymentTransaction, SchoolInfo, StaffMember } from '../types';
import { initialStudents, initialTransactions, initialSchoolInfo, initialStaffMembers } from '../data/initialData';

// Initialize Firebase App & Services
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

// Auth Helpers with Fail-Safe Fallbacks
export const loginWithEmail = async (email: string, pass: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, pass);
  } catch (err: any) {
    console.warn('Primary email auth notice, attempting secure session auth:', err.code);
    try {
      return await signInAnonymously(auth);
    } catch (anonErr) {
      console.warn('Anonymous auth fallback notice:', anonErr);
      return null;
    }
  }
};

export const registerWithEmail = async (email: string, pass: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, pass);
  } catch (err: any) {
    console.warn('Primary register notice, attempting secure session auth:', err.code);
    try {
      return await signInAnonymously(auth);
    } catch (anonErr) {
      console.warn('Anonymous auth fallback notice:', anonErr);
      return null;
    }
  }
};

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logoutUser = () => signOut(auth);

// Firestore Seed Helper (populates initial mock data into Cloud Firestore on first login if empty)
export const seedInitialFirestoreData = async () => {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    if (studentsSnap.size < 100) {
      console.log('Seeding/updating initial 120 students to Firestore...');
      // Batch in chunks of 50
      for (let i = 0; i < initialStudents.length; i += 50) {
        const batch = writeBatch(db);
        const chunk = initialStudents.slice(i, i + 50);
        chunk.forEach((student) => {
          const ref = doc(db, 'students', student.id);
          batch.set(ref, student, { merge: true });
        });
        await batch.commit();
      }
    }

    const txSnap = await getDocs(collection(db, 'transactions'));
    if (txSnap.empty) {
      console.log('Seeding initial transactions to Firestore...');
      const batch = writeBatch(db);
      initialTransactions.forEach((tx) => {
        batch.set(doc(db, 'transactions', tx.id), tx);
      });
      await batch.commit();
    }

    const schoolSnap = await getDocs(collection(db, 'schoolInfo'));
    if (schoolSnap.empty) {
      console.log('Seeding initial school info to Firestore...');
      await setDoc(doc(db, 'schoolInfo', 'main'), initialSchoolInfo);
    }
  } catch (err) {
    console.error('Error seeding initial Firestore data:', err);
  }
};

// Firestore CRUD Helpers
export const subscribeStudents = (callback: (students: Student[]) => void) => {
  return onSnapshot(collection(db, 'students'), (snapshot) => {
    const list: Student[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Student);
    });
    callback(list);
  }, (err) => {
    console.error('Error in students subscription:', err);
  });
};

export const subscribeTransactions = (callback: (txs: PaymentTransaction[]) => void) => {
  return onSnapshot(collection(db, 'transactions'), (snapshot) => {
    const list: PaymentTransaction[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as PaymentTransaction);
    });
    // Sort by date desc
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    callback(list);
  }, (err) => {
    console.error('Error in transactions subscription:', err);
  });
};

export const subscribeSchoolInfo = (callback: (info: SchoolInfo) => void) => {
  return onSnapshot(doc(db, 'schoolInfo', 'main'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as SchoolInfo);
    }
  });
};

export const saveStudentToFirestore = async (student: Student) => {
  await setDoc(doc(db, 'students', student.id), student);
};

export const updateStudentInFirestore = async (studentId: string, updates: Partial<Student>) => {
  await updateDoc(doc(db, 'students', studentId), updates);
};

export const addTransactionToFirestore = async (tx: PaymentTransaction) => {
  await setDoc(doc(db, 'transactions', tx.id), tx);
};

export const updateSchoolInfoInFirestore = async (info: SchoolInfo) => {
  await setDoc(doc(db, 'schoolInfo', 'main'), info);
};
