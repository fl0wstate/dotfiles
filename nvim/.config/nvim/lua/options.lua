require "nvchad.options"

-- add yours here!

local o = vim.o
o.cursorlineopt='both' -- to enable cursorline!
vim.o.winbar = "%{%v:lua.require'nvim-navic'.get_location()%}"
