// In your Vue component

import { reactive } from 'vue';

export const doctorlist = reactive({
  doctors: [
    {
        name: "Dr. Kamel Ouertani",
        description: "Studied at University of Tunis and completed residency at Charles Nicolle Hospital",
        image: "https://thumbs.dreamstime.com/b/young-male-doctor-close-up-happy-looking-camera-56751540.jpg",
        specialty: "Endocrinologist",
        location: "Tunis",
        rating: 3.9
      },
      {
        name: "Dr. Leila Masmoudi",
        description: "Studied at University of Sfax and completed residency at Habib Bourguiba University Hospital",
        image: "https://t3.ftcdn.net/jpg/05/04/25/70/360_F_504257032_jBtwqNdvdMN9Xm6aDT0hcvtxDXPZErrn.jpg",
        specialty: "Ophthalmologist",
        location: "Bizerte",
        rating: 4
      },
      {
        name: "Dr. John Doe",
        description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
        image: "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=640:*",
        specialty: "Cardiologist",
        location: "Monastir",
        rating: 4.5
      },
      {
        name: "Dr. Sarah Smith",
        description: "Studied at University of Sfax and completed residency at Sfax University Hospital",
        image: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
        specialty: "Neurologist",
        location: "Nabeul",
        rating: 4.7
      },
      {
        name: "Dr. Ahmed Khaled",
        description: "Studied at University of Tunis El Manar and completed residency at Rabta Hospital",
        image: "https://media.istockphoto.com/id/1346124900/photo/confident-successful-mature-doctor-at-hospital.jpg?s=612x612&w=0&k=20&c=S93n5iTDVG3_kJ9euNNUKVl9pgXTOdVQcI_oDGG-QlE=",
        specialty: "Cardiologist",
        location: "Tunis",
        rating: 4.2
      },
      {
        name: "Dr. Zied Ladhari",
        description: "Studied at University of Sousse and completed residency at Sahloul University Hospital",
        image: "https://nmc.ae/_next/image?url=https%3A%2F%2Fstatic-cdn.nmc.ae%2Fstrapi%2FDr_Amro_90f95a38db.png&w=3840&q=75",
        specialty: "Pediatrician",
        location: "Sousse",
        rating: 4.3
      },
      {
        name: "Dr. Amina Khelifa",
        description: "studied at University of Sousse and completed residency at Sahloul University Hospital",
        image: "https://media.istockphoto.com/id/1372002650/photo/cropped-portrait-of-an-attractive-young-female-doctor-standing-with-her-arms-folded-in-the.jpg?s=612x612&w=0&k=20&c=o1QtStNsowOU0HSof6xQ_jZMglU8ZK565gHd655U6S4=",
        specialty: "Dermatologist",
        location: "Sousse",
        rating: 4.9
      },
      {
        name: "Dr. Sami Ben Ali",
        description: "Studied at University of Tunis and completed residency at Rabta Hospital",
        image: "https://previews.123rf.com/images/dolgachov/dolgachov1307/dolgachov130700228/20605818-bright-picture-of-male-doctor-with-stethoscope.jpg",
        specialty: "Cardiologist",
        location: "Tunis",
        rating: 3.9
      },
      {
        name: "Dr. Tarek Ayari",
        description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
        image: "https://st4.depositphotos.com/1017986/21088/i/450/depositphotos_210888716-stock-photo-happy-doctor-with-clipboard-at.jpg",
        specialty: "Psychiatrist",
        location: "Monastir",
        rating: 4.5
      },
      {
        name: "Dr. Manel Ben Ahmed",
        description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
        image: "https://plus.unsplash.com/premium_photo-1664475450083-5c9eef17a191?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwZG9jdG9yfGVufDB8fDB8fHww",
        specialty: "Dermatologist",
        location: "Kairouan",
        rating: 3.7
      },
      {
        name: "Dr. Sarah Aloui",
        description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
        image: "https://i.pinimg.com/736x/b9/97/a5/b997a530822d0f2c03259070d4590d45.jpg",
        specialty: "Gastroenterologist",
        location: "Nabeul",
        rating: 4.2
      },
      {
        name: "Dr. Khaled Cherif",
        description: "Studied at University of Sfax and completed residency at Sfax University Hospital",
        image: "https://cdn.prod.website-files.com/62d4f06f9c1357a606c3b7ef/65ddf3cdf19abaf5688af2f8_shutterstock_1933145801%20(1).jpg",
        specialty: "Neurologist",
        location: "Bizerte",
        rating: 4.7
      },
      {
        name: "Dr. Yassir Zribi",
        description: "Studied at University of Monastir and completed residency at Farhat Hached University Hospital",
        image: "https://s3-eu-west-1.amazonaws.com/intercare-web-public/wysiwyg-uploads%2F1569586526901-doctor.jpg",
        specialty: "Obstetrician",
        location: "Beja",
        rating: 4.4
      },
      {
        name: "Dr. Sabrine El Abed",
        description: "Studied at University of Tunis and completed residency at Rabta Hospital",
        image: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
        specialty: "Ophthalmologist",
        location: "Gabes",
        rating: 4.0
      },
      {
        name: "Dr. Baha Hadded",
        description: "Studied at University of Mahdia and completed residency at Mahdia University Hospital",
        image: "https://static.vecteezy.com/system/resources/previews/028/287/384/non_2x/a-mature-indian-male-doctor-on-a-white-background-ai-generated-photo.jpg",
        specialty: "Hematologist",
        location: "Mahdia",
        rating: 3.8
      },
      // Add remaining doctors here
    ],
    categories: {
      Speciality: ["Dermatologist", "Cardiologist", "Endocrinologist", "Gastroenterologist", "Hematologist", "Neurologist", "Pediatrician", "Obstetrician", "Psychiatrist", "Ophthalmologist", "Otolaryngologist"],
      Location: ["Tunis", "Bizerte", "Zaghouan", "Nabeul", "Sousse", "Kairouan", "Monastir", "Mahdia", "Jendouba", "Beja", "Siliana", "Kef", "Kasserine", "Sidi Bouzid", "Sfax", "Gafsa", "Gabes", "Tozeur", "Kebili", "Medenine", "Tataouine"]
    }
  });