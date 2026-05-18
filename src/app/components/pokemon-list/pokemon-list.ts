import { Component, OnInit,signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { toSignal, toObservable } from "@angular/core/rxjs-interop";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { List } from "../../services/list";
import { Pokemon } from "../../models/pokemon.models";
import { PokemonCard } from "../pokemon-card/pokemon-card";

@Component({
  selector: "app-pokemon-list",
  standalone: true,
  imports: [CommonModule, PokemonCard],
  templateUrl: "./pokemon-list.html",
  styleUrl: "./pokemon-list.css",
})
export class PokemonList implements OnInit {
  //pokemons$!: Observable<Pokemon[]>;
  currentPage = signal(1); // değişti , sinyal yapınca angular takip etmeye başlar , template ide takip eder

  currentPage$ = toObservable(this.currentPage);
  pokemons = signal<Pokemon[]>([]);

//  pokemons$ = this.currentPage$.pipe(
//  switchMap((page) => this.listService.getPage(page))
//  );

//  pokemons = toSignal(this.pokemons$, {
//  initialValue: [] as Pokemon[]
//  });

//  pokemons = toSignal(
//    toObservable(this.currentPage).pipe(
//      switchMap((page)=> this.listService.getPage(page))
//    ),
//    { initialValue: [] as Pokemon[]} //before the signal arrived it should be empty array 
//  )


  // Aynı anda ekranda kaç sayfa numarası gözükecek
  pagesPerGroup = 10;

  // Şu an ekranda görünen grup nereden başlıyor
  // ilk açılışta 1-10 görünecek
  currentGroupStart = 1;

  constructor(private listService: List) {}

  ngOnInit() {
    this.loadPage(this.currentPage()); //değişti 
  }

  loadPage(page: number): void {
    if (page < 1) return;
    this.currentPage.set(page); //değişti , değiştirmek için set() ve update() kullanır , ve her seferinde değişince her şeyi günceller bunu kullanan  
    // burada signal diyip tracklemeye çalış 
    this.listService.getPage(page).subscribe((data) => {
      this.pokemons.set(data);
    })

  }

  // HTML içinde göstereceğimiz sayfa numaralarını üretir
  get visiblePages(): number[] {
  const pages: number[] = [];

  for (let i = 0; i < this.pagesPerGroup; i++) {
    pages.push(this.currentGroupStart + i);
  }
  return pages;
  }

  // Sonraki 10'lu gruba geçer: 1-10 -> 11-20 -> 21-30
  nextPageGroup(): void {
    this.currentGroupStart += this.pagesPerGroup;
  }

  // Önceki 10'lu gruba döner: 11-20 -> 1-10
  prevPageGroup(): void {
    if (this.currentGroupStart === 1) return;

    this.currentGroupStart -= this.pagesPerGroup;
  }
}