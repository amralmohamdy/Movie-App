import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
    toastMessage = signal<string>('');
  toastType = signal<'success' | 'error' | 'info'>('info');
  toastProgress = signal(0);
  showToast = signal(false);

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.showToast.set(true);
    this.toastProgress.set(0);

    const interval = 20;
    const step = interval / duration;

    const timer = setInterval(() => {
      const next = this.toastProgress() + step;
      if (next >= 1) {
        this.toastProgress.set(1);
        this.showToast.set(false);
        clearInterval(timer);
      } else {
        this.toastProgress.set(next);
      }
    }, interval);
  }

}
