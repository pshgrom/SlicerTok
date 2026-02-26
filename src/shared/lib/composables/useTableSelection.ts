import { computed } from 'vue'

/**
 * Двусторонний binding выбранных id в таблице (checkbox).
 * Используется в таблицах с мультивыбором (например TableAdminPaymentsFinance, TableAdminProcessPayments).
 */
export function useTableSelection(
  getSelectedIds: () => (string | number)[],
  setSelectedIds: (val: (string | number)[]) => void
) {
  return computed({
    get: getSelectedIds,
    set: setSelectedIds
  })
}
