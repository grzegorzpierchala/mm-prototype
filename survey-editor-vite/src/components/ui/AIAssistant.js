// AI Assistant Widget Component
export function AIAssistant() {
  return `
    <!-- AI Assistant Widget -->
    <div class="ai-chat-widget"
         x-data="{ 
           chatOpen: false,
           userMessage: '',
           messages: [
             { type: 'ai', text: 'Hi! I can help you create better survey questions. Try asking me to:', timestamp: new Date() },
             { type: 'suggestion', text: 'Suggest questions for customer satisfaction', timestamp: new Date() },
             { type: 'suggestion', text: 'Review my survey for bias', timestamp: new Date() },
             { type: 'suggestion', text: 'Make my questions more engaging', timestamp: new Date() }
           ]
         }">
      
      <!-- Chat Button -->
      <button @click="chatOpen = !chatOpen"
              class="ai-chat-button">
        <svg x-show="!chatOpen" class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
          </path>
        </svg>
        <svg x-show="chatOpen" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Chat Window -->
      <div x-show="chatOpen"
           x-transition:enter="transition ease-out duration-300"
           x-transition:enter-start="opacity-0 scale-95 translate-y-4"
           x-transition:enter-end="opacity-100 scale-100 translate-y-0"
           x-transition:leave="transition ease-in duration-200"
           x-transition:leave-start="opacity-100 scale-100 translate-y-0"
           x-transition:leave-end="opacity-0 scale-95 translate-y-4"
           @click.away="chatOpen = false"
           class="ai-chat-window">
        
        <!-- Header -->
        <div class="ai-chat-header">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                </path>
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-white">Survey AI Assistant</h3>
              <p class="text-xs text-white/70">Powered by GPT-4</p>
            </div>
          </div>
          <button @click="chatOpen = false"
                  class="p-1 hover:bg-white/10 rounded transition-colors">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Chat Body -->
        <div class="ai-chat-body">
          <template x-for="(message, index) in messages" :key="index">
            <div class="mb-4">
              <!-- AI Message -->
              <div x-show="message.type === 'ai'" class="flex items-start">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-800" x-text="message.text"></p>
                  <p class="text-xs text-gray-500 mt-1" 
                     x-text="message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })">
                  </p>
                </div>
              </div>
              
              <!-- Suggestion -->
              <div x-show="message.type === 'suggestion'" 
                   @click="userMessage = message.text"
                   class="ai-suggestion ml-11">
                <span x-text="message.text"></span>
                <svg class="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
              
              <!-- User Message -->
              <div x-show="message.type === 'user'" class="flex items-start justify-end">
                <div class="mr-3 text-right">
                  <p class="text-sm bg-indigo-600 text-white rounded-lg px-4 py-2 inline-block" 
                     x-text="message.text"></p>
                  <p class="text-xs text-gray-500 mt-1" 
                     x-text="message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })">
                  </p>
                </div>
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-medium text-gray-600">You</span>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Typing Indicator -->
          <div x-show="false" class="flex items-center ml-11 mb-4">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
        
        <!-- Input Area -->
        <div class="ai-chat-input-area">
          <div class="flex items-end">
            <textarea 
              x-model="userMessage"
              @keydown.enter.prevent="if(!$event.shiftKey && userMessage.trim()) { 
                messages.push({ type: 'user', text: userMessage, timestamp: new Date() });
                // Simulate AI response
                setTimeout(() => {
                  messages.push({ 
                    type: 'ai', 
                    text: 'That\\'s a great question! Here are some suggestions to improve it...', 
                    timestamp: new Date() 
                  });
                }, 1000);
                userMessage = '';
              }"
              class="flex-1 px-4 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="1"
              placeholder="Ask me anything about surveys..."
              style="min-height: 40px; max-height: 120px;"></textarea>
            <button @click="if(userMessage.trim()) { 
                      messages.push({ type: 'user', text: userMessage, timestamp: new Date() });
                      // Simulate AI response
                      setTimeout(() => {
                        messages.push({ 
                          type: 'ai', 
                          text: 'That\\'s a great question! Here are some suggestions to improve it...', 
                          timestamp: new Date() 
                        });
                      }, 1000);
                      userMessage = '';
                    }"
                    :disabled="!userMessage.trim()"
                    class="ml-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            <kbd class="kbd text-xs">Shift</kbd> + <kbd class="kbd text-xs">Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  `
}