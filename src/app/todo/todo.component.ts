import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit{
  Task!: string | null;
  store!: string;

  ngOnInit(): void {
     this.Task = localStorage?.getItem("Task") != null ? localStorage?.getItem("Task") : '';
     if(this.Task !=''&&this.Task!=null){
        //this.tasks = JSON.parse(this.Task);
        this.tasks = this.Task.split(',');
     }
  }
  tasks: string[] = [];
  addTask(newTask: string): void {
    const trimmedTask = newTask.trim();
    if (trimmedTask !== '') {
      this.tasks.push(trimmedTask);
      //localStorage.setItem("Task", JSON.stringify(this.tasks));
      localStorage.setItem("Task", this.tasks.toString());
    }
  }
  deleteTask(index:number):void{
    this.tasks.splice(index,1);
    localStorage.setItem("Task", this.tasks.toString());
  }
  editTask(index:number) :void{
    
  }
}