local global = vim.g
local o = vim.o

vim.scriptingencoding = "utf-8"

-- Map <leader>

global.mapleader = " "
global.maplocalleader = " "

-- Editor options

o.termguicolors = true
o.number = true
o.cindent = true
o.autoindent = true
o.smartindent = true
o.clipboard = "unnamedplus"
o.syntax = "off"
o.autoindent = true
o.shiftwidth = 8
o.expandtab = false
o.tabstop = 8
o.encoding = "utf-8"
o.title = true
o.showcmd = true
o.showmatch = true
o.splitbelow = true
o.inccommand = "split"
o.wildmenu = true
o.ttimeoutlen = 0
o.hidden = true
o.ruler = true
