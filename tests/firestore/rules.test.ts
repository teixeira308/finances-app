import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import { setDoc, getDoc, doc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'test-project',
      firestore: {
        rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('allows a user to read their own transaction', async () => {
    const aliceContext = testEnv.authenticatedContext('alice');
    const aliceDb = aliceContext.firestore();
    
    // Use admin context to seed data
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'transactions/t1'), {
        userId: 'alice',
        amount: 100,
        description: 'Test',
        date: new Date(),
        categoryId: 'c1'
      });
    });

    const docRef = doc(aliceDb, 'transactions/t1');
    await expect(getDoc(docRef)).resolves.toBeDefined();
  });

  it('denies a user from reading another user\'s transaction', async () => {
    const bobContext = testEnv.authenticatedContext('bob');
    const bobDb = bobContext.firestore();
    
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore();
      await setDoc(doc(adminDb, 'transactions/t1'), {
        userId: 'alice',
        amount: 100,
        description: 'Test',
        date: new Date(),
        categoryId: 'c1'
      });
    });

    const docRef = doc(bobDb, 'transactions/t1');
    await expect(getDoc(docRef)).rejects.toThrow();
  });

  it('denies creating a transaction with missing fields', async () => {
    const aliceContext = testEnv.authenticatedContext('alice');
    const aliceDb = aliceContext.firestore();
    
    const docRef = doc(aliceDb, 'transactions/t2');
    await expect(setDoc(docRef, {
      userId: 'alice',
      amount: 100
      // missing fields
    })).rejects.toThrow();
  });
});
