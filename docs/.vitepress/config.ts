import { defineConfig } from 'vitepress'
import { getSidebar } from './utils/sidebar'

export default defineConfig({
  lang: 'zh-CN',
  title: '成理工程生存指南 & 飞跃手册',
  description: '成都理工大学工程技术学院学生生存指南与升学就业经验分享',

  srcExclude: ['superpowers/**', 'templates/**'],
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '生存指南', link: '/survival/' },
      { text: '飞跃手册', link: '/leap/' },
      { text: '投稿指南', link: '/contribute' },
      {
        text: 'GitHub',
        link: 'https://github.com/<username>/CLGC'
      }
    ],

    sidebar: {
      '/survival/': getSidebar('docs/survival'),
      '/leap/': getSidebar('docs/leap')
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/<username>/CLGC' }
    ],

    footer: {
      message: '欢迎投稿，共建585知识库',
      copyright: '成都理工大学工程技术学院'
    },

    editLink: {
      pattern: 'https://github.com/<username>/CLGC/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    }
  }
})
