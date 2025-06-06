import { reactive } from 'vue';

// Load saved schedules from localStorage or use default if none exists
const loadSavedSchedules = () => {
  const savedSchedules = localStorage.getItem('doctorSchedules');
  return savedSchedules ? JSON.parse(savedSchedules) : null;
};

// Initialize doctors data
const initializeDoctorList = () => {
  const savedSchedules = loadSavedSchedules();
  
  const defaultDoctors = [
    {
      id: 1,
      name: "Dr. Kamel Ouertani",
      email: "kamel.ouertani@example.com",
      password: "passwordKamel",
      phone: "+216 23 654 321",
      description: "Studied at University of Tunis and completed residency at Charles Nicolle Hospital",
      image: "https://thumbs.dreamstime.com/b/young-male-doctor-close-up-happy-looking-camera-56751540.jpg",
      specialty: "Endocrinologist",
      location: "Tunis",
      rating: 3.9,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "15:00 - 17:00"],
        Wednesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Thursday: ["10:00 - 12:00", "14:30 - 16:30"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 2,
      name: "Dr. Leila Masmoudi",
      email: "leila.masmoudi@example.com",
      password: "passwordLeila",
      phone: "+216 23 654 321",
      description: "Studied at University of Sfax and completed residency at Habib Bourguiba University Hospital",
      image: "https://t3.ftcdn.net/jpg/05/04/25/70/360_F_504257032_jBtwqNdvdMN9Xm6aDT0hcvtxDXPZErrn.jpg",
      specialty: "Ophthalmologist",
      location: "Bizerte",
      rating: 4.0,
      schedule: {
        Monday: ["08:00 - 10:00", "14:00 - 16:00"],
        Tuesday: ["09:00 - 11:00", "15:00 - 17:00"],
        Wednesday: ["08:30 - 10:30", "13:30 - 15:30"],
        Thursday: ["09:00 - 11:00", "14:30 - 16:30"],
        Friday: ["08:00 - 10:00", "12:00 - 14:00"],
        Saturday: ["09:00 - 11:00"],
        Sunday: []
      }
    },
    {
      id: 3,
      name: "Dr. John Doe",
      email: "john.doe@example.com",
      password: "passwordJohn",
      phone: "+216 23 654 321",
      description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
      image: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=640:*",
      specialty: "Cardiologist",
      location: "Monastir",
      rating: 4.5,
      schedule: {
        Monday: ["10:00 - 12:00", "14:00 - 16:00"],
        Tuesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Wednesday: ["10:00 - 12:00", "14:30 - 16:30"],
        Thursday: ["08:30 - 10:30", "12:30 - 14:30"],
        Friday: ["09:00 - 11:00", "15:00 - 17:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 4,
      name: "Dr. Sarah Smith",
      email: "sarah.smith@example.com",
      password: "passwordSarah",
      phone: "+216 23 654 321",
      description: "Studied at University of Sfax and completed residency at Sfax University Hospital",
      image: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
      specialty: "Neurologist",
      location: "Nabeul",
      rating: 4.7,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "15:00 - 17:00"],
        Wednesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Thursday: ["10:00 - 12:00", "14:30 - 16:30"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 5,
      name: "Dr. Ahmed Khaled",
      email: "ahmed.khaled@example.com",
      password: "passwordAhmed",
      phone: "+216 23 654 321",
      description: "Studied at University of Tunis El Manar and completed residency at Rabta Hospital",
      image: "https://media.istockphoto.com/id/1346124900/photo/confident-successful-mature-doctor-at-hospital.jpg?s=612x612&w=0&k=20&c=S93n5iTDVG3_kJ9euNNUKVl9pgXTOdVQcI_oDGG-QlE=",
      specialty: "Cardiologist",
      location: "Tunis",
      rating: 4.2,
      schedule: {
        Monday: ["08:00 - 10:00", "13:00 - 15:00"],
        Tuesday: ["09:30 - 11:30", "14:30 - 16:30"],
        Wednesday: ["08:30 - 10:30", "13:30 - 15:30"],
        Thursday: ["09:00 - 11:00", "15:00 - 17:00"],
        Friday: ["08:00 - 10:00", "14:00 - 16:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 6,
      name: "Dr. Zied Ladhari",
      email: "zied.ladhari@example.com",
      password: "passwordZied",
      phone: "+216 23 654 321",
      description: "Studied at University of Sousse and completed residency at Sahloul University Hospital",
      image: "https://nmc.ae/_next/image?url=https%3A%2F%2Fstatic-cdn.nmc.ae%2Fstrapi%2FDr_Amro_90f95a38db.png&w=3840&q=75",
      specialty: "Pediatrician",
      location: "Sousse",
      rating: 4.3,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["08:00 - 10:00", "13:00 - 15:00"],
        Wednesday: ["09:30 - 11:30", "14:00 - 16:00"],
        Thursday: ["10:00 - 12:00", "14:00 - 16:00"],
        Friday: ["09:00 - 11:00", "15:00 - 17:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 7,
      name: "Dr. Amina Khelifa",
      email: "amina.khelifa@example.com",
      password: "passwordAmina",
      phone: "+216 23 654 321",
      description: "Studied at University of Sousse and completed residency at Sahloul University Hospital",
      image: "https://media.istockphoto.com/id/1372002650/photo/cropped-portrait-of-an-attractive-young-female-doctor-standing-with-her-arms-folded-in-the.jpg?s=612x612&w=0&k=20&c=o1QtStNsowOU0HSof6xQ_jZMglU8ZK565gHd655U6S4=",
      specialty: "Dermatologist",
      location: "Sousse",
      rating: 4.9,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "15:00 - 17:00"],
        Wednesday: ["09:30 - 11:30", "13:00 - 15:00"],
        Thursday: ["10:00 - 12:00", "14:30 - 16:30"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 8,
      name: "Dr. Sami Ben Ali",
      email: "sami.benali@example.com",
      password: "passwordSami",
      phone: "+216 23 654 321",
      description: "Studied at University of Tunis and completed residency at Rabta Hospital",
      image: "https://previews.123rf.com/images/dolgachov/dolgachov1307/dolgachov130700228/20605818-bright-picture-of-male-doctor-with-stethoscope.jpg",
      specialty: "Cardiologist",
      location: "Tunis",
      rating: 3.9,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "15:00 - 17:00"],
        Wednesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Thursday: ["10:00 - 12:00", "14:00 - 16:00"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 9,
      name: "Dr. Tarek Ayari",
      email: "tarek.ayari@example.com",
      password: "passwordTarek",
      phone: "+216 23 654 321",
      description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
      image: "https://st4.depositphotos.com/1017986/21088/i/450/depositphotos_210888716-stock-photo-happy-doctor-with-clipboard-at.jpg",
      specialty: "Psychiatrist",
      location: "Monastir",
      rating: 4.5,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "15:00 - 17:00"],
        Wednesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Thursday: ["10:00 - 12:00", "14:30 - 16:30"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 10,
      name: "Dr. Manel Ben Ahmed",
      email: "manel.benahmed@example.com",
      password: "passwordManel",
      phone: "+216 23 654 321",
      description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
      image: "https://plus.unsplash.com/premium_photo-1664475450083-5c9eef17a191?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fDB8fHww",
      specialty: "Dermatologist",
      location: "Kairouan",
      rating: 3.7,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "14:00 - 16:00"],
        Wednesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Thursday: ["10:00 - 12:00", "14:00 - 16:00"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 11,
      name: "Dr. Sarah Aloui",
      email: "sarah.aloui@example.com",
      password: "passwordSarahAloui",
      phone: "+216 23 654 321",
      description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
      image: "https://i.pinimg.com/736x/b9/97/a5/b997a530822d0f2c03259070d4590d45.jpg",
      specialty: "Gastroenterologist",
      location: "Nabeul",
      rating: 4.2,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "15:00 - 17:00"],
        Wednesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Thursday: ["10:00 - 12:00", "14:00 - 16:00"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 12,
      name: "Dr. Khaled Cherif",
      email: "khaled.cherif@example.com",
      password: "passwordKhaled",
      phone: "+216 23 654 321",
      description: "Studied at University of Sfax and completed residency at Sfax University Hospital",
      image: "https://cdn.prod.website-files.com/62d4f06f9c1357a606c3b7ef/65ddf3cdf19abaf5688af2f8_shutterstock_1933145801%20(1).jpg",
      specialty: "Neurologist",
      location: "Bizerte",
      rating: 4.7,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "14:00 - 16:00"],
        Wednesday: ["09:30 - 11:30", "13:00 - 15:00"],
        Thursday: ["10:00 - 12:00", "14:30 - 16:30"],
        Friday: ["09:00 - 11:00", "13:30 - 15:30"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    },
    {
      id: 13,
      name: "Dr. Yassir Zribi",
      email: "yassir.zribi@example.com",
      password: "passwordYassir",
      phone: "+216 23 654 321",
      description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
      image: "https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg",
      specialty: "Pediatrician",
      location: "Monastir",
      rating: 4.8,
      schedule: {
        Monday: ["09:00 - 11:00", "14:00 - 16:00"],
        Tuesday: ["10:00 - 12:00", "15:00 - 17:00"],
        Wednesday: ["09:30 - 11:30", "13:30 - 15:30"],
        Thursday: ["10:00 - 12:00", "14:30 - 16:30"],
        Friday: ["09:00 - 11:00", "13:00 - 15:00"],
        Saturday: ["10:00 - 12:00"],
        Sunday: []
      }
    }
  ];

  // If there are saved schedules, update the default doctors' schedules
  if (savedSchedules) {
    defaultDoctors.forEach(doctor => {
      if (savedSchedules[doctor.id]) {
        doctor.schedule = savedSchedules[doctor.id];
      }
    });
  }

  return defaultDoctors;
};

// Create the reactive doctorlist object
export const doctorlist = reactive({
  currentWeek: new Date().toISOString().split("T")[0],
  doctors: initializeDoctorList(),
  
  // Add method to save schedule changes
  saveScheduleChanges(doctorId, newSchedule) {
    // Find the doctor and update their schedule
    const doctor = this.doctors.find(d => d.id === doctorId);
    if (doctor) {
      doctor.schedule = newSchedule;
      
      // Save all schedules to localStorage
      const savedSchedules = loadSavedSchedules() || {};
      savedSchedules[doctorId] = newSchedule;
      localStorage.setItem('doctorSchedules', JSON.stringify(savedSchedules));
    }
  },
  categories: {
    Speciality: [
      "Dermatologist",
      "Cardiologist",
      "Endocrinologist",
      "Gastroenterologist",
      "Hematologist",
      "Neurologist",
      "Pediatrician",
      "Obstetrician",
      "Psychiatrist",
      "Ophthalmologist",
      "Otolaryngologist"
    ],
    Location: [
      "Tunis", "Bizerte", "Zaghouan", "Nabeul", "Sousse", "Kairouan", "Monastir", "Mahdia",
      "Jendouba", "Beja", "Siliana", "Kef", "Kasserine", "Sidi Bouzid", "Sfax", "Gafsa",
      "Gabes", "Tozeur", "Kebili", "Medenine", "Tataouine"
    ]
  }
});
