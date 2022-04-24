import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule  } from '@angular/forms';
import { TodoComponent } from './todo/todo.component';
import { DailyComponent } from './todo/daily/daily.component';
 import { DataService } from './todo/data.service';
 import { HttpClientModule } from '@angular/common/http';
import { TaskComponent } from './todo/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TodoComponent,
    DailyComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,ReactiveFormsModule,HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
