# VitePress 博客站点搭建实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建成都理工大学工程技术学院生存指南 & 飞跃手册的 VitePress 静态网站，包含完整的项目骨架、自动化侧边栏、CI/CD 部署流程。

**Architecture:** 基于 VitePress 1.x 静态网站生成器，使用目录扫描自动生成侧边栏，GitHub Actions 自动构建部署到 GitHub Pages。内容以 Markdown 文件组织，通过 frontmatter 控制排序和元数据。

**Tech Stack:** VitePress 1.x, Vue 3, TypeScript, pnpm, GitHub Actions, Prettier, markdownlint

---

## 文件结构总览

```
CLGC/
├── .github/workflows/
│   ├── deploy.yml
│   └── pr-check.yml
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts
│   │   ├── utils/
│   │   │   └── sidebar.ts
│   │   └── theme/
│   │       ├── index.ts
│   │       └── custom.css
│   ├── index.md
│   ├── survival/
│   │   ├── index.md
│   │   ├── enrollment/
│   │   │   ├── _category.md
│   │   │   ├── report-guide.md
│   │   │   └── packing-list.md
│   │   ├── academics/
│   │   │   ├── _category.md
│   │   │   ├── exam-tips.md
│   │   │   └── gpa-guide.md
│   │   ├── campus-life/
│   │   │   ├── _category.md
│   │   │   └── dorm-life.md
│   │   ├── campus-map/
│   │   │   └── _category.md
│   │   ├── explore/
│   │   │   └── _category.md
│   │   └── faq/
│   │       ├── _category.md
│   │       └── index.md
│   ├── leap/
│   │   ├── index.md
│   │   ├── postgraduate/
│   │   │   └── _category.md
│   │   ├── abroad/
│   │   │   └── _category.md
│   │   ├── employment/
│   │   │   └── _category.md
│   │   └── stories/
│   │       └── _category.md
│   ├── contribute.md
│   ├── templates/
│   │   ├── survival-entry.md
│   │   └── leap-entry.md
│   └── public/
│       └── logo-placeholder.png
├── package.json
├── .gitignore
├── .prettierrc.yaml
├── .markdownlint.yaml
└── .editorconfig
```

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "cdutetc-guide",
  "version": "1.0.0",
  "description": "成都理工大学工程技术学院 生存指南 & 飞跃手册",
  "private": true,
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "format": "prettier --write \"docs/**/*.md\"",
    "format:check": "prettier --check \"docs/**/*.md\"",
    "lint": "markdownlint \"docs/**/*.md\" --ignore node_modules",
    "lint:fix": "markdownlint --fix \"docs/**/*.md\" --ignore node_modules"
  },
  "devDependencies": {
    "vitepress": "^1.6.0",
    "vue": "^3.5.0",
    "prettier": "^3.4.0",
    "markdownlint-cli": "^0.43.0",
    "gray-matter": "^4.0.3"
  },
  "packageManager": "pnpm@9.0.0"
}
```

- [ ] **Step 2: 创建 .gitignore**

```
# Dependencies
node_modules/

# Build output
docs/.vitepress/dist/
docs/.vitepress/cache/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local
```

- [ ] **Step 3: 安装依赖**

```bash
cd /home/jin/CLGC
pnpm install
```

- [ ] **Step 4: 初始化 Git 仓库**

```bash
cd /home/jin/CLGC
git init
git add .
git commit -m "chore: initialize project with package.json and dependencies"
```

---

### Task 2: VitePress 主配置文件

**Files:**
- Create: `docs/.vitepress/config.ts`

- [ ] **Step 1: 创建 config.ts**

```typescript
// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'
import { getSidebar } from './utils/sidebar'

