export function chineseToUnicode(str: string) {
    let unicodeStr = ''
    for (let i = 0; i < str.length; i++) {
        const unicode = str.charCodeAt(i).toString(16).toUpperCase()
        unicodeStr += '\\u' + '0'.repeat(4 - unicode.length) + unicode
    }
    return unicodeStr
}
export function unicodeToChinese(str: string) {
    return str.replace(/\\u(\w{4})/g, (_: any, code: string) =>
        String.fromCharCode(parseInt(code, 16))
    )
}
