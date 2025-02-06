import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WidgetService } from './widget.service';

interface CacheContent {
  expiry: number;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheContent>();

  constructor(
    private widgetService: WidgetService,
  ) { }

  // Get data from cache
  get(key: string): Observable<any> | undefined {
    const data = this.cache.get(key);
    if (!data) {
      return undefined;
    }

    const now = new Date().getTime();
    if (now > data.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return of(data.value); // return observable
  }

  // Set data to cache
  set(key: string, value: any, ttl: number = environment.cache_ttl): Observable<any> {
    const expiry = new Date().getTime() + ttl;
    this.cache.set(key, { expiry, value });
    return of(value);
  }

  // Cache and return the Observable
  cacheObservable(key: string, fallback: Observable<any>, ttl?: number): Observable<any> {
    const cached = this.get(key);
    if (cached) {
      return cached;
    } else {
      return fallback.pipe(
        tap(value => {
          this.set(key, value, ttl);
        })
      );
    }
  }

  clearCache(){
    this.cache.clear()
  }

}