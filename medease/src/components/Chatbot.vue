<template>
  <div class="chatbot-container" :class="{ 'chatbot-open': showChat }">
    <!-- Chat Header -->
    <div class="chat-header" @click="showChat = !showChat">
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-message-text</v-icon>
        <span>MedEase Assistant</span>
      </div>
      <v-icon>{{ showChat ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
    </div>

    <!-- Chat Content -->
    <div class="chat-content" v-show="showChat">
      <div class="chat-messages" ref="chatContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender]"
        >
          <div class="message-content">
            <div v-if="message.type === 'text'">{{ message.text }}</div>
            <div v-else-if="message.type === 'doctors'" class="doctors-list">
              <div v-for="doctor in message.doctors" :key="doctor._id" class="doctor-item">
                <div class="doctor-info">
                  <strong>Dr. {{ doctor.firstName }} {{ doctor.lastName }}</strong>
                  <div class="specialty">{{ doctor.specialty }}</div>
                </div>
                <v-btn
                  size="small"
                  color="primary"
                  @click="goToBooking(doctor._id)"
                  class="booking-btn"
                >
                  Book Appointment
                </v-btn>
              </div>
            </div>
          </div>
          <div class="message-time">
            {{ message.time }}
          </div>
        </div>
      </div>

      <div class="chat-input">
        <v-text-field
          v-model="newMessage"
          placeholder="Type your message..."
          outlined
          dense
          hide-details
          @keyup.enter="sendMessage"
          :loading="isLoading"
        >
          <template v-slot:append>
            <v-btn
              icon
              variant="text"
              color="#0ea5e9"
              @click="sendMessage"
              :disabled="isLoading"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { API_CONFIG } from '@/config/api'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// Chat state
const showChat = ref(false)
const messages = ref(
  JSON.parse(localStorage.getItem('medease_chat_history')) || [
    {
      text: 'Hello! I am your MedEase assistant. How can I help you today?',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }
  ]
)
const newMessage = ref('')
const chatContainer = ref(null)
const isLoading = ref(false)

// Specialty keywords
const specialtyKeywords = {
  'cardiologist': 'Cardiologist',
  'cardiology': 'Cardiologist',
  'heart': 'Cardiologist',
  'pediatrician': 'Pediatrician',
  'pediatrics': 'Pediatrician',
  'pediatric': 'Pediatrician',
  'dermatologist': 'Dermatologist',
  'dermatology': 'Dermatologist',
  'skin': 'Dermatologist',
  'neurologist': 'Neurologist',
  'neurology': 'Neurologist',
  'brain': 'Neurologist',
  'endocrinologist': 'Endocrinologist',
  'endocrinology': 'Endocrinologist',
  'hormone': 'Endocrinologist',
  'ophthalmologist': 'Ophthalmologist',
  'ophthalmology': 'Ophthalmologist',
  'eye': 'Ophthalmologist',
  'psychiatrist': 'Psychiatrist',
  'psychiatry': 'Psychiatrist',
  'mental': 'Psychiatrist',
  'gastroenterologist': 'Gastroenterologist',
  'gastroenterology': 'Gastroenterologist',
  'stomach': 'Gastroenterologist',
  'digestive': 'Gastroenterologist'
}

// List of all keywords from specialtyKeywords
const specialtyKeywordsList = Object.keys(specialtyKeywords);

// Function to send a message
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return

  // Add user message
  messages.value.push({
    text: newMessage.value,
    sender: 'user',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    type: 'text'
  })

  const userMessage = newMessage.value
  newMessage.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // List of all keywords from specialtyKeywords
  const lowerUserMessage = userMessage.toLowerCase();
  const matchesSpecialty = specialtyKeywordsList.some(keyword => lowerUserMessage.includes(keyword));

  if (
    lowerUserMessage.includes('doctor') ||
    lowerUserMessage.includes('find') ||
    lowerUserMessage.includes('available') ||
    matchesSpecialty
  ) {
    await handleDoctorQuery(userMessage)
  } else {
    await getAIResponse(userMessage)
  }
}

// Function to handle doctor queries
const handleDoctorQuery = async (message) => {
  try {
    isLoading.value = true
    console.log('Processing doctor query:', message)
    
    // Convert message to lowercase for better matching
    const lowerMessage = message.toLowerCase()
    console.log('Lowercase message:', lowerMessage)
    
    // Find matching specialty
    let specialty = null
    for (const [keyword, specialtyValue] of Object.entries(specialtyKeywords)) {
      if (lowerMessage.includes(keyword)) {
        specialty = specialtyValue
        console.log('Found matching specialty:', specialty)
        break
      }
    }
    
    // Fetch doctors from backend
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    console.log('Sending request to:', `${apiUrl}/api/chatbot/doctors`)
    console.log('Request payload:', { specialty })
    
    const response = await axios.post(`${apiUrl}/api/chatbot/doctors`, { specialty })
    console.log('Backend response:', response.data)
    
    if (response.data && response.data.length > 0) {
      const specialtyText = specialty ? `in ${specialty}` : ''
      messages.value.push({
        text: `Here are the available doctors ${specialtyText}:`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'doctors',
        doctors: response.data
      })
    } else {
      const noResultsMessage = specialty 
        ? `I couldn't find any ${specialty} specialists available at the moment. Please try a different specialty or check back later.`
        : 'I couldn\'t find any doctors matching your criteria. Please try specifying a specialty or check back later.'
      
      messages.value.push({
        text: noResultsMessage,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      })
    }
  } catch (error) {
    console.error('Error fetching doctors:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    messages.value.push({
      text: 'I apologize, but I encountered an error while searching for doctors. Please try again later.',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

// Function to navigate to booking page
const goToBooking = (doctorId) => {
  router.push(`/bookingPage/${doctorId}`)
}

// Function to get AI response
const getAIResponse = async (message) => {
  try {
    console.log('Sending request to API...');
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'anthropic/claude-2',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful medical assistant for MedEase. Provide clear, concise, and accurate information about healthcare, appointments, and medical services. Always be professional and empathetic.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://medease.com',
          'X-Title': 'MedEase'
        }
      }
    );

    console.log('Raw API Response:', response);
    console.log('Response Data:', response.data);

    // Check if we have a valid response with the expected structure
    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
      return response.data.choices[0].message.content.trim();
    }

    // If we get here, the response format wasn't what we expected
    console.error('Unexpected response structure:', response.data);
    return 'I apologize, but I received an unexpected response format. Please try again.';

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    // Check if it's an authentication error
    if (error.response?.status === 401) {
      return 'I apologize, but there seems to be an authentication issue. Please contact support.';
    }

    // Check if it's a rate limit error
    if (error.response?.status === 429) {
      return 'I apologize, but we have reached our request limit. Please try again in a moment.';
    }

    // For all other errors
    return 'I apologize, but I encountered an error. Please try again later.';
  }
}

