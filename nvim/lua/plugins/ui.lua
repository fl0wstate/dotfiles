return {
    {
        "catppuccin/nvim",
        lazy = true,
        name = "catppuccin",
        opts = {
            integrations = {
                aerial = true,
                alpha = true,
                cmp = true,
                dashboard = true,
                flash = true,
                fzf = true,
                grug_far = true,
                gitsigns = true,
                headlines = true,
                illuminate = true,
                indent_blankline = { enabled = true },
                leap = true,
                lsp_trouble = true,
                mason = true,
                markdown = true,
                mini = true,
                native_lsp = {
                    enabled = true,
                    underlines = {
                        errors = { "undercurl" },
                        hints = { "undercurl" },
                        warnings = { "undercurl" },
                        information = { "undercurl" },
                    },
                },
                navic = { enabled = true, custom_bg = "lualine" },
                neotest = true,
                neotree = true,
                noice = true,
                notify = true,
                semantic_tokens = true,
                snacks = true,
                telescope = true,
                treesitter = true,
                treesitter_context = true,
                which_key = true,
            },
        },
        specs = {
            {
                "akinsho/bufferline.nvim",
                optional = true,
                opts = function(_, opts)
                    if (vim.g.colors_name or ""):find("catppuccin") then
                        opts.highlights = require("catppuccin.groups.integrations.bufferline").get()
                    end
                end,
            },
        },
    },
    {
        "craftzdog/solarized-osaka.nvim",
        lazy = false,
        priority = 1000,
        opts = {},

        {
            "LazyVim/LazyVim",
            opts = {
                colorscheme = "solarized-osaka",
            },
        },
    },
    {
        "sphamba/smear-cursor.nvim",

        opts = {
            smear_between_buffers = true,
            smear_between_neighbor_lines = true,
            scroll_buffer_space = true,
            legacy_computing_symbols_support = true,
            smear_insert_mode = true,
            trailing_stiffness = 0.2,
            trailing_exponent = 3,
            gamma = 1,
        },
    },
    -- Using lazy.nvim
    {
        "ribru17/bamboo.nvim",
        lazy = false,
        priority = 1000,
        config = function()
            require("bamboo").setup({
                style = "multiplex",
                transparent = true,
                dim_inactive = true,
            })
        end,
    },

    {
        "metalelf0/black-metal-theme-neovim",
        lazy = false,
        priority = 1000,
        config = function()
            require("black-metal").setup({
                theme = "venom",
                variant = "dark",
                transparent = true,
            })
            require("black-metal").load()
        end,
    },
}
