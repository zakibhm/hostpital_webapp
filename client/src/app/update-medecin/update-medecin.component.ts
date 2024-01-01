import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { Medecin } from '../interface/medecin';
import { Service } from '../interface/service';
import { AppError } from '../common/app-error';
import { BadRequestError } from '../common/bad-request-error';
import { NotFoundError } from '../common/not-found-error';

@Component({
  selector: 'app-update-medecin',
  templateUrl: './update-medecin.component.html',
  styleUrls: ['./update-medecin.component.css']
})
export class UpdateMedecinComponent {
  public medecinId: number;
  public medecin: Medecin = {
    idMedecin: 0,
    prenom: '',
    nom: '',
    specialite: '',
    anneesExperience: 0,
    idService: 0
  }; // Initialize an empty Medecin object
  public specialites: string[] = [];
  public services: Service[] = [];
  public selectedService: Service ;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private medecinService: CommunicationService // Inject your service here
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.medecinId = params['id'];
      this.getMedecinById(this.medecinId);
    });
    this.getMedecinsSpecilities();
    this.getServices();
  }
  getMedecinById(id: number): void {
    this.medecinService.getMedecinById(id).subscribe(
      (medecin: Medecin) => {
        this.medecin = medecin ; // Set the received doctor 
      }
    );
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
        this.services = services
      },
      (error) => {
        alert("Error fetching Services:");
      }
    );
  }

  updateMedecin(): void {
    this.medecin.idService = this.selectedService.idService as number;
    this.medecinService.updateMedecin(this.medecinId,this.medecin).subscribe(() => {
      this.router.navigate(['/medecins']); // Redirect to the medecins list after update
    },
    (error:AppError) => {
      if(error instanceof BadRequestError) {
        alert("the new data of this doctor is invalid or malformed");
      }
      else if (error instanceof NotFoundError) {
        alert("This doctor has already been deleted When you were trying to modify him.");
      }
      else throw error;
    });
  }


}