// Function to scroll chat to bottom
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Save chat history to localStorage whenever it changes
watch(messages, (newMessages) => {
  localStorage.setItem('medease_chat_history', JSON.stringify(newMessages));
}, { deep: true });

const clearChat = () => {
  messages.value = [
    {
      text: 'Hello! I am your MedEase assistant. How can I help you today?',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }
  ];
  localStorage.removeItem('medease_chat_history');
}

onMounted(() => {
  // Initialize chat
  scrollToBottom()
})
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 100;
}

.chatbot-open {
  height: 400px;
}

.chat-header {
  padding: 12px 16px;
  background-color: #0ea5e9;
  color: white;
  border-radius: 12px 12px 0 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-content {
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  max-height: 300px;
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
}

.message.user {
  margin-left: auto;
}

.message.bot {
  margin-right: auto;
}

.message-content {
  padding: 12px;
  border-radius: 12px;
  display: inline-block;
}

.message.user .message-content {
  background-color: #0ea5e9;
  color: white;
}

.message.bot .message-content {
  background-color: white;
  color: #1e3a8a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-time {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 4px;
  text-align: right;
}

.chat-input {
  padding: 16px;
  background-color: white;
  border-top: 1px solid #e2e8f0;
}

.chat-input :deep(.v-field__input) {
  color: #0ea5e9 !important;
}

.chat-input :deep(.v-field__input::placeholder) {
  color: #0ea5e9 !important;
  opacity: 0.7;
}

.chat-input :deep(.v-field__outline) {
  color: #0ea5e9 !important;
}

.chat-input :deep(.v-field:hover .v-field__outline) {
  color: #0ea5e9 !important;
}

.chat-input :deep(.v-field--focused .v-field__outline) {
  color: #0ea5e9 !important;
}

/* Animation for chat content */
.chat-content {
  transition: all 0.3s ease;
  opacity: 0;
  height: 0;
  overflow: hidden;
}

.chatbot-open .chat-content {
  opacity: 1;
  height: calc(100% - 48px);
}

.doctors-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.doctor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.doctor-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.specialty {
  font-size: 0.875rem;
  color: #64748b;
}

.booking-btn {
  font-size: 0.75rem;
  text-transform: none;
}
</style> 