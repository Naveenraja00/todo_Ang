import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css']
})
export class DailyComponent implements OnInit {
  days: any[] = [];
  pending! : number;
    @Input() get day(): any[] {
        return this.days;
    }
    
    set day(value: any[]) {
        if (value) {
            this.days = value;
            this.calculatePending();
            
        }
    }
    calculatePending(){
      this.pending = 0;
      this.days.forEach((day)=>{
        if(day.pending > 0){
          this.pending += day.pending;
        }
      });
    }
  constructor() { }

  ngOnInit(): void {
    
  }

}
