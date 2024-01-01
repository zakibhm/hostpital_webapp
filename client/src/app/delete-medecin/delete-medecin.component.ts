import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';

@Component({
  selector: 'app-delete-medecin',
  templateUrl: './delete-medecin.component.html',
  styleUrls: ['./delete-medecin.component.css']
})
export class DeleteMedecinComponent implements OnInit {
  isDeleted: boolean = false;
  public medecinId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private communicationService: CommunicationService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.medecinId = params['id']; // Fetch the 'id' parameter from the route
    });
  }
  deleteMedecin(): void {
    if(this.medecinId) {
      this.communicationService.deleteMedecin(this.medecinId).subscribe(
        () => {
          this.isDeleted = true;
          setTimeout(() => {
            this.router.navigate(['/medecins']);
          }, 1500);
        },
        (error : AppError) => {
          if(error instanceof NotFoundError) {
            alert("This doctor has already been deleted.");
          }
          else throw error;
        } 
      );
    }
  }

}
