export default function ValidationError() {
  return `
    <!-- Validation Error Display -->
    <div x-data="{
      questionId: null,
      
      init() {
        // Get question ID from parent context
        this.questionId = this.$el.closest('[data-question-id]')?.getAttribute('data-question-id')
      },
      
      get validation() {
        return this.$store.validation.getValidation(this.questionId)
      },
      
      get hasErrors() {
        return this.$store.validation.hasErrors(this.questionId)
      },
      
      get errors() {
        return this.$store.validation.getErrors(this.questionId)
      },
      
      get showErrors() {
        return this.$store.validation.showErrors
      }
    }"
    x-show="hasErrors && showErrors"
    x-transition:enter="transition ease-out duration-200"
    x-transition:enter-start="opacity-0 transform translate-y-1"
    x-transition:enter-end="opacity-100 transform translate-y-0"
    x-transition:leave="transition ease-in duration-150"
    x-transition:leave-start="opacity-100 transform translate-y-0"
    x-transition:leave-end="opacity-0 transform translate-y-1"
    class="mt-2">
      
      <!-- Single Error -->
      <template x-if="errors.length === 1">
        <div class="flex items-center gap-2 text-sm text-red-600">
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span x-text="errors[0]"></span>
        </div>
      </template>
      
      <!-- Multiple Errors -->
      <template x-if="errors.length > 1">
        <div class="space-y-1">
          <template x-for="error in errors" :key="error">
            <div class="flex items-start gap-2 text-sm text-red-600">
              <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span x-text="error"></span>
            </div>
          </template>
        </div>
      </template>
    </div>
  `
}

// Inline validation indicator for form fields
export function ValidationIndicator() {
  return `
    <div x-data="{
      questionId: null,
      
      init() {
        this.questionId = this.$el.closest('[data-question-id]')?.getAttribute('data-question-id')
      },
      
      get hasErrors() {
        return this.$store.validation.hasErrors(this.questionId)
      },
      
      get isValid() {
        const validation = this.$store.validation.getValidation(this.questionId)
        const response = this.$store.validation.responses[this.questionId]
        return validation.isValid && response !== null && response !== undefined && response !== ''
      }
    }"
    class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
      
      <!-- Error Icon -->
      <div x-show="hasErrors"
           x-transition:enter="transition ease-out duration-200"
           x-transition:enter-start="opacity-0 scale-75"
           x-transition:enter-end="opacity-100 scale-100"
           class="text-red-500">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
      
      <!-- Success Icon -->
      <div x-show="isValid && !hasErrors"
           x-transition:enter="transition ease-out duration-200"
           x-transition:enter-start="opacity-0 scale-75"
           x-transition:enter-end="opacity-100 scale-100"
           class="text-green-500">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
      </div>
    </div>
  `
}

// Validation Summary Component
export function ValidationSummary() {
  return `
    <div x-data="validationSummary()"
    x-show="errorCount > 0"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0 transform -translate-y-2"
    x-transition:enter-end="opacity-100 transform translate-y-0"
    class="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-red-200 p-4 z-50">
      
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-900">
            <span x-text="errorCount"></span> Validation Error<span x-show="errorCount > 1">s</span>
          </h3>
          <p class="mt-1 text-sm text-gray-600">
            Please fix the errors before submitting.
          </p>
          
          <!-- Error Links -->
          <div class="mt-2 space-y-1" x-show="questionsWithErrors.length <= 3">
            <template x-for="questionId in questionsWithErrors" :key="questionId">
              <button @click="scrollToError(questionId)"
                      class="block text-sm text-red-600 hover:text-red-800 hover:underline text-left">
                Jump to <span x-text="$store.survey.questions.find(q => q.id === questionId)?.questionNumber || 'question'"></span>
              </button>
            </template>
          </div>
          
          <!-- Show count if too many errors -->
          <div class="mt-2" x-show="questionsWithErrors.length > 3">
            <button @click="scrollToError(questionsWithErrors[0])"
                    class="text-sm text-red-600 hover:text-red-800 hover:underline">
              Jump to first error
            </button>
          </div>
        </div>
        
        <!-- Close button -->
        <button @click="$el.parentElement.remove()"
                class="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  `
}

// Field wrapper with validation styling
export function ValidatedField() {
  return `
    <div x-data="{
      questionId: null,
      
      init() {
        this.questionId = this.$el.closest('[data-question-id]')?.getAttribute('data-question-id')
      },
      
      get hasErrors() {
        return this.$store.validation.hasErrors(this.questionId)
      },
      
      get fieldClasses() {
        return {
          'border-gray-300 focus:border-blue-500 focus:ring-blue-500': !this.hasErrors,
          'border-red-300 focus:border-red-500 focus:ring-red-500': this.hasErrors
        }
      }
    }">
      <slot></slot>
    </div>
  `
}

