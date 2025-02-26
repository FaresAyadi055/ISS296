<template>
    <v-footer class="footer" color="#f9f9f9">
      <v-container>
        <v-row>
          
          <v-col cols="12" md="4">
            <h3 class="font-weight-bold mr-4" style="color: #D5DE58;">MedEase.</h3>
            <p>Copyright © 2025 MedEase, all rights reserved.</p>
          </v-col>
          
          
          <v-col cols="12" md="2">
            <h4 class="font-weight-bold">Our Company</h4>
            <p>About us</p>
            <p>Contact us</p>
          </v-col>
          
          
          <v-col cols="12" md="3">
            <h4 class="font-weight-bold">Legal & Compliance</h4>
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
            <p>Cookie Policy</p>
          </v-col>
          
          
          <v-col cols="12" md="3">
            <h4 class="font-weight-bold">Support & Help</h4>
            <p>FAQ</p>
            <p>Customer Support</p>
          </v-col>
          
          
          <v-col cols="12" class="text-right">
            <v-btn icon color="#5b9df9" class="mx-2">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon color="#5b9df9">
              <v-icon>mdi-linkedin</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script>
  export default {
    name: "FooterComponent",
  };
  </script>
  
  <style scoped>
  .footer {
    padding: 20px 0;
  }
  .text-yellow {
    color: #f5ea64;
  }
  .text-green {
    color: #bada55;
  }
  </style>
  