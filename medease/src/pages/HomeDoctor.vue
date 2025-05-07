<template>
  <v-app style="background-color: #f8fafc;">
    <NavBarDoctor />
    
    <v-main>
      <v-container>
        
        <v-row class="d-flex align-center mt-8 mb-16">
          <v-col cols="12" md="6" class="pr-10">
            <h1 class="text-h2 font-weight-black mb-6" style="color: #1e3a8a;">
              Take care of your<br>
              <span style="color: #0ea5e9;">health in time</span>
            </h1>
            <p class="text-h5 mb-8" style="color: #64748b; line-height: 1.7;">
              Connect with trusted healthcare professionals anytime,<br>
              anywhere with our easy-to-use web application
            </p>
          </v-col>

          <v-col cols="12" md="6">
            <v-img
              :src="doctorIllustration"
              contain
              max-height="600"
            ></v-img>
          </v-col>
        </v-row>

        
        <v-row class="my-16 py-16" style="background-color: #f0f9ff;">
          <v-col cols="12" class="text-center mb-10">
            <h2 class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">
              Why book with MedEase?
            </h2>
            <p class="text-h5" style="color: #64748b;">
              Book your doctor's appointment online differently
            </p>
          </v-col>

          <v-col cols="12" md="6" class="d-flex pa-8">
            <v-img
              :src="heartIcon"
              max-width="72"
              class="mr-6"
            ></v-img>
            <div>
              <h3 class="text-h4 font-weight-bold mb-2" style="color: #1e3a8a;">
                Faster Access to Care
              </h3>
              <p class="text-body-1" style="color: #64748b; line-height: 1.7;">
                Real-time availability updates and instant booking system
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="d-flex pa-8">
            <v-img
              :src="calendarIcon"
              max-width="72"
              class="mr-6"
            ></v-img>
            <div>
              <h3 class="text-h4 font-weight-bold mb-2" style="color: #1e3a8a;">
                Health Management
              </h3>
              <p class="text-body-1" style="color: #64748b; line-height: 1.7;">
                Smart reminders and in-person appointment management
              </p>
            </div>
          </v-col>
        </v-row>

        
        <v-row class="my-16 py-16 text-center">
          <v-col cols="12">
            <div class="text-h3 font-weight-bold mb-4" style="color: #1e3a8a;">
              MedEase by the numbers
            </div>
            <div class="text-h1 font-weight-black mb-4" style="color: #0ea5e9;">
              200,000+
            </div>
            <p class="text-h5" style="color: #64748b;">
              people getting better healthcare
            </p>
            <div class="text-h1 font-weight-black mb-4" style="color: #0ea5e9; margin-top: 50px;">
              10,000,000+
            </div>
            <p class="text-h5" style="color: #64748b;">
              people getting better
            </p>
          </v-col>
        </v-row>

        <v-row class="justify-center mb-10">
          <v-col cols="12" md="8">
            <v-card elevation="4" class="pa-8 text-center daily-quote-card" style="border-radius: 24px; position: relative; overflow: visible; background: linear-gradient(90deg, #e0f2fe 0%, #f0f9ff 100%);">
              <v-icon size="40" color="#0ea5e9" class="mb-2" style="position: absolute; left: 24px; top: -20px; background: #e0f2fe; border-radius: 50%; padding: 8px;">mdi-format-quote-open</v-icon>
              <div class="text-h5 font-italic mb-2 daily-quote-text" style="color: #0ea5e9; min-height: 32px;">
                <span v-if="quoteLoading">
                  <v-progress-circular indeterminate color="#0ea5e9" size="24" class="mr-2" />
                  Loading daily quote...
                </span>
                <span v-else-if="quoteError">{{ quoteError }}</span>
                <span v-else>“{{ dailyQuote }}”</span>
              </div>
              <div class="text-caption daily-quote-caption" style="color: #64748b;">
                <v-icon size="16" color="#64748b" class="mr-1">mdi-robot</v-icon>
                AI-generated daily inspiration
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="justify-center mb-12">
          <v-col cols="12">
            <h2 class="text-h4 font-weight-bold mb-6 text-center" style="color: #1e3a8a;">What our users say about MedEase</h2>
            <div class="review-scroll-arrows d-flex align-center justify-center mb-2">
              <v-btn icon variant="text" @click="scrollReviews('left')" class="review-arrow-btn mr-2" aria-label="Scroll left">
                <v-icon size="32">mdi-chevron-left</v-icon>
              </v-btn>
              <div class="review-scroll-wrapper" ref="reviewScrollRef" style="flex:1;">
                <div class="review-scroll">
                  <v-card v-for="(review, i) in reviews" :key="i" class="review-card mx-3" elevation="3">
                    <v-card-title class="review-title">
                      <v-avatar size="40" class="mr-3">
                        <v-img :src="review.avatar" />
                      </v-avatar>
                      <span class="font-weight-bold">{{ review.name }}</span>
                    </v-card-title>
                    <v-card-text class="review-text">
                      <v-rating :value="review.rating" color="#0ea5e9" dense readonly size="18" class="mb-2" />
                      <div>{{ review.text }}</div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
              <v-btn icon variant="text" @click="scrollReviews('right')" class="review-arrow-btn ml-2" aria-label="Scroll right">
                <v-icon size="32">mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBarDoctor from '@/components/navbardoctor.vue'
