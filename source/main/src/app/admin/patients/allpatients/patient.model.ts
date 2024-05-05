

/*export enum Gender {
  Male = "Male",
  Female = "Female"
}

export enum Allergie {
  PEANUTS = "PEANUTS",
  GLUTEN = "GLUTEN",
  DAIRY = "DAIRY",
  EGGS = "EGGS",
  SOY = "SOY",
  SHELLFISH = "SHELLFISH",
  FISH = "FISH",
  TREE_NUTS = "TREE_NUTS",
  WHEAT = "WHEAT",
  LACTOSE = "LACTOSE",
  SULFITES = "SULFITES",
  OTHER = "OTHER"
}

export class Patient {
  idPatient: number;
  name: string;
  patientPassword: string;
  date: Date;
  address: string;
  bgroupe: string;
  gender: Gender;
  mobile: string;
  patientContactEmergencies: string;
  medicalHistory: string;
  patientAlergies: Allergie | null;
  treatment: string;
  image: string;
  funeral: Funeral | null;
  payments: Payment[];
  prescriptions: Prescription[];
  dietPlans: DietPlan[];
  feedBacks: FeedBack[];
  complaints: Complaint[];
  ambulanceDispatch: AmbulanceDispatch | null;
  subscription: Subscription | null;
  rendezVousList: RendezVous[];
  tasks: Task[];
  messages: Message[];
  notifications: Notification[];
  equipments: Equipment[];
  events: Event[];
  services: Service[];
  vitalSignList: VitalSign[];

  constructor(patient: Partial<Patient>) {
    this.idPatient = patient.idPatient || this.getRandomID();
    this.image = patient.image || 'assets/images/user/user1.jpg';
    this.name = patient.name || '';
    this.gender = patient.gender || Gender.Male; // Default to Male if not provided
    this.date = patient.date || new Date();
    this.address = patient.address || '';
    this.mobile = patient.mobile || '';
    this.patientContactEmergencies = patient.patientContactEmergencies || '';
    this.medicalHistory = patient.medicalHistory || '';
    this.patientAlergies = patient.patientAlergies || null;
    this.treatment = patient.treatment || '';
    this.patientPassword = patient.patientPassword || '';
    this.funeral = patient.funeral || null;
    this.payments = patient.payments || [];
    this.prescriptions = patient.prescriptions || [];
    this.dietPlans = patient.dietPlans || [];
    this.feedBacks = patient.feedBacks || [];
    this.complaints = patient.complaints || [];
    this.ambulanceDispatch = patient.ambulanceDispatch || null;
    this.subscription = patient.subscription || null;
    this.rendezVousList = patient.rendezVousList || [];
    this.tasks = patient.tasks || [];
    this.messages = patient.messages || [];
    this.notifications = patient.notifications || [];
    this.equipments = patient.equipments || [];
    this.events = patient.events || [];
    this.services = patient.services || [];
    this.vitalSignList = patient.vitalSignList || [];
  }

  private getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}*/
export enum Gender {
  Male = "Male",
  Female = "Female"
}

export enum Allergie {
  PEANUTS = "PEANUTS",
  GLUTEN = "GLUTEN",
  DAIRY = "DAIRY",
  EGGS = "EGGS",
  SOY = "SOY",
  SHELLFISH = "SHELLFISH",
  FISH = "FISH",
  TREE_NUTS = "TREE_NUTS",
  WHEAT = "WHEAT",
  LACTOSE = "LACTOSE",
  SULFITES = "SULFITES",
  OTHER = "OTHER"
}

export class Patient {
  constructor(
    public idPatient: number,
    public name: string,
    public patientPassword: string,
    public date: Date,
    public address: string,
    public bgroupe: string,
    public gender: Gender,
    public mobile: string,
    public patientContactEmergencies: string,
    public medicalHistory: string,
    public patientAlergies: Allergie,
    public treatment: string,
    public email: string ,
    public image: string,
    public password: string = '',

  ) {}
}