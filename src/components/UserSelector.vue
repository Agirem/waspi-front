<template>
  <div class="min-h-[inherit] flex items-center justify-center bg-white py-8 sm:py-12">
    <div class="w-full max-w-[320px] sm:max-w-sm px-4 sm:px-6 mx-auto">
      <h1 class="text-xl sm:text-2xl font-semibold text-[#2EA249] text-center mb-6 sm:mb-8">
        Waspi Rewards
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-5 sm:space-y-6">
        <div class="space-y-1 sm:space-y-2">
          <label for="username" class="block text-sm text-gray-600">
            Adresse email
          </label>
          <input
            id="username"
            v-model="username"
            type="email"
            required
            class="mt-1 w-full px-3 py-2.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2EA249] focus:ring-1 focus:ring-[#2EA249]/20 transition-colors"
            :class="{ 'border-red-300 bg-red-50 focus:border-red-300 focus:ring-red-200': error }"
            placeholder="Entrez votre adresse email"
          />
        </div>

        <div class="space-y-1 sm:space-y-2">
          <label for="password" class="block text-sm text-gray-600">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 w-full px-3 py-2.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#2EA249] focus:ring-1 focus:ring-[#2EA249]/20 transition-colors"
            :class="{ 'border-red-300 bg-red-50 focus:border-red-300 focus:ring-red-200': error }"
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <div v-if="error" 
          class="text-sm text-red-500 bg-red-50 border border-red-100 p-3 rounded-md shadow-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full py-2.5 sm:py-2 px-4 bg-[#2EA249] hover:bg-[#2EA249]/90 active:bg-[#2EA249]/80 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2EA249]/50 transition-colors shadow-sm"
          :disabled="loading"
        >
          <span v-if="!loading">Se connecter</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connexion...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from '../services/api'

export default {
  name: 'UserSelector',
  emits: ['user-selected', 'token-set'],
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        this.error = 'Veuillez remplir tous les champs'
        return
      }

      this.error = ''
      this.loading = true

      try {
        const data = await login(this.username, this.password)
        
        if (data.success) {
          this.$emit('token-set', data.token)
          this.$emit('user-selected', data.user)
        } else {
          this.error = 'Échec de la connexion'
        }
      } catch (error) {
        this.error = 'Identifiants incorrects'
        console.error('Erreur de connexion:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Les animations sont gérées par Tailwind */
</style>