export default defineConfig({
  lang: 'zh-CN',
  title: '成理工程生存指南 & 飞跃手册',
  description: '成都理工大学工程技术学院学生生存指南与升学就业经验分享',

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
```

- [ ] **Step 2: 验证配置文件语法**

```bash
cd /home/jin/CLGC
npx tsc --noEmit docs/.vitepress/config.ts 2>&1 || echo "Expected: will fail until sidebar.ts exists"
```

- [ ] **Step 3: 提交**

```bash
git add docs/.vitepress/config.ts
git commit -m "feat: add VitePress main config"
```

---

### Task 3: 侧边栏自动生成脚本

**Files:**
- Create: `docs/.vitepress/utils/sidebar.ts`

- [ ] **Step 1: 创建 sidebar.ts**

```typescript
// docs/.vitepress/utils/sidebar.ts
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

interface CategoryMeta {
  title: string
  order: number
  collapsed: boolean
}

/**
 * 解析 _category.md 获取分类元信息
 */
function getCategoryMeta(dirPath: string): CategoryMeta {
  const categoryFile = path.join(dirPath, '_category.md')
  const defaults: CategoryMeta = {
    title: path.basename(dirPath),
    order: 99,
    collapsed: false
  }

  if (!fs.existsSync(categoryFile)) {
    return defaults
  }

  const content = fs.readFileSync(categoryFile, 'utf-8')
  const { data } = matter(content)

  return {
    title: data.title || defaults.title,
    order: data.order ?? defaults.order,
    collapsed: data.collapsed ?? defaults.collapsed
  }
}

/**
 * 获取目录下所有 .md 文件（排除 _category.md 和 index.md）
 */
function getMdFiles(dirPath: string): SidebarItem[] {
  const files = fs.readdirSync(dirPath)
  const items: { order: number; item: SidebarItem }[] = []

  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const stat = fs.statSync(fullPath)

    if (
      stat.isFile() &&
      file.endsWith('.md') &&
      file !== '_category.md' &&
      file !== 'index.md'
    ) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      const { data } = matter(content)
      const name = file.replace(/\.md$/, '')

      items.push({
        order: data.order ?? 99,
        item: {
          text: data.title || name,
          link: fullPath.replace(/^docs/, '').replace(/\.md$/, '')
        }
      })
    }
  }

  items.sort((a, b) => a.order - b.order || a.item.text!.localeCompare(b.item.text!))
  return items.map(i => i.item)
}

/**
 * 递归扫描目录生成侧边栏配置
 */
export function getSidebar(dirPath: string): SidebarItem[] {
  const fullDirPath = path.resolve(dirPath)
  const entries = fs.readdirSync(fullDirPath)
  const groups: { order: number; item: SidebarItem }[] = []

  for (const entry of entries) {
    const fullPath = path.join(fullDirPath, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const meta = getCategoryMeta(fullPath)
      const children = getMdFiles(fullPath)

      if (children.length > 0) {
        groups.push({
          order: meta.order,
          item: {
            text: meta.title,
            collapsed: meta.collapsed,
            items: children
          }
        })
      }
    }
  }

  groups.sort((a, b) => a.order - b.order)
  return groups.map(g => g.item)
}
```

- [ ] **Step 2: 提交**

```bash
git add docs/.vitepress/utils/sidebar.ts
git commit -m "feat: add auto sidebar generation from directory structure"
```

---

### Task 4: 主题定制

**Files:**
- Create: `docs/.vitepress/theme/index.ts`
- Create: `docs/.vitepress/theme/custom.css`

- [ ] **Step 1: 创建 theme/index.ts**

```typescript
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme
}
```

- [ ] **Step 2: 创建 theme/custom.css**

```css
/* docs/.vitepress/theme/custom.css */

/* ===== 构成主义 + 简约风格 ===== */

:root {
  /* 主色 - 深蓝系（沉稳、学术感） */
  --vp-c-brand-1: #1a237e;
  --vp-c-brand-2: #3949ab;
  --vp-c-brand-3: #5c6bc0;
  --vp-c-brand-soft: rgba(26, 35, 126, 0.14);

  /* 强调色 - 红/橙（构成主义经典色） */
  --color-accent: #d32f2f;
  --color-accent-light: #ff6659;

  /* 首页 hero 渐变 - 对角线构图 */
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #d32f2f 100%);

  --vp-home-hero-image-background-image: linear-gradient(
    135deg,
    #1a237e40 0%,
    #3949ab30 50%,
    #d32f2f20 100%
  );
  --vp-home-hero-image-filter: blur(44px);
}

