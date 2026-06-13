import DefaultTheme from 'vitepress/theme'
import './style/index.css'
import LatestVersion from './components/LatestVersion.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('LatestVersion', LatestVersion)
  }
}
