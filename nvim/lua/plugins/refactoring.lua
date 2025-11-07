return {
    -- Incremental rename
    {
        "smjonas/inc-rename.nvim",
        cmd = "IncRename",
        keys = {
            {
                "<leader>rn",
                function()
                    return ":IncRename " .. vim.fn.expand("<cword>")
                end,
                desc = "Incremental rename",
                mode = "n",
                noremap = true,
                expr = true,
            },
        },
        config = true,
    },

    -- Refactoring tool
    {
        "ThePrimeagen/refactoring.nvim",
        keys = {
            {
                "<leader>r",
                function()
                    require("refactoring").select_refactor({
                        show_success_message = true,
                    })
                end,
                mode = "v",
                noremap = true,
                silent = true,
                expr = false,
            },
        },
        opts = {},
    },

    --- Filename Display
    {
        "b0o/incline.nvim",
        dependencies = {},
        event = "BufReadPre",
        priority = 1200,
        config = function()
            local helpers = require("incline.helpers")
            require("incline").setup({
                window = {
                    padding = 0,
                    margin = { horizontal = 0 },
                },
                render = function(props)
                    local filename = vim.fn.fnamemodify(vim.api.nvim_buf_get_name(props.buf), ":t")
                    local ft_icon, ft_color = require("nvim-web-devicons").get_icon_color(filename)
                    local modified = vim.bo[props.buf].modified
                    local buffer = {
                        ft_icon and { " ", ft_icon, " ", guibg = ft_color, guifg = helpers.contrast_color(ft_color) }
                            or "",
                        " ",
                        { filename, gui = modified and "bold,italic" or "bold" },
                        " ",
                        guibg = "#363944",
                    }
                    return buffer
                end,
            })
        end,
    },
}
