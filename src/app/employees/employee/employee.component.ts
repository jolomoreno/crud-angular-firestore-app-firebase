import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../shared/employee.service';
import {NgForm} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastrService} from 'ngx-toastr';
import {log} from 'util';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private readonly employeeService: EmployeeService,
              private readonly firestore: AngularFirestore,
              private readonly toastrService: ToastrService) { }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
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
    const data = form.value;
    this.firestore.collection('employees').add(data);
    this.resetForm(form);
    this.toastrService.success('Submitted successfully', 'EMP. Register');
  }
}
