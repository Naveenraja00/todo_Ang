import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  day!: any[];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getdays()
            .subscribe((dlist: any[]) => this.day = dlist);
  }

}
