import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit{
  Task!: string | null;
 editingIndex: number | null = null; 

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
      if (this.editingIndex !== null) {
        this.tasks[this.editingIndex] = trimmedTask;
        this.editingIndex = null; 
      } else {
        this.tasks.push(trimmedTask);
      }
      localStorage.setItem("Task", this.tasks.toString());
       const taskInput = document.getElementById('taskInput') as HTMLInputElement;
      taskInput.value = ''; // clear the input field
    }
  }
  deleteTask(index:number):void{
    this.tasks.splice(index,1);
    localStorage.setItem("Task", this.tasks.toString());
  }
 editTask(index:number): void {
    this.editingIndex = index; 
    const taskToEdit = this.tasks[index];
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    taskInput.focus()
    console.log(taskInput.value);
    taskInput.value = taskToEdit;
  }
}
