"use client";

import { useSyncExternalStore } from "react";
import { Volume2Icon, VolumeXIcon } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, subscribeSound } from "@/lib/sound";
import { iconButton } from "./theme-toggle";
import { useI18n } from "@/lib/locale-client";
import { Tooltip } from "./tooltip";

export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, isSoundEnabled, () => true);
  const { dict } = useI18n();
  const label = on ? dict.sound.mute : dict.sound.unmute;
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={!on}
        className={iconButton}
        onClick={() => void setSoundEnabled(!on)}
      >
        {on ? (
          <Volume2Icon className="size-4" />
        ) : (
          <VolumeXIcon className="size-4" />
        )}
      </button>
    </Tooltip>
  );
}
