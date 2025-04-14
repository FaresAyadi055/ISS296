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
            {{ message.text }}
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
import { ref, onMounted, nextTick } from 'vue'
import { API_CONFIG } from '@/config/api'
import axios from 'axios'

// Chat state
const showChat = ref(false)
const messages = ref([
  {
    text: 'Hello! I am your MedEase assistant. How can I help you today?',
    sender: 'bot',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
])
const newMessage = ref('')
const chatContainer = ref(null)
const isLoading = ref(false)

// Function to send a message
const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return

  // Add user message
  messages.value.push({
    text: newMessage.value,
    sender: 'user',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  const userMessage = newMessage.value
  newMessage.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Get AI response
  isLoading.value = true
  try {
    const response = await getAIResponse(userMessage)
    messages.value.push({
      text: response,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } catch (error) {
    console.error('Error getting AI response:', error)
    messages.value.push({
      text: 'I apologize, but I encountered an error. Please try again later.',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
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
</style> 