import { defineConfig } from 'vitepress'
import AutoSidebar from "vite-plugin-vitepress-auto-sidebar";
import timeline from "vitepress-markdown-timeline"; 


// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  title: "Lura WebSite",
  description: "一些随笔",
  cleanUrls: true,
  markdown: { 
    //行号显示
    lineNumbers: true, 

    //时间线
    config: (md) => {
      md.use(timeline);
    },
  }, 
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '数据库', link: '/数据库/Mysql高可用实践'},
      { text: 'CICD', link: '/持续集成与持续部署系列/Jenkins讲解' },
      { text: '前端', link: '/前端/发布前端资源到阿里云OSS' },
      { text: '算法', link: '/算法/数据结构' },
      { text: '微服务', link: '/微服务篇/统一微服务日志.md' },
      { text: 'K8S', link: '/kubenetes系列/（一）kubenetes简介.md' },
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
