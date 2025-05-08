<template>
  <v-app style="background-color: #f8fafc;">
    <NavBar />
    
    <v-main>
      <v-container>
        
        <v-row class="d-flex align-center mt-8 mb-16 modern-hero-row creative-hero-bg">
          <v-col cols="12" md="6" class="pr-10 modern-hero-text">
            <div class="modern-badge mb-4">
              <v-icon color="#0ea5e9" size="22" class="mr-2">mdi-heart-pulse</v-icon>
              <span>Welcome to MedEase</span>
            </div>
            <h1 class="modern-title mb-6">
              Your Health, <span class="modern-highlight">Your Way</span>
            </h1>
            <p class="modern-subtitle mb-8">
              Book appointments, manage your health, and connect with top doctors—all in one seamless platform. Experience healthcare reimagined for you.
            </p>
            <div class="modern-cta-group mb-8">
              <v-btn color="#0ea5e9" class="modern-cta-btn mr-4" size="x-large" elevation="4">Get Started</v-btn>
              <v-btn variant="outlined" color="#0ea5e9" class="modern-cta-btn" size="large" @click="$router.push('/Pharmacy')">Visit Pharmacy</v-btn>
            </div>
            <div class="trusted-bar mt-6">
              <v-icon color="#0ea5e9" size="20" class="mr-1">mdi-shield-check</v-icon>
              <span>Trusted by 200,000+ users</span>
              <v-avatar size="28" class="ml-2 mr-1"><v-img src="https://randomuser.me/api/portraits/men/32.jpg" /></v-avatar>
              <v-avatar size="28" class="mr-1"><v-img src="https://randomuser.me/api/portraits/women/44.jpg" /></v-avatar>
              <v-avatar size="28"><v-img src="https://randomuser.me/api/portraits/men/76.jpg" /></v-avatar>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="modern-hero-image-col">
            <div class="modern-hero-image-wrapper">
              <v-img
                :src="doctorIllustration"
                contain
                max-height="520"
                class="modern-hero-image"
              ></v-img>
              <div class="modern-hero-bubble modern-hero-bubble-1">
                <v-icon color="#0ea5e9" size="28">mdi-star</v-icon>
                <span>4.9/5 Avg. Rating</span>
              </div>
              <div class="modern-hero-bubble modern-hero-bubble-3">
                <v-icon color="#0ea5e9" size="28">mdi-rocket-launch</v-icon>
                <span>Book in 30s</span>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-row class="my-16 py-16 how-to-use-row modern-how-to-use" style="background: linear-gradient(120deg, #f0f9ff 60%, #e0f2fe 100%); border-radius: 32px; box-shadow: 0 8px 32px 0 rgba(14,165,233,0.07); position: relative; overflow: hidden;">
          <div class="modern-howto-bg-shape"></div>
          <v-col cols="12" class="text-center mb-10">
            <h2 class="text-h3 font-weight-black mb-4 modern-howto-title">
              How to Use <span class="modern-highlight">MedEase</span>
            </h2>
            <p class="text-h5 modern-howto-desc">
              Start your healthcare journey in just three easy steps
            </p>
          </v-col>
          <v-col cols="12" md="4" class="d-flex flex-column align-center mb-8 modern-howto-step">
            <div class="modern-howto-icon mb-4">
              <v-icon size="44" color="#0ea5e9">mdi-account-plus</v-icon>
            </div>
            <h3 class="text-h5 font-weight-bold mb-2 modern-howto-step-title">Sign Up or Log In</h3>
            <p class="text-body-1 modern-howto-step-desc">
              Create your free account or log in to unlock all features and manage your health with ease.
            </p>
          </v-col>
          <v-col cols="12" md="4" class="d-flex flex-column align-center mb-8 modern-howto-step">
            <div class="modern-howto-icon mb-4">
              <v-icon size="44" color="#0ea5e9">mdi-calendar-check</v-icon>
            </div>
            <h3 class="text-h5 font-weight-bold mb-2 modern-howto-step-title">Book Instantly</h3>
            <p class="text-body-1 modern-howto-step-desc">
              Search, compare, and book appointments with top doctors in seconds—no waiting, no hassle.
            </p>
          </v-col>
          <v-col cols="12" md="4" class="d-flex flex-column align-center mb-8 modern-howto-step">
            <div class="modern-howto-icon mb-4">
              <v-icon size="44" color="#0ea5e9">mdi-bell-alert</v-icon>
            </div>
            <h3 class="text-h5 font-weight-bold mb-2 modern-howto-step-title">Stay on Track</h3>
            <p class="text-body-1 modern-howto-step-desc">
              Get smart reminders, manage prescriptions, and enjoy seamless, personalized care.
            </p>
          </v-col>
          <div class="modern-howto-connector modern-howto-connector-1"></div>
          <div class="modern-howto-connector modern-howto-connector-2"></div>
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

        
        <v-row class="justify-center mb-10">
          <v-col cols="12" md="8">
            <v-card elevation="4" class="pa-8 text-center daily-quote-card" style="border-radius: 24px; position: relative; overflow: visible;">
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
    <Chatbot />
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/navbarAuthPatient.vue'
import Footer from '@/components/footer.vue'
import Chatbot from '@/components/Chatbot.vue'
import doctorIllustration from '@/assets/doctor-illustration.png'
import heartIcon from '@/assets/heart-icon.png'
import calendarIcon from '@/assets/calendar-icon.png'
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

// Reviews state
const reviews = ref([
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
])

