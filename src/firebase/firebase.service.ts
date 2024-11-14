import { initializeApp } from 'firebase/app';
import {
  doc,
  getDoc,
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  setDoc,
  addDoc,
} from 'firebase/firestore';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable()
export class FirebaseService {
  private db;
  private app;

  constructor(private configService: ConfigService) {
    // Initialize Firebase Admin SDK
    const firebaseConif = {
      apiKey: 'AIzaSyBGQNNcZbBXYUBuLjomd-pGByHdBvE2JR4',
      authDomain: 'xypher-cc6dc.firebaseapp.com',
      projectId: 'xypher-cc6dc',
      storageBucket: 'xypher-cc6dc.firebasestorage.app',
      messagingSenderId: '492089257015',
      appId: '1:492089257015:web:911003cf75812bd27de3b2',
    };

    console.log('firebaseConif', firebaseConif);
    this.app = initializeApp(firebaseConif);
    this.db = getFirestore(this.app);
    const auth = getAuth();
    signInWithEmailAndPassword(
      auth,
      'tobsichfabian1102@gmail.com',
      '1.Rabenwald.1',
    );
  }

  // Firestore CRUD operations
  async createDocument(collection: string, data: any): Promise<any> {
    const docRef = await setDoc(this.db.collection(collection).doc(), data);
    return docRef;
  }

  async getDocument(collection: string, docId: string): Promise<any> {
    const docRef = this.db.collection(collection).doc(docId);
    const doc = await docRef.get();
    return doc.data();
  }

  async getCollections(): Promise<DocumentData> {
    const playersCollection = collection(this.db, 'players');
    const collections = await getDocs(playersCollection);
    const players = collections.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));
    return players;
  }

  async createUser(username: string, data: any): Promise<any> {
    const docRef = await setDoc(doc(this.db, 'players', username), {
      ...data,
    });
    return docRef;
  }

  async getUser(username: string): Promise<any> {
    const docRef = doc(this.db, 'players', username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  async getServer(serverName: string): Promise<any> {
    const docRef = collection(this.db, serverName);
    const docSnap = await getDocs(docRef);
    const serverInfo = docSnap.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));
  }

  async getPlayerData(serverName: string, username: string): Promise<any> {
    console.log(username + 'is trying to get his data');
    const docRef = doc(
      this.db,
      serverName.toLocaleLowerCase() + '/players/players/' + username,
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return 'No such document!';
    }
  }
}