.dark {
  --vp-c-brand-1: #5c6bc0;
  --vp-c-brand-2: #3949ab;
  --vp-c-brand-3: #1a237e;
  --vp-c-brand-soft: rgba(92, 107, 192, 0.2);
  --color-accent: #ff6659;
}

/* 构成主义装饰 - h2 标题下划线 */
.vp-doc h2 {
  border-bottom: 3px solid var(--color-accent);
  padding-bottom: 0.5rem;
}

/* 对角线装饰条 - hero 区域 */
.VPHero .name {
  position: relative;
}

.VPHero .name::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 120px;
  height: 4px;
  background: var(--color-accent);
  transform: skewX(-20deg);
}

/* 侧边栏活跃项 - 红色标记 */
.VPSidebarItem.is-active > .item > .indicator {
  background-color: var(--color-accent);
}
```

- [ ] **Step 3: 提交**

```bash
git add docs/.vitepress/theme/
git commit -m "feat: add custom theme with brand colors and dark mode support"
```

---

### Task 5: 首页与版块首页

**Files:**
- Create: `docs/index.md`
- Create: `docs/survival/index.md`
- Create: `docs/leap/index.md`

- [ ] **Step 1: 创建首页 docs/index.md**

```markdown
---
layout: home
hero:
  name: 成理工程生存指南
  text: & 飞跃手册
  tagline: 成都理工大学工程技术学院学生知识库，由同学们共建共享
  actions:
    - theme: brand
      text: 生存指南
      link: /survival/
    - theme: alt
      text: 飞跃手册
      link: /leap/

features:
  - icon: 🎒
    title: 生存指南
    details: 入学须知、学业攻略、校园生活、常见问题，帮你快速适应大学生活
    link: /survival/
  - icon: 🚀
    title: 飞跃手册
    details: 考研、出国、就业经验分享，学长学姐的亲身经历为你指路
    link: /leap/
  - icon: ✍️
    title: 投稿分享
    details: 欢迎每一位同学分享你的经验，帮助后来者少走弯路
    link: /contribute
---
```

- [ ] **Step 2: 创建生存指南首页 docs/survival/index.md**

```markdown
---
layout: doc
title: 生存指南
---

# 生存指南

欢迎来到成理工程生存指南！这里汇集了校园生活的方方面面，帮助你更好地适应和享受大学生活。

## 版块导航

- **入学指南**：新生报到须知、必备物品清单
- **学业相关**：考试备考、绩点计算、图书馆使用
- **校园生活**：宿舍、社团、校园设施
- **常见问题**：FAQ 合集

## 如何贡献

如果你有想要分享的内容，欢迎参考 [投稿指南](/contribute) 进行投稿。
```

- [ ] **Step 3: 创建飞跃手册首页 docs/leap/index.md**

```markdown
---
layout: doc
title: 飞跃手册
---

# 飞跃手册

欢迎来到成理工程飞跃手册！这里收录了学长学姐们在升学和就业路上的真实经历与经验。

## 版块导航

- **考研**：备考经验、院校选择、复试技巧
- **出国**：语言考试、选校申请、文书写作
- **就业/实习**：简历面试、行业分享、实习经历
- **个人总结**：各院系同学的经验分享

## 如何贡献

毕业季来临，欢迎分享你的故事！参考 [投稿指南](/contribute) 了解更多。
```

- [ ] **Step 4: 提交**

```bash
git add docs/index.md docs/survival/index.md docs/leap/index.md
git commit -m "feat: add homepage and section index pages"
```

---

### Task 6: 生存指南内容结构

**Files:**
- Create: `docs/survival/enrollment/_category.md`
- Create: `docs/survival/enrollment/report-guide.md`
- Create: `docs/survival/enrollment/packing-list.md`
- Create: `docs/survival/academics/_category.md`
- Create: `docs/survival/academics/exam-tips.md`
- Create: `docs/survival/academics/gpa-guide.md`
- Create: `docs/survival/campus-life/_category.md`
- Create: `docs/survival/campus-life/dorm-life.md`
- Create: `docs/survival/campus-map/_category.md`
- Create: `docs/survival/explore/_category.md`
- Create: `docs/survival/faq/_category.md`
- Create: `docs/survival/faq/index.md`

- [ ] **Step 1: 创建入学指南模块**

```bash
mkdir -p docs/survival/enrollment
```

`docs/survival/enrollment/_category.md`:
```markdown
---
title: 入学指南
order: 1
collapsed: false
---

