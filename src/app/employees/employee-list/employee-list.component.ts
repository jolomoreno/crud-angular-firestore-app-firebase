import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../shared/employee.service';
import {Employee} from '../../shared/employee.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  public employees: Employee[];

  constructor(private readonly employeeService: EmployeeService,
              private readonly firestore: AngularFirestore,
              private readonly toastrService: ToastrService) { }

  ngOnInit() {
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

  onEdit(employee: Employee) {
    this.employeeService.formData = Object.assign({}, employee);
  }

  onDelete(employeeId: string) {
    if (confirm('Are you sure to delete this record?')) {
      this.firestore.doc(`employees/${employeeId}`).delete();
      this.toastrService.warning('Employee deleted successfully', 'EMP. Delete');
    }
  }
}
