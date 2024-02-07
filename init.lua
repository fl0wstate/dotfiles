require("settings")
require("plugins")
require("maps")
-- Lua configuration using init.lua
local lspconfig = require('lspconfig')
local null_ls = require("null-ls")
null_ls.setup {
  sources = {
    null_ls.builtins.formatting.pyright,
    -- Add other sources as needed
  },
}
-- Set up Clangd
lspconfig.clangd.setup{
  cmd = {"clangd", "--compile-commands-dir=\"C:/Users/AC/AppData/Local/nvim/lua/compiler_json\""},
  on_attach = function(client, bufnr)
    -- Additional configuration if needed
  end
}
local themeStatus, kanagawa = pcall(require, "kanagawa")

if themeStatus then
        vim.cmd("colorscheme gruvbox")
else
        return
end

-- Substitution
function custom_substitute()
    local search_pattern = vim.fn.input("Enter search pattern: ")
    local replacement_pattern = vim.fn.input("Enter replacement pattern: ")
    local options = vim.fn.input("Enter substitution options (e.g., 'g' for global): ")

    local command = string.format("%%s/%s/%s/%s", vim.fn.escape(search_pattern, '/.*$^~['), vim.fn.escape(replacement_pattern, '/.*$^~['), options)
    vim.api.nvim_command(command)
end

vim.cmd("command! -nargs=0 CustomSubstitute lua custom_substitute()")
