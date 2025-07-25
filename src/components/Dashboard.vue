<template>
  <div class="bg-white shadow rounded-lg overflow-hidden h-screen flex flex-col">
    <!-- En-tête utilisateur -->
    <div class="px-4 py-5 sm:p-6 border-b border-gray-200 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ user.name }}</h2>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex space-x-4">
            <div class="text-center">
              <span class="block text-2xl font-bold text-gray-900">{{ user.points }}</span>
              <span class="text-sm text-gray-500">Points</span>
            </div>
            <div class="text-center">
              <span class="block text-2xl font-bold text-gray-900">{{ user.likes_count }}</span>
              <span class="text-sm text-gray-500">Likes</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="badge in user.badges" :key="badge.earned_at"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
              :class="{
                'bg-primary bg-opacity-10 text-primary': badge.type === 'beginner',
                'bg-purple-100 text-purple-800': badge.type === 'top-fan',
                'bg-primary bg-opacity-10 text-primary': badge.category === 'like'
              }">
              {{ badge.type }}
              <span class="ml-1 text-xs opacity-75">(+{{ badge.points_earned }})</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Section commentaires -->
    <div class="px-4 py-5 sm:p-6 flex-1 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-bold text-gray-900">Commentaires</h3>
          <div class="flex space-x-2">
            <button @click="filterType = 'all'" 
              :class="{
                'bg-gray-200 text-gray-700': filterType === 'all',
                'bg-gray-100 text-gray-500 hover:bg-gray-200': filterType !== 'all'
              }"
              class="px-3 py-1 rounded-md text-sm font-medium">
              Tous
            </button>
            <button @click="filterType = 'mine'" 
              :class="{
                'bg-gray-200 text-gray-700': filterType === 'mine',
                'bg-gray-100 text-gray-500 hover:bg-gray-200': filterType !== 'mine'
              }"
              class="px-3 py-1 rounded-md text-sm font-medium">
              Mes commentaires
            </button>
          </div>
        </div>
        <button @click="openCommentModal" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#2EA249] hover:bg-[#248A39] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2EA249]">
          Nouveau commentaire
        </button>
      </div>

      <!-- Liste des commentaires -->
      <div class="space-y-4">
        <div v-for="comment in filteredComments" :key="comment.id" class="bg-gray-50 rounded-lg p-4">
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center space-x-2 mb-2">
                <span class="font-bold text-gray-900">{{ comment.user.name }}</span>
                <span class="text-sm text-gray-500">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
              </div>
              <p class="text-sm text-gray-900">{{ comment.text }}</p>
              <div class="mt-2 flex items-center space-x-4 text-sm">
                <button @click="toggleLike(comment.id)" 
                  class="flex items-center text-gray-500 hover:text-primary">
                  <img :src="comment.is_liked ? '/red.png' : '/white.png'" 
                       alt="like icon" 
                       class="w-5 h-5 mr-1" />
                  {{ comment.likes_count }}
                </button>
                <button v-if="comment.user.id === user.id" 
                  @click="deleteComment(comment.id)"
                  class="text-red-500 hover:text-red-600">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour nouveau commentaire -->
    <VueFinalModal v-model="showCommentModal" classes="modal-container" content-class="modal-content" overlay-class="modal-overlay">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Nouveau commentaire</h3>
        <textarea
          v-model="newComment"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          placeholder="Écrivez votre commentaire..."
        ></textarea>
        <div class="mt-4 flex justify-end space-x-3">
          <button @click="showCommentModal = false" 
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
            Annuler
          </button>
          <button @click="addComment" 
            class="px-4 py-2 text-sm font-medium text-white bg-[#2EA249] rounded-md hover:bg-[#248A39] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2EA249]">
            Publier
          </button>
        </div>
      </div>
    </VueFinalModal>
  </div>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'
import { getComments, addComment, deleteComment, likeComment, unlikeComment, getLikes, getProfile } from '../services/api'

export default {
  name: 'Dashboard',
  components: {
    VueFinalModal
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: [],
      showCommentModal: false,
      newComment: '',
      filterType: 'all'
    }
  },
  computed: {
    filteredComments() {
      if (this.filterType === 'mine') {
        return this.comments.filter(comment => comment.user.id === this.user.id)
      }
      return this.comments
    }
  },
  methods: {
    openCommentModal() {
      this.showCommentModal = true
      this.newComment = ''
    },
    async addComment() {
      if (!this.newComment.trim()) return

      try {
        const response = await addComment(this.newComment.trim(), this.user.id)
        if (response.success) {
          this.comments.unshift(response.data.comment)
          this.showCommentModal = false
          this.newComment = ''
          await this.updateProfile()
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error)
      }
    },
    async updateProfile() {
      try {
        const response = await getProfile()
        if (response.success) {
          const { points, badges, likes_count } = response.data
          this.user.points = points
          this.user.badges = badges
          this.user.likes_count = likes_count
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error)
      }
    },
    async toggleLike(commentId) {
      const comment = this.comments.find(c => c.id === commentId)
      if (!comment) return

      try {
        if (comment.is_liked) {
          const response = await unlikeComment(commentId)
          if (response.success) {
            comment.likes_count--
            comment.is_liked = false
            await this.updateProfile()
          }
        } else {
          const response = await likeComment(commentId)
          if (response.success) {
            const { comment_likes_count } = response.data
            comment.likes_count = comment_likes_count
            comment.is_liked = true
            await this.updateProfile()
          }
        }
      } catch (error) {
        if (error.response?.status === 409) {
          // Si l'erreur est un conflit (déjà liké), on met à jour l'état local
          if (!comment.is_liked) {
            comment.is_liked = true
            await this.fetchComments() // Rafraîchir pour avoir le bon nombre de likes
          }
        } else {
          console.error('Erreur lors du like/unlike:', error)
        }
      }
    },
    async deleteComment(commentId) {
      try {
        const response = await deleteComment(commentId)
        if (response.success) {
          this.comments = this.comments.filter(c => c.id !== commentId)
          await this.updateProfile()
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error)
      }
    },
    async fetchComments() {
      try {
        const [comments, userLikes] = await Promise.all([
          getComments(),
          getLikes()
        ])
        
        // Créer un Set des IDs des commentaires likés par l'utilisateur
        const likedCommentIds = new Set(userLikes.map(like => like.comment_id))
        
        // Marquer les commentaires comme likés si présents dans le Set
        this.comments = comments.map(comment => ({
          ...comment,
          is_liked: likedCommentIds.has(comment.id)
        }))
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error)
      }
    }
  },
  mounted() {
    this.fetchComments()
  }
}
</script>

<style>
.modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 40;
}
.modal-content {
  position: relative;
  z-index: 50;
  transform: translateY(0);
  transition: all 0.3s ease-out;
  max-width: 32rem;
  width: calc(100% - 2rem);
  margin: 0 auto;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}
.modal-enter-active .modal-content {
  transform: translateY(0);
  opacity: 1;
}
.modal-enter-from .modal-content {
  transform: translateY(-50px);
  opacity: 0;
}
.modal-leave-to .modal-content {
  transform: translateY(50px);
  opacity: 0;
}
</style>