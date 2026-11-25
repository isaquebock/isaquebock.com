"use client";

import { play, setEnabled, unlock, type PlayOptions, type SoundName } from "cuelume";

/**
 * Preferência de som do visitante. O cuelume aplica, mas não guarda:
 * guardamos em localStorage e avisamos quem estiver ouvindo (o botão).
 */
const KEY = "sound";
const listeners = new Set<() => void>();
let enabled = true;

export function initSound() {
  enabled = localStorage.getItem(KEY) !== "off";
  setEnabled(enabled);
  listeners.forEach((l) => l());
}

export function isSoundEnabled() {
  return enabled;
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function setSoundEnabled(value: boolean) {
  enabled = value;
  localStorage.setItem(KEY, value ? "on" : "off");
  setEnabled(value);
  listeners.forEach((l) => l());
  if (value) {
    // Ligar o som é um gesto do usuário: o momento certo de liberar o áudio.
    await unlock();
    play("toggle");
  }
}

/** Toca um som respeitando a preferência (o cuelume já ignora quando desligado). */
export function sfx(name: SoundName, options?: PlayOptions) {
  play(name, options);
}
