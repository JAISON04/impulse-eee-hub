import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Registration {
  id?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  event: string;
  eventId: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId: string;
  registeredAt: Timestamp;
  userId?: string;
}

const REGISTRATIONS_COLLECTION = 'registrations';

// Add a new registration
export const addRegistration = async (
  registration: Omit<Registration, 'id' | 'registeredAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), {
      ...registration,
      registeredAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding registration:', error);
    throw error;
  }
};

// Get all registrations
export const getRegistrations = async (): Promise<Registration[]> => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      orderBy('registeredAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Registration[];
  } catch (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }
};

// Get registrations by event
export const getRegistrationsByEvent = async (
  eventId: string
): Promise<Registration[]> => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('registeredAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Registration[];
  } catch (error) {
    console.error('Error fetching registrations by event:', error);
    throw error;
  }
};

// Subscribe to real-time registrations updates
export const subscribeToRegistrations = (
  callback: (registrations: Registration[]) => void
): (() => void) => {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    orderBy('registeredAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const registrations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Registration[];
    callback(registrations);
  });

  return unsubscribe;
};

// Update registration payment status
export const updatePaymentStatus = async (
  registrationId: string,
  paymentStatus: 'pending' | 'completed' | 'failed',
  transactionId?: string
): Promise<void> => {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    const updateData: Record<string, unknown> = { paymentStatus };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Delete a registration
export const deleteRegistration = async (
  registrationId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, REGISTRATIONS_COLLECTION, registrationId));
  } catch (error) {
    console.error('Error deleting registration:', error);
    throw error;
  }
};

// Generate a mock transaction ID (in production, this comes from payment gateway)
export const generateTransactionId = (): string => {
  return `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};