新生入学相关指南，帮助你顺利完成报到。
```

`docs/survival/enrollment/report-guide.md`:
```markdown
---
title: 报到须知
order: 1
description: 新生报到流程及注意事项
---

# 报到须知

::: tip
本文档正在编写中，欢迎有经验的同学贡献内容。
:::

## 报到时间

<!-- 待补充 -->

## 报到流程

<!-- 待补充 -->

## 需要携带的材料

<!-- 待补充 -->

## 注意事项

<!-- 待补充 -->
```

`docs/survival/enrollment/packing-list.md`:
```markdown
---
title: 必备物品清单
order: 2
description: 新生入学必备物品参考
---

# 必备物品清单

::: tip
本文档正在编写中，欢迎有经验的同学贡献内容。
:::

## 证件类

<!-- 待补充 -->

## 生活用品

<!-- 待补充 -->

## 学习用品

<!-- 待补充 -->
```

- [ ] **Step 2: 创建学业相关模块**

```bash
mkdir -p docs/survival/academics
```

`docs/survival/academics/_category.md`:
```markdown
---
title: 学业相关
order: 2
collapsed: false
---

学业相关的实用信息，包括考试备考、绩点计算、图书馆使用等。
```

`docs/survival/academics/exam-tips.md`:
```markdown
---
title: 考试与备考
order: 1
description: 考试备考经验与技巧
---

# 考试与备考

::: tip
本文档正在编写中，欢迎有经验的同学贡献内容。
:::

## 期末考试

<!-- 待补充 -->

## 备考技巧

<!-- 待补充 -->
```

`docs/survival/academics/gpa-guide.md`:
```markdown
---
title: 学分与绩点
order: 2
description: 学分制度与绩点计算指南
---

# 学分与绩点

::: tip
本文档正在编写中，欢迎有经验的同学贡献内容。
:::

## 学分制度说明

<!-- 待补充 -->

## 绩点计算方法

<!-- 待补充 -->
```

- [ ] **Step 3: 创建校园生活模块**

```bash
mkdir -p docs/survival/campus-life
```

`docs/survival/campus-life/_category.md`:
```markdown
---
title: 校园生活
order: 3
collapsed: false
---

校园生活相关指南，包括宿舍、社团、设施等。
```

`docs/survival/campus-life/dorm-life.md`:
```markdown
---
title: 宿舍生活
order: 1
description: 宿舍生活指南
---

# 宿舍生活

::: tip
本文档正在编写中，欢迎有经验的同学贡献内容。
:::

## 宿舍分布

<!-- 待补充 -->

## 宿舍设施

<!-- 待补充 -->

## 生活 Tips

<!-- 待补充 -->
```

- [ ] **Step 4: 创建后续规划模块（空目录 + _category.md）**

```bash
mkdir -p docs/survival/campus-map
mkdir -p docs/survival/explore
```

`docs/survival/campus-map/_category.md`:
```markdown
---
title: 校园地图
order: 4
collapsed: false
---

校园功能场所标注与介绍（后续规划）。
```

`docs/survival/explore/_category.md`:
```markdown
---
title: 周边探索
order: 5
collapsed: false
---

周边美食与旅游推荐（后续规划）。
```

- [ ] **Step 5: 创建常见问题模块**

```bash
mkdir -p docs/survival/faq
```

`docs/survival/faq/_category.md`:
```markdown
---
title: 常见问题
order: 6
collapsed: false
---

常见问题解答。
```

`docs/survival/faq/index.md`:
```markdown
---
title: FAQ
order: 1
description: 常见问题解答
---

# 常见问题

::: tip
本文档正在编写中，欢迎同学们提出问题并贡献答案。
:::

## 入学相关

<!-- 待补充 -->

## 学业相关

<!-- 待补充 -->

## 生活相关

