import { formatDate } from '@angular/common';
export class Task {
  idTask: string;
  img: string;
  title: string;
  done: boolean;
  note: string;
  priority: string;
  due_date: string;
  idPatient: number;

  constructor(appointment: Task) {
    {
      this.idTask = appointment.idTask ;
      this.img = appointment.img || 'assets/images/user/user1.jpg';
      this.title = appointment.title || '';
      this.done = appointment.done || true;
      this.due_date = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.note = appointment.note || '';
      this.priority = appointment.priority || '';
      this.idPatient = appointment.idPatient ;

    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
