require("settings")
require("plugins")
require("maps")
-- Lua configuration using init.lua
local lspconfig = require('lspconfig')

-- Set up Clangd
lspconfig.clangd.setup{
  cmd = {"clangd", "--compile-commands-dir=\"C:/Users/AC/AppData/Local/nvim/lua/compiler_json\""},
  on_attach = function(client, bufnr)
    -- Additional configuration if needed
  end
}
local themeStatus, kanagawa = pcall(require, "kanagawa")

if themeStatus then
        vim.cmd("colorscheme kanagawa")
else
        return
end