<!-- 待补充 -->
```

- [ ] **Step 6: 提交**

```bash
git add docs/survival/
git commit -m "feat: add survival guide content structure with category metadata"
```

---

### Task 7: 飞跃手册内容结构

**Files:**
- Create: `docs/leap/postgraduate/_category.md`
- Create: `docs/leap/abroad/_category.md`
- Create: `docs/leap/employment/_category.md`
- Create: `docs/leap/stories/_category.md`

- [ ] **Step 1: 创建考研模块**

```bash
mkdir -p docs/leap/postgraduate
```

`docs/leap/postgraduate/_category.md`:
```markdown
---
title: 考研
order: 1
collapsed: false
---

考研备考经验、院校选择、复试技巧分享。
```

- [ ] **Step 2: 创建出国模块**

```bash
mkdir -p docs/leap/abroad
```

`docs/leap/abroad/_category.md`:
```markdown
---
title: 出国
order: 2
collapsed: false
---

语言考试、选校申请、文书写作经验分享。
```

- [ ] **Step 3: 创建就业/实习模块**

```bash
mkdir -p docs/leap/employment
```

`docs/leap/employment/_category.md`:
```markdown
---
title: 就业/实习
order: 3
collapsed: false
---

简历面试、行业分享、实习经历。
```

- [ ] **Step 4: 创建个人总结模块**

```bash
mkdir -p docs/leap/stories
```

`docs/leap/stories/_category.md`:
```markdown
---
title: 个人总结
order: 4
collapsed: false
---

各院系同学的升学就业经验总结。
```

- [ ] **Step 5: 提交**

```bash
git add docs/leap/
git commit -m "feat: add leap manual content structure with category metadata"
```

---

### Task 8: 投稿模板与指南

**Files:**
- Create: `docs/templates/survival-entry.md`
- Create: `docs/templates/leap-entry.md`
- Create: `docs/contribute.md`

- [ ] **Step 1: 创建生存指南模板**

```bash
mkdir -p docs/templates
```

`docs/templates/survival-entry.md`:
```markdown
---
title: {标题}
category: {分类名称}
order: 99
description: {简要描述}
---

# {标题}

## 简介

<!-- 简要介绍这个话题 -->

## 正文

<!-- 详细内容，可以使用以下格式 -->

### 小标题 1

内容...

### 小标题 2

内容...

## Tips

::: tip
实用小贴士
:::

## 参考资料

<!-- 可选：相关链接或参考资料 -->
```

- [ ] **Step 2: 创建飞跃手册模板**

`docs/templates/leap-entry.md`:
```markdown
---
title: {标题}
author: {作者，可匿名}
department: {院系}
major: {专业}
year: {毕业年份}
destination: {升学/就业去向}
type: {考研|出国|就业}
tags: []
date: {YYYY-MM-DD}
---

# {标题}

## 个人背景

<!-- 基本信息，如 GPA、语言成绩等（可选择性公开） -->

## 准备过程

<!-- 备考/申请的详细时间线和过程 -->

### 阶段一

<!-- 具体内容 -->

### 阶段二

<!-- 具体内容 -->

## 经验总结

<!-- 核心建议，3-5 条 -->

## 踩过的坑

<!-- 值得注意的问题和教训 -->

## 资源推荐

<!-- 推荐的资料、网站、工具等 -->

## 想说的话

<!-- 对学弟学妹的寄语 -->
```

- [ ] **Step 3: 创建投稿指南页面**

`docs/contribute.md`:
```markdown
---
title: 投稿指南
---

# 投稿指南

感谢你愿意为成理工程知识库贡献内容！本页面介绍如何投稿。

## 投稿方式

### 方式一：GitHub Pull Request（推荐）

1. Fork 本仓库
2. 在对应目录下创建新的 Markdown 文件
3. 参考 [生存指南模板](/templates/survival-entry.md) 或 [飞跃手册模板](/templates/leap-entry.md) 编写内容
4. 提交 Pull Request
5. 等待审核合并后自动上线

### 方式二：邮件投稿

如果你不熟悉 Git 操作，可以将内容以 Word 文档形式发送至邮箱，由维护者代为上架。

