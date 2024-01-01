import { Component, OnInit } from '@angular/core';
import { Medecin } from '../interface/medecin';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-liste-medecins',
  templateUrl: './liste-medecins.component.html',
  styleUrls: ['./liste-medecins.component.css'],
})
export class ListeMedecinsComponent implements OnInit {
   medecins: Medecin[] = [];

  constructor( private CommunicationService: CommunicationService) {
   
   }

  ngOnInit(): void {
    this.CommunicationService.getAllMedecins().subscribe(
      (medecins: any) => {
        this.medecins = medecins;
      },
      (error) => {
        alert("Error fetching doctors:");
      }
    );
  }
  
}
  
