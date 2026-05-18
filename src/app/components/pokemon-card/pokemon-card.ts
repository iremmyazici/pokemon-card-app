import { Component,Input,Output,EventEmitter} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pokemon } from '../../models/pokemon.models';


@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
})

export class PokemonCard  {
  @Input() pokemon!: Pokemon;
  @Input() qualcosa: number = 0

  @Input() isSelected: boolean = false;

  @Output() selected = new EventEmitter<number>();

  onCardClick() {
    this.selected.emit(this.pokemon.id); // karta tıklanınca bu event çalışıyor ve parenta pokemon id gönderiliyor
  }



}
