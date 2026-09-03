import {
  doc,
  runTransaction,
  onSnapshot,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { getFirestoreDb } from './firebase';
import { KhatmState, AllocationResult } from '../types';

export const TOTAL_PAGES_IN_QURAN = 604;
const KHATM_DOC_COLLECTION = 'quran_khatm';
const KHATM_DOC_ID = 'state';

/**
 * Pure calculation logic for transitioning state upon a new page assignment
 */
export function calculateNextState(current: Partial<KhatmState> | null | undefined): {
  newState: KhatmState;
  allocation: AllocationResult;
} {
  const currentKhatm = Number(current?.currentKhatm) || 1;
  const lastAssignedPage = Number(current?.lastAssignedPage) || 0;
  const completedKhatms = Number(current?.completedKhatms) || 0;
  const totalAssignedPagesAllTime = Number(current?.totalAssignedPagesAllTime) || (completedKhatms * TOTAL_PAGES_IN_QURAN + lastAssignedPage);

  let nextPage: number;
  let nextKhatm: number;
  let nextCompletedKhatms: number;

  if (lastAssignedPage >= TOTAL_PAGES_IN_QURAN) {
    // Previous khatm was completed! Move to page 1 of the next khatm.
    nextCompletedKhatms = completedKhatms + 1;
    nextKhatm = currentKhatm + 1;
    nextPage = 1;
  } else {
    nextCompletedKhatms = completedKhatms;
    nextKhatm = currentKhatm;
    nextPage = lastAssignedPage + 1;
  }

  const newState: KhatmState = {
    currentKhatm: nextKhatm,
    lastAssignedPage: nextPage,
    completedKhatms: nextCompletedKhatms,
    totalAssignedPagesAllTime: totalAssignedPagesAllTime + 1,
  };

  const allocation: AllocationResult = {
    pageNumber: nextPage,
    khatmNumber: nextKhatm,
    completedKhatms: nextCompletedKhatms,
    timestamp: Date.now(),
  };

  return { newState, allocation };
}

/**
 * Subscribes to real-time changes of the global Quran Khatm counter
 */
export function subscribeToKhatmState(
  onUpdate: (state: KhatmState) => void,
  onError: (error: Error) => void
): () => void {
  try {
    const db = getFirestoreDb();
    const stateDocRef = doc(db, KHATM_DOC_COLLECTION, KHATM_DOC_ID);

    const unsubscribe = onSnapshot(
      stateDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as KhatmState;
          onUpdate({
            currentKhatm: Number(data.currentKhatm) || 1,
            lastAssignedPage: Number(data.lastAssignedPage) || 0,
            completedKhatms: Number(data.completedKhatms) || 0,
            totalAssignedPagesAllTime: Number(data.totalAssignedPagesAllTime) || 0,
            updatedAt: data.updatedAt,
          });
        } else {
          // Document does not exist yet (first initialization)
          onUpdate({
            currentKhatm: 1,
            lastAssignedPage: 0,
            completedKhatms: 0,
            totalAssignedPagesAllTime: 0,
          });
        }
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error);
        onError(error);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('Failed to initialize Firestore subscription:', err);
    onError(err);
    return () => {};
  }
}

/**
 * Atomically allocates the next Quran page using a Firestore transaction.
 * Guarantees zero duplicate allocations across concurrent users.
 */
export async function allocateNextQuranPage(customDb?: Firestore): Promise<AllocationResult> {
  const db = customDb || getFirestoreDb();
  const stateDocRef = doc(db, KHATM_DOC_COLLECTION, KHATM_DOC_ID);

  return await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(stateDocRef);
    const existingData = snapshot.exists() ? (snapshot.data() as Partial<KhatmState>) : null;

    const { newState, allocation } = calculateNextState(existingData);

    transaction.set(stateDocRef, {
      ...newState,
      updatedAt: serverTimestamp(),
    });

    return allocation;
  });
}
