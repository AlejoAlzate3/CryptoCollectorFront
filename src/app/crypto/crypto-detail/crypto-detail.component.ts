import { ChangeDetectionStrategy, Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { CryptoService } from '../../core/services/crypto.service';
import { CryptoResponse } from '../../core/models/crypto.models';
import { formatPrice, formatLargeNumber, formatDate } from '../../shared/utils/format.util';
import { APP_ROUTES, MESSAGES } from '../../shared/constants/app.constants';

@Component({
  selector: 'app-crypto-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crypto-detail.component.html',
  styleUrl: './crypto-detail.component.css'
})
export class CryptoDetailComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  crypto = signal<CryptoResponse | null>(null);
  isLoading = signal(true);
  error = signal('');
  coinId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cryptoService: CryptoService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.coinId = params['id'];
        if (this.coinId) {
          this.loadCryptoDetail();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCryptoDetail(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.cryptoService.getCryptoById(this.coinId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (crypto) => {
          this.crypto.set(crypto);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set(error.message || MESSAGES.CRYPTO.DETAIL_LOAD_ERROR);
          this.isLoading.set(false);
        }
      });
  }

  goBack(): void {
    this.router.navigate([APP_ROUTES.CRYPTO_LIST]);
  }

  getRankColor(rank: number | null): string {
    if (!rank) return '#999';
    if (rank <= 10) return '#ffd700';
    if (rank <= 50) return '#c0c0c0';
    if (rank <= 100) return '#cd7f32';
    return '#999';
  }

  formatPrice = formatPrice;
  formatLargeNumber = formatLargeNumber;
  formatDate = formatDate;
}
