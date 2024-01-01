import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, throwError} from "rxjs";
//import { catchError } from "rxjs/operators";
import { Medecin } from "../interface/medecin";
import { Service } from "../interface/service";
import { NotFoundError } from "../common/not-found-error";
import { BadRequestError } from "../common/bad-request-error";
import { AppError } from "../common/app-error";

@Injectable()
export class CommunicationService {
  private readonly BASE_URL: string = "http://localhost:3000/database";
  private _listeners: Subject<any> = new Subject<any>();

  constructor(private readonly http: HttpClient) {}

  listen(): Observable<any> {
    return this._listeners.asObservable();
  }

  filter(filterBy: string): void {
    this._listeners.next(filterBy);
  }

  // Example methods for making HTTP requests

  getAllMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.BASE_URL}/medecins`)
    .pipe(
      catchError(this.handleError)
    );
  }
  getMedecinById(id: number): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.BASE_URL}/medecins/${id}`)
    .pipe(catchError(this.handleError));
  }

  getMedecinsSpecilities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/medecins/specialites`);
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.BASE_URL}/medecins/services`)
    .pipe(catchError(this.handleError));
  }

  updateMedecin(id: number, data: Medecin): Observable<any> {
    return this.http.put<Medecin>(`${this.BASE_URL}/medecins/update/${id}`, data);
  }

  deleteMedecin(id: number): Observable<Medecin> {
    return this.http.delete<any>(`${this.BASE_URL}/medecins/delete/${id}`)
    .pipe(catchError(this.handleError));
  }

  addMedecin(data: Medecin): Observable<any> {
    return this.http.post<Medecin>(`${this.BASE_URL}/medecins/insert`, data)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse){
    if(error.status === 404)
      return throwError(new NotFoundError());
    if(error.status === 400)
      return throwError(new BadRequestError());
    return throwError(new AppError(error));

}
}
