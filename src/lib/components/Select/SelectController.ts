import { type Writable, writable } from "svelte/store";
export default class SelectController {
  public options: Writable<Array<SelectOption>> = writable([]);
  public getOptions() {
    return this.options;
  }
  public RegisterOption(option: SelectOption) {
    this.options.update((options) => [...options, option]);
  }

  private lastKnownId = 0;
  public getId() {
    return this.lastKnownId++;
  }
  public currentOption: Writable<number> = writable(-1);

  public setCurrentOption(value: number) {
    this.currentOption.set(value);
  }

  public opened: Writable<boolean> = writable(false);
  public closeSelect() {
    this.opened.set(false);
  }
}

export type SelectOption = {
  name: string;
  value: string;
};
