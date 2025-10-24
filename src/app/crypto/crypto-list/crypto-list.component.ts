import { Component, OnInit, signal, ViewChild, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { CryptoService } from '../../core/services/crypto.service';
import { CryptoResponse, CryptoStats } from '../../core/models/crypto.models';
import { formatPrice, formatLargeNumber, formatDate } from '../../shared/utils/format.util';
import {
  PAGINATION_CONFIG,
  SORT_CONFIG,
  CRYPTO_TABLE_COLUMNS,
  MESSAGES,
  APP_ROUTES
} from '../../shared/constants/app.constants';

@Component({
  selector: 'app-crypto-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crypto-list.component.html',
  styleUrl: './crypto-list.component.css'
})
export class CryptoListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly destroy$ = new Subject<void>();

  displayedColumns: string[] = [...CRYPTO_TABLE_COLUMNS];

  dataSource = new MatTableDataSource<CryptoResponse>([]);

  isLoading = signal(false);
  error = signal('');
  searchQuery = signal('');
  stats = signal<CryptoStats | null>(null);
  isSyncing = signal(false);

  totalElements = 0;
  pageSize: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
  pageIndex: number = PAGINATION_CONFIG.DEFAULT_PAGE_INDEX;
  pageSizeOptions = [...PAGINATION_CONFIG.PAGE_SIZE_OPTIONS];

  sortBy: string = SORT_CONFIG.DEFAULT_SORT_BY;
  sortDirection: 'asc' | 'desc' = SORT_CONFIG.DEFAULT_SORT_DIRECTION;

  constructor(
    private cryptoService: CryptoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCryptos();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCryptos(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.cryptoService.listCryptos(
      this.searchQuery() || undefined,
      this.pageIndex,
      this.pageSize,
      this.sortBy,
      this.sortDirection
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || MESSAGES.CRYPTO.LOAD_ERROR);
        this.isLoading.set(false);
      }
    });
  }

  loadStats(): void {
    this.cryptoService.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats.set(stats);
        },
        error: (error) => {
        }
      });
  }

  onSearch(): void {
    this.pageIndex = PAGINATION_CONFIG.DEFAULT_PAGE_INDEX;
    this.loadCryptos();
  }

  onSearchInputChange(): void {
    const trimmedQuery = this.searchQuery().trim();
    if (!trimmedQuery) {
      this.pageIndex = PAGINATION_CONFIG.DEFAULT_PAGE_INDEX;
      this.loadCryptos();
    }
  }

  onClearSearch(): void {
    this.searchQuery.set('');
    this.pageIndex = PAGINATION_CONFIG.DEFAULT_PAGE_INDEX;
    this.loadCryptos();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCryptos();
  }

  onSortChange(sort: Sort): void {
    if (sort.active && sort.direction) {
      this.sortBy = SORT_CONFIG.COLUMN_MAPPING[sort.active as keyof typeof SORT_CONFIG.COLUMN_MAPPING] || SORT_CONFIG.DEFAULT_SORT_BY;
      this.sortDirection = sort.direction as 'asc' | 'desc';
    } else {
      this.sortBy = SORT_CONFIG.DEFAULT_SORT_BY;
      this.sortDirection = SORT_CONFIG.DEFAULT_SORT_DIRECTION;
    }

    this.pageIndex = PAGINATION_CONFIG.DEFAULT_PAGE_INDEX;
    this.loadCryptos();
  }

  viewDetail(crypto: CryptoResponse): void {
    this.router.navigate([APP_ROUTES.CRYPTO_DETAIL(crypto.coinId)]);
  }

  syncCryptos(): void {
    if (confirm(MESSAGES.CRYPTO.SYNC_CONFIRM)) {
      this.isSyncing.set(true);

      this.cryptoService.syncCryptos()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isSyncing.set(false);
            this.loadCryptos();
            this.loadStats();
            alert(MESSAGES.CRYPTO.SYNC_SUCCESS(response.synced));
          },
          error: (error) => {
            this.isSyncing.set(false);
            alert(`${MESSAGES.CRYPTO.SYNC_ERROR}: ${error.message}`);
            alert(`${MESSAGES.CRYPTO.SYNC_ERROR}: ${error.message}`);
          }
        });
    }
  }

  formatPrice = formatPrice;
  formatLargeNumber = formatLargeNumber;
  formatDate = formatDate;

  trackByCoinId(index: number, item: CryptoResponse): string {
    return item.coinId;
  }
}
