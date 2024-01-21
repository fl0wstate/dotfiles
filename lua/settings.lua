local global = vim.g
local o = vim.o

vim.scriptingencoding = "utf-8"

-- Map <leader>

global.mapleader = " "
global.maplocalleader = " "

-- Editor options

o.termguicolors = true
o.number = true
o.clipboard = "unnamedplus"
o.syntax = "on"
o.autoindent = true
o.shitfwidth = 2
o.expandtab = true
o.tabstop = 2
o.encoding = "utf-8"
o.title = true
o.showcmd = true
o.showmatch = true
o.splitbelow = "splitright"
o.incomand = "split"
o.wildmenue = true
o.ttimeoutlen = 0
o.hidden = true
o.ruler = true
