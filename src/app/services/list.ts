import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../environments/environments';
import { Pokemon } from '../models/pokemon.models';

@Injectable({
  providedIn: 'root',
})
export class List {
  private baseUrl = environment.apiUrl;
  private readonly pageSize = 10;
  private readonly maxCachedPages = 10;

  private pageCache = new Map<number, Pokemon[]>();

  constructor(private http: HttpClient) {}

  getPokemon(id: number): Observable<Pokemon> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${id}`).pipe(
      map((res) => ({
        id: res.id,
        name: res.name,
        image: res.sprites.front_default,
      }))
    );
  }

  getPage(page: number): Observable<Pokemon[]> {
    if (page < 1) {
      return of([]);
    }

    const cachedPage = this.pageCache.get(page);
    if (cachedPage) {
      return of(cachedPage);
    }

    const startId = (page - 1) * this.pageSize + 1;

    const requests = Array.from({ length: this.pageSize }, (_, i) =>
      this.getPokemon(startId + i)
    );

    return forkJoin(requests).pipe(  // signal ile change yapılabilir mi bak ? 
      tap((pokemons) => {
        this.pageCache.set(page, pokemons);
        this.trimCache();
      })
      
    );
  }

  private trimCache(): void {
    if (this.pageCache.size <= this.maxCachedPages) {
      return;
    }

    const oldestPage = this.pageCache.keys().next().value;
    if (oldestPage !== undefined) {
      this.pageCache.delete(oldestPage);
    }
  }
}