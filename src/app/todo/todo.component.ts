import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { todoDetails } from './_models/todoDetails.model';
import { TodoserviceService } from '../core/todoservice.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit{
  Task!: string | null;
  editingIndex: number | null = null; 
  getTodo: Array<any> = [];
  task:any;


  constructor(private todoservice: TodoserviceService,private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
     this.Task = localStorage?.getItem("Task") != null ? localStorage?.getItem("Task") : '';
     if(this.Task !=''&&this.Task!=null){
        //this.tauniqueId: string, updatedTaskValue: string, status?: string, status: stringtasks = this.Task.split(',');
     }
     this.GetTodoDetails();
    //  this.addTaskDetails(this.task);
  }
  tasks: string[] = [];
  submitTask(taskValue : string) :void{
    const trimmedTask = taskValue.trim();
    if (trimmedTask !== '') {
    if (this.editingIndex !== null) {
      this.updateTask(this.getTodo[this.editingIndex].uniqueId, trimmedTask,this.getTodo[this.editingIndex].status);
      this.editingIndex = null; 
    } else {
      // If editingIndex is null, it means we're adding a new task
      this.addTaskDetails(taskValue);
    }
  }
}
  addTask(newTask: string): void {
    const trimmedTask = newTask.trim();
    if (trimmedTask !== '') {
      if (this.editingIndex !== null) {
        this.getTodo[this.editingIndex].task= trimmedTask;
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
    this.getTodo.splice(index,1)
    // this.tasks.splice(index,1);
    localStorage.setItem("Task", this.tasks.toString());
  }
 editTask(tasks:any): void {
    this.editingIndex = this.getTodo.indexOf(tasks);
    if (tasks) {
      const taskToEdit = tasks.task;
      const taskInput = document.getElementById('taskInput') as HTMLInputElement | null;
      if (taskInput) {
        taskInput.focus();
        taskInput.value = taskToEdit;
        //console.log(taskInput.value);
      } else {
        console.error('taskInput element not found.');
      }
    } else {
      console.error('tasks object is null or undefined.');
    }
  }
  // api call getTodo details
  GetTodoDetails(): void {
    setTimeout(() => { 
    this.todoservice.todoDataFetch().subscribe((data: any) => {
      this.getTodo = data;
      console.log(this.getTodo);
    });
  }, 500);
   }
   // api call to add the data
   addTaskDetails(task:any):void{
    setTimeout(() => { 
    this.todoservice.todoCreateFetch(task).subscribe((data: any) => {
      this.getTodo.push(data);
      console.log(this.getTodo);
      const taskInput = document.getElementById('taskInput') as HTMLInputElement;
      taskInput.value = '';
    });
    const taskInput = document.getElementById('taskInput') as HTMLInputElement;
    taskInput.value = '';
  }, 500);

  }
  // api call to update the data
  updateTask(uniqueId: string, updatedTaskValue: string,updatedStatusvalue : string): void {
    setTimeout(() => { 
      this.todoservice.todoUpdateFetch(uniqueId, updatedTaskValue, updatedStatusvalue).subscribe({
        next: (updatedTodo: any) => {
          const index = this.getTodo.findIndex(todo => todo.uniqueId === uniqueId);
          if (index !== -1) {
            this.getTodo[index] = updatedTodo;
          }
          console.log('Todo updated successfully:', updatedTodo);
          const taskInput = document.getElementById('taskInput') as HTMLInputElement;
          taskInput.value = '';
        },
      
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    }, 500);
    } 
    // api call for delete
  deleteTaskDetails(uniqueId: string): void {
    setTimeout(() => { 
      this.todoservice.todoDeleteFetch(uniqueId).subscribe(() => {
        this.getTodo = this.getTodo.filter(todo => todo.uniqueId !== uniqueId);
      });
    }, 500);
  }
  getBackgroundColor(status: string): string {
    return status === 'completed' ? 'lightgreen' : 'transparent'; // Set background color based on status
  }
  
  toggleTaskStatus(task: todoDetails): void {
    const newStatus = task.status === 'completed' ? 'in progress' : 'completed';
    this.updateTask(task.uniqueId, task.task, newStatus); // Pass the new status
  }
  
}