import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../../models/api/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService {

  private readonly _enterpriseUrl = environment.webApiDomain + '/enterprise';
  private readonly _apiKey = environment.apiKey;

  constructor(private readonly _httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': `${this._apiKey}`
    })
  }

  public getAllCompanies(): Observable<Company[]> {
    return this._httpClient.get<Company[]>(this._enterpriseUrl, {headers: this.getHeaders()});
  }
  public getComanyById(id: string): Observable<Company> {
    return this._httpClient.get<Company>(`${this._enterpriseUrl}/${id}`, {headers: this.getHeaders()});
  }
  public getComanyByIsin(isin: string): Observable<Company> {
    return this._httpClient.get<Company>(`${this._enterpriseUrl}/${isin}`, {headers: this.getHeaders()});
  }

  public update(request: Company): Observable<object> {
    return this._httpClient.post(this._enterpriseUrl + '/update', request, {headers: this.getHeaders()});
  }

  public create(request: Company): Observable<object> {
    return this._httpClient.post(this._enterpriseUrl + '/create', request, {headers: this.getHeaders()});
  }
}