## 文件命名规范

- 使用英文短横线命名（kebab-case）
- 简短且有意义
- 示例：`postgraduate-experience.md`、`dorm-life-guide.md`

## Frontmatter 说明

每个 Markdown 文件顶部需要填写 frontmatter 元数据：

```yaml
---
title: 文章标题          # 必填
order: 1                 # 排序权重，数字越小越靠前
description: 简要描述     # 用于 SEO
author: 作者名           # 飞跃手册文章建议填写
date: 2024-01-01         # 发布日期
---
```

## 内容规范

- 使用 Markdown 语法
- 保持客观真实
- 尊重他人隐私
- 不包含敏感或违规内容

## 联系方式

如有问题，请通过 GitHub Issues 反馈。
```

- [ ] **Step 4: 提交**

```bash
git add docs/templates/ docs/contribute.md
git commit -m "feat: add contribution templates and guide page"
```

---

### Task 9: 代码质量工具配置

**Files:**
- Create: `.prettierrc.yaml`
- Create: `.markdownlint.yaml`
- Create: `.editorconfig`

- [ ] **Step 1: 创建 .prettierrc.yaml**

```yaml
semi: false
singleQuote: true
tabWidth: 2
trailingComma: 'es5'
printWidth: 100
proseWrap: preserve
overrides:
  - files: '*.md'
    options:
      printWidth: off
```

- [ ] **Step 2: 创建 .markdownlint.yaml**

```yaml
default: true

MD013:
  line_length: 200

MD024:
  siblings_only: true

MD033: false

MD034: false
```

- [ ] **Step 3: 创建 .editorconfig**

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 4: 验证格式检查**

```bash
cd /home/jin/CLGC
pnpm format:check
pnpm lint
```

- [ ] **Step 5: 提交**

```bash
git add .prettierrc.yaml .markdownlint.yaml .editorconfig
git commit -m "chore: add code quality tool configs (prettier, markdownlint, editorconfig)"
```

---

### Task 10: CI/CD 工作流

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `.github/workflows/pr-check.yml`

- [ ] **Step 1: 创建 deploy.yml**

```bash
mkdir -p .github/workflows
```

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm docs:build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 创建 pr-check.yml**

`.github/workflows/pr-check.yml`:
```yaml
name: PR Check

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Check formatting
        run: pnpm format:check

      - name: Lint markdown
        run: pnpm lint

      - name: Build check
        run: pnpm docs:build
```

- [ ] **Step 3: 提交**

```bash
git add .github/workflows/
git commit -m "ci: add deploy and PR check GitHub Actions workflows"
```

---

### Task 11: 构建验证

- [ ] **Step 1: 运行构建**

```bash
cd /home/jin/CLGC
pnpm docs:build
```

Expected: 构建成功，无报错。

- [ ] **Step 2: 本地预览**

```bash
pnpm docs:preview
```

Expected: 访问 http://localhost:4173 可以看到首页，导航栏、侧边栏正常工作。

- [ ] **Step 3: 验证侧边栏自动生成**

检查生存指南页面侧边栏是否显示：
- 入学指南（报到须知、必备物品清单）
- 学业相关（考试与备考、学分与绩点）
- 校园生活（宿舍生活）
- 常见问题（FAQ）

检查飞跃手册页面侧边栏是否显示：
- 考研
- 出国
- 就业/实习
- 个人总结

- [ ] **Step 4: 验证暗色模式**

点击右上角主题切换按钮，确认暗色模式正常工作。

- [ ] **Step 5: 验证搜索功能**

点击搜索按钮，搜索"报到"，确认能找到相关页面。

- [ ] **Step 6: 最终提交**

```bash
git add .
git commit -m "chore: complete VitePress blog setup"
```

---

## 执行说明

本计划共 11 个 Task，预计 30-45 分钟可完成全部搭建。

执行顺序严格按 Task 1 → 11，每个 Task 完成后提交一次 commit。

**选择执行方式：**

1. **Subagent-Driven（推荐）**：每个 Task 派发独立子代理执行，任务间有审查环节
2. **Inline Execution**：在当前会话中按顺序执行所有 Task
