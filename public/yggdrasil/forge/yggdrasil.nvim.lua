-- ᛉ Yggdrasil — a Neovim colourscheme in the palette the whole setup shares.
--
-- The mapping follows the tmux config rather than editor convention, so the
-- two read as one system: violet is the thing you are on, blue is the active
-- boundary, mist is highlighted text, ink is chrome, stone is anything muted.
--
-- Install (no plugin manager):
--   cp yggdrasil.nvim.lua ~/.config/nvim/colors/yggdrasil.lua
--   then in init.lua:  vim.opt.termguicolors = true
--                      vim.cmd.colorscheme("yggdrasil")
--
-- Needs a true-colour terminal. Inside tmux that means the RGB override the
-- bundled yggdrasil.tmux.conf already sets.

vim.cmd("highlight clear")
if vim.fn.exists("syntax_on") == 1 then
  vim.cmd("syntax reset")
end

vim.opt.termguicolors = true
vim.g.colors_name = "yggdrasil"

local p = {
  black = "#0a0a0a", -- deepest, for text on violet
  night = "#0d1117", -- the editor background
  ink = "#1a1a2e", -- borders, chrome, selection
  stone = "#64748b", -- comments, line numbers, anything spent
  volta = "#8b5cf6", -- the accent: keywords, the cursor line number
  volta_light = "#a78bfa", -- types
  mist = "#c4b5fd", -- constants, highlighted text
  lario = "#3b82f6",
  lario_light = "#60a5fa", -- functions, the active boundary
  lario_mist = "#93c5fd",
  slate = "#f3f4f6", -- body text
  berry = "#ef4444", -- errors
  emerald = "#4ade80", -- strings, additions
  amber = "#facc15", -- warnings
}

local function hi(group, spec)
  vim.api.nvim_set_hl(0, group, spec)
end

-- ── Editor chrome ──────────────────────────────────────────────────────────
hi("Normal", { fg = p.slate, bg = p.night })
hi("NormalFloat", { fg = p.slate, bg = p.ink })
hi("FloatBorder", { fg = p.volta, bg = p.ink })
hi("Cursor", { fg = p.night, bg = p.volta })
hi("CursorLine", { bg = p.ink })
hi("CursorColumn", { bg = p.ink })
hi("ColorColumn", { bg = p.ink })
hi("LineNr", { fg = p.ink })
hi("CursorLineNr", { fg = p.volta, bold = true })
hi("SignColumn", { bg = p.night })
hi("VertSplit", { fg = p.ink })
-- The split you are in gets the blue edge, exactly as the pane does in tmux.
hi("WinSeparator", { fg = p.ink })
hi("Visual", { bg = p.ink })
hi("Search", { fg = p.black, bg = p.mist })
hi("IncSearch", { fg = p.black, bg = p.volta })
hi("CurSearch", { fg = p.black, bg = p.volta })
hi("MatchParen", { fg = p.lario_light, bold = true })
hi("Folded", { fg = p.stone, bg = p.ink })
hi("NonText", { fg = p.ink })
hi("Whitespace", { fg = p.ink })
hi("SpecialKey", { fg = p.ink })
hi("Directory", { fg = p.lario_light })
hi("Title", { fg = p.volta, bold = true })
hi("Question", { fg = p.lario_light })
hi("MoreMsg", { fg = p.emerald })
hi("ErrorMsg", { fg = p.berry })
hi("WarningMsg", { fg = p.amber })
hi("ModeMsg", { fg = p.mist })

-- Status and tabs mirror the tmux message bar: ink behind, mist in front.
hi("StatusLine", { fg = p.mist, bg = p.ink })
hi("StatusLineNC", { fg = p.stone, bg = p.night })
hi("TabLine", { fg = p.stone, bg = p.night })
hi("TabLineFill", { bg = p.night })
hi("TabLineSel", { fg = p.black, bg = p.volta, bold = true })
hi("WinBar", { fg = p.mist, bg = p.night })
hi("WinBarNC", { fg = p.stone, bg = p.night })

hi("Pmenu", { fg = p.slate, bg = p.ink })
hi("PmenuSel", { fg = p.black, bg = p.volta, bold = true })
hi("PmenuSbar", { bg = p.ink })
hi("PmenuThumb", { bg = p.volta })

-- ── Syntax ─────────────────────────────────────────────────────────────────
hi("Comment", { fg = p.stone, italic = true })
hi("Constant", { fg = p.mist })
hi("String", { fg = p.emerald })
hi("Character", { fg = p.emerald })
hi("Number", { fg = p.mist })
hi("Boolean", { fg = p.mist })
hi("Float", { fg = p.mist })
hi("Identifier", { fg = p.slate })
hi("Function", { fg = p.lario_light })
hi("Statement", { fg = p.volta })
hi("Conditional", { fg = p.volta })
hi("Repeat", { fg = p.volta })
hi("Label", { fg = p.volta })
hi("Operator", { fg = p.lario_mist })
hi("Keyword", { fg = p.volta })
hi("Exception", { fg = p.berry })
hi("PreProc", { fg = p.volta_light })
hi("Include", { fg = p.volta })
hi("Define", { fg = p.volta_light })
hi("Macro", { fg = p.volta_light })
hi("Type", { fg = p.volta_light })
hi("StorageClass", { fg = p.volta_light })
hi("Structure", { fg = p.volta_light })
hi("Typedef", { fg = p.volta_light })
hi("Special", { fg = p.lario_mist })
hi("SpecialChar", { fg = p.lario_mist })
hi("Delimiter", { fg = p.stone })
hi("Underlined", { fg = p.lario_light, underline = true })
hi("Error", { fg = p.berry })
hi("Todo", { fg = p.black, bg = p.amber, bold = true })

