"use client";

import { useSettingsStore } from "@/stores/settingsStore";

export function TimerSettings() {
  const {
    focusDuration, shortBreakDuration, longBreakDuration,
    autoStartBreaks, soundEnabled,
    updateTimerSettings,
  } = useSettingsStore();

  return (
    <div className="flex flex-col gap-5 max-w-sm">
      <label className="form-control">
        <div className="label pb-1">
          <span className="label-text">Focus duration (minutes)</span>
        </div>
        <input
          type="number"
          min={1} max={120}
          value={focusDuration}
          onChange={(e) => updateTimerSettings({ focusDuration: Number(e.target.value) })}
          className="input input-bordered"
        />
      </label>

      <label className="form-control">
        <div className="label pb-1">
          <span className="label-text">Short break (minutes)</span>
        </div>
        <input
          type="number"
          min={1} max={30}
          value={shortBreakDuration}
          onChange={(e) => updateTimerSettings({ shortBreakDuration: Number(e.target.value) })}
          className="input input-bordered"
        />
      </label>

      <label className="form-control">
        <div className="label pb-1">
          <span className="label-text">Long break (minutes)</span>
        </div>
        <input
          type="number"
          min={1} max={60}
          value={longBreakDuration}
          onChange={(e) => updateTimerSettings({ longBreakDuration: Number(e.target.value) })}
          className="input input-bordered"
        />
      </label>

      <div className="flex items-center justify-between">
        <span className="text-sm">Auto-start breaks</span>
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-sm"
          checked={autoStartBreaks}
          onChange={(e) => updateTimerSettings({ autoStartBreaks: e.target.checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm">Timer end sound</span>
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-sm"
          checked={soundEnabled}
          onChange={(e) => updateTimerSettings({ soundEnabled: e.target.checked })}
        />
      </div>

      <p className="text-xs text-base-content/50">Settings are saved automatically to your browser.</p>
    </div>
  );
}
