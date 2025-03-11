import { Component, OnInit, ViewChild } from '@angular/core';
import { Company } from '../../models/api/company.model';
import { MatDialog } from '@angular/material/dialog';
import { CompanyDialogAction, CompanyDialogComponent, CompanyDialogData } from '../../dialog/company-dialog/company-dialog.component';
import { CompanyApiService } from '../../services/api/company-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  public companies: Company[] = [];
  public displayedColumns: string[] = ['name', 'exchange', 'ticker', 'isin', 'website', 'edit'];
  public dataSource = new MatTableDataSource<Company>();
  @ViewChild(MatPaginator) public paginator!: MatPaginator;

  constructor(private companyService: CompanyApiService, private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.loadCompanies();
  }
  
  public loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(data => {
      this.dataSource.data = data; 
    });
  }

  public openCompanyDialog(companyData: CompanyDialogData): void {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '950px',
      data: companyData
    });

    dialogRef.afterClosed().subscribe(() => this.loadCompanies());
  }

  public updateCompany(company: Company): void {
    this.companyService.update(company).subscribe(() => this.loadCompanies());
  }

  public openDialogNewCompany(): void {
    this.openCompanyDialog({
      action: CompanyDialogAction.ADD,
    });
  }

  public openDialogEditCompany(company: Company): void {
    this.openCompanyDialog({
      action: CompanyDialogAction.EDIT,
      company: company
    });
  }
}
