import { writable } from "svelte/store"

export const currentRoute = writable("")

export const flashError = writable("")
export const flashSuccess = writable("")

export function clearFlash() {
  flashError.set("")
  flashSuccess.set("")
}
