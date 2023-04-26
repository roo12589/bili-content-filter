import { PluginOption, UserConfig, defineConfig } from 'vite'
import monkey, { MonkeyOption, MonkeyUserScript } from 'vite-plugin-monkey'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const scriptOption: MonkeyUserScript = {
        name: '哔站过滤 排行榜、搜索结果',
        version: '1.0',
        description: '允许通过配置黑名单列表过滤一些污眼的结果,可以通过油猴内置菜单配置黑名单（页面空白处右击或浏览器右上角油猴扩展悬浮窗口界面）,悬浮在上面可以暂时取消屏蔽，点击前往可以跳转',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'github/roo12589',
        author: 'roo12589',
        match: ['https://www.bilibili.com/v/popular/rank*','https://search.bilibili.com/all*'],
        "run-at": "document-end",
        // updateURL: '',
        // downloadURL: '',
    }

    const option: PluginOption = monkey({
        entry: 'src/main.ts',
        userscript: scriptOption,
    })

    const config: UserConfig = {
        plugins: [option],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
    }
    return config
})
