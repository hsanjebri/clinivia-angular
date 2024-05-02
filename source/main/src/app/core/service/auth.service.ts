import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, toArray } from 'rxjs';
import { User } from '../models/user';
import { Role } from '@core/models/role';
import { Doctors } from 'app/admin/doctors/alldoctors/doctors.model';
import { DoctorsService } from 'app/admin/doctors/doctors.service';
import { number } from 'echarts';
import { AlldoctorsComponent } from 'app/admin/doctors/alldoctors/alldoctors.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl :string = "http://localhost:8085/Examen/api/UserController/getAllUsers"
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public doctors1: Doctors[] = [];
  public listusers: User[]=[];
  public alld? : AlldoctorsComponent;
  private users: User[] = //this.listusers;
  [
    {
      id: 1,
      img: 'assets/images/user/admin.jpg',
      username: 'admin@hospital.org',
      password: 'admin@123',
      firstName: 'Sarah',
      lastName: 'Smith',
      role: Role.Admin,
      token: 'admin-token',
    },
    {
      id: 2,
      img: 'assets/images/user/doctor.jpg',
      username: 'doctor@hospital.org',
      password: 'doctor@123',
      firstName: 'Ashton',
      lastName: 'Cox',
      role: Role.Doctor,
      token: 'doctor-token',
    },
    {
      id: 3,
      img: 'assets/images/user/patient.jpg',
      username: 'patient@hospital.org',
      password: 'patient@123',
      firstName: 'Cara',
      lastName: 'Stevens',
      role: Role.Patient,
      token: 'patient-token',
    },
  ];

  constructor(private http: HttpClient, private ds : DoctorsService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }


  public listusers1 =this.ds.getUs().subscribe({
    next:(data)=>this.doctors1=data,
    error:(error)=> console.log(error),
    complete:()=>console.log('done')
  }
  )


  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  docToUser(doc: Doctors): User {
    const newuser: User = {
      firstName: doc.name,
      lastName: doc.name,
      id: doc.id,
      img: 'assets/images/user/admin.jpg',
      password: doc.password,
      username: doc.email,
      token: "doctor-token",
      role: Role.Doctor
    };
    if(doc.role == "Admin"){
      newuser.token = "admin-token",
      newuser.role = Role.Admin
    }
    if(doc.role == "Patient"){
      newuser.token = "patient-token",
      newuser.role = Role.Patient
    }
    return newuser;
  }

  getallusers(){
    
    for(let i = 0; i < this.doctors1.length; i++){
      this.listusers[i] = this.docToUser(this.doctors1[i])
    }
    console.log(this.listusers)
    
    return this.listusers;
  }


  login(username: string, password: string) {

    this.getallusers();
    //console.log(this.doctors1)
    const user = this.listusers.find((u) => u.username === username && u.password === password);
    this.alld?.dataSource.connect();
    if (!user) {
      return this.error('Username or password is incorrect');
    } else {
      console.log(this.alld?.dataSource.renderedData)
      //console.log(this.http.get<Doctors>(this.baseUrl))
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return this.ok({
        id: user.id,
        img: user.img,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
      });
    }
  }
  ok(body?: {
    id: number;
    img: string;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
  }) {
    return of(new HttpResponse({ status: 200, body }));
  }
  error(message: string) {
    return throwError(message);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }


  ngOnInit(){
   // this.listProduct=this.ps.listProduct
    this.ds.getUs().subscribe({
      next:(data)=>this.doctors1=data,
      error:(error)=> console.log(error),
      complete:()=>console.log('done')
    }
    )
    
  }
  
}