const reviewScrollRef = ref(null)

const scrollReviews = (direction) => {
  const scrollWrapper = reviewScrollRef.value
  if (scrollWrapper) {
    const scrollAmount = 320 // Width of one review card
    scrollWrapper.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}

function isUserLoggedIn() {
  // Check for both token and patient in localStorage, as used in navbarAuthPatient.vue
  return !!(localStorage.getItem('token') && localStorage.getItem('patient'));
}

const handleGetStarted = () => {
  if (isUserLoggedIn()) {
    router.push('/booking');
  } else {
    router.push('/signInPatient');
  }
};

onMounted(() => {
  fetchDailyQuote()
})
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

.daily-quote-card {
  background: linear-gradient(90deg, #e0f2fe 0%, #f0f9ff 100%);
  box-shadow: 0 6px 32px 0 rgba(14, 165, 233, 0.10);
  margin-bottom: 32px;
}
.daily-quote-text {
  font-size: 1.35rem;
  line-height: 1.7;
  letter-spacing: 0.01em;
}
.daily-quote-caption {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.modern-how-to-use {
  position: relative;
  margin-bottom: 64px;
  margin-top: 64px;
  padding-top: 64px;
  padding-bottom: 64px;
  overflow: visible;
}
.modern-howto-title {
  color: #1e3a8a;
  font-size: 2.5rem;
  letter-spacing: -1px;
}
.modern-howto-desc {
  color: #64748b;
  font-size: 1.2rem;
  margin-bottom: 0;
}
.modern-howto-step {
  position: relative;
  z-index: 2;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px 0 rgba(14,165,233,0.06);
  padding: 36px 18px 32px 18px;
  min-height: 320px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.modern-howto-step:hover {
  box-shadow: 0 8px 32px 0 rgba(14,165,233,0.13);
  transform: translateY(-6px) scale(1.03);
}
.modern-howto-icon {
  background: linear-gradient(120deg, #e0f2fe 60%, #bae6fd 100%);
  border-radius: 50%;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(14,165,233,0.10);
}
.modern-howto-step-title {
  color: #0ea5e9;
  font-size: 1.25rem;
}
.modern-howto-step-desc {
  color: #64748b;
  font-size: 1.08rem;
  margin-top: 0;
  margin-bottom: 0;
}
.modern-howto-bg-shape {
  position: absolute;
  left: -120px;
  top: 40px;
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, #0ea5e9 0%, #38bdf8 60%, transparent 100%);
  opacity: 0.07;
  z-index: 0;
  border-radius: 50%;
}
.modern-howto-connector {
  position: absolute;
  top: 180px;
  width: 30%;
  height: 4px;
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
  opacity: 0.13;
  border-radius: 2px;
  z-index: 1;
}
.modern-howto-connector-1 {
  left: 18%;
}
.modern-howto-connector-2 {
  left: 52%;
}
@media (max-width: 960px) {
  .modern-howto-title {
    font-size: 1.5rem !important;
  }
  .modern-howto-step {
    min-height: 220px;
    padding: 24px 8px 20px 8px;
  }
  .modern-howto-connector {
    display: none;
  }
}

.modern-hero-row.creative-hero-bg {
  background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 60%, #bae6fd 100%);
  border-radius: 32px;
  box-shadow: 0 8px 32px 0 rgba(14, 165, 233, 0.10);
  padding: 48px 0 48px 0;
  position: relative;
  overflow: visible;
  min-height: 600px;
}
.modern-hero-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 4px 32px 0 rgba(14, 165, 233, 0.10);
  padding: 36px;
}
.modern-hero-bubble {
  position: absolute;
  display: flex;
  align-items: center;
  background: #fff;
  color: #0ea5e9;
  font-weight: 700;
  border-radius: 999px;
  box-shadow: 0 2px 12px 0 rgba(14, 165, 233, 0.10);
  padding: 8px 18px;
  font-size: 1.1rem;
  z-index: 2;
  white-space: nowrap;
}
.modern-hero-bubble-1 {
  left: -32px;
  top: 24px;
}
.modern-hero-bubble-3 {
  left: 50%;
  bottom: -32px;
  transform: translateX(-50%);
}
.modern-title {
  font-size: 3.2rem;
  font-weight: 900;
  color: #1e3a8a;
  line-height: 1.1;
}
.modern-highlight {
  color: #0ea5e9;
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.modern-subtitle {
  color: #64748b;
  font-size: 1.25rem;
  line-height: 1.7;
  max-width: 480px;
}
.modern-cta-btn:hover {
  background: #38bdf8 !important;
  color: #fff !important;
  transform: scale(1.08);
}

.modern-badge {
  display: inline-flex;
  align-items: center;
  background: #e0f2fe;
  color: #0ea5e9;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 999px;
  padding: 6px 18px;
  letter-spacing: 0.02em;
}
.trusted-bar {
  display: flex;
  align-items: center;
  background: #e0f2fe;
  color: #0ea5e9;
  font-weight: 600;
  font-size: 1.08rem;
  border-radius: 999px;
  padding: 7px 22px;
  box-shadow: 0 2px 12px 0 rgba(14, 165, 233, 0.07);
  width: fit-content;
}
@media (max-width: 960px) {
  .modern-hero-row.creative-hero-bg {
    min-height: 340px;
    padding: 18px 0 18px 0;
  }
  .modern-title {
    font-size: 2.1rem !important;
  }
  .modern-hero-image-wrapper {
    max-width: 320px;
    padding: 12px;
  }
}
</style>