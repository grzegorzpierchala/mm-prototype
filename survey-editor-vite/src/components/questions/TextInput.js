// Text Input Question Component
export function renderTextInput(question) {
  return `
    <div class="question-card" x-data="{ editing: false }">
      <!-- Question Header -->
      <div class="flex items-center gap-3 mb-4">
        <span class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
          Text Input
        </span>
        <input 
          type="text" 
          x-model="$store.survey.questions.find(q => q.id === '${question.id}').questionNumber"
          class="flex-1 text-base font-medium text-gray-500 bg-transparent border-0 focus:bg-gray-50 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Q1, A1, 1.1, etc."
        >
      </div>
      
      <!-- Question Text -->
      <input 
        type="text"
        x-model="$store.survey.questions.find(q => q.id === '${question.id}').text"
        class="text-lg font-medium text-gray-900 mb-4 w-full bg-transparent border-0 focus:bg-gray-50 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your question here..."
      >
      
      <!-- Preview of Input Field -->
      <div class="mt-4">
        <input 
          type="text"
          :placeholder="$store.survey.questions.find(q => q.id === '${question.id}').settings.placeholder"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          disabled
        >
        <div class="mt-2 text-sm text-gray-500 text-right">
          <span>0</span> / <span x-text="$store.survey.questions.find(q => q.id === '${question.id}').settings.maxLength"></span> characters
        </div>
      </div>
      
      <!-- Question Actions -->
      <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="duplicateQuestion('${question.id}')" class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
        <button @click="removeQuestion('${question.id}')" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  `
}

// Component configuration
export const textInputConfig = {
  id: 'text_input',
  name: 'Short Text',
  icon: '💬',
  defaultSettings: {
    placeholder: 'Type your answer here...',
    maxLength: 200,
    required: false,
    validation: {
      pattern: '',
      customError: ''
    }
  }
}