# Markdown Numbering Tools

`mntools`，一个用于给Markdown文本添加序号的工具。

## 安装

```shell
$ npm install -g mntools
```

## 添加标题序号

### 添加简单序号

对于示例markdown文本：

```markdown
# Markdown Numbering Tools
some text

## AAAA

### bbbb

## CCCC

### DDDD
```

如果需要给markdown的各级标题添加形如`1.2.1`的简单序号，只需要执行下列命令即可：

```shell
$ nmtools header input.md
```

命令将输出：

```markdown
# 1. Markdown Numbering Tools
some text

## 1.1. AAAA

### 1.1.1. bbbb

## 1.2. CCCC

### 1.2.1. DDDD
```

### 跳过一级标题

大部分情况下，一级标题会作为文章标题存在，所以一个markdown文件只有一个一级标题，如果想跳过一级标题的话，使用 `-k ` 即可：

```shell
$ nmtools header input.md -k 1
# Markdown Numbering Tools
some text

## 1. AAAA

### 1.1. bbbb

## 2. CCCC

### 2.1. DDDD
```

### 按标题等级采用不同格式

在论文或者其他比较正式的文本时，常常有要求一级标题采用 `第一章` 这样的格式，二级标题采用 `1.1.` 这样的格式。论文看多了感觉这样的格式还挺好看的，mntools提供的自定义格式功能可用于实现这样的编号。

在介绍自定义格式之前，先介绍两个概念：序列（Series）和格式（Pattern）

一个Series就是一个带名字的字符串列表，用于表示各种形式的数字，mntools内置的Series有：

|序列名|序列|
|-|-|
|num|[0, 1, 2, 3, 4, 5, ....]|
|chinese| [零, 一, 二, 三, 四, ....]|
|roman| [0, I, II, III, IV, ....]|
|circle_num| [⓪, ①, ②, ③, ④, ....]|

一个Pattern是对如何编号的描述，由一系列键值对组成，键为标题的级别，值为对应标题应该采用的格式，形式如下：
```
{
    "1": "{chinese}、",
    "2": "{num}.{num}."
}
```

上述Pattern的含义是，`"1"`级标题采用 `chinese` Series中的数字，并且后面跟上一个 `、`; `"2"`级标题中第一个序号采用 `num` Series，第二个需要也采用 `num` Series，后面均添加一个 `.`

例如，要想实现以及标题采用 `第一章 ` 的格式，其余标题采用 `1.1.` 的格式，只需要如下编辑pattern文件，示例见[patterns.example.json](patterns.example.json):

```json
{
    "1": "第{chinese}章 "
}
```

在添加标题时，运行如下命令即可：

```shell
$ mntools header input.md -p patterns.json
```

```markdown
# 第一章  Markdown Numbering Tools
some text

## 1.1. AAAA

### 1.1.1. bbbb

## 1.2. CCCC

### 1.2.1. DDDD
```

如果需要增加自定义序列，也可以通过`-s`参数传入序列，序列书写方式参考[series.example.json](series.example.json)，使用方法示例：

```shell
$ mntools header input.md -p patterns.json -s series.json
```

## 移除标题序号

要移除添加的标题需要，只需要在添加标题序号的命令后加上 `-r` 选项即可，如：

```shell
$ mntools header input.md -r
# Markdown Numbering Tools
some text

## AAAA

### bbbb

## CCCC

### DDDD
```

## 添加图片序号

TODO