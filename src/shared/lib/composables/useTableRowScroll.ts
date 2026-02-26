import type { Ref } from 'vue'
import { nextTick, watch } from 'vue'

/**
 * При изменении выбранной строки (selectedIndex) прокручивает таблицу к этой строке.
 * Используется в таблицах с side panel, когда выбранная строка подсвечивается и должна быть в зоне видимости.
 */
export function useTableRowScroll(
  tableRef: Ref<{ $el?: HTMLElement } | null>,
  getSelectedIndex: () => number
) {
  watch(
    () => getSelectedIndex(),
    async (newIndex) => {
      if (newIndex < 0) return
      await nextTick()
      const rowEl = tableRef.value?.$el?.querySelector(`#row-${newIndex}`)
      if (rowEl) {
        rowEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    },
    { immediate: false }
  )
}
