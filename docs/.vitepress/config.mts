import { defineConfig } from 'vitepress'
import AutoSidebar from "vite-plugin-vitepress-auto-sidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "Lura WebSite",
  description: "一些随笔",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '数据库', link: '/数据库/Mysql高可用实践'},
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      
    ],
  },
  vite: {
    plugins: [
      AutoSidebar({
        ignoreList: ["banner.scss"],
      }),
    ],
  },

})
