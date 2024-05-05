import { formatDate } from '@angular/common';
import { Patient } from '../patients/allpatients/patient.model';
export class subscription {
    subscriptionID: number;
    subscriptionDuration: number;
    subscriptionDateOfCreation: string;
    subscriptionType: string;
    subscriptionFee: number;
    status: boolean;
    contents: string;
    byadmin: boolean;
    patient: Patient;
    img: string;
    constructor(subscription: subscription) {
        {
        this.subscriptionID = subscription.subscriptionID || this.getRandomID();
        this.subscriptionDuration = subscription.subscriptionDuration || 0;
        this.subscriptionDateOfCreation = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
        this.subscriptionType = subscription.subscriptionType || '';
        this.subscriptionFee = subscription.subscriptionFee || 0;
        this.status = subscription.status || false;
        this.contents = subscription.contents || 'nothing';
        this.byadmin = subscription.byadmin || false;
        this.patient = subscription.patient || '';
        this.img = subscription.img || '';
        }
    }
    public getRandomID(): number {
        const S4 = () => {
        return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    }
}