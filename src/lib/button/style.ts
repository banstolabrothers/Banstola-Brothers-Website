import type { ButtonType } from "@/types/button";

export const BUTTON_STYLES: Record<string, string> = {
  primarybutton:
    "px-5 pt-3 pb-3.5 h-fit rounded-full text-white border-2 border-brand-500 bg-brand-500 border-brand-900 shadow-[3px_3px_0px_0px_rgba(69,30,0,1)]",
  secondarybutton:
    "px-5 pt-3 pb-3.5 h-fit rounded-full text-brand-900 border-2 border-brand-500 hover:bg-brand-100 border-brand-900 shadow-[3px_3px_0px_0px_rgba(69,30,0,1)]",
  whatsapp:
    "px-5 pt-3 pb-3.5 h-fit rounded-full border-2 text-[#1c1e21] bg-[#25d366] border-[#1c1e21] shadow-[3px_3px_0px_0px_rgba(24,30,33,1)]",
  category:
    "flex items-center text-brand-900 rounded-full transition-all duration-200 border-2 border-brand-900 shadow-[4px_4px_0px_0px_rgba(69,30,0,1)]",
};

export const DEFAULT_BUTTON_CLASS =
  "flex gap-2 w-fit justify-center items-center hover:cursor-pointer hover:scale-105 flex-nowrap whitespace-nowrap transition ease-in-out duration-[200ms]";

export const getButtonStyle = (type: ButtonType): string =>
  BUTTON_STYLES[type] ?? "";
