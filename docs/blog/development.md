---
title: 开发指南
order: 2
description: 本地开发环境搭建与常用命令
---

# 开发指南

## 环境要求

- Node.js >= 18
- pnpm >= 8

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/cdutetc-tieba/CDUTETC-Guide.git
cd CDUTETC-Guide

# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建生产版本
pnpm docs:build

# 预览构建结果
pnpm docs:preview
```

## 常用命令

| 命令                | 说明                       |
| ------------------- | -------------------------- |
| `pnpm docs:dev`     | 启动开发服务器（热更新）   |
| `pnpm docs:build`   | 构建生产版本               |
| `pnpm docs:preview` | 预览构建结果               |
| `pnpm format`       | 格式化所有 Markdown 文件   |
| `pnpm format:check` | 检查格式是否一致           |
| `pnpm lint`         | 检查 Markdown 规范         |
| `pnpm lint:fix`     | 自动修复 Markdown 规范问题 |

## 目录约定

| 文件/目录      | 说明                                    |
| -------------- | --------------------------------------- |
| `_category.md` | 子目录的元信息（标题、排序）            |
| `index.md`     | 目录的首页内容                          |
| 内容文件       | 使用 kebab-case 命名，如 `exam-tips.md` |

## Frontmatter 规范

```yaml
---
title: 文章标题 # 必填，显示在侧边栏
order: 1 # 排序权重，数字越小越靠前
description: 描述 # 用于 SEO
author: 作者名 # 飞跃手册文章建议填写
date: 2024-01-01 # 发布日期
---
```

## 部署流程

推送到 `main` 分支后，GitHub Actions 自动：

1. 安装依赖
2. 构建站点
3. 部署到 GitHub Pages

网站地址：https://cdutetc-tieba.github.io/CDUTETC-Guide/
