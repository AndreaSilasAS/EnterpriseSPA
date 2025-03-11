import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './enterprise/components/company-list/company-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/enterprise', pathMatch: 'full' },  // Redirigir a companies
  { path: 'enterprise', component: CompanyListComponent }  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
