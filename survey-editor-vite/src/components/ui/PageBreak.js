// Page Break Component - Visual indicator and hover zone
export function PageBreak() {
  return `
    <div x-data="pageBreakComponent()" 
         class="relative group"
         @mouseenter="showButton = true" 
         @mouseleave="showButton = false">
      
      <!-- Hover Zone (invisible by default) -->
      <div class="absolute inset-0 -top-3 -bottom-3 z-10"></div>
      
      <!-- Page Break Button (shows on hover) -->
      <div x-show="showButton" 
           x-transition:enter="transition ease-out duration-200"
           x-transition:enter-start="opacity-0 transform scale-95"
           x-transition:enter-end="opacity-100 transform scale-100"
           x-transition:leave="transition ease-in duration-150"
           x-transition:leave-start="opacity-100 transform scale-100"
           x-transition:leave-end="opacity-0 transform scale-95"
           class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <button @click="insertPageBreak()"
                class="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap">
          + Add page break
        </button>
      </div>
    </div>
  `
}

export function pageBreakComponent() {
  return {
    showButton: false,
    
    insertPageBreak() {
      // Dispatch event to parent component
      this.$dispatch('insert-page-break', {
        afterQuestionId: this.$el.getAttribute('data-after-question-id')
      })
    }
  }
}

// Page Break Indicator Component (shows after insertion)
export function PageBreakIndicator() {
  return `
    <div x-data="{ hovering: false }" 
         @mouseenter="hovering = true" 
         @mouseleave="hovering = false"
         class="relative my-8">
      
      <!-- Page Break Line -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-dashed border-gray-300"></div>
        </div>
        <div class="relative flex justify-center">
          <span class="px-4 bg-gray-50 text-sm text-gray-500">Page break</span>
        </div>
      </div>
      
      <!-- Remove Button (shows on hover) -->
      <button x-show="hovering"
              x-transition:enter="transition ease-out duration-200"
              x-transition:enter-start="opacity-0"
              x-transition:enter-end="opacity-100"
              @click="$dispatch('remove-page-break', { pageBreakId: $el.getAttribute('data-page-break-id') })"
              class="absolute top-0 right-4 text-xs text-gray-400 hover:text-red-500 transition-colors">
        Remove
      </button>
    </div>
  `
}