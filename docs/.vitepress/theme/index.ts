import DefaultTheme  from "vitepress/theme"
import { useLive2d } from 'vitepress-theme-website'
import { inBrowser } from 'vitepress'
import busuanzi from 'busuanzi.pure.js'


export default {
    extends: DefaultTheme,

    enhanceApp({ app , router }) {
        if (inBrowser) {
          router.onAfterRouteChanged = () => {
            busuanzi.fetch()
          }
        }
      },

    
}