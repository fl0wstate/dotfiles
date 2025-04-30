return {
  "voltycodes/areyoulockedin.nvim",
  dependencies = { "nvim-lua/plenary.nvim" },
  event = "VeryLazy",
  config = function()
    require("areyoulockedin").setup({
      session_key = "f9032d8e-b16c-43c1-afc8-043a5ccf6d07",
    })
  end,
}
