import { Injectable } from '@angular/core';
import {Employee} from './employee.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  formData: Employee;

  constructor(private readonly firestore: AngularFirestore) { }

  getEmployees() {
    return this.firestore.collection('employees').snapshotChanges();
  }

  addEmployee(employeeData) {
    this.firestore.collection('employees').add(employeeData);
  }

  editEmployee(employeeId, employeeData) {
    this.firestore.doc(`employees/${employeeId}`).update(employeeData);
  }

  deleteEmployee(employeeId) {
    this.firestore.doc(`employees/${employeeId}`).delete();
  }
}
