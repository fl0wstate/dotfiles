-- Automatically run : PackerCompile
vim.api.nvim_create_autocmd("BufWritePost", {
	group = vim.api.nvim_create_augroup("PACKER", { clear = true }),
	pattern = "plugins.lua",
	command = "source <afile> | PackerCompile",
})


return require("packer").startup(function(use)
        -- Packer
        use("wbthomason/packer.nvim")

        -- Common utilities
        use("nvim-lua/plenary.nvim")

        -- Icons
        use("nvim-tree/nvim-web-devicons")

        -- Colorscheme
        use("rebelot/kanagawa.nvim")

        -- Statusline
        use({
                "nvim-lualine/lualine.nvim",
                event = "BufEnter",
                config = function()
                        require("configs.lualine")
                end,
                requires = {"nvim-web-devicons"},
        })

        -- Treesitter
        use({
                "nvim-treesitter/nvim-treesitter",
                run = function()
                        require("configs.treesitter")
                end,
        })

        -- Telescope
        use({
                "nvim-telescope/telescope.nvim",
                requires = { {"nvim-lua/plenary.nvim"} },
        })

        -- LSP :) finally
        use({
                "neovim/nvim-lspconfig",
                config = function()
                        require("configs.lsp")
                end,
        })

        use("onsails/lspkind-nvim")
        use({
                "L3MON4D3/LuaSnip",
                tag = "v<CurrentMajor>.*",
        })

        -- cmp: Autocomplete
        use({
                "hrsh7th/nvim-cmp",
                event = "InsertEnter",
                config = function()
                        require("configs.cmp")
                end,
        })

        use("hrsh7th/cmp-nvim-lsp")

        use({"hrsh7th/cmp-path", after = "nvim-cmp"})
        use({"hrsh7th/cmp-buffer", after = "nvim-cmp"})

        -- LSP diagnostics, code actions, and more via lua
        use({
                "jose-elias-alvarez/null-ls.nvim",
                config = function()
                        require("configs.null-ls")
                end,
                requires = {"nvim-lua/plenary.nvim"}
        })

        -- Mason: Portabl package manager
        use({
                "williamboman/mason.nvim",
                config = function()
                        require("mason").setup()
                end
        })

        use({
                "williamboman/mason-lspconfig.nvim",
                config = function()
                        require("configs.mason-lsp")
                end,
                after = "mason.nvim",
        })

        -- File Manageruse
        use({
                "nvim-neo-tree/neo-tree.nvim",
                branch = "v2.x",
                requires = {
                        "nvim-lua/plenary.nvim",
                        "nvim-tree/nvim-web-devicons",
                        "MunifTanjim/nui.nvim",
                },
        })

        -- Show colors
        use({
                "norcalli/nvim-colorizer.lua",
                config = function()
                        require("colorizer").setup({"*"})
                end,
        })

        -- Terminal
        use({
                "akinsho/toggleterm.nvim",
                tag = "*",
                config = function()
                        require("configs.toggleterm")
                end,
        })

        -- Git
        use({
                "lewis6991/gitsigns.nvim",
                config = function()
                        require("configs.gitsigns")
                end,
        })

        -- Markdown Preview
        use({
                "iamcco/markdown-preview.nvim",
                run = function()
                        vim.fn["mkdp#utl#install"]()
                end,
        })

        -- autopairs
        use({
                "windwp/nvim-autopairs",
                config = function()
                        require("configs.autopairs")
                end,
        })

        -- Background Transparent
        use({
                "xiyaowong/nvim-transparent",
                config = function()
                        require("transparent").setup({
                                extra_groups = {
                                "BufferLineTabClose",
                                "BufferlineBufferSelected",
                                "BufferLineFill",
                                "BufferLineBackground",
                                "BufferLineSeparator",
                                "BufferLineIndicatorSelected",
                        },
                        exclude_groups = {},
                })
        end,
})
end)
