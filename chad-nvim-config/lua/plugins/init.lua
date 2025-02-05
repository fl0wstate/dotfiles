return {
  {
    "stevearc/conform.nvim",
    -- event = 'BufWritePre', -- uncomment for format on save
    opts = require "configs.conform",
  },

  "nvim-lua/plenary.nvim",

  { "bluz71/vim-moonfly-colors", name = "moonfly", lazy = false, priority = 1000 },

  {
    "zbirenbaum/copilot.lua",
    event = "InsertEnter",
    opts = {
      suggestion = {
        enable = false,
      },
      panel = {
        enable = false,
      },
    },
  },

  {
    "hrsh7th/nvim-cmp",
    dependencies = {
      {
        "zbirenbaum/copilot-cmp",
        config = function()
          require("copilot_cmp").setup()
        end,
      },
    },
    opts = {
      sources = {
        { name = "nvim_lsp", group_index = 2 },
        { name = "copilot",  group_index = 2 },
        { name = "luasnip",  group_index = 2 },
        { name = "buffer",   group_index = 2 },
        { name = "nvim_lua", group_index = 2 },
        { name = "path",     group_index = 2 },
      },
    },
  },

  {
    "nvchad/ui",
    config = function()
      require "nvchad"
    end
  },

  {
    "nvchad/base46",
    lazy = true,
    build = function()
      require("base46").load_all_highlights()
    end,
  },

  {
    "nvimtools/none-ls.nvim",
    event = "VeryLazy",
    opt = function()
      return require "configs.null-ls"
    end,
  },

  -- These are some examples, uncomment them if you want to see them work!
  {
    "neovim/nvim-lspconfig",
    config = function()
      require "configs.lspconfig"
    end,
  },

  {
    "nvim-treesitter/nvim-treesitter",
    opts = {
      ensure_installed = {
        "vim", "lua", "vimdoc",
        "html", "css", "tsx",
        "javascript", "typescript",
      },
    },
  },
  {
    'boganworld/crackboard.nvim',
    dependencies = { 'nvim-lua/plenary.nvim' },
    config = function()
      require('crackboard').setup({
        session_key = '7f74ae9c8913f32dc87d8289a4dc6631412bb9041517b82ba6c1979e954cfee9',
      })
    end,
  },

  {
    "windwp/nvim-ts-autotag",
    ft = {
      "typescript", "javascriptreact",
      "javascript", "typescriptreact",
    },
    config = function()
      require("nvim-ts-autotag").setup()
    end
  },

  {
    "SmiteshP/nvim-navic",
    config = function()
      require("nvim-navic").setup({
        highlight = true,
        separator = " > ",
      })
      local function set_navic_highlights()
        local colors = vim.api.nvim_get_hl(0, { name = "Repeat" }) -- Grabs default Normal highlight
        local fg_color = colors.fg or "#e32e22"                    -- Fallback color if fg is not defined

        -- Define Navic highlight groups
        vim.api.nvim_set_hl(0, "NavicText", { fg = fg_color, bold = true })
        vim.api.nvim_set_hl(0, "NavicSeparator", { fg = fg_color })
      end

      -- Apply the highlight function at startup
      set_navic_highlights()

      -- Apply highlights every time the colorscheme changes
      vim.api.nvim_create_autocmd("ColorScheme", {
        pattern = "*",
        callback = set_navic_highlights,
      })
    end
  },

  {
    -- Add breadcrumbs.nvim
    "LunarVim/breadcrumbs.nvim",
    config = function()
      require("breadcrumbs").setup({
        -- Add your configuration options here
      })
    end,
  },
}
