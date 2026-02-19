
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    // For Vercel/Standard environments, we check if we're on the client or if config is provided
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
        try {
          // If we are in an environment that supports automatic initialization (like Firebase App Hosting)
          // it might succeed here. Otherwise it falls back to the manual config.
          firebaseApp = initializeApp(firebaseConfig);
        } catch (e) {
          firebaseApp = initializeApp(firebaseConfig);
        }
    } else {
        // Fallback for SSR/Prerendering if needed
        firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
