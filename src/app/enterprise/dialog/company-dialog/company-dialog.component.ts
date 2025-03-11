import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Company } from '../../models/api/company.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyApiService } from '../../services/api/company-api.service';
import { Subject, take, takeUntil } from 'rxjs';


export interface CompanyDialogData {
  company?: Company;
  action: CompanyDialogAction;
}

export enum CompanyDialogAction {
  ADD,
  EDIT
}

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss']
})

export class CompanyDialogComponent implements OnInit, OnDestroy{
  public action: CompanyDialogAction;
  public company: Company;
  public formGroup: FormGroup = new FormGroup({});
  public DialogAction = CompanyDialogAction;
  private readonly ngUnsubscribe$ = new Subject<boolean>();
  @Output() public companyChanged: EventEmitter<Company> = new EventEmitter<Company>();
  
  constructor(
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: CompanyDialogData,
    private readonly formBuilder: FormBuilder,
    private readonly apiService: CompanyApiService
  ) {
    this.action = data.action;
    this.company = data.company ?? this.generateNewCompany()
  }

  public ngOnInit(): void {
    console.log(this.company);
    if (!this.company.id) {
      this.generateNewCompany();
    }
    
    this.createFormGroup();
    this.fillForm(this.company);

    document.querySelector('app-root')?.removeAttribute('aria-hidden');
  }
  private generateNewCompany(): Company {
    return {
      id: 0,
      isin: '',
      exchange: '',
      name: '',
      ticker: '',
      website: ''
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next(true);
    this.ngUnsubscribe$.complete();
  }

  private createFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      isin: [null, Validators.required],
      exchange: [null, Validators.required],
      ticker: [null, Validators.required],
      website: [],
    });
  }

  private fillForm(company: Company): void {
    this.formGroup.patchValue(company);
  }

  public onSubmit(form: Company): void {
    if (!this.formGroup.valid) {
      return;
    }

    switch (this.action) {
      case CompanyDialogAction.ADD:
        this.addCompany(form);
        break;
      case CompanyDialogAction.EDIT:
        this.updteCompany(form);
        break;
      default:
        break;
    }
  }

  private addCompany(data: Company): void {
    this.apiService.create(data)
      .pipe(
        take(1),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(() => {
        this.companyChanged.emit(data);
        this.dialogRef.close();
      });
  }
  private updteCompany(data: Company): void {
    console.log("update", data)
    data.id = this.company.id;
    this.apiService.update(data)
      .pipe(
        take(1),
        takeUntil(this.ngUnsubscribe$)
      ).subscribe(() => {
        this.companyChanged.emit(data);
        this.dialogRef.close();
      });
  }

}
