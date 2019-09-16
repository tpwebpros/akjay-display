import { writable } from "svelte/store"

export const currentRoute = writable("/")

export const flashError = writable("")
export const flashMessage = writable("")

export function clearFlash() {
  flashError.set("")
  flashMessage.set("")
}
