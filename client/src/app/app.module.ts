import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./modules/app-routing.module";
import { AppComponent } from "./app.component";
import { CommunicationService } from "./services/communication.service";
import { AppMaterialModule } from './modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { CreateMedecinComponent } from "./create-medecin/create-medecin.component";
import { HomeComponent } from "./home/home.component";
import { UpdateMedecinComponent } from "./update-medecin/update-medecin.component";
import { DeleteMedecinComponent } from "./delete-medecin/delete-medecin.component";
import { ListeMedecinsComponent } from "./liste-medecins/liste-medecins.component";
import { MyErrorHandler } from "./common/app-error-handler";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListeMedecinsComponent,
    CreateMedecinComponent,
    UpdateMedecinComponent,
    DeleteMedecinComponent,
    NotFoundComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'medecins', component: ListeMedecinsComponent },
      { path: 'medecins/insert', component: CreateMedecinComponent },
      { path: 'medecins/update/:id', component: UpdateMedecinComponent },
      { path: 'medecins/delete/:id', component: DeleteMedecinComponent },
      { path: '**',component:NotFoundComponent }
    ])
  ],
  providers: [
    CommunicationService,
    {provide:ErrorHandler,useClass:MyErrorHandler}
  ],
  entryComponents: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