-- ── Diff and version control ───────────────────────────────────────────────
hi("DiffAdd", { fg = p.emerald, bg = p.ink })
hi("DiffChange", { fg = p.amber, bg = p.ink })
hi("DiffDelete", { fg = p.berry, bg = p.ink })
hi("DiffText", { fg = p.mist, bg = p.ink, bold = true })
hi("Added", { fg = p.emerald })
hi("Changed", { fg = p.amber })
hi("Removed", { fg = p.berry })
hi("GitSignsAdd", { fg = p.emerald })
hi("GitSignsChange", { fg = p.amber })
hi("GitSignsDelete", { fg = p.berry })

-- ── Diagnostics ────────────────────────────────────────────────────────────
hi("DiagnosticError", { fg = p.berry })
hi("DiagnosticWarn", { fg = p.amber })
hi("DiagnosticInfo", { fg = p.lario_light })
hi("DiagnosticHint", { fg = p.mist })
hi("DiagnosticOk", { fg = p.emerald })
hi("DiagnosticUnderlineError", { sp = p.berry, undercurl = true })
hi("DiagnosticUnderlineWarn", { sp = p.amber, undercurl = true })
hi("DiagnosticUnderlineInfo", { sp = p.lario_light, undercurl = true })
hi("DiagnosticUnderlineHint", { sp = p.mist, undercurl = true })

-- ── Treesitter ─────────────────────────────────────────────────────────────
hi("@comment", { link = "Comment" })
hi("@keyword", { link = "Keyword" })
hi("@keyword.function", { link = "Keyword" })
hi("@keyword.return", { fg = p.volta, italic = true })
hi("@conditional", { link = "Conditional" })
hi("@repeat", { link = "Repeat" })
hi("@function", { link = "Function" })
hi("@function.call", { link = "Function" })
hi("@function.builtin", { fg = p.lario })
hi("@method", { link = "Function" })
hi("@constructor", { fg = p.volta_light })
hi("@type", { link = "Type" })
hi("@type.builtin", { fg = p.volta_light, italic = true })
hi("@variable", { fg = p.slate })
hi("@variable.builtin", { fg = p.mist, italic = true })
hi("@parameter", { fg = p.lario_mist })
hi("@field", { fg = p.slate })
hi("@property", { fg = p.slate })
hi("@string", { link = "String" })
hi("@string.escape", { fg = p.lario_mist })
hi("@number", { link = "Number" })
hi("@boolean", { link = "Boolean" })
hi("@constant", { link = "Constant" })
hi("@constant.builtin", { fg = p.mist, italic = true })
hi("@operator", { link = "Operator" })
hi("@punctuation.delimiter", { fg = p.stone })
hi("@punctuation.bracket", { fg = p.stone })
hi("@punctuation.special", { fg = p.lario_mist })
hi("@tag", { fg = p.volta })
hi("@tag.attribute", { fg = p.volta_light })
hi("@tag.delimiter", { fg = p.stone })
hi("@text.title", { fg = p.volta, bold = true })
hi("@text.uri", { fg = p.lario_light, underline = true })
hi("@text.emphasis", { italic = true })
hi("@text.strong", { bold = true })

-- ── LSP ────────────────────────────────────────────────────────────────────
hi("LspReferenceText", { bg = p.ink })
hi("LspReferenceRead", { bg = p.ink })
hi("LspReferenceWrite", { bg = p.ink, underline = true })
hi("LspInlayHint", { fg = p.stone, bg = p.night, italic = true })

-- ── Terminal ───────────────────────────────────────────────────────────────
-- The ANSI slots the embedded terminal hands to anything running inside it,
-- so `:terminal` matches the tmux session it is probably sitting in.
vim.g.terminal_color_0 = p.ink
vim.g.terminal_color_1 = p.berry
vim.g.terminal_color_2 = p.emerald
vim.g.terminal_color_3 = p.amber
vim.g.terminal_color_4 = p.lario
vim.g.terminal_color_5 = p.volta
vim.g.terminal_color_6 = p.lario_mist
vim.g.terminal_color_7 = p.slate
vim.g.terminal_color_8 = p.stone
vim.g.terminal_color_9 = p.berry
vim.g.terminal_color_10 = p.emerald
vim.g.terminal_color_11 = p.amber
vim.g.terminal_color_12 = p.lario_light
vim.g.terminal_color_13 = p.volta_light
vim.g.terminal_color_14 = p.mist
vim.g.terminal_color_15 = p.slate
