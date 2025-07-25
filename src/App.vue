<template>
  <div class="min-h-screen bg-gray-50 w-full flex items-center justify-center">
    <div class="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <template v-if="!activeUser">
        <UserSelector @user-selected="setActiveUser" @token-set="setAccessToken" />
      </template>

      <template v-else>
        <Dashboard :user="activeUser" />
      </template>
    </div>
  </div>
</template>

<script>
import UserSelector from './components/UserSelector.vue'
import Dashboard from './components/Dashboard.vue'
import { setToken, getProfile } from './services/api'

export default {
  name: 'App',
  components: { UserSelector, Dashboard },
  data() {
    return {
      activeUser: null
    }
  },
  methods: {
    async setActiveUser(user) {
      try {
        const response = await getProfile()
        if (response.success) {
          this.activeUser = response.data
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
      }
    },
    setAccessToken(token) {
      setToken(token)
    },
    async checkExistingToken() {
      const token = localStorage.getItem('token')
      if (token) {
        setToken(token)
        await this.setActiveUser()
      }
    }
  },
  async mounted() {
    await this.checkExistingToken()
  }
}
</script>
