import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, deleteDoc, doc, getDocs, collectionData } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  // private firestore = inject(Firestore);
  // private injector = inject(Injector);

  // /**
  //  * Get all wishlist documents as an Observable of plain objects.
  //  * Using AngularFire's collectionData avoids manual getDocs usage and
  //  * returns an Observable that plays nicely with Angular change detection.
  //  */
  // getWishlist(): Observable<any[]> {
  //   const wishlistRef = collection(this.firestore, 'wishlist');
  //   return from(runInInjectionContext(this.injector, async () => {
  //     const snapshot = await getDocs(wishlistRef);
  //     // Spread document data first, then set `id` to the Firestore document id
  //     // to ensure `id` is unique (doc id) and not overridden by a field inside the
  //     // document data (which may contain a non-unique movie id).
  //     return snapshot.docs.map(d => ({ ...(d.data ? d.data() : {}), id: d.id }));
  //   }));
  // }

  // /**
  //  * Add a new wishlist item.
  //  */
  // addToWishlist(item: any): Observable<any> {
  //   const wishlistRef = collection(this.firestore, 'wishlist');
  //   return from(runInInjectionContext(this.injector, () => addDoc(wishlistRef, { ...item, createdAt: new Date() })));
  // }

  // /**
  //  * Remove a wishlist document by id. Validates id and runs delete inside
  //  * the injection context.
  //  */
  // removeFromWishlist(id: string): Observable<void> {
  //   if (!id || typeof id !== 'string') {
  //     return from(Promise.reject(new Error(`Invalid ID provided: ${id}. ID must be a non-empty string.`)));
  //   }
  //   const docRef = doc(this.firestore, 'wishlist', id);
  //   return from(runInInjectionContext(this.injector, () => deleteDoc(docRef)));
  // }

  constructor(private firestore: Firestore, private auth: Auth, private injector: Injector) {}

  /** Watch current user’s wishlist */
  getWishlist(): Observable<any[]> {
    const user = this.auth.currentUser;
    if (!user) {
      return of([]);
    }

    const ref = collection(this.firestore, `users/${user.uid}/wishlist`);
    // Use getDocs inside runInInjectionContext and map the snapshot to plain objects.
    // Returning an Observable from a Promise ensures all Firestore operations run
    // inside Angular's injection context and avoids collectionData type issues.
    return from(runInInjectionContext(this.injector, async () => {
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(d => ({ ...(d.data ? d.data() : {}), id: d.id }));
    }));
  }

  async addToWishlist(item: { name: string }) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');
    const ref = collection(this.firestore, `users/${user.uid}/wishlist`);
    return runInInjectionContext(this.injector, () => addDoc(ref, item));
  }

  async removeFromWishlist(id: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');
    const ref = doc(this.firestore, `users/${user.uid}/wishlist/${id}`);
    return runInInjectionContext(this.injector, () => deleteDoc(ref));
  }
}
