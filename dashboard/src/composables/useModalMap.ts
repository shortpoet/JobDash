import { ref } from "vue"
import { Modal } from "../interfaces/common/modal.interface"

const modalMap = ref<Record<string, Modal>>()

export function useModalMap() {

  const addModal = (destination: string) => {
    const modal = new Modal(destination)
    modalMap[destination] = modal
  }

  return {
    modalMap,
    addModal
  }
}