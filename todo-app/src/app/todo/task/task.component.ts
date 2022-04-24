import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-root',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks : any;
  constructor(private dataService: DataService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    let date = new Date(this.route.snapshot.paramMap.get('date')!);
    this.dataService.gettask(date).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

}
