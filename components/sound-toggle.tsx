"use client";

import { useSyncExternalStore } from "react";
import { Volume2Icon, VolumeXIcon } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, subscribeSound } from "@/lib/sound";
import { iconButton } from "./theme-toggle";

export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, isSoundEnabled, () => true);
  return (
    <button
      type="button"
      aria-label={on ? "Mute sounds" : "Unmute sounds"}
      aria-pressed={!on}
      title={on ? "Mute sounds" : "Unmute sounds"}
      className={iconButton}
      onClick={() => void setSoundEnabled(!on)}
    >
      {on ? <Volume2Icon className="size-4" /> : <VolumeXIcon className="size-4" />}
    </button>
  );
}
