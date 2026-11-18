import { createHash } from "node:crypto"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"

// OpenCode compiles a TUI plugin's JSX and maps its solid-js and @opentui imports to the host runtime only for
// files outside node_modules, where package plugins are installed. The entry therefore copies the view to the
// state directory, named by content so an update never reuses a cached module, and loads it from there.
const source = readFileSync(new URL("./tui-view.jsx", import.meta.url), "utf8")
const dir = path.join(process.env.XDG_STATE_HOME || path.join(homedir(), ".local/state"), "merlin-opencode/tui")
const file = path.join(dir, createHash("sha256").update(source).digest("hex").slice(0, 16) + ".jsx")
mkdirSync(dir, { recursive: true })
writeFileSync(file, source)
export default (await import(pathToFileURL(file).href)).default