import Footer from '@/components/footer.vue'
import doctorIllustration from '@/assets/doctor-illustration.png'
import heartIcon from '@/assets/heart-icon.png'
import calendarIcon from '@/assets/calendar-icon.png'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { API_CONFIG } from '@/config/api'

const router = useRouter()

// Daily quote state
const dailyQuote = ref('')
const quoteLoading = ref(true)
const quoteError = ref('')

const fetchDailyQuote = async () => {
  quoteLoading.value = true
  quoteError.value = ''
  try {
    const response = await axios.post(
      API_CONFIG.API_URL,
      {
        model: 'anthropic/claude-2',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful medical assistant for MedEase. Generate a short, modern, and inspiring healthcare quote for today. Keep it under 30 words.'
          },
          {
            role: 'user',
            content: 'Give me a modern, inspiring healthcare quote for today.'
          }
        ],
        temperature: 0.7,
        max_tokens: 60
      },
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://medease.com',
          'X-Title': 'MedEase'
        }
      }
    )
    if (response.data && response.data.choices && response.data.choices[0].message) {
      dailyQuote.value = response.data.choices[0].message.content.trim()
    } else {
      quoteError.value = 'Could not load quote.'
    }
  } catch (e) {
    quoteError.value = 'Could not load quote.'
  } finally {
    quoteLoading.value = false
  }
}

onMounted(() => {
  fetchDailyQuote()
})

const reviews = [
  {
    name: 'Sarah M.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'MedEase made booking appointments so easy and fast! Highly recommended for busy people.'
  },
  {
    name: 'Ahmed K.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
    text: 'Great reminders and a user-friendly interface. I never miss my doctor visits now.'
  },
  {
    name: 'Linda S.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    rating: 5,
    text: 'The best healthcare platform I have used. The AI assistant is a nice touch!'
  },
  {
    name: 'Mohamed T.',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    rating: 4,
    text: 'Easy to use and very reliable. MedEase helped me find the right doctor quickly.'
  },
  {
    name: 'Emily R.',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
    text: 'Love the design and the smooth booking process. Highly recommend MedEase!'
  }
]

const reviewScrollRef = ref(null)

const scrollReviews = (direction) => {
  const scrollContainer = reviewScrollRef.value
  if (scrollContainer) {
    const scrollAmount = 320 // Width of one review card
    scrollContainer.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.v-main {
  padding: 80px 0;
}

@media (max-width: 960px) {
  .text-h2 {
    font-size: 2.5rem !important;
  }
  
  .text-h3 {
    font-size: 2rem !important;
  }
  
  .text-h5 {
    font-size: 1.1rem !important;
  }
}

.v-btn {
  text-transform: none;
  padding: 20px 40px !important;
  font-size: 1.1rem;
  font-weight: 600;
}

.review-scroll-arrows {
  position: relative;
}
.review-arrow-btn {
  background: #e0f2fe;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  box-shadow: 0 2px 8px 0 rgba(14, 165, 233, 0.08);
  padding: 0;
}
.review-arrow-btn:hover {
  background: #bae6fd;
}
.review-arrow-btn .v-icon {
  margin: 0;
  padding: 0;
  font-size: 32px;
  line-height: 1;
}
.review-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.review-scroll-wrapper::-webkit-scrollbar {
  display: none;
}
.review-scroll {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
}
.review-card {
  min-width: 320px;
  max-width: 320px;
  flex: 0 0 auto;
  border-radius: 18px;
  background: #f8fafc;
  transition: box-shadow 0.2s;
}
.review-card:hover {
  box-shadow: 0 8px 32px 0 rgba(14, 165, 233, 0.13);
}
.review-title {
  align-items: center;
  display: flex;
  font-size: 1.1rem;
  color: #1e3a8a;
}
.review-text {
  font-size: 1rem;
  color: #334155;
  min-height: 70px;
}
</style>