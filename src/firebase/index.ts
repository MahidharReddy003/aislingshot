'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Initialize Firebase with explicit config to ensure it works on all platforms (Local/Hosting/Vercel).
 * Includes defensive checks to prevent initialization errors during Next.js build-time pre-rendering.
 */
export function initializeFirebase() {
  const existingApps = getApps();
  
  // Create a stable app instance
  let app: FirebaseApp;
  
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    // We only provide options if we are NOT on a server-side build that might have empty config
    // though firebaseConfig is defined in config.ts, we wrap it defensively.
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.warn("Firebase initialization failed during build time. This is expected if config is missing.");
      // Fallback app if needed, but usually we just want to avoid the crash
      app = getApp(); 
    }
  }

  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app)
  };
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
