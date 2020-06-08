import { ref, readonly } from "vue"
import { Modal } from "../interfaces/modal.interface"

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