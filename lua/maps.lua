local function map(mode, lhs, rhs)
        vim.keymap.set(mode, lhs, rhs, {silent = true})
end

local status, telescope = pcall(require, "telescope.builtin")
if status then
        -- telescope
        map("n", "<leader>ff", telescope.find_files)
        map("n", "<leader>fg", telescope.live_grep)
        map("n", "<leader>fb", telescope.buffers)
        map("n", "<leader>fh", telescope.help_tags)
        map("n", "<leader>fs", telescope.git_status)
        map("n", "<leader>fc", telescope.git_commits)
else
        print("Telescope not Found")
end

--Save
map("n", "<leader>w", "<CMD>update<CR>")

--Quit
map("n", "<leader>q", "<CMD>q<CR>")

--Exit insert mode
map("i", "jk", "<ESC>")

--Windows
map("n", "<leader>v", "<CMD>vsplit<CR>")
map("n", "<leader>b", "<CMD>split<CR>")

--NeoTree
map("n", "<leader>e", "<CMD>Neotree toggle<CR>")
map("n", "<leader>o", "<CMD>Neotree focus<CR>")
map("n", "<leader>f", "<CMD>Neotree float<CR>")

--Buffers
map("n", "<TAB>", "<CMD>bnext<CR>")
map("n", "<S-TAB>", "<CMD>bprevious<CR>")

--Terminal
map("n", "<leader>th", "<CMD>ToggleTerm size=10 direction=horizontal<CR>")
map("n", "<leader>tv", "<CMD>ToggleTerm size=80 direction=vertical<CR>")
map("n", "<leader>tf", "<CMD>ToggleTerm<CR>")

--Markdown Preiview
map("n", "<leader>m", "<CMD>MarkdownPreview<CR>")
map("n", "<leader>mn", "<CMD>MarkdownPreviewStop<CR>")

--Window Navigation
map("n", "<C-h>", "<C-w>h")
map("n", "<C-l>", "<C-w>l")
map("n", "<C-k>", "<C-w>k")
map("n", "<C-j>", "<C-w>j")

--Resize Windows
map("n", "<C-Left>", "<C-w><")
map("n", "<C-Right>", "<C-w>>")
map("n", "<C-Up>", "<C-w>+")
map("n", "<C-Down>", "<C-w>-")

--Source New commands
map("n", "<leader>s", "<CMD>%source<CR>")

--Transparency
map("n", "<leader>ts", "<CMD>TransparentToggle<CR>")

--Spelling mstake
map("n", "<leader>sp", "<CMD>setlocal spell! spelllang=en_gb<CR>", { noremap = true })

-- Autocorrect the wholebuffer
map("n", "<leader>,", 'gg=G', { noremap = true })
map("i", "<C-f>", "<CMD>CustomSubstitute<CR>")

