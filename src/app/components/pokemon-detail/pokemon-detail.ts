import { Component, OnInit, ChangeDetectorRef} from "@angular/core";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { List } from '../../services/list';
import { Pokemon } from '../../models/pokemon.models';


@Component({
  selector: "app-pokemon-detail",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./pokemon-detail.html",
  styleUrl: "./pokemon-detail.css",
})

export class PokemonDetail implements OnInit{
  pokemon:Pokemon | null=null;
  isLoading : boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private listService: List,
    private cdr: ChangeDetectorRef
  ){}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    console.log('arrived id:', id);

    this.isLoading = true;
    this.listService.getPokemon(id).subscribe({
      next: (pokemon: Pokemon) => {
        console.log('arrived :', pokemon);
        this.pokemon = pokemon;

        this.isLoading = false;
        this.cdr.markForCheck()

      },
      error: (err) => {
        console.error('detailed error :', err);
        this.isLoading = false;

      }
    });
  });

}


}
