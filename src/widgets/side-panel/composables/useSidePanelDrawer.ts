import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface SidePanelDrawerProps {
  isFirst: boolean
  activePanel: boolean
  isLast: boolean
  currentItem: Record<string, unknown>
}

export function useSidePanelDrawer(
  props: SidePanelDrawerProps,
  emit: (e: 'update:activePanel' | 'update:currentItem', ...args: unknown[]) => void
) {
  const initialValue = ref<Record<string, unknown>>({})
  const formRef = ref<{ validate: () => Promise<{ valid: boolean }>; $el?: HTMLElement } | null>(
    null
  )

  const activePanelVal = computed({
    get() {
      return props.activePanel
    },
    set(val: boolean) {
      emit('update:activePanel', val)
    }
  })

  const currentItem = computed({
    get() {
      return props.currentItem
    },
    set(val: Record<string, unknown>) {
      emit('update:currentItem', val)
    }
  })

  watch(
    () => props.activePanel,
    (isOpen) => {
      if (isOpen && props.currentItem && Object.keys(props.currentItem).length) {
        initialValue.value = { ...props.currentItem }
      }
    }
  )

  const resetForm = () => {
    currentItem.value = { ...initialValue.value }
  }

  const closeDialog = () => {
    resetForm()
    activePanelVal.value = false
  }

  const scrollToFirstError = () => {
    const formEl = formRef.value?.$el ?? document.querySelector('.side-panel')
    const invalidField = formEl?.querySelector('.v-input--error, .v-field--error')
    if (invalidField) {
      invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const validateAndScroll = async (): Promise<boolean> => {
    const result = await formRef.value?.validate?.()
    const isValid = result?.valid ?? true
    if (!isValid) {
      scrollToFirstError()
    }
    return isValid
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && activePanelVal.value) {
      closeDialog()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    activePanelVal,
    currentItem,
    formRef,
    initialValue,
    resetForm,
    closeDialog,
    scrollToFirstError,
    validateAndScroll
  }
}
