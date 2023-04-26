/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />

declare global {
    interface Window {
        chineseToUnicode: Function
        unicodeToChinese: Function
        noti: HTMLElement
    }
}
export {}
