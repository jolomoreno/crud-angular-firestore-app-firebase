import { Component, OnInit } from '@angular/core';
import {Employee} from '../shared/employee.model';
import {EmployeeService} from '../shared/employee.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  public employees: Employee[];
  public titlePage = 'EMP. Create';

  constructor(private readonly employeeService: EmployeeService,
              private readonly firestore: AngularFirestore,
              private readonly toastrService: ToastrService) { }

  ngOnInit() {
    this.resetForm();
    this.employeeService.getEmployees().subscribe(
      response => {
        this.employees = response.map(employeesFirestoreData => {
          return {
            id: employeesFirestoreData.payload.doc.id,
            ...employeesFirestoreData.payload.doc.data() as Employee
          };
        });
      }
    );
  }

  resetForm(form?: NgForm) {
    this.titlePage = 'EMP. Create';
    if (form != null) {
      form.resetForm();
    }
    this.employeeService.formData = {
      id: null,
      fullName: '',
      position: '',
      empCode: '',
      mobile: ''
    };
  }

  onSubmit(form: NgForm) {
    this.titlePage = 'EMP. Create';
    const title = (form.value.id == null) ? 'EMP. Create' : 'EMP. Edit';
    const message = (form.value.id == null) ? 'Employee created successfully' : 'Employee edited successfully';
    const data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id === null) {
      this.firestore.collection('employees').add(data);
    } else {
      this.firestore.doc(`employees/${form.value.id}`).update(data);
    }
    this.resetForm(form);
    this.toastrService.success(message, title);
  }

  onEdit(employee: Employee) {
    this.titlePage = 'EMP. Edit';
    this.employeeService.formData = Object.assign({}, employee);
  }

  onDelete(employeeId: string) {
    if (confirm('Are you sure to delete this record?')) {
      this.titlePage = 'EMP. Create';
      this.firestore.doc(`employees/${employeeId}`).delete();
      this.toastrService.warning('Employee deleted successfully', 'EMP. Delete');
    }
  }
}
