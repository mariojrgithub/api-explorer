import { Component, OnInit } from '@angular/core';
import { ApiEntry } from 'src/app/models/apientry';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-api-home',
  templateUrl: './api-home.component.html',
  styleUrls: ['./api-home.component.css'],
})
export class ApiHomeComponent implements OnInit {
  apiArray?: ApiEntry[][];

  tempArray?: ApiEntry[];

  categories?: any[];

  page?: number = 0;

  numOfPages?: number = 0;

  hidden?: string = 'hidden';

  hideMenu?: string = 'hidden'

  disabled?: string = '';

  numResults?: number = 0;

  constructor(private apiServ: ApiService) {}

  ngOnInit(): void {}

  public fetchAllApis(): void {
    this.hidden = '';
    document.getElementsByTagName('input')[0].value = '';

    if(this.categories?.length !== 0){
      this.hideMenu = "";
    }

    this.apiServ.getApis().subscribe({
      next: (response) => {
        this.tempArray = response['entries'];

        const cats = new Set();
        this.tempArray?.forEach((item, i) => {
          cats.add(item?.Category);
        })

        this.categories = Array.from(cats);

        this.paginate(this.tempArray!, 10);
        this.numOfPages = this.apiArray?.length;

        if (this.apiArray?.length !== 0) {
          this.disabled = 'disabled';
        }
        
        this.numResults = this.tempArray?.length;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public paginate(array: any[], pageNum: number): void {
    let start = 0;
    let end = Math.floor(array.length / pageNum);
    let pages: ApiEntry[][] = [];
    let temp: ApiEntry[] = [];

    while (start < array.length) {
      for (start; start < end; start++) {
        if (array[start] !== undefined) {
          temp.push(array[start]);
        }
      }
      pages.push(temp);
      temp = [];
      end = end + Math.floor(array.length / pageNum);
    }

    this.apiArray = pages;
    this.hidden = 'hidden';
  }

  public setPage(num: number): void {
    this.page = num;
    console.log(this.page)
  }

  public nextPage(): void {
    if (this.page! < this.apiArray!.length - 1) {
      this.page = this.page! + 1;
    }
  }

  public lastPage(): void {
    if (this.page! > 0) {
      this.page = this.page! - 1;
    }
  }

  public searchApis(term: string): void {
    const results: ApiEntry[] = [];
    
    this.tempArray?.forEach((item, i) => {
      if (item.API.toLowerCase().includes(term.toLowerCase())) {
        results.push(item);
      }
    });
    console.log(results)
    this.page = 0;
    this.numResults = results?.length;

    if (results.length > 100 && results.length !== 0) {
      this.paginate(results, 4);
    } else if (results.length !== 0) {
      this.paginate(results, 1);
    }

    if (results.length === 0) {
      alert('There are no results for ' + term);
      document.getElementsByTagName('input')[0].value = '';
      this.disabled = "";
    }
    
    if (!term) {
      this.apiArray = [];
      this.numOfPages = 0;
      this.numResults = 0;
      this.fetchAllApis();
    }

  }

  public goToCategory(term: string): void {
    const results: ApiEntry[] = [];
    
    this.tempArray?.forEach((item, i) => {
      if (item.Category.toLowerCase().includes(term.toLowerCase())) {
        results.push(item);
      }
    });
    console.log(results)
    document.getElementsByTagName('input')[0].value = '';
    this.page = 0;
    this.disabled = "";

    if (results.length > 100 && results.length !== 0) {
      this.paginate(results, 4);
    } else if (results.length !== 0) {
      this.paginate(results, 1);
    }

    this.numResults = results?.length;
  }

}
