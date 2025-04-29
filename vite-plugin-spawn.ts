import type { PluginOption } from "vite"

import { spawn, type ChildProcess } from "node:child_process";

export default function pluginSpawn(command: string, args: string[]): PluginOption {
  let proc: ChildProcess | undefined;

  return {
    name: "spawn",
    apply: "serve",
    buildStart() {
      if (!proc) {
        proc = spawn(command, args, {
          stdio: ["ignore", "inherit", "inherit" ],
          shell: true,
        })
      }
    },
    buildEnd() {
      if (proc) {
        proc.kill()
        proc = undefined;
      }
    },
  };
}
