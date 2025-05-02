-- This file needs to have same structure as nvconfig.lua
-- https://github.com/NvChad/ui/blob/v2.5/lua/nvconfig.lua
-- Please read that file to know all available options :(

---@type ChadrcConfig
local M = {}
M.base46 = {
  theme = "dark_horizon",
  transparency = true,

  hl_override = {
    Comment = { italic = false },
    ["@comment"] = { italic = false },
  },
}

M.ui = {
  cmp = {
    lspkind_text = true,
    style = "default", -- default/flat_light/flat_dark/atom/atom_colored
    format_colors = {
      tailwind = true,
    },
  },
  telescope = { style = "borderless" },
  statusline = {
    theme = "minimal", -- default/vscode/vscode_colored/minimal
    separator_style = "round",
    order = nil,
    modules = nil,
    -- below are options for separator_style
    -- default/round/block/arrow separators work only for default statusline theme
    -- round and block will work for minimal theme only
  },

  tabufline = {
    enabled = true,
    lazyload = true,
    order = { "treeOffset", "buffers", "tabs", "btns" },
    modules = nil,
  },

  cheatsheet = {
    theme = "simple",                                                   -- simple/grid
    excluded_groups = { "terminal (t)", "autopairs", "Nvim", "Opens" }, -- can add group name or with mode
  },

  mason = { pkgs = {} },
}

M.colorify = {

  enabled = true,
  mode = "virtual", -- fg, bg, virtual
  virt_text = "󱓻 ",
  highlight = { hex = true, lspvars = true },
}
M.lsp = { signature = true }
M.nvdash = {
  load_on_startup = true,

  header = {
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⠨⣺⣤⣾⣿⣿⣥⣥⣥⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⣠⣴⣷⣶⡶⣎⣿⣿⣿⣿⣿⣿⣶⣶⣿⣵⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢐⠀⣆⣼⣷⣽⣿⣿⣿⣿⣿⣿⣿⣿⣋⠛⢃⡀⠰⢹⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢢⣾⣿⣿⡽⡟⣿⣿⣿⣷⣿⣯⣆⣙⡃⡠⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⢟⣿⣏⣟⠀⣂⣿⣿⣿⣿⣿⣿⣟⠦⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡷⣿⣵⡛⠂⠊⡙⣿⡗⣽⢽⣿⣯⣐⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠃⡎⢼⡥⠴⠴⠆⣾⣿⣿⡿⣿⢷⣿⣶⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡑⠁⠘⠶⢿⣯⣿⣿⢫⣿⡠⠈⢻⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠈⢵⣿⣿⣯⣿⣿⡇⠁⠀⢹⣷⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢘⣯⣿⢿⣿⣿⢟⣹⠃⠀⠀⢾⢈⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣺⣿⣽⣿⣿⣣⣿⣯⠠⡗⢀⢼⣞⢽⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣬⣿⣿⢿⣿⣿⣾⣿⡿⢰⡟⠀⣿⡇⢿⣯⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣼⣿⣿⣿⣿⣿⣿⣿⣿⢡⢟⠀⢠⣿⠆⠈⢿⡻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣾⣵⠀⣼⡇⡀⠀⠀⡉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣟⣿⣿⠻⣇⢿⣿⣿⡂⢸⣿⢺⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  },
  sukuna = {
    "⠄⠈⠿⠟⣩⣿⣷⡴⠶⠿⠿⠿⣫⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⣿⣿⣿⠟⠛⢿⣿⣿⣿⡀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠄⠄⠄⠄⠄⠄⠄⠈⠄⠄",
    "⠄⠄⠄⠈⠉⠁⠁⠄⠄⠄⠄⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠰⣿⡿⣿⡀⠄⢸⡿⣿⠿⠃⣀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡂⠄⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣶⣦⣤⡀⢸⣿⣿⣿⠃⠃⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠄⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢻⣿⡇⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⢟⣻⣿⣿⣿⠄⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⣴⣾⣦⠄⠄⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣬⣝⠛⠿⣿⣿⣿⣿⣿⣿⣿⡞⣿⢣⣿⣿⣿⣿⣿⣿⣿⠿⠛⢛⣭⣥⣴⣾⣿⣿⣿⣿⣿⣿⣿⡇⠄⠄⣠⣾⣧⠄⠄⠄",
    "⠄⠄⠄⠄⠰⠋⠉⡻⣄⠄⢸⣿⣿⣿⡛⠛⠻⠿⢿⣟⣻⡿⢉⠄⠄⠄⠄⠉⠉⠻⣿⣿⣿⣶⣿⣿⣿⡿⢋⠉⠄⠄⠄⢀⣿⣿⠿⣿⣿⣿⡿⠿⠿⢿⣿⣿⡇⠄⣴⡋⠄⠘⡇⠄⠄",
    "⠄⠄⠄⠄⡀⢀⡰⠃⠻⡀⢸⣿⣿⣿⡳⣶⣶⣦⣄⣈⡉⠙⠓⠶⢤⣀⣀⠄⠄⠄⢸⣿⣿⣿⣿⣿⣿⣶⠁⠄⣀⣀⡤⠿⠗⠚⠋⠉⢉⣀⣀⣀⠄⢟⢿⣿⡇⣾⡁⠹⣧⣠⡇⠄⠄",
    "⠄⠄⠄⠄⣿⡾⡁⣀⠔⢷⠈⣿⣿⣳⡻⡜⣿⣿⣿⣿⣇⡀⠐⣂⣀⡈⠉⠓⢦⡀⣸⣾⠻⢛⣭⡿⢿⣿⣀⣚⠉⠄⣀⣤⠄⠄⢶⣿⣿⣿⣿⣿⣅⣮⣼⣿⢡⠉⠉⡆⣿⣿⡇⠄⠄",
    "⠄⠄⠄⠄⠘⢷⡽⠁⠄⠄⣦⢟⢿⣷⣧⣌⡲⣟⢟⡻⠿⣿⣿⣿⣿⣿⠶⣤⣕⢱⣟⣻⡃⣨⡟⢃⡸⣿⣿⣟⣠⣾⣿⣿⣷⣶⣾⣿⢿⣿⡩⠞⣡⣣⣿⡟⣿⡄⠄⠁⣿⡿⠃⠄⠄",
    "⠄⠄⠄⠄⠄⠈⢻⣄⠄⠘⣿⡜⣦⡙⢿⣿⣽⣗⣛⣟⣲⣶⣶⣶⣶⣭⣽⣿⢯⡎⢸⣿⡇⣿⣿⡀⢻⢿⣿⣿⣽⣿⣶⣶⣬⣿⣯⢟⣛⣑⣺⣯⣾⡟⠋⠰⠋⠄⠄⣼⡟⠁⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⢿⣦⠄⠄⠙⢻⣿⠸⡏⢘⠻⣿⣿⣿⣿⣿⣟⠿⣿⣿⣿⣿⣧⣾⣿⡇⢸⣿⣷⣿⣞⣿⣿⣿⣿⠿⣻⣿⣿⣿⣿⣿⡿⠛⠋⢻⠇⡜⠄⠄⢀⣴⠃⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠛⣷⣤⣤⣇⡀⣆⣠⢿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣰⣿⣼⣿⣿⠁⢸⣿⣿⣧⣿⣄⣉⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⠿⢻⣄⣠⣼⣶⣿⠟⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠿⣿⣿⡁⠘⠿⢀⣈⣙⣿⣿⣿⣿⣿⣿⣿⣵⣿⣱⣿⣿⡟⢀⠈⣿⣿⣿⡽⣿⣯⣿⣿⣿⣿⣿⣿⣿⣯⣭⣥⡄⠸⠟⠁⠿⠟⠉⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢇⠄⢼⣿⣿⣿⣿⣿⣿⣿⣿⢯⣿⣯⣿⣿⣿⠃⢸⡆⢹⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⡄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠸⣆⠸⣿⣿⣿⣿⣿⣿⣿⡿⣿⣟⣿⣿⣿⡇⢠⣿⣷⠈⢻⣿⣿⣷⢿⣯⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣇⠸⣿⣿⣿⣿⣿⣿⣼⣟⣾⣿⣿⡟⠄⢴⣾⡿⠇⠈⢿⣿⣿⣯⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⢃⡆⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢰⡈⢻⣇⢸⣿⣿⣿⣿⣳⢫⣿⣿⣿⣿⠃⠄⠄⠘⠄⠄⠄⠸⣿⣿⣿⣏⣷⢿⣿⣿⣿⣿⣿⡿⠃⡘⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄",
    "⠄⠄⠄⠄⠄⠄⠄⠄⠄⣠⣀⠄⠄⠄⠘⣧⠄⠹⣆⡘⢻⣿⢿⡟⣿⣿⣿⣿⠃⠄⠄⠄⠄⠄⠄⠄⠄⣿⣿⣿⣿⣻⣧⢿⣿⣿⡿⠋⡠⠈⠄⠄⠄⠄⠄⢀⣦⡤⠄⠄⠄⠄⠄⠄⠄",
    "⣔⣀⠄⠄⢠⢤⣄⣀⠄⠻⢿⣓⠄⠄⠄⢿⣇⠄⠈⢑⣤⢬⡿⣾⣿⣿⣿⠏⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⣿⣿⣿⣷⢿⣿⡝⣋⡰⠎⠁⠄⣰⡆⠄⠄⠠⠿⠛⠁⠄⢿⣇⠄⠄⠄⠄",
    "⢻⣿⣷⣦⡄⠈⠿⣿⣦⣔⠉⠛⠷⡄⠄⢸⣿⣆⠄⢘⣵⣟⣾⣿⣿⣿⡟⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠻⣿⣿⣿⣿⢿⣷⡅⠁⠄⢀⡰⠋⠄⡄⠈⠿⣿⣦⣔⠉⠛⠷⢿⣇⠄⠄",
    ".................................................................",
    "............................邪悪な神社...........................",
  },

  nvchad = {
    "                            ",
    "     ▄▄         ▄ ▄▄▄▄▄▄▄   ",
    "   ▄▀███▄     ▄██ █████▀    ",
    "   ██▄▀███▄   ███           ",
    "   ███  ▀███▄ ███           ",
    "   ███    ▀██ ███           ",
    "   ███      ▀ ███           ",
    "   ▀██ █████▄▀█▀▄██████▄    ",
    "     ▀ ▀▀▀▀▀▀▀ ▀▀▀▀▀▀▀▀▀▀   ",
    "                            ",
    "     Powered By  eovim    ",
    "                            ",
  },

  buttons = {
    { txt = "  Find File", keys = "ff", cmd = "Telescope find_files" },
    { txt = "  Recent Files", keys = "fo", cmd = "Telescope oldfiles" },
    { txt = "󰈭  Find Word", keys = "fw", cmd = "Telescope live_grep" },
    { txt = "󱥚  Themes", keys = "th", cmd = ":lua require('nvchad.themes').open()" },
    { txt = "  Mappings", keys = "ch", cmd = "NvCheatsheet" },
    { txt = "  Config", keys = "cf", cmd = ":cd ~/.config/nvim/" },
    { txt = " Close", keys = "x", cmd = ":qa<CR> " },

    { txt = "─", hl = "NvDashLazy", no_gap = true, rep = true },

    {
      txt = function()
        local stats = require("lazy").stats()
        local ms = math.floor(stats.startuptime) .. " ms"
        return "  Loaded " .. stats.loaded .. "/" .. stats.count .. " plugins in " .. ms
      end,
      hl = "NvDashLazy",
      no_gap = true,
    },

    { txt = "─", hl = "NvDashLazy", no_gap = true, rep = true },
  },
}

M.copilot = {
  i = {
    ["<C-l>"] = {
      function()
        vim.fn.feedkeys(vim.fn['copilot#Accept'](), '')
      end,
      "Copilot Accept",
      { replace_keycodes = true, nowait = true, silent = true, expr = true, noremap = true }
    }
  }
}
function M.set_navic_highlights()
  -- Retrieve existing colors based on the current colorscheme
  local normal_fg = vim.api.nvim_get_hl_by_name("Normal", true).foreground
  local comment_fg = vim.api.nvim_get_hl_by_name("Comment", true).foreground or normal_fg
  local function_fg = vim.api.nvim_get_hl_by_name("Function", true).foreground or normal_fg

  -- Set highlights for `nvim-navic` based on the retrieved colors
  vim.api.nvim_set_hl(0, "NavicText", { fg = normal_fg })
  vim.api.nvim_set_hl(0, "NavicSeparator", { fg = comment_fg })
  vim.api.nvim_set_hl(0, "NavicFunction", { fg = function_fg })
  -- Add more highlights as needed for different `nvim-navic` elements
end

return M
