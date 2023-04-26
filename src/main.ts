import { chineseToUnicode, unicodeToChinese } from './utils'

import './style.css'
import { GM_getValue, GM_registerMenuCommand, GM_setValue } from '$'

// 将中文|unicode互转方法挂载
window.chineseToUnicode = chineseToUnicode
window.unicodeToChinese = unicodeToChinese
const nameList = getList()

let count = 0
console.log(count)
const { pathname, search } = location
filter(pathname, search)

function filter(pagePath: string, search: string) {
    let itemClassName: string
    let nameClassName: string
    const timer = setInterval(() => {
        if (pagePath.includes('/v/popular/rank')) {
            itemClassName = '.rank-list>.rank-item'
            nameClassName = '.up-name'
        } else if (pathname === '/all' && search.includes('keyword')) {
            itemClassName = '.video-list .bili-video-card'
            nameClassName = '.bili-video-card__info--author'
        }
        const list = document.querySelectorAll<HTMLElement>(itemClassName)
        list.forEach((el: any) => {
            if (
                nameList
                    .map(unicodeToChinese)
                    .includes(el.querySelector(nameClassName).innerText)
            ) {
                replace(el)
            }
        })
        if (list) {
            clearInterval(timer)
        }
        count++
        if (count >= 5) {
            clearInterval(timer)
            console.log('执行失败，未获取到元素')
        }
    }, 1000)
}

function replace(el: HTMLElement) {
    //代替div块
    const block = document.createElement('div')
    block.className = 'block'
    const href = el.querySelector('a')?.href
    block.innerHTML = `<span>内容令人不适，已被屏蔽。</span><a href='${href}' style='color:gray'>点击前往</a>`
    el.insertBefore(block, el.firstChild)
    /*         let holdtime = 0
             let timer = null
             block.onmouseenter = function (e) { timer = setTimeout(() => { holdtime = 3000 }, 3000) }
             block.onmousemove = function (e) { if (holdtime >= 3000) { e.stopPropagation(); e.target.style.display = 'none' } }
             block.onmouseleave = function (e) {
                 if (timer) { clearTimeout(timer); holdtime = 0 }
                 setTimeout(() => { e.target.style.display = 'flex' }, 2000)
             } */
}

// 获取配置项的值
function getList() {
    // 内置21个典型 默认为unicode
    const nameList = [
        '\\u656C\\u6C49\\u537F',
        '\\u5B9D\\u5251\\u5AC2\\u548C\\u96E8\\u54E5',
        '\\u4F55\\u540C\\u5B66',
        '\\u4E09\\u4EE3\\u9E7F\\u4EBA',
        '\\u62C9\\u5B8F\\u6851',
        '\\u67D0\\u5E7B\\u541B',
        '\\u5F90\\u5927\\u867E',
        '\\u5C0F\\u6F6E\\u9662\\u957F',
        '\\u5C0F\\u7FD4\\u54E5',
        '\\u8001\\u756A\\u8304',
        '\\u86CB\\u9EC4\\u6D3E',
        '\\u6556\\u5382\\u957F',
        '\\u6258\\u9A6C\\u65AF\\u5BB6\\u7684',
        '\\u4FAF\\u7FE0\\u7FE0',
        '\\u5F90\\u5927\\u867E\\u54AF',
        '\\u529B\\u5143\\u541B',
        '\\u5728\\u4E0B\\u54F2\\u522B',
        '\\u96E8\\u54E5\\u5230\\u5904\\u8DD1',
        '\\u554A\\u5417\\u7CBD',
        '\\u675C\\u6D77\\u7687',
        '\\u62DC\\u6258\\u4E86\\u5C0F\\u7FD4\\u54E5',
        '\\u4E2D\\u56FD\\u0062\\u006F\\u0079',
        // chineseToUnicode('陈睿')
    ]
    var value = GM_getValue<string[]>('nameList')
    if (!value) {
        GM_setValue('nameList', nameList)
    }
    return value.map(unicodeToChinese) || nameList.map(unicodeToChinese)
}
// 设置配置项的值
function setList(value: string) {
    return GM_setValue('nameList', value.split(',').map(chineseToUnicode))
}
// 注册菜单命令，允许用户设置背景色
GM_registerMenuCommand('黑名单列表', function () {
    var value = prompt('请输入名单:（英,文,逗,号,隔,开）', getList().toString())
    if (value !== null) {
        setList(value)
        createNoti(`已添加,目前共${value.split(',').length}个,刷新后生效`, {
            backgroundColor: '#f0f9eb',
            color: '#67c23a',
        })
    }
})

var timer: number | NodeJS.Timeout
function createNoti(
    text: string,
    styleObj: Partial<CSSStyleDeclaration>
) {
    if (timer) clearTimeout(timer)
    if (!window.noti) {
        let div = document.createElement('div')
        div.className = 'notice'
        styleObj && Object.assign(div.style, styleObj)
        window.noti = div
        div.innerHTML = `&nbsp;&nbsp;${text}&nbsp;&nbsp;`
        //document.body.appendChild(div)
        const ele =
            document.querySelector('.bpx-player-video-wrap') ||
            document.querySelector('#playerWrap') ||
            document.body
        ele && ele.appendChild(div)
    } else {
        window.noti.style.maxWidth = '9999px'
        window.noti.innerText = text
    }
    timer = setTimeout(function () {
        window.noti.style.maxWidth = '0'
    }, 2300)
}
