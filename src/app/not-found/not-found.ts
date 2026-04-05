import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.html'
})
export class NotFoundErrorComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  
  countdown: number = 5;
  private intervalId: any;

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.goToLogin();
      }
    }, 1000);
  }

  goToLogin() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.router.navigate(['/login']);
  }
}
