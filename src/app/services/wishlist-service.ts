import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private injector: Injector
  ) {}

  /** Watch current user’s wishlist */
  getWishlist(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return of([]);
    }

    const ref = collection(this.firestore, `users/${user.uid}/wishlist`);
    return from(
      runInInjectionContext(this.injector, async () => {
        const snapshot = await getDocs(ref);
        return snapshot.docs.map((d) => {
          const data = d.data() as any;
          return {
            docId: d.id, // Document ID (اختياري)
            ...data,     // القيم الفعلية داخل الوثيقة مثل { id: 1708848 }
          };
        });
      })
    );
  }

  /** Add an item to wishlist */
  async addToWishlist(id: number) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const ref = collection(this.firestore, `users/${user.uid}/wishlist`);
    const item = { id };

    // تأكد إنه مش مكرر
    const q = query(ref, where('id', '==', id));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      console.log('Item already in wishlist');
      return;
    }

    return runInInjectionContext(this.injector, () => addDoc(ref, item));
  }

  /** Remove an item by movie ID (not docId) */
  async removeFromWishlist(movieId: number) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const ref = collection(this.firestore, `users/${user.uid}/wishlist`);
    const q = query(ref, where('id', '==', movieId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('Item not found in wishlist');
      return;
    }

    const docRef = doc(this.firestore, `users/${user.uid}/wishlist/${snapshot.docs[0].id}`);
    return runInInjectionContext(this.injector, () => deleteDoc(docRef));
  }
}
