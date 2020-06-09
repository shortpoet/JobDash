import { Moment } from "moment";
import { Ref, readonly, ref } from "vue";

export interface IModal {
  destination: string
  visible: Ref<boolean>
  showModal: Function
  hideModal: Function
}

export class Modal implements IModal {
  destination: string;
  visible: Ref<boolean>
  showModal = () => this.visible.value = true
  hideModal = () => this.visible.value = false
  constructor(destination: string) {
    this.destination = destination
    // make it private so that have to use public APIs (show/hide) for interaction / state change
    this.visible = ref(false)
  }
}

export type Destination = '#delete-contact-modal' | '#delete-task-modal' | '#contact-card-modal' | '#task-card-modal'