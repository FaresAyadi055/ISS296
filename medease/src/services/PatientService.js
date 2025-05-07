import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const patientService = {
  // Get all patients
  async getAllPatients() {
    try {
      const response = await axios.get(`${API_URL}/patients`)
      return response.data
    } catch (error) {
      console.error('Error fetching patients:', error)
      throw error
    }
  },

  // Get patient by ID
  async getPatientById(id) {
    try {
      const response = await axios.get(`${API_URL}/patients/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching patient:', error)
      throw error
    }
  },

  // Add medical condition
  async addCondition(patientId, condition) {
    try {
      const response = await axios.post(`${API_URL}/patients/${patientId}/conditions`, condition)
      return response.data
    } catch (error) {
      console.error('Error adding condition:', error)
      throw error
    }
  },

  // Delete medical condition
  async deleteCondition(patientId, conditionId) {
    try {
      await axios.delete(`${API_URL}/patients/${patientId}/conditions/${conditionId}`)
    } catch (error) {
      console.error('Error deleting condition:', error)
      throw error
    }
  },

  // Add medication
  async addMedication(patientId, medication) {
    try {
      const response = await axios.post(`${API_URL}/patients/${patientId}/medications`, medication)
      return response.data
    } catch (error) {
      console.error('Error adding medication:', error)
      throw error
    }
  },

  // Delete medication
  async deleteMedication(patientId, medicationId) {
    try {
      await axios.delete(`${API_URL}/patients/${patientId}/medications/${medicationId}`)
    } catch (error) {
      console.error('Error deleting medication:', error)
      throw error
    }
  },

  // Add reminder
  async addReminder(patientId, reminder) {
    try {
      const response = await axios.post(`${API_URL}/patients/${patientId}/reminders`, reminder)
      return response.data
    } catch (error) {
      console.error('Error adding reminder:', error)
      throw error
    }
  },

  // Delete reminder
  async deleteReminder(patientId, reminderId) {
    try {
      await axios.delete(`${API_URL}/patients/${patientId}/reminders/${reminderId}`)
    } catch (error) {
      console.error('Error deleting reminder:', error)
      throw error
    }
  }
}