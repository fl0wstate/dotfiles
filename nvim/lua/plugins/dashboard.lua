return {
  {
    "goolord/alpha-nvim",
    config = function()
      local alpha = require("alpha")
      local dashboard = require("alpha.themes.dashboard")
      -- Your ASCII art logo

      local logo = [[
  ███████▓    ▒█████  █     █▓██   ██▓
▓██   ▓██▒   ▒██▒  ██▓█░ █ ░█░▒██  ██▒
▒████ ▒██░   ▒██░  ██▒█░ █ ░█  ▒██ ██░
░▓█▒  ▒██░   ▒██   ██░█░ █ ░█  ░ ▐██▓░
░▒█░  ░██████░ ████▓▒░░██▒██▓  ░ ██▒▓░
 ▒ ░  ░ ▒░▓  ░ ▒░▒░▒░░ ▓░▒ ▒    ██▒▒▒
 ░    ░ ░ ▒  ░ ░ ▒ ▒░  ▒ ░ ░  ▓██ ░▒░
 ░ ░    ░ ░  ░ ░ ░ ▒   ░   ░  ▒ ▒ ░░
          ░  ░   ░ ░     ░    ░ ░
                              ░ ░
      ]]
      -- Set header with proper line splitting
      dashboard.section.header.val = vim.split(logo, "\n")

      -- Setup alpha with dashboard config
      alpha.setup(dashboard.config)
    end,
  },
}
