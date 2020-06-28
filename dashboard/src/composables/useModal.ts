import { ref, readonly } from "vue"
import { useModalMap } from './useModalMap'

const visible = ref(false)

export function useModal(destination) {
  const modalMap = useModalMap()
  if (!modalMap.modalMap[destination]) {
    modalMap.addModal(destination)
  }
  const modal = modalMap.modalMap[destination]

  return {
    getModal: destination => modalMap.modalMap[destination],
    // make it private so that have to use public APIs (show/hide) for interaction / state change
    visible: readonly(modal.visible),
    showModal: () => modal.visible.value = true,
    hideModal: () => modal.visible.value = false,
  }
}
