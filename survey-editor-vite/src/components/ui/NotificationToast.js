// Notification Toast Component - Shows undo/redo notifications
export function NotificationToast() {
  return `
    <!-- Notification Toast Container -->
    <div x-data="{
           notifications: [],
           addNotification(message, type = 'info') {
             const id = Date.now()
             const notification = { id, message, type }
             this.notifications.push(notification)
             
             // Auto-remove after 3 seconds
             setTimeout(() => {
               this.removeNotification(id)
             }, 3000)
           },
           removeNotification(id) {
             this.notifications = this.notifications.filter(n => n.id !== id)
           }
         }"
         x-init="
           // Listen for undo/redo events
           window.addEventListener('history:undo', (e) => {
             addNotification(e.detail.message, 'undo')
           })
           window.addEventListener('history:redo', (e) => {
             addNotification(e.detail.message, 'redo')
           })
         "
         class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      
      <div class="flex flex-col items-center space-y-3">
        <template x-for="notification in notifications" :key="notification.id">
          <div x-transition:enter="transition ease-out duration-300"
               x-transition:enter-start="opacity-0 transform translate-y-2"
               x-transition:enter-end="opacity-100 transform translate-y-0"
               x-transition:leave="transition ease-in duration-200"
               x-transition:leave-start="opacity-100 transform translate-y-0"
               x-transition:leave-end="opacity-0 transform translate-y-2"
               class="pointer-events-auto">
            
            <div class="flex items-center space-x-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px]">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <template x-if="notification.type === 'undo'">
                  <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                    </svg>
                  </div>
                </template>
                <template x-if="notification.type === 'redo'">
                  <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path>
                    </svg>
                  </div>
                </template>
              </div>
              
              <!-- Message -->
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900" x-text="notification.message"></p>
              </div>
              
              <!-- Close button -->
              <button @click="removeNotification(notification.id)"
                      class="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors pointer-events-auto">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  `
}

// Export notification function for external use
export function showNotification(message, type = 'info') {
  window.dispatchEvent(new CustomEvent(`history:${type}`, { 
    detail: { message } 
  }))
}