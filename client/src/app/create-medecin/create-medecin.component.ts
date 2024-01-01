import { Component} from '@angular/core';
import { Medecin } from '../interface/medecin';
import { Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { Service } from '../interface/service';
import { AppError } from '../common/app-error';
import { BadRequestError } from '../common/bad-request-error';

@Component({
  selector: 'app-create-medecin',
  templateUrl: './create-medecin.component.html',
  styleUrls: ['./create-medecin.component.css']
})
export class CreateMedecinComponent {
  
  //private medecinId: number;
  public medecins: Medecin[] = [];
  public medecin: Medecin = {
    prenom: '',
    nom: '',
    specialite: '',
    anneesExperience: 0,
    idService: 0
  }; 
  public specialites: string[] = [];
  public services: Service[] = [];
  public selectedService: Service ;


  constructor(
    private router: Router,
    private medecinService: CommunicationService 
  ) {}

  ngOnInit(): void {
    this.getMedecinsSpecilities();
    this.getServices();
}


  getMedecinsSpecilities(): void {
    this.medecinService.getMedecinsSpecilities().subscribe(
      (specialites: any[]) => {
        this.specialites = specialites.map((specialtyObj: any) => specialtyObj.specialite);
      },
      (error) => {
        alert("Error fetching Medecins specialities:");
      }
    );
  }

  getServices(): void {
    this.medecinService.getServices().subscribe(
      (services: Service[]) => {
        this.services = services;
      },
      (error:AppError) => {
        if(error instanceof BadRequestError) {
          alert("Error fetching services:");
        }
        else throw error;
      }
    );
  }

  

  addMedecin(): void {
    this.medecin.idService = this.selectedService.idService as number;
    this.medecinService.addMedecin(this.medecin).subscribe(
      () => {
        
        this.router.navigate(['/medecins']);
      },
      (error:AppError) => {
        alert("the data sent of the new doctor is invalid or malformed") 
          ;
      }
    );
  }
  

}
