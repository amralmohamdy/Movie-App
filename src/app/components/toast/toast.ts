import { Component, effect, signal } from '@angular/core';
import { ToastService } from '../../shared/toast-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  constructor(public toast: ToastService) { }

  get toastMessage() {
    return this.toast.toastMessage();
  }

  get toastType() {
    return this.toast.toastType();
  }

  get toastProgress() {
    return this.toast.toastProgress();
  }

  get showToast() {
    return this.toast.showToast();
  }
}
