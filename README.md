# ddc-snippy

[Snippy](https://github.com/dcampos/nvim-snippy) source for [ddc.vim](https://github.com/Shougo/ddc.vim)

## Installation

Install using your favorite plugin manager.

## Configuration

Enable ddc-snippy:

```lua
vim.fn['ddc#custom#patch_global']('sources', { 'snippy' })
```

Enable expanding LSP snippets completed by [ddc-source-nvim-lsp](https://github.com/Shougo/ddc-source-nvim-lsp):

```lua
vim.fn["denops#callback#register"](function(body)
  require('snippy').expand_snippet(body)
end)
```
