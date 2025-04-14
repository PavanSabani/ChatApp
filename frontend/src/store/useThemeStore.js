import { create } from "zustand";

export const useThemeStore = create((set)=>({
    theme:localStorage.getItem("chat-theme")||"dark",
    setTheme:(theme)=>{
      theme:localStorage.getItem("chat-theme",theme) ;
      set({theme});
    },
}));