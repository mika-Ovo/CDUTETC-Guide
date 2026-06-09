---
title: 投稿指南
---

# 投稿指南

感谢你愿意为成理工程 生存指南&飞跃手册 贡献内容，本页面介绍如何投稿。

## 投稿方式

### 方式一：GitHub Pull Request（推荐）

1. Fork 本仓库
2. 在对应目录下创建新的 Markdown 文件
3. 参考 [生存指南模板](/templates/survival-entry.md) 或 [飞跃手册模板](/templates/leap-entry.md) 编写内容
4. 提交 Pull Request
5. 等待审核合并后自动上线

### 方式二：邮件投稿

如果你不熟悉 Git 操作，可以将内容以 Word 或 Markdown（推荐）文档形式发送至邮箱，由维护者代为上架。

投稿邮箱：cdutetc.tieba@outlook.com

## 文件命名规范

- 使用英文短横线命名（kebab-case）
- 简短且有意义
- 示例：`postgraduate-experience.md`、`dorm-life-guide.md`
- 若是通过邮箱投稿，请标明投稿内容的所属分区，方便编者调整

## Frontmatter 说明

每个 Markdown 文件顶部需要填写 frontmatter 元数据：

```yaml
---
title: 文章标题 # 必填
order: 1 # 排序权重，数字越小越靠前
description: 简要描述 # 用于 SEO
author: 作者名 # 飞跃手册文章建议填写
date: 2024-01-01 # 发布日期
---
```

## 内容规范

- 使用 Markdown 语法
- 保持客观真实
- 尊重他人隐私
- 不包含敏感或违规内容

## 联系方式

如有问题，请通过 GitHub Issues 反馈。
