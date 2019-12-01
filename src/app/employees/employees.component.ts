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
  public titlePage = 'Create';

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
    this.titlePage = 'Create';
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
    this.titlePage = 'Create';
    const title = (form.value.id == null) ? 'Create' : 'Edit';
    const message = (form.value.id == null) ? 'Employee created successfully' : 'Employee edited successfully';
    const data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id === null) {
      this.employeeService.addEmployee(data);
    } else {
      this.employeeService.editEmployee(form.value.id, data);
    }
    this.resetForm(form);
    this.toastrService.success(message, title);
  }

  onEdit(employee: Employee) {
    this.titlePage = 'Edit';
    this.employeeService.formData = Object.assign({}, employee);
  }

  onDelete(employeeId: string) {
    if (confirm('Are you sure to delete this record?')) {
      this.titlePage = 'Create';
      this.employeeService.deleteEmployee(employeeId);
      this.toastrService.warning('Employee deleted successfully', 'EMP. Delete');
    }
  }
}
