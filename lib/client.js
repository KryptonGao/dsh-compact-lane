window.__ModuleLoader__.load({id:"dsh-compact-lane",factory:(require)=>{var module={exports:{}};var exports=module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  foldModeOf: () => foldModeOf,
  iconColorOf: () => iconColorOf,
  inject: () => inject,
  installStyles: () => installStyles
});
module.exports = __toCommonJS(client_exports);
var import_react8 = require("react");
var import_dsh_client_ui_slots = require("@deepseek-ai/dsh-client-ui-slots");
var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");

// node_modules/.pnpm/@deepseek-ai+dsh-util-workspace-path@0.2.1-rc.2_@deepseek-ai+cordis@4.0.5/node_modules/@deepseek-ai/dsh-util-workspace-path/lib/index.js
var FILE_ADDRESS_PREFIX = "dsh-resource://file/";
function encodeSegment(segment) {
  return encodeURIComponent(segment).replace(/%3A/gi, ":");
}
function encodePath(path) {
  return path.split("/").map(encodeSegment).join("/");
}
function sessionFileAddress(sessionId, path) {
  const normalized = path.replace(/\\/g, "/").replace(/^(?:\.\/)+/, "");
  return `${FILE_ADDRESS_PREFIX}session/${encodeSegment(sessionId)}/${encodePath(normalized)}`;
}
function isWindowsStylePath(value) {
  return /^[A-Za-z]:[/\\]/.test(value) || value.startsWith("\\\\");
}
function isAbsoluteWorkspacePath(path) {
  return path.startsWith("/") || isWindowsStylePath(path);
}
function fileAddressFor(sessionId, cwd, path) {
  const normalized = path.replace(/\\/g, "/");
  if (!isAbsoluteWorkspacePath(normalized)) return sessionFileAddress(sessionId, normalized);
  const root = cwd === void 0 ? "" : cwd.replace(/\\/g, "/").replace(/\/+$/, "");
  if (root !== "" && normalized === root) return sessionFileAddress(sessionId, "");
  if (root !== "" && normalized.startsWith(`${root}/`)) return sessionFileAddress(sessionId, normalized.slice(root.length + 1));
  return sessionFileAddress(sessionId, normalized);
}

// node_modules/.pnpm/diff@8.0.4/node_modules/diff/libesm/diff/base.js
var Diff = class {
  diff(oldStr, newStr, options = {}) {
    let callback;
    if (typeof options === "function") {
      callback = options;
      options = {};
    } else if ("callback" in options) {
      callback = options.callback;
    }
    const oldString = this.castInput(oldStr, options);
    const newString = this.castInput(newStr, options);
    const oldTokens = this.removeEmpty(this.tokenize(oldString, options));
    const newTokens = this.removeEmpty(this.tokenize(newString, options));
    return this.diffWithOptionsObj(oldTokens, newTokens, options, callback);
  }
  diffWithOptionsObj(oldTokens, newTokens, options, callback) {
    var _a;
    const done = (value) => {
      value = this.postProcess(value, options);
      if (callback) {
        setTimeout(function() {
          callback(value);
        }, 0);
        return void 0;
      } else {
        return value;
      }
    };
    const newLen = newTokens.length, oldLen = oldTokens.length;
    let editLength = 1;
    let maxEditLength = newLen + oldLen;
    if (options.maxEditLength != null) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    const maxExecutionTime = (_a = options.timeout) !== null && _a !== void 0 ? _a : Infinity;
    const abortAfterTimestamp = Date.now() + maxExecutionTime;
    const bestPath = [{ oldPos: -1, lastComponent: void 0 }];
    let newPos = this.extractCommon(bestPath[0], newTokens, oldTokens, 0, options);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      return done(this.buildValues(bestPath[0].lastComponent, newTokens, oldTokens));
    }
    let minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
    const execEditLength = () => {
      for (let diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        let basePath;
        const removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
        if (removePath) {
          bestPath[diagonalPath - 1] = void 0;
        }
        let canAdd = false;
        if (addPath) {
          const addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }
        const canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = void 0;
          continue;
        }
        if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
          basePath = this.addToPath(addPath, true, false, 0, options);
        } else {
          basePath = this.addToPath(removePath, false, true, 1, options);
        }
        newPos = this.extractCommon(basePath, newTokens, oldTokens, diagonalPath, options);
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return done(this.buildValues(basePath.lastComponent, newTokens, oldTokens)) || true;
        } else {
          bestPath[diagonalPath] = basePath;
          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }
          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }
      editLength++;
    };
    if (callback) {
      (function exec() {
        setTimeout(function() {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback(void 0);
          }
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        const ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  }
  addToPath(path, added, removed, oldPosInc, options) {
    const last = path.lastComponent;
    if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: { count: last.count + 1, added, removed, previousComponent: last.previousComponent }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: { count: 1, added, removed, previousComponent: last }
      };
    }
  }
  extractCommon(basePath, newTokens, oldTokens, diagonalPath, options) {
    const newLen = newTokens.length, oldLen = oldTokens.length;
    let oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldTokens[oldPos + 1], newTokens[newPos + 1], options)) {
      newPos++;
      oldPos++;
      commonCount++;
      if (options.oneChangePerToken) {
        basePath.lastComponent = { count: 1, previousComponent: basePath.lastComponent, added: false, removed: false };
      }
    }
    if (commonCount && !options.oneChangePerToken) {
      basePath.lastComponent = { count: commonCount, previousComponent: basePath.lastComponent, added: false, removed: false };
    }
    basePath.oldPos = oldPos;
    return newPos;
  }
  equals(left, right, options) {
    if (options.comparator) {
      return options.comparator(left, right);
    } else {
      return left === right || !!options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  }
  removeEmpty(array) {
    const ret = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  castInput(value, options) {
    return value;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenize(value, options) {
    return Array.from(value);
  }
  join(chars) {
    return chars.join("");
  }
  postProcess(changeObjects, options) {
    return changeObjects;
  }
  get useLongestToken() {
    return false;
  }
  buildValues(lastComponent, newTokens, oldTokens) {
    const components = [];
    let nextComponent;
    while (lastComponent) {
      components.push(lastComponent);
      nextComponent = lastComponent.previousComponent;
      delete lastComponent.previousComponent;
      lastComponent = nextComponent;
    }
    components.reverse();
    const componentLen = components.length;
    let componentPos = 0, newPos = 0, oldPos = 0;
    for (; componentPos < componentLen; componentPos++) {
      const component = components[componentPos];
      if (!component.removed) {
        if (!component.added && this.useLongestToken) {
          let value = newTokens.slice(newPos, newPos + component.count);
          value = value.map(function(value2, i) {
            const oldValue = oldTokens[oldPos + i];
            return oldValue.length > value2.length ? oldValue : value2;
          });
          component.value = this.join(value);
        } else {
          component.value = this.join(newTokens.slice(newPos, newPos + component.count));
        }
        newPos += component.count;
        if (!component.added) {
          oldPos += component.count;
        }
      } else {
        component.value = this.join(oldTokens.slice(oldPos, oldPos + component.count));
        oldPos += component.count;
      }
    }
    return components;
  }
};

// node_modules/.pnpm/diff@8.0.4/node_modules/diff/libesm/diff/line.js
var LineDiff = class extends Diff {
  constructor() {
    super(...arguments);
    this.tokenize = tokenize;
  }
  equals(left, right, options) {
    if (options.ignoreWhitespace) {
      if (!options.newlineIsToken || !left.includes("\n")) {
        left = left.trim();
      }
      if (!options.newlineIsToken || !right.includes("\n")) {
        right = right.trim();
      }
    } else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
      if (left.endsWith("\n")) {
        left = left.slice(0, -1);
      }
      if (right.endsWith("\n")) {
        right = right.slice(0, -1);
      }
    }
    return super.equals(left, right, options);
  }
};
var lineDiff = new LineDiff();
function diffLines(oldStr, newStr, options) {
  return lineDiff.diff(oldStr, newStr, options);
}
function tokenize(value, options) {
  if (options.stripTrailingCr) {
    value = value.replace(/\r\n/g, "\n");
  }
  const retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }
  for (let i = 0; i < linesAndNewlines.length; i++) {
    const line = linesAndNewlines[i];
    if (i % 2 && !options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      retLines.push(line);
    }
  }
  return retLines;
}

// src/adapter/tools.ts
function record(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function toolKind(name) {
  if (name === "pwsh" || name === "bash") return "bash";
  return name === "read" || name === "edit" || name === "write" ? name : "other";
}
function appliedDiffs(meta) {
  const diffs = record(meta)?.diffs;
  if (!Array.isArray(diffs)) return [];
  const files = /* @__PURE__ */ new Map();
  for (const value of diffs) {
    const d = record(value);
    if (!d || typeof d.path !== "string" || typeof d.newText !== "string" || !(d.oldText === null || typeof d.oldText === "string"))
      continue;
    const rows = diffLines(d.oldText ?? "", d.newText).flatMap(
      (part) => {
        const lines = part.value.split("\n");
        if (lines.at(-1) === "") lines.pop();
        return lines.map((text) => ({
          kind: part.added ? "add" : part.removed ? "del" : "ctx",
          gutter: "",
          text
        }));
      }
    );
    if (!rows.some((r) => r.kind === "add" || r.kind === "del")) continue;
    const key = d.path.replaceAll("\\", "/");
    const file = files.get(key);
    if (file) file.rows.push({ kind: "gap", gutter: "", text: "" }, ...rows);
    else files.set(key, { path: d.path, rows });
  }
  return [...files.values()];
}
function adaptTool(root, interrupted = false) {
  const settled = "kind" in root;
  const meta = settled ? record(root.meta) : void 0;
  const name = root.name || "\u672A\u77E5\u5DE5\u5177";
  let kind = toolKind(name);
  const neutralWrite = name === "write" && meta?.operation !== "create" && meta?.operation !== "update";
  if (name === "write" && meta?.operation === "update") kind = "edit";
  const path = typeof meta?.path === "string" ? meta.path : root.args.text("file_path");
  const body = settled ? [
    root.content.map((b) => b.type === "text" ? b.text : JSON.stringify(b)).join("\n"),
    root.isError ? root.error?.reason : void 0
  ].filter(Boolean).join("\n") : void 0;
  const todos = root.args.value("todos");
  const plan = name === "todo_write" && Array.isArray(todos) ? todos.flatMap((todo) => {
    const item = record(todo);
    if (!item || typeof item.content !== "string" || !["pending", "in_progress", "completed"].includes(
      String(item.status)
    ))
      return [];
    return [
      {
        text: item.content,
        status: item.status
      }
    ];
  }) : void 0;
  const candidateId = settled && !root.isError ? /^started subagent ([^\s]+)$/.exec(body?.trim() ?? "")?.[1] : void 0;
  return {
    id: root.callId,
    name,
    kind,
    neutralWrite,
    phase: settled ? "result" : root.phase,
    status: settled ? root.isError ? "error" : "done" : interrupted ? "interrupted" : "running",
    activity: {
      command: root.args.text("command"),
      path,
      body,
      diffs: settled && !root.isError ? appliedDiffs(root.meta) : [],
      plan,
      agent: name === "subagent" || name === "subagent_fork" ? {
        description: root.args.text("description") ?? name,
        prompt: root.args.text("prompt") ?? "",
        candidateId
      } : void 0
    }
  };
}

// src/adapter/turn.ts
function adaptTurn(chat, turn) {
  const location = chat.timeline.turns.get(turn);
  const nodes = chat.locations.getTurn(turn).map((key) => chat.nodes.get(key)).filter((n) => n !== void 0);
  const tools = /* @__PURE__ */ new Map();
  for (const n of nodes)
    if (n.kind === "tool-call") tools.set(n.data.root.callId, n.data.root);
  const owners = new Set(
    nodes.flatMap(
      (n) => n.kind === "assistant-step" ? n.data.blocks.flatMap(
        (b) => b.kind === "tool-call" ? [b.callId] : []
      ) : []
    )
  );
  const claimed = /* @__PURE__ */ new Set(), items = [];
  let outputSeen = false, interleaved = false, forkSeq;
  for (const node of nodes) {
    if (node.kind === "user" || node.kind === "steering") {
      interleaved ||= outputSeen;
      items.push({
        type: "user",
        id: node.key,
        time: node.data.time,
        text: node.data.content.flatMap((b) => b.type === "text" ? [b.text] : []).join("\n"),
        images: node.data.content.flatMap(
          (b, i) => b.type === "image" ? [{ id: `${node.key}:${i}`, attachment: b.attachment }] : []
        ),
        files: node.data.content.flatMap(
          (b) => b.type === "file" ? [{ name: b.attachment.name, bytes: b.attachment.bytes }] : []
        )
      });
    } else if (node.kind === "assistant-step") {
      outputSeen = true;
      const { blocks, status } = node.data;
      const owned = blocks.flatMap((block) => {
        if (block.kind !== "tool-call" || claimed.has(block.callId)) return [];
        claimed.add(block.callId);
        const call = tools.get(block.callId);
        return call ? [
          adaptTool(
            call,
            location?.status === "closed" || status === "interrupted"
          )
        ] : [];
      });
      items.push({
        type: "assistant",
        id: node.key,
        message: {
          id: node.key,
          thinking: blocks.flatMap((b) => b.kind === "reasoning" ? [b.text] : []).join("\n\n"),
          text: blocks.flatMap((b) => b.kind === "text" ? [b.text] : []).join("\n\n"),
          tools: owned,
          active: status === "running" && location?.status !== "closed"
        }
      });
    } else if (node.kind === "tool-call" && !owners.has(node.data.root.callId)) {
      items.push({
        type: "assistant",
        id: node.key,
        message: {
          id: node.key,
          thinking: "",
          text: "",
          active: false,
          tools: [adaptTool(node.data.root, location?.status === "closed")]
        }
      });
    } else if (node.kind === "turn-tail" && !node.data.branchUnavailable)
      forkSeq = node.data.seq;
    else if (node.kind === "turn-error")
      items.push({ type: "notice", id: node.key, text: node.data.message });
    else if (node.kind === "turn-max-tokens")
      items.push({ type: "notice", id: node.key, text: "\u5DF2\u8FBE\u5230\u672C\u8F6E\u8F93\u51FA\u9650\u5236" });
  }
  const reason = location?.end?.data.reason.kind;
  if (reason === "aborted" || reason === "interrupted" || reason === "blocked")
    items.push({
      type: "notice",
      id: `turn:${turn}:end`,
      text: reason === "aborted" ? "\u5DF2\u505C\u6B62" : reason === "interrupted" ? "\u672C\u8F6E\u5DF2\u4E2D\u65AD" : "\u672C\u8F6E\u5DF2\u963B\u6B62"
    });
  return {
    id: String(turn),
    items,
    running: location?.status === "open",
    startedAt: location?.start?.time,
    endedAt: location?.end?.time,
    forkSeq,
    interleaved
  };
}

// src/adapter/source.ts
function turnSource(chat, turn) {
  let value = adaptTurn(chat.getSnapshot(), turn);
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      let keys = [], location, stops = [];
      const publish = () => {
        value = adaptTurn(chat.getSnapshot(), turn);
        listener();
      };
      const sync = () => {
        const s = chat.getSnapshot(), next = s.locations.getTurn(turn), loc = s.timeline.turns.get(turn);
        if (next !== keys) {
          stops.forEach((stop2) => stop2());
          keys = next;
          stops = keys.map((key) => s.nodes.source(key).subscribe(publish));
          location = loc;
          publish();
        } else if (loc !== location) {
          location = loc;
          publish();
        }
      };
      const stop = chat.subscribe(sync);
      sync();
      return () => {
        stop();
        stops.forEach((dispose) => dispose());
      };
    }
  };
}

// src/ui/lane.tsx
var import_react4 = require("react");

// src/ui/primitives.tsx
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime = require("react/jsx-runtime");
var paths = {
  chevron: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "9 18 15 12 9 6" }),
  check: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "20 6 9 17 4 12" }),
  x: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m18 6-12 12M6 6l12 12" }) }),
  bash: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "7 9 10 12 7 15" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 15h5" })
  ] }),
  read: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "3" })
  ] }),
  edit: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" }) }),
  write: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M12 12v6M9 15h6" }) }),
  stack: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m12 2 10 5-10 5L2 7Zm-10 10 10 5 10-5M2 17l10 5 10-5" }) }),
  copy: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
  ] }),
  branch: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 3v12M18 9a9 9 0 0 1-9 9" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "18", cy: "6", r: "3" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "6", cy: "18", r: "3" })
  ] }),
  agent: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "8.5", y: "3", width: "7", height: "7", rx: "1.8" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.8" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.8" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 10v2M6.5 14v-2h11v2" })
  ] }),
  other: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" }),
  thinking: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 18h6M10 21.5h4" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2.5a6.5 6.5 0 0 0-3.7 11.85c.45.32.7.8.7 1.35V16h6v-.3c0-.55.25-1.03.7-1.35A6.5 6.5 0 0 0 12 2.5Z" })
  ] }),
  down: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 5v14m-7-7 7 7 7-7" }),
  circle: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12", cy: "12", r: "9" }),
  arrow: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14m-7-7 7 7-7 7" })
};
function Icon({
  name,
  size = 13,
  className = ""
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "svg",
    {
      className,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: name === "chevron" ? 2.5 : 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: paths[name] ?? paths.other
    }
  );
}
function Loader() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "span",
    {
      className: "tool-activity-loader dot-loader",
      role: "status",
      "aria-label": "\u8FD0\u884C\u4E2D",
      children: Array.from({ length: 36 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "i",
        {
          style: {
            "--d": `${((Math.floor(i / 6) + i % 6) * 0.14 % 1 - 1) * 2}s`
          }
        },
        i
      ))
    }
  );
}
function Status({
  status,
  compact = true
}) {
  const state = status === "interrupted" ? "error" : status;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "span",
    {
      className: `content-swap tool-status-swap ${compact ? "compact" : ""} is-${state}`,
      children: state === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "content-swap-current", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {}) }) : state === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "span",
        {
          className: "content-swap-current tool-compact-error",
          role: "img",
          "aria-label": status === "interrupted" ? "\u5DF2\u4E2D\u65AD" : "\u5931\u8D25",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "x", size: 11 })
        }
      ) : !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "content-swap-current tool-status done", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: "check", size: 11 }) }) : null
    }
  );
}
function Collapse({
  open,
  children,
  process = false
}) {
  const [mounted, setMounted] = (0, import_react.useState)(open);
  if (open && !mounted) setMounted(true);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: process ? "time-spent-body" : "tool-collapse",
      "aria-hidden": !open,
      ...!open ? { inert: "" } : {},
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: process ? "time-spent-body-inner" : "tool-collapse-inner",
          children: (mounted || open) && children
        }
      )
    }
  );
}
function Prose({
  text,
  streaming = false
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "md-content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_dsh_client_ui_primitives.MarkdownText,
    {
      text,
      streaming,
      labels: {
        code: { copyLabel: "\u590D\u5236\u4EE3\u7801", copiedLabel: "\u5DF2\u590D\u5236" },
        footnotes: "\u811A\u6CE8"
      }
    }
  ) });
}
function Copy({
  text,
  className = "reply-action",
  label = "\u590D\u5236",
  iconOnly = false
}) {
  const [copied, setCopied] = (0, import_react.useState)(false), [error, setError] = (0, import_react.useState)(false);
  const timer = (0, import_react.useRef)();
  (0, import_react.useEffect)(() => () => clearTimeout(timer.current), []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        type: "button",
        className,
        "aria-label": label,
        title: label,
        onClick: async () => {
          const ok = await (0, import_dsh_client_ui_primitives.writeClipboard)(text);
          setCopied(ok);
          setError(!ok);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            setCopied(false);
            setError(false);
          }, 1400);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { name: copied ? "check" : "copy" }),
          !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: copied ? "\u5DF2\u590D\u5236" : label })
        ]
      }
    ),
    error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { role: "status", className: "lane-action-error", children: "\u590D\u5236\u5931\u8D25" })
  ] });
}
function FileBadge({ path }) {
  const ext = path.split(".").at(-1)?.toLowerCase() ?? "f";
  const colors = {
    ts: "#3178c6",
    tsx: "#3178c6",
    js: "#c7a51b",
    json: "#7d8e36",
    css: "#8d62b5",
    md: "#778399",
    py: "#3a7ba7"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "span",
    {
      className: "file-type-icon lane-file-badge",
      style: { background: colors[ext] ?? "#8b95a7" },
      children: ext.slice(0, 2).toUpperCase()
    }
  );
}
function CodeText({ text }) {
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|export|function|return|await|async|import|from|if|else|throw|new|type|interface|extends|for|of|while|catch|try|default|as)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Z][A-Za-z0-9]*)\b|\b([a-zA-Z_$][\w$]*)(?=\()/gm;
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    parts.push(text.slice(last, m.index));
    const kind = m[1] ? "comment" : m[2] ? "string" : m[3] ? "keyword" : m[4] ? "number" : m[5] ? "type" : "function";
    parts.push(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { color: `var(--syntax-${kind})` }, children: m[0] }, m.index)
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text ? parts : " " });
}
function Fade({
  children,
  className = "",
  contentClass = ""
}) {
  const viewport = (0, import_react.useRef)(null), content = (0, import_react.useRef)(null);
  const [edges, setEdges] = (0, import_react.useState)({ top: 0, bottom: 0 });
  (0, import_react.useLayoutEffect)(() => {
    const v = viewport.current, c = content.current;
    const smooth = (x) => {
      const t = Math.max(0, Math.min(1, x / 24));
      return t * t * (3 - 2 * t);
    };
    const sync = () => setEdges({
      top: smooth(v.scrollTop),
      bottom: smooth(v.scrollHeight - v.clientHeight - v.scrollTop)
    });
    const observer = new ResizeObserver(sync);
    observer.observe(v);
    observer.observe(c);
    v.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => {
      observer.disconnect();
      v.removeEventListener("scroll", sync);
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: `thinking-scroll-shell has-content-edge-blur ${className}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "thinking-scroll-viewport",
        ref: viewport,
        tabIndex: 0,
        role: "region",
        "aria-label": "\u53EF\u5728\u533A\u57DF\u5185\u6EDA\u52A8",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            ref: content,
            className: `stream-prose-block thinking-text ${contentClass}`,
            children
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "thinking-scroll-fade thinking-scroll-fade-top",
        "aria-hidden": "true",
        style: { opacity: edges.top }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "thinking-scroll-fade thinking-scroll-fade-bottom",
        "aria-hidden": "true",
        style: { opacity: edges.bottom }
      }
    )
  ] });
}

// src/ui/fold.ts
var import_react2 = require("react");
var FoldModeContext = (0, import_react2.createContext)("folded");
function useUnfolded() {
  return (0, import_react2.useContext)(FoldModeContext) === "unfolded";
}
function useApplyFoldMode(setOpen) {
  const unfolded = useUnfolded();
  const previous = (0, import_react2.useRef)(unfolded);
  (0, import_react2.useEffect)(() => {
    if (previous.current === unfolded) return;
    previous.current = unfolded;
    setOpen(unfolded);
  }, [unfolded, setOpen]);
}
var IconColorContext = (0, import_react2.createContext)(true);

// src/ui/scroll.ts
var import_react3 = require("react");
function useLaneScroll(identity) {
  const viewport = (0, import_react3.useRef)(null), surface = (0, import_react3.useRef)(null);
  const pinned = (0, import_react3.useRef)(true), [jump, setJump] = (0, import_react3.useState)(false), [scrolling, setScrolling] = (0, import_react3.useState)(false);
  const preserve = (0, import_react3.useCallback)(async (action2) => {
    const v = viewport.current;
    if (!v) return;
    const height = v.scrollHeight, top = v.scrollTop;
    pinned.current = false;
    await action2();
    await new Promise(
      (resolve) => requestAnimationFrame(() => {
        v.scrollTop = top + v.scrollHeight - height;
        resolve();
      })
    );
  }, []);
  const latest = (0, import_react3.useCallback)(() => {
    const v = viewport.current;
    if (v) {
      pinned.current = true;
      v.scrollTop = v.scrollHeight;
      setJump(false);
    }
  }, []);
  (0, import_react3.useLayoutEffect)(() => {
    const v = viewport.current, s = surface.current;
    pinned.current = true;
    let frame = 0, scrollFrame = 0;
    const distance = () => Math.max(0, v.scrollHeight - v.clientHeight - v.scrollTop);
    const scroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const d = distance();
        setJump(d > 64);
      });
    };
    let lastTouch;
    const wheel = (e) => {
      if (e.deltaY < 0) pinned.current = false;
    };
    const touch = (e) => {
      const y = e.touches[0]?.clientY;
      if (y !== void 0 && lastTouch !== void 0 && y > lastTouch)
        pinned.current = false;
      lastTouch = y;
    };
    const touchStart = () => {
      lastTouch = void 0;
    };
    const key = (e) => {
      if (["ArrowUp", "PageUp", "Home"].includes(e.key)) pinned.current = false;
    };
    let previous = v.scrollTop;
    let idle;
    const intent = () => {
      setScrolling(true);
      clearTimeout(idle);
      idle = setTimeout(() => setScrolling(false), 800);
      if (v.scrollTop < previous - 1) pinned.current = false;
      if (distance() <= 16) pinned.current = true;
      previous = v.scrollTop;
      scroll();
    };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pinned.current) v.scrollTop = v.scrollHeight;
        scroll();
      });
    });
    observer.observe(v);
    observer.observe(s);
    v.addEventListener("scroll", intent, { passive: true });
    v.addEventListener("wheel", wheel, { passive: true });
    v.addEventListener("touchstart", touchStart, { passive: true });
    v.addEventListener("touchmove", touch, { passive: true });
    v.addEventListener("keydown", key);
    latest();
    previous = v.scrollTop;
    return () => {
      observer.disconnect();
      clearTimeout(idle);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      v.removeEventListener("scroll", intent);
      v.removeEventListener("wheel", wheel);
      v.removeEventListener("touchstart", touchStart);
      v.removeEventListener("touchmove", touch);
      v.removeEventListener("keydown", key);
    };
  }, [identity, latest]);
  return { viewport, surface, jump, scrolling, latest, preserve };
}

// src/ui/lane.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Lane({
  identity,
  children,
  header,
  page
}) {
  const { viewport, surface, jump, scrolling, latest, preserve } = useLaneScroll(identity);
  const iconColor = (0, import_react4.useContext)(IconColorContext);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "div",
    {
      "data-dsh-compact-lane": "",
      "data-scheme": "light",
      "data-tool-icon-color": iconColor ? "true" : "false",
      "data-conversation-composer-overlay": "",
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "main-chat-view", "data-tool-display": "compact", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "chat-conversation-pane", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            ref: viewport,
            className: `chat-scroll-area${scrolling ? " is-scrolling" : ""}`,
            tabIndex: 0,
            "aria-label": "\u7D27\u51D1\u5BF9\u8BDD",
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { ref: surface, className: "chat-message-surface", children: [
              page && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "button",
                {
                  type: "button",
                  className: "lane-load-older",
                  disabled: page.loading,
                  onClick: () => void preserve(page.load),
                  children: page.loading ? "\u6B63\u5728\u52A0\u8F7D\u2026" : "\u52A0\u8F7D\u66F4\u65E9\u7684\u6D88\u606F"
                }
              ),
              header,
              children
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "button",
          {
            type: "button",
            className: "chat-jump-latest",
            "data-visible": jump ? "true" : "false",
            "aria-hidden": !jump,
            tabIndex: jump ? 0 : -1,
            onClick: latest,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "\u56DE\u5230\u6700\u65B0" }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Icon, { name: "down", size: 11 })
            ]
          }
        )
      ] }) })
    }
  );
}

// src/ui/turn.tsx
var import_react6 = require("react");

// src/adapter/model.ts
function splitPath(path) {
  const n = path.replaceAll("\\", "/"), i = n.lastIndexOf("/");
  return i <= 0 ? { name: path, dir: "" } : { name: n.slice(i + 1), dir: n.slice(0, i) };
}
function splitToolRuns(tools) {
  const runs = [];
  for (const t of tools) {
    const last = runs.at(-1);
    if (t.kind !== "other" && last?.[0].kind !== "other" && last) last.push(t);
    else runs.push([t]);
  }
  return runs;
}
function compactSummaryParts(tools) {
  const counts = /* @__PURE__ */ new Map(), seen = /* @__PURE__ */ new Set();
  for (const t of tools) {
    if (t.kind === "other") continue;
    const group = t.neutralWrite ? "neutral-write" : t.kind;
    const path = t.activity.path?.trim().replaceAll("\\", "/");
    if (t.kind !== "bash" && path) {
      const key = `${group}:${path}`;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    const part = counts.get(group) ?? {
      kind: t.kind,
      neutral: !!t.neutralWrite,
      count: 0
    };
    part.count++;
    counts.set(group, part);
  }
  return [...counts.values()];
}
function diffStat(rows) {
  const added = rows.filter((r) => r.kind === "add").length, removed = rows.filter((r) => r.kind === "del").length;
  return added || removed ? { added, removed } : null;
}
function fileChanges(tools) {
  const files = /* @__PURE__ */ new Map();
  for (const t of tools) {
    if (t.status !== "done") continue;
    for (const d of t.activity.diffs) {
      const stat = diffStat(d.rows);
      if (!stat) continue;
      const key = d.path.replaceAll("\\", "/");
      const file = files.get(key) ?? { path: d.path, added: 0, removed: 0 };
      file.added += stat.added;
      file.removed += stat.removed;
      files.set(key, file);
    }
  }
  return [...files.values()];
}
function totalDiffStat(tools) {
  const files = fileChanges(tools);
  return files.length ? files.reduce(
    (s, f) => ({
      added: s.added + f.added,
      removed: s.removed + f.removed
    }),
    { added: 0, removed: 0 }
  ) : null;
}
function collapseDiffContext(rows) {
  const out = [];
  let before = false, i = 0;
  while (i < rows.length) {
    if (rows[i].kind !== "ctx") {
      before ||= rows[i].kind === "add" || rows[i].kind === "del";
      out.push(rows[i++]);
      continue;
    }
    const start = i;
    while (i < rows.length && rows[i].kind === "ctx") i++;
    const context = rows.slice(start, i);
    if (before && context.length > 3 && rows.slice(i).some((r) => r.kind === "add" || r.kind === "del"))
      out.push(
        context[0],
        { kind: "gap", gutter: "", text: "" },
        context.at(-1)
      );
    else out.push(...context);
  }
  return out;
}
function formatElapsed(ms) {
  const s = Math.max(0, Math.floor(ms / 1e3));
  if (s < 1) return "\u4E0D\u5230 1 \u79D2";
  if (s < 60) return `${s} \u79D2`;
  if (s < 3600) return `${Math.floor(s / 60)} \u5206 ${s % 60} \u79D2`;
  return `${Math.floor(s / 3600)} \u5C0F\u65F6 ${Math.floor(s % 3600 / 60)} \u5206 ${s % 60} \u79D2`;
}

// src/ui/tools.tsx
var import_react5 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var action = (t) => t.neutralWrite ? "\u5DF2\u5199\u5165" : {
  bash: "\u5DF2\u8FD0\u884C",
  read: "\u5DF2\u8BFB\u53D6",
  edit: "\u5DF2\u7F16\u8F91",
  write: "\u5DF2\u521B\u5EFA",
  other: ""
}[t.kind];
function Stat({
  stat,
  className = "tool-compact-stat"
}) {
  return stat && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className, children: [
    stat.added > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "tool-stat-add", children: [
      "+",
      stat.added
    ] }),
    stat.removed > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "tool-stat-del", children: [
      "\u2212",
      stat.removed
    ] })
  ] });
}
function DiffCard({ diff }) {
  const rows = collapseDiffContext(diff.rows);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "section",
    {
      className: "compact-diff-card",
      "aria-label": `${diff.path} \u7684\u6587\u4EF6\u5DEE\u5F02`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("header", { className: "compact-diff-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "compact-diff-card-name", title: diff.path, children: splitPath(diff.path).name }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Stat, { stat: diffStat(diff.rows), className: "compact-diff-card-stat" }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            Copy,
            {
              text: diff.rows.map(
                (r) => r.kind === "gap" ? "\u2026" : `${r.kind === "add" ? "+" : r.kind === "del" ? "-" : " "}${r.text}`
              ).join("\n"),
              label: "\u590D\u5236\u5DEE\u5F02",
              iconOnly: true,
              className: "compact-diff-card-copy"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          Fade,
          {
            className: "compact-diff-scroll-shell",
            contentClass: "compact-diff-scroll-content",
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-sheet tool-sheet-compact-diff", children: rows.map(
              (r, i) => r.kind === "gap" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "div",
                {
                  className: "tool-diff-gap is-compact",
                  role: "separator",
                  "aria-label": "\u7701\u7565\u7684\u4E0A\u4E0B\u6587"
                },
                i
              ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                "div",
                {
                  className: `tool-code-line tool-diff-line ${r.kind}`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "tool-gutter", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-sign", children: r.kind === "add" ? "+" : r.kind === "del" ? "\u2212" : "" }),
                      r.gutter
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-code-text", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CodeText, { text: r.text }) })
                  ]
                },
                i
              )
            ) })
          }
        )
      ]
    }
  );
}
function ToolLine({
  tool: t,
  actions,
  uniform = false
}) {
  const [open, setOpen] = (0, import_react5.useState)(false);
  const { activity: a, kind } = t, path = a.path ?? "", subject = splitPath(path || t.name);
  const stat = totalDiffStat([t]), hasDiff = a.diffs.length > 0, details = hasDiff || t.status === "error" || t.status === "interrupted";
  const toggle = () => setOpen((v) => !v);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: `tool-compact-item tool-kind-${kind}${open ? " open" : ""}`,
      "data-tool": t.id,
      children: [
        kind === "bash" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "button",
          {
            type: "button",
            className: "tool-compact-line",
            "aria-expanded": open,
            "aria-label": "\u5C55\u5F00\u547D\u4EE4\u548C\u8F93\u51FA",
            title: a.command,
            onClick: toggle,
            children: [
              !uniform && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-icon", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "bash" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-action", children: action(t) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-cmd", children: a.command?.replace(/\s+/g, " ").trim() || "\u547D\u4EE4" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "chevron", size: 12, className: "tool-compact-chevron" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Status, { status: t.status })
            ]
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tool-compact-line", children: [
          !uniform && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-icon", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: kind }) }),
          !uniform && (details ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              className: "tool-compact-text-toggle tool-compact-action-toggle",
              onClick: toggle,
              "aria-expanded": open,
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-action", children: action(t) })
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-action", children: action(t) })),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(FileBadge, { path }),
          path ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              className: "tool-compact-name",
              title: `\u9884\u89C8 ${path}`,
              onClick: () => actions.openFile(path),
              children: subject.name
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-name is-static", children: subject.name }),
          subject.dir && (details ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              className: "tool-compact-text-toggle tool-compact-path-toggle",
              onClick: toggle,
              "aria-expanded": open,
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-dir", children: subject.dir })
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-dir", children: subject.dir })),
          details && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "button",
            {
              type: "button",
              className: "tool-compact-detail-toggle",
              "aria-label": open ? "\u6536\u8D77\u6587\u4EF6\u8BE6\u60C5" : "\u5C55\u5F00\u6587\u4EF6\u8BE6\u60C5",
              "aria-expanded": open,
              onClick: toggle,
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "chevron", size: 12, className: "tool-compact-chevron" })
            }
          ),
          !(open && hasDiff) && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Stat, { stat }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Status, { status: t.status })
        ] }),
        (kind === "bash" || details) && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Collapse, { open, children: kind === "bash" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-compact-out", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Fade, { className: "tool-details-scroll", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            className: `tool-terminal${t.status === "error" ? " failed" : ""}`,
            children: [
              a.command && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tool-terminal-cmd", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-terminal-prompt", children: "$" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: a.command })
              ] }),
              a.body ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { className: "tool-terminal-out", children: a.body }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-terminal-wait", children: t.status === "running" ? "\u8FD0\u884C\u4E2D" : t.status === "interrupted" ? "\u5DF2\u4E2D\u65AD" : "\u65E0\u8F93\u51FA" })
            ]
          }
        ) }) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: `tool-compact-file-detail${hasDiff ? " has-diff-preview" : ""}`,
            children: hasDiff ? a.diffs.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DiffCard, { diff: d }, `${d.path}:${i}`)) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-error tool-markdown", children: a.body || "\u5DF2\u4E2D\u65AD" })
          }
        ) })
      ]
    }
  );
}
function ToolGroup({
  tools,
  actions
}) {
  const [open, setOpen] = (0, import_react5.useState)(useUnfolded()), parts = compactSummaryParts(tools);
  useApplyFoldMode(setOpen);
  const initiallySingle = (0, import_react5.useRef)(tools.length === 1);
  const uniform = parts.length === 1 ? parts[0].kind : null;
  const files = [
    ...new Set(
      tools.map((t) => t.activity.path?.replaceAll("\\", "/")).filter((p) => !!p)
    )
  ];
  const sample = uniform === "bash" ? tools[0].activity.command?.replace(/\s+/g, " ").trim() : files.slice(0, 2).map((p) => splitPath(p).name).join(", ") + (files.length > 2 ? ` +${files.length - 2}` : "");
  const label = parts.map(
    (p) => `${p.neutral ? "\u5DF2\u5199\u5165" : { bash: "\u5DF2\u8FD0\u884C", read: "\u5DF2\u8BFB\u53D6", edit: "\u5DF2\u7F16\u8F91", write: "\u5DF2\u521B\u5EFA", other: "" }[p.kind]} ${p.count} ${p.kind === "bash" ? "\u6761\u547D\u4EE4" : "\u4E2A\u6587\u4EF6"}`
  ).join(" \xB7 ");
  const running = tools.some((t) => t.status === "running"), failed = tools.filter(
    (t) => t.status === "error" || t.status === "interrupted"
  ).length;
  const hide = open && (uniform === "edit" || uniform === "write");
  const multiple = tools.length > 1;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: `tool-compact-group tool-kind-${uniform ?? "other"}${!multiple ? " is-single" : ""}${initiallySingle.current ? " no-enter" : ""}${open ? " open" : ""}${running ? " is-running" : ""}`,
      children: [
        multiple && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "button",
          {
            type: "button",
            className: "tool-compact-summary",
            "aria-expanded": open,
            title: label,
            onClick: () => setOpen((v) => !v),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-icon", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: uniform ?? "stack" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-label", children: label }),
              uniform && sample && !hide && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-sample", children: sample }),
              failed > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "tool-compact-failed", children: [
                failed,
                " \u5931\u8D25"
              ] }),
              !hide && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Stat, { stat: totalDiffStat(tools) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "chevron", size: 12, className: "tool-compact-chevron" }),
              running && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Loader, {})
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Collapse, { open: !multiple || open, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: `tool-compact-lines${!multiple ? " is-single" : ""}`, children: tools.map((t) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          ToolLine,
          {
            tool: t,
            actions,
            uniform: multiple && !!uniform
          },
          t.id
        )) }) })
      ]
    }
  );
}
function OtherTool({
  tool: t,
  actions
}) {
  const [open, setOpen] = (0, import_react5.useState)(false), a = t.activity;
  if (a.agent) {
    const id = a.agent.candidateId, agent = id ? actions.agents.get(id) : void 0;
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        className: `tool-compact-item tool-kind-other agent-compact${open ? " open" : ""}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "tool-compact-line agent-compact-line", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
              "button",
              {
                type: "button",
                className: "agent-compact-toggle is-lead",
                "aria-expanded": open,
                onClick: () => setOpen((v) => !v),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-icon", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "agent" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-compact-action", children: "\u5B50\u4EE3\u7406" })
                ]
              }
            ),
            id && agent ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "button",
              {
                type: "button",
                className: "agent-compact-name",
                onClick: () => actions.openAgent(id),
                children: a.agent.description
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "agent-compact-name is-static", children: a.agent.description }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
              "button",
              {
                type: "button",
                className: "agent-compact-toggle is-tail",
                "aria-label": "\u5C55\u5F00\u4EFB\u52A1\u6982\u51B5",
                "aria-expanded": open,
                onClick: () => setOpen((v) => !v),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "chevron", size: 12, className: "tool-compact-chevron" }),
                  agent?.running === true ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Loader, {}) : t.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Status, { status: "error" }) : t.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Loader, {}) : null
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Collapse, { open, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-compact-out agent-compact-out", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            Fade,
            {
              className: "agent-summary-scroll",
              contentClass: "process-thinking-text agent-summary-text",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "agent-summary-task", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Prose, { text: a.agent.prompt }) }),
                a.body && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "agent-summary-report", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Prose, { text: a.body }) })
              ]
            }
          ) }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "article",
    {
      className: `tool-card tool-kind-other is-${t.status}${open ? " open" : ""}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-card-top", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "button",
          {
            type: "button",
            className: "tool-card-head",
            "aria-expanded": open,
            onClick: () => setOpen((v) => !v),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-card-icon", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "other" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-kind-label", children: a.plan ? "\u6267\u884C\u6E05\u5355" : "\u5DE5\u5177" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-card-main", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "tool-card-name grow", children: a.plan?.[0]?.text ?? t.name }) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { name: "chevron", size: 12, className: "tool-chevron" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Status, { status: t.status, compact: false })
            ]
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Collapse, { open, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-card-body", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Fade, { className: "tool-details-scroll", children: a.plan ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "plan-checklist", role: "list", children: a.plan.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            className: `plan-checklist-item is-${p.status}`,
            role: "listitem",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "span",
                {
                  className: `plan-status-icon plan-checklist-icon is-${p.status}`,
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                    Icon,
                    {
                      name: p.status === "completed" ? "check" : p.status === "in_progress" ? "arrow" : "circle",
                      size: 11
                    }
                  )
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "plan-checklist-text", children: p.text })
            ]
          },
          i
        )) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("pre", { className: "lane-raw-result", children: a.body ?? (t.status === "running" ? "\u8FD0\u884C\u4E2D" : "\u65E0\u6587\u672C\u7ED3\u679C") }) }) }) })
      ]
    }
  );
}
function ToolRun({
  tools,
  actions
}) {
  return tools[0].kind === "other" ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(OtherTool, { tool: tools[0], actions }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ToolGroup, { tools, actions });
}
function ToolList({
  tools,
  actions
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "tool-card-list is-compact", children: splitToolRuns(tools).map((run) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ToolRun, { tools: run, actions }, run[0].id)) });
}

// src/ui/turn.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function Thinking({ message: m }) {
  const active = m.active && !m.text && !m.tools.length;
  const [open, setOpen] = (0, import_react6.useState)(active);
  (0, import_react6.useEffect)(() => setOpen(active), [active]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className: `thinking-block time-spent-collapsible${open ? " expanded" : ""}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "thinking-header", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "button",
          {
            type: "button",
            className: `time-spent-trigger${active ? " is-running" : ""}`,
            "aria-expanded": open,
            onClick: () => setOpen((v) => !v),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "thinking-icon", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "thinking" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: active ? "\u601D\u8003\u4E2D" : "\u601D\u8003" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "chevron", className: "time-spent-trigger-arrow", size: 12 }),
              active && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Loader, {})
            ]
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Collapse, { open, process: true, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Fade, { contentClass: "process-thinking-text", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Prose, { text: m.thinking, streaming: active }) }) })
      ]
    }
  );
}
function Message({
  message: m,
  actions,
  showText = true
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "article",
    {
      className: "assistant-block assistant-turn-process-item",
      "data-message": m.id,
      children: [
        m.thinking && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Thinking, { message: m }),
        m.tools.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ToolList, { tools: m.tools, actions }),
        showText && m.text && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "agent-reply-prose", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Prose, { text: m.text, streaming: m.active }) })
      ]
    }
  );
}
function UserImage({
  image,
  actions
}) {
  const [url, setUrl] = (0, import_react6.useState)(""), [error, setError] = (0, import_react6.useState)(false);
  (0, import_react6.useEffect)(() => {
    let alive = true;
    actions.loadImage?.(image.attachment).then(
      (value) => {
        if (alive) setUrl(value);
      },
      () => {
        if (alive) setError(true);
      }
    );
    return () => {
      alive = false;
    };
  }, [image.attachment, actions.loadImage]);
  return url ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "a",
    {
      className: "user-attachment-thumb",
      href: url,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "\u67E5\u770B\u56FE\u7247",
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("img", { src: url, alt: "\u6D88\u606F\u9644\u4EF6" })
    }
  ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "lane-notice", children: error ? "\u56FE\u7247\u52A0\u8F7D\u5931\u8D25" : "\u6B63\u5728\u52A0\u8F7D\u56FE\u7247\u2026" });
}
function User({
  item,
  actions
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "user-msg-container message-enter", children: [
    (item.images.length > 0 || !!item.files?.length) && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "user-attachments", children: [
      item.images.map((image) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(UserImage, { image, actions }, image.id)),
      item.files?.map((file, i) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "lane-file-attachment", children: [
        file.name,
        " \xB7 ",
        file.bytes,
        " B"
      ] }, i))
    ] }),
    item.text && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "user-bubble", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Prose, { text: item.text }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "user-message-actions", children: [
      item.time !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("time", { children: new Date(item.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        Copy,
        {
          text: item.text,
          label: "\u590D\u5236\u6D88\u606F",
          iconOnly: true,
          className: "reply-action user-message-action"
        }
      )
    ] })
  ] });
}
function Elapsed({
  start,
  end,
  running
}) {
  const [now, setNow] = (0, import_react6.useState)(Date.now());
  (0, import_react6.useEffect)(() => {
    if (!running || start === void 0) return;
    const id = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(id);
  }, [running, start]);
  const duration = start !== void 0 && (running || end !== void 0) ? Math.max(0, (running ? now : end) - start) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    running ? "\u5DF2\u5904\u7406" : "\u7528\u65F6",
    duration === void 0 ? "" : ` ${formatElapsed(duration)}`
  ] });
}
function Changes({
  model,
  actions
}) {
  const [all, setAll] = (0, import_react6.useState)(false);
  const files = fileChanges(
    model.items.flatMap((i) => i.type === "assistant" ? i.message.tools : [])
  );
  if (!files.length) return null;
  const added = files.reduce((n, f) => n + f.added, 0), removed = files.reduce((n, f) => n + f.removed, 0);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "turn-changes", "aria-label": "\u672C\u8F6E\u6587\u4EF6\u53D8\u66F4\u7EDF\u8BA1", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("header", { className: "turn-changes-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "turn-changes-icon", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "write", size: 18 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "turn-changes-summary", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("strong", { children: [
          "\u5DF2\u7F16\u8F91 ",
          files.length,
          " \u4E2A\u6587\u4EF6"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "turn-changes-total", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "turn-changes-added", children: [
            "+",
            added
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "turn-changes-removed", children: [
            "\u2212",
            removed
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "turn-changes-body", children: [
      (all ? files : files.slice(0, 3)).map((f) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "turn-changes-file", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            type: "button",
            className: "turn-changes-path",
            onClick: () => actions.openFile(f.path),
            children: f.path
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "turn-changes-file-stat", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "turn-changes-added", children: [
            "+",
            f.added
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "turn-changes-removed", children: [
            "\u2212",
            f.removed
          ] })
        ] })
      ] }, f.path)),
      files.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "button",
        {
          type: "button",
          className: "turn-changes-more",
          "aria-expanded": all,
          onClick: () => setAll((v) => !v),
          children: [
            all ? "\u6536\u8D77\u6587\u4EF6" : `\u518D\u663E\u793A ${files.length - 3} \u4E2A\u6587\u4EF6`,
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "down" })
          ]
        }
      )
    ] })
  ] });
}
var Turn = (0, import_react6.memo)(function Turn2({
  model,
  actions,
  initialOpen = false
}) {
  const unfolded = useUnfolded();
  const [expanded, setExpanded] = (0, import_react6.useState)(
    model.running || initialOpen || unfolded
  ), [error, setError] = (0, import_react6.useState)(""), [busy, setBusy] = (0, import_react6.useState)(false);
  useApplyFoldMode(setExpanded);
  const wasRunning = (0, import_react6.useRef)(model.running);
  (0, import_react6.useEffect)(() => {
    if (wasRunning.current !== model.running)
      setExpanded(model.running || unfolded);
    wasRunning.current = model.running;
  }, [model.running, unfolded]);
  const assistants = model.items.filter(
    (i) => i.type === "assistant"
  );
  const final = [...assistants].reverse().find((i) => i.message.text.trim());
  const hasProcess = assistants.some(
    (i) => i.message.thinking || i.message.tools.length || i !== final
  );
  const renderItem = (item) => item.type === "user" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(User, { item, actions }, item.id) : item.type === "notice" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { role: "status", className: "lane-notice", children: item.text }, item.id) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    Message,
    {
      message: item.message,
      actions,
      showText: model.interleaved || item.id !== final?.id
    },
    item.id
  );
  const inputs = model.interleaved ? [] : model.items.filter((i) => i.type === "user");
  const process = model.interleaved ? model.items : model.items.filter((i) => i.type === "assistant");
  if (!assistants.length)
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
      model.items.map(renderItem),
      model.running && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("article", { className: "assistant-block assistant-live-turn", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "time-spent-trigger assistant-turn-trigger", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Elapsed, { start: model.startedAt, running: true }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Loader, {})
      ] }) })
    ] });
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    inputs.map(renderItem),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "article",
      {
        className: `assistant-block assistant-turn${model.running ? " assistant-live-turn" : ""}`,
        "data-turn": model.id,
        children: [
          model.interleaved ? process.map(renderItem) : /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "div",
              {
                className: `time-spent-collapsible${expanded ? " expanded" : ""}`,
                children: [
                  (hasProcess || model.startedAt !== void 0) && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                    "button",
                    {
                      type: "button",
                      className: "time-spent-trigger assistant-turn-trigger",
                      "aria-expanded": expanded,
                      onClick: () => setExpanded((v) => !v),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                          Elapsed,
                          {
                            start: model.startedAt,
                            end: model.endedAt,
                            running: model.running
                          }
                        ) }),
                        hasProcess && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                          Icon,
                          {
                            name: "chevron",
                            size: 12,
                            className: "time-spent-trigger-arrow"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Collapse, { open: expanded, process: true, children: process.map(renderItem) })
                ]
              }
            ),
            final && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "agent-reply-prose", "data-final-message": final.id, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              Prose,
              {
                text: final.message.text,
                streaming: final.message.active
              }
            ) }),
            model.items.filter((i) => i.type === "notice").map(renderItem)
          ] }),
          !model.running && final && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "reply-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Copy, { text: final.message.text }),
            model.forkSeq !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "button",
              {
                type: "button",
                className: "reply-action",
                disabled: busy,
                onClick: async () => {
                  setBusy(true);
                  setError("");
                  try {
                    await actions.fork(model.forkSeq);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : String(e));
                  } finally {
                    setBusy(false);
                  }
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Icon, { name: "branch" }),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: "\u5206\u652F\u5230\u65B0\u804A\u5929" })
                ]
              }
            ),
            model.endedAt !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("time", { className: "reply-time", children: new Date(model.endedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }) })
          ] }),
          error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { role: "alert", className: "lane-action-error", children: error }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Changes, { model, actions })
        ]
      }
    )
  ] });
});

// src/styles/vela-compact.css
var vela_compact_default = '/* Vela compact-chat-ui.html: vela-extracted. Declarations preserved; selectors scoped.\n * Regenerate: node scripts/extract-styles.mjs [reference.html]\n */\n/* \u2550\u2550\u2550 tokens:root \u2550\u2550\u2550 */\n[data-dsh-compact-lane] {\n  --radius-xs: 6px;\n  --radius-sm: 8px;\n  --radius-md: 12px;\n  --radius-lg: 16px;\n  --radius-xl: 20px;\n  --radius-2xl: 22px;\n  --radius-pill: 9999px;\n  --font-sans: "SF Pro Text", "SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", sans-serif;\n  --font-mono: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;\n  --sidebar-left-width: 250px;\n  --sidebar-right-width: 340px;\n  --workbench-width: 640px;\n  --header-height: 52px;\n  /*\n   * \u5DE6\u53F3\u4FA7\u680F\u548C\u6574\u6761\u9876\u680F\u5171\u7528\u540C\u4E00\u5957\u6BDB\u73BB\u7483\u914D\u65B9;\u5185\u5706\u89D2\u662F\u5185\u5BB9\u7EB8\u9762\u9876\u89D2\u4E0E\u73BB\u7483\u58F3\u4E4B\u95F4\u7684\u8FC7\u6E21\u534A\u5F84,\n   * \u73BB\u7483\u58F3\u7ED5\u8FDB\u8FD9\u4E2A\u5706\u89D2,\u9876\u680F\u4E0E\u4FA7\u680F\u3001\u5185\u5BB9\u533A\u4EA4\u754C\u5904\u624D\u4E0D\u4F1A\u6709\u786C\u76F4\u89D2\u3002\n   */\n  --glass-blur: blur(16px) saturate(190%);\n  --glass-fillet: 12px;\n  --glass-edge-inset: 6px;\n  --transition-smooth: 0.24s cubic-bezier(0.16, 1, 0.3, 1);\n  --transition-enter: 0.18s cubic-bezier(0.16, 1, 0.3, 1);\n  --motion-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);\n  --motion-ease-exit: cubic-bezier(0.4, 0, 1, 1);\n  --transition-popover-exit: 110ms var(--motion-ease-exit);\n  --transition-sidebar: 0.28s cubic-bezier(0.2, 0, 0, 1);\n}\n\n\n/* \u2550\u2550\u2550 theme:daylight \u2550\u2550\u2550 */\n/* \u6674\u7A7A Daylight(\u6D45\u8272\u57FA\u5E95) */\n[data-dsh-compact-lane],[data-dsh-compact-lane] {\n  color-scheme: light;\n  --bg-sidebar-glass: rgba(238, 244, 252, 0.52);\n  --bg-sidebar-hover: rgba(0, 0, 0, 0.04);\n  --bg-sidebar-active: #ffffff;\n  --bg-chat: #ffffff;\n  --bg-chat-bubble-user: #edf4fc;\n  --bg-card-surface: #ffffff;\n  --bg-surface-subtle: #f7f7f8;\n  --bg-elevated: #ffffff;\n  --bg-code: #f5f5f6;\n  --bg-hover: #f0f1f2;\n  --scrollbar-thumb: rgba(0, 0, 0, 0.12);\n  --border-subtle: rgba(25, 28, 33, 0.09);\n  --border-strong: #d9dadd;\n  --overlay: rgba(15, 23, 42, 0.18);\n  --text-primary: #202124;\n  --text-secondary: #484b50;\n  --text-muted: #686d75;\n  --text-dim: #a1a6ad;\n  --accent-blue: #2563eb;\n  --accent-blue-hover: #1d4ed8;\n  --accent-contrast: #ffffff;\n  --success: #059669;\n  --danger: #c8322a;\n  --warning: #ea580c;\n  --violet: #7c3aed;\n  --tint: 6%;\n  --tint-strong: 12%;\n  --avatar-from: #f97316;\n  --avatar-to: #ec4899;\n  --shadow-card: 0 1px 3px rgba(20, 20, 20, 0.035);\n  --shadow-dock: 0 8px 24px rgba(20, 20, 20, 0.075), 0 1px 3px rgba(20, 20, 20, 0.035);\n  --shadow-active-item: none;\n  --shadow-popover: 0 12px 32px rgba(20, 20, 20, 0.14), 0 2px 6px rgba(20, 20, 20, 0.05);\n  --tool-bash: #334155;\n  --tool-read: #1d4ed8;\n  --tool-edit: #b45309;\n  --tool-write: #047857;\n  --tool-other: #64748b;\n  --term-bg: var(--bg-code);\n  --term-fg: var(--text-primary);\n  --term-cmd: var(--text-primary);\n  --term-prompt: color-mix(in srgb, var(--success) 72%, var(--text-primary));\n  --term-error: var(--danger);\n  --ctx-track: #dbdbdb;\n  --ctx-system: #717171;\n  --ctx-tools: #7565cc;\n  --ctx-rules: #007041;\n  --ctx-skills: #a46701;\n  --ctx-conversation: #c93714;\n  --syntax-fg: #1e293b;\n  --syntax-comment: #94a3b8;\n  --syntax-string: #16a34a;\n  --syntax-number: #ea580c;\n  --syntax-keyword: #e11d48;\n  --syntax-function: #2563eb;\n  --syntax-type: #0284c7;\n  --syntax-attr: #b45309;\n}\n\n\n/* \u2550\u2550\u2550 theme:derived \u2550\u2550\u2550 */\n/* \u7531\u57FA\u7840\u8272\u63A8\u5BFC\u7684\u8272\u8C03;\u4E3B\u9898\u5757\u5199\u5728\u5B83\u4E4B\u540E,\u9700\u8981\u65F6\u53EF\u4EE5\u5355\u72EC\u8986\u76D6\u3002 */\n[data-dsh-compact-lane],[data-dsh-compact-lane] [data-scheme] {\n  --bg-card-blue: color-mix(in srgb, var(--accent-blue) var(--tint), var(--bg-chat));\n  --accent-tint: color-mix(in srgb, var(--accent-blue) var(--tint), transparent);\n  --accent-tint-strong: color-mix(in srgb, var(--accent-blue) var(--tint-strong), transparent);\n  --accent-border: color-mix(in srgb, var(--accent-blue) 32%, transparent);\n  --accent-ring: color-mix(in srgb, var(--accent-blue) 14%, transparent);\n  --shadow-btn-blue: 0 4px 14px color-mix(in srgb, var(--accent-blue) 35%, transparent);\n  --success-tint: color-mix(in srgb, var(--success) var(--tint), transparent);\n  --danger-tint: color-mix(in srgb, var(--danger) var(--tint), transparent);\n  --warning-tint: color-mix(in srgb, var(--warning) var(--tint), transparent);\n  --warning-tint-strong: color-mix(in srgb, var(--warning) var(--tint-strong), transparent);\n  --warning-strong: color-mix(in srgb, var(--warning) 62%, var(--text-primary));\n  --violet-tint: color-mix(in srgb, var(--violet) var(--tint), transparent);\n  --tool-bash-tint: color-mix(in srgb, var(--tool-bash) var(--tint), transparent);\n  --tool-read-tint: color-mix(in srgb, var(--tool-read) var(--tint), transparent);\n  --tool-edit-tint: color-mix(in srgb, var(--tool-edit) var(--tint), transparent);\n  --tool-write-tint: color-mix(in srgb, var(--tool-write) var(--tint), transparent);\n  --tool-other-tint: color-mix(in srgb, var(--tool-other) var(--tint), transparent);\n  --diff-add-bg: color-mix(in srgb, var(--success) var(--tint), transparent);\n  --diff-add-fg: color-mix(in srgb, var(--success) 78%, var(--text-primary));\n  --diff-stat-add-fg: color-mix(in srgb, var(--success) 88%, var(--bg-chat));\n  --diff-stat-del-fg: color-mix(in srgb, var(--danger) 88%, var(--bg-chat));\n  --diff-del-bg: color-mix(in srgb, var(--danger) var(--tint), transparent);\n  --diff-del-fg: color-mix(in srgb, var(--danger) 78%, var(--text-primary));\n}\n\n\n/* \u2550\u2550\u2550 reset \u2550\u2550\u2550 */\n[data-dsh-compact-lane] *,[data-dsh-compact-lane] *::before,[data-dsh-compact-lane] *::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  border: none;\n  outline: none;\n}\n\n\n\n[data-dsh-compact-lane] button,[data-dsh-compact-lane] textarea {\n  font: inherit;\n  color: inherit;\n  background: transparent;\n}\n\n[data-dsh-compact-lane] button {\n  cursor: pointer;\n}\n\n/* \u91CD\u7F6E\u91CC\u53BB\u6389\u4E86 outline,\u952E\u76D8\u805A\u7126\u65F6\u7EDF\u4E00\u8865\u56DE\u7126\u70B9\u73AF;\u5217\u8868\u884C\u5411\u5185\u6536,\u907F\u514D\u88AB\u6EDA\u52A8\u5BB9\u5668\u88C1\u6389\u3002 */\n[data-dsh-compact-lane] :focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: 2px;\n}\n[data-dsh-compact-lane] .input-textarea:focus-visible {\n  outline: none;\n}\n\n/* \u2550\u2550\u2550 scrollbar \u2550\u2550\u2550 */\n[data-dsh-compact-lane] ::-webkit-scrollbar {\n  width: 5px;\n  height: 5px;\n}\n[data-dsh-compact-lane] ::-webkit-scrollbar-thumb {\n  background: var(--scrollbar-thumb);\n  border-radius: var(--radius-pill);\n}\n\n/* \u2550\u2550\u2550 main-chat-view \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .main-chat-view {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  /* \u767D\u5E95\u4EA4\u7ED9 ::after \u4ECE\u9876\u680F\u4E0B\u6CBF\u94FA\u5F00,\u9876\u680F\u90A3\u4E00\u6BB5\u7559\u7ED9\u73BB\u7483 */\n  background: none;\n  --composer-clearance: 220px;\n  container-type: inline-size;\n  container-name: chat;\n}\n\n/* \u2550\u2550\u2550 main-chat-header \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .main-chat-header {\n  height: var(--header-height);\n  padding: 0 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  /* \u9876\u680F\u63A7\u4EF6\u62AC\u5230\u73BB\u7483\u4E4B\u4E0A,\u4FDD\u6301\u6E05\u6670,\u4E0D\u88AB\u6A21\u7CCA */\n  position: relative;\n  z-index: 3;\n  -webkit-app-region: drag;\n  transition: padding-left var(--transition-sidebar);\n}\n\n\n/* \u2550\u2550\u2550 chat-title-group \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .chat-title-group {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex: 1;\n  min-width: 0;\n}\n\n/* \u2550\u2550\u2550 chat-active-title \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .chat-active-title {\n  display: block;\n  max-width: 420px;\n  font-size: 15px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n/* \u2550\u2550\u2550 chat-title-rename \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .chat-title-rename {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  text-align: left;\n  cursor: pointer;\n  border-radius: var(--radius-sm);\n  -webkit-app-region: no-drag;\n}\n[data-dsh-compact-lane] .chat-title-rename svg { flex: none; color: var(--text-muted); }\n[data-dsh-compact-lane] .chat-title-rename > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n[data-dsh-compact-lane] .chat-title-rename:hover { color: var(--accent-blue); }\n\n/* \u2550\u2550\u2550 chat-flow \u2550\u2550\u2550 */\n/* \u52A8\u753B\u4F5C\u7528\u5728\u53EF\u7EE7\u627F\u7684\u989C\u8272\u4E0A,\u8BA9\u539F\u751F\u6EDA\u52A8\u6761\u6DE1\u51FA\u65F6\u4FDD\u7559\u5BBD\u5EA6\u4E0E\u62D6\u52A8\u547D\u4E2D\u533A\u3002 */\n@property --chat-scrollbar-color {\n  syntax: "<color>";\n  inherits: true;\n  initial-value: transparent;\n}\n\n[data-dsh-compact-lane] .chat-scroll-area {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  /* \u81EA\u6210\u5C42\u53E0\u4E0A\u4E0B\u6587:\u5361\u7247\u5185\u90E8\u7684\u5B9A\u4F4D\u5B50\u5143\u7D20(\u5982\u7D27\u51D1\u5DEE\u5F02\u7684\u884C\u6587\u5B57 z-index: 3)\n     \u4E0D\u4F1A\u8D8A\u8FC7\u540C\u7EA7\u3001\u7EDD\u5BF9\u5B9A\u4F4D\u7684\u8F93\u5165\u6846 dock \u753B\u5230\u8F93\u5165\u6846\u4E0A\u9762\u3002 */\n  isolation: isolate;\n  /* \u5E95\u90E8\u7559\u767D\u653E\u5728\u6EDA\u52A8\u5185\u5BB9\u91CC\u800C\u4E0D\u662F margin:\u6B63\u6587\u624D\u80FD\u6ED1\u5230\u8F93\u5165\u6846\u4E0B\u65B9,\n     \u4EA4\u7ED9\u8F93\u5165\u6846\u4E0A\u65B9\u7684\u6E10\u8FDB\u6A21\u7CCA\u63A5\u7BA1;\u6EDA\u52A8\u5230\u5E95\u65F6\u6700\u540E\u4E00\u6761\u6D88\u606F\u4F9D\u7136\u5B8C\u6574\u53EF\u89C1\u3002 */\n  padding: 20px 24px var(--composer-clearance);\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  gap: 22px;\n  --chat-scrollbar-color: transparent;\n  transition: --chat-scrollbar-color 180ms ease;\n}\n[data-dsh-compact-lane] .chat-scroll-area.is-scrolling {\n  --chat-scrollbar-color: var(--scrollbar-thumb);\n  transition-duration: 60ms;\n}\n[data-dsh-compact-lane] .chat-scroll-area::-webkit-scrollbar-thumb { background: var(--chat-scrollbar-color); }\n@media (prefers-reduced-motion: reduce) {\n  [data-dsh-compact-lane] .chat-scroll-area { transition: none; }\n}\n[data-dsh-compact-lane] .chat-scroll-area > .user-msg-container,[data-dsh-compact-lane] .chat-scroll-area > .assistant-block,[data-dsh-compact-lane] .chat-scroll-area > .chat-error-card {\n  width: min(100%, 760px);\n}\n[data-dsh-compact-lane] .chat-scroll-area > .empty-state { width: min(100%, 460px); }\n[data-dsh-compact-lane] .assistant-live-turn {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: calc(min(100%, var(--chat-lane-max, 760px)) - var(--chat-lane-shrink, 0px));\n  margin-right: calc(var(--chat-lane-shift, 0px) * 2);\n}\n[data-dsh-compact-lane] .assistant-live-turn > .assistant-block { width: 100%; }\n\n[data-dsh-compact-lane] .empty-state {\n  margin: auto;\n  max-width: 420px;\n  text-align: center;\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .empty-state h1 {\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.03em;\n  color: var(--text-primary);\n  margin-bottom: 8px;\n}\n[data-dsh-compact-lane] .empty-state p {\n  line-height: 1.65;\n}\n[data-dsh-compact-lane] .empty-state-action {\n  margin-top: 16px;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 7px 14px;\n  border-radius: var(--radius-pill);\n  background: var(--accent-blue);\n  color: var(--accent-contrast);\n  box-shadow: var(--shadow-btn-blue);\n  font-size: 15px;\n  font-weight: 600;\n}\n[data-dsh-compact-lane] .empty-state-action:hover { background: var(--accent-blue-hover); }\n\n[data-dsh-compact-lane] .chat-error-card {\n  background: var(--danger-tint);\n  border-radius: var(--radius-lg);\n  padding: 14px 18px;\n  line-height: 1.65;\n  color: var(--text-primary);\n  user-select: text;\n  overflow-wrap: anywhere;\n}\n[data-dsh-compact-lane] .chat-error-card-title {\n  font-weight: 600;\n  color: var(--diff-del-fg);\n  margin-bottom: 4px;\n}\n\n[data-dsh-compact-lane] .user-msg-container {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 8px;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .user-bubble {\n  background: var(--bg-chat-bubble-user);\n  border-radius: var(--radius-lg);\n  padding: 12px 18px;\n  max-width: 85%;\n  min-width: 0;\n  line-height: 1.65;\n}\n[data-dsh-compact-lane] .user-message-actions .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }\n[data-dsh-compact-lane] .user-message-actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 4px;\n  min-height: 24px;\n  color: var(--text-muted);\n  font-size: 12px;\n  font-variant-numeric: tabular-nums;\n}\n[data-dsh-compact-lane] .user-message-actions time { margin-right: 4px; white-space: nowrap; }\n[data-dsh-compact-lane] .user-message-action { width: 28px; height: 28px; padding: 0; justify-content: center; }\n[data-dsh-compact-lane] .user-message-editor {\n  width: 85%;\n  min-width: 0;\n  padding: 12px 16px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--radius-lg);\n  background: var(--bg-chat-bubble-user);\n}\n[data-dsh-compact-lane] .user-message-editor textarea {\n  display: block;\n  width: 100%;\n  min-height: 80px;\n  padding: 2px;\n  resize: vertical;\n  border: 0;\n  border-radius: var(--radius-xs);\n  background: transparent;\n  color: var(--text-primary);\n  font: inherit;\n  line-height: 1.65;\n}\n[data-dsh-compact-lane] .user-message-editor textarea:focus-visible { outline: 2px solid var(--accent-blue); outline-offset: 3px; }\n[data-dsh-compact-lane] .user-edit-note,[data-dsh-compact-lane] .user-edit-error { margin: 10px 0 0; font-size: 12px; line-height: 1.5; }\n[data-dsh-compact-lane] .user-edit-note { color: var(--text-muted); }\n[data-dsh-compact-lane] .user-edit-error { color: var(--diff-del-fg); }\n[data-dsh-compact-lane] .user-edit-buttons { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }\n[data-dsh-compact-lane] .user-edit-buttons button { padding: 6px 12px; border-radius: var(--radius-md); font-size: 12px; cursor: pointer; }\n[data-dsh-compact-lane] .user-edit-cancel { background: transparent; color: var(--text-primary); }\n[data-dsh-compact-lane] .user-edit-submit { background: var(--text-primary); color: var(--bg-chat); }\n[data-dsh-compact-lane] .user-edit-buttons button:disabled { opacity: .45; cursor: not-allowed; }\n[data-dsh-compact-lane] .user-edit-buttons button:focus-visible { outline: 2px solid var(--accent-blue); outline-offset: 2px; }\n[data-dsh-compact-lane] .user-attachments {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: 6px;\n  max-width: 85%;\n}\n/* \u7F29\u7565\u56FE\u662F\u6253\u5F00\u5168\u5C4F\u67E5\u770B\u7684\u6309\u94AE:\u56FE\u7247\u94FA\u6EE1\u6309\u94AE,\u5706\u89D2\u7531\u6309\u94AE\u88C1\u51FA\u3002 */\n[data-dsh-compact-lane] .user-attachment-thumb {\n  display: block;\n  width: 120px;\n  height: 120px;\n  max-width: 100%;\n  padding: 0;\n  overflow: hidden;\n  border-radius: var(--radius-md);\n  background: var(--bg-surface-subtle);\n  cursor: zoom-in;\n}\n[data-dsh-compact-lane] .user-attachment-thumb img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: opacity 140ms ease;\n}\n[data-dsh-compact-lane] .user-attachment-thumb:hover img {\n  opacity: 0.88;\n}\n[data-dsh-compact-lane] .user-attachment-thumb:only-child {\n  width: 140px;\n  height: 140px;\n}\n[data-dsh-compact-lane] .agent-reply-prose {\n  min-width: 0;\n  color: var(--text-primary);\n  font-size: 15px;\n  line-height: 1.75;\n}\n[data-dsh-compact-lane][data-scheme="light"] .agent-reply-prose {\n  color: #000;\n}\n\n[data-dsh-compact-lane] .md-content {\n  overflow-wrap: anywhere;\n}\n[data-dsh-compact-lane] .md-content > :first-child {\n  margin-top: 0;\n}\n[data-dsh-compact-lane] .md-content > :last-child {\n  margin-bottom: 0;\n}\n[data-dsh-compact-lane] .md-content p,[data-dsh-compact-lane] .md-content ul,[data-dsh-compact-lane] .md-content ol,[data-dsh-compact-lane] .md-content blockquote,[data-dsh-compact-lane] .md-content pre,[data-dsh-compact-lane] .md-content .md-table-scroll {\n  margin: 0.55em 0;\n}\n[data-dsh-compact-lane] .md-content h1,[data-dsh-compact-lane] .md-content h2,[data-dsh-compact-lane] .md-content h3,[data-dsh-compact-lane] .md-content h4,[data-dsh-compact-lane] .md-content h5,[data-dsh-compact-lane] .md-content h6 {\n  font-weight: 600;\n  letter-spacing: -0.02em;\n  line-height: 1.35;\n  margin: 0.9em 0 0.35em;\n}\n/*\n * \u6807\u9898\u7528 em \u8DDF\u968F\u6240\u5728\u5BB9\u5668\u7684\u6B63\u6587\u5B57\u53F7:\u804A\u5929 15px\u3001\u8FFD\u8E2A\u9884\u89C8 12px\u3001\u601D\u8003\u533A 13px \u90FD\u80FD\u4FDD\u6301\n * \u540C\u4E00\u5957\u5C42\u7EA7\u6BD4\u4F8B,\u4E0D\u4F1A\u5728\u5C0F\u5B57\u53F7\u533A\u57DF\u91CC\u5192\u51FA\u8FC7\u5927\u7684\u6807\u9898\u3002\n */\n[data-dsh-compact-lane] .md-content h1 { font-size: 1.33em; }\n[data-dsh-compact-lane] .md-content h2 { font-size: 1.18em; }\n[data-dsh-compact-lane] .md-content h3 { font-size: 1.07em; }\n[data-dsh-compact-lane] .md-content h4 { font-size: 1em; }\n[data-dsh-compact-lane] .md-content h5 { font-size: 0.93em; }\n[data-dsh-compact-lane] .md-content h6 { font-size: 0.87em; }\n[data-dsh-compact-lane] .md-content ul,[data-dsh-compact-lane] .md-content ol {\n  padding-left: 1.25em;\n}\n[data-dsh-compact-lane] .md-content li {\n  margin: 0.18em 0;\n}\n[data-dsh-compact-lane] .md-content li > p {\n  margin: 0.15em 0;\n}\n[data-dsh-compact-lane] .md-content a {\n  color: var(--accent-blue);\n  text-decoration: underline;\n  text-underline-offset: 2px;\n}\n[data-dsh-compact-lane] .md-content a:hover {\n  color: var(--accent-blue-hover);\n}\n[data-dsh-compact-lane] .md-content blockquote {\n  border-left: 2px solid var(--border-strong);\n  padding-left: 12px;\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .md-content :not(pre) > code {\n  font-family: var(--font-mono);\n  font-size: 14px;\n  background: var(--bg-hover);\n  padding: 0.08em 0.35em;\n  border-radius: 4px;\n  overflow-wrap: normal;\n  word-break: normal;\n}\n[data-dsh-compact-lane] .md-content pre {\n  background: var(--bg-code);\n  border-radius: 10px;\n  padding: 12px 14px;\n  overflow-x: auto;\n  font-family: var(--font-mono);\n  font-size: 14px;\n  line-height: 1.55;\n  overflow-wrap: normal;\n  word-break: normal;\n}\n[data-dsh-compact-lane] .md-content pre code {\n  font-family: inherit;\n  font-size: inherit;\n  background: none;\n  padding: 0;\n  white-space: pre;\n}\n[data-dsh-compact-lane] .user-bubble .md-content pre,[data-dsh-compact-lane] .user-bubble .md-content :not(pre) > code {\n  background: var(--bg-elevated);\n}\n[data-dsh-compact-lane] .md-content hr {\n  height: 1px;\n  background: var(--border-subtle);\n  margin: 0.9em 0;\n}\n[data-dsh-compact-lane] .md-content del {\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .agent-reply-prose .md-content blockquote,[data-dsh-compact-lane] .agent-reply-prose .md-content del {\n  color: inherit;\n}\n[data-dsh-compact-lane] .md-table-scroll {\n  max-width: 100%;\n  overflow-x: auto;\n}\n[data-dsh-compact-lane] .md-content table {\n  width: max-content;\n  min-width: 100%;\n  border-collapse: collapse;\n  font-size: 15px;\n}\n[data-dsh-compact-lane] .md-content th,[data-dsh-compact-lane] .md-content td {\n  border: 1px solid var(--border-subtle);\n  padding: 6px 10px;\n  text-align: left;\n  vertical-align: top;\n}\n[data-dsh-compact-lane] .md-content th {\n  background: var(--bg-surface-subtle);\n  font-weight: 600;\n}\n[data-dsh-compact-lane] .md-content img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n  border-radius: 8px;\n  margin: 0.55em 0;\n}\n[data-dsh-compact-lane] .md-content input[type="checkbox"] {\n  appearance: auto;\n  margin: 0 0.4em 0 0;\n  vertical-align: -0.12em;\n}\n[data-dsh-compact-lane] .md-content li:has(> input[type="checkbox"]) {\n  list-style: none;\n  margin-left: -1.15em;\n}\n\n[data-dsh-compact-lane] .assistant-block {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  min-width: 0;\n}\n\n/* \u56DE\u590D\u4E0B\u65B9\u7684\u64CD\u4F5C\u884C:\u590D\u5236\u4E0E\u5206\u652F\u5728\u5DE6,\u56DE\u590D\u65F6\u95F4\u8D34\u53F3\u3002 */\n[data-dsh-compact-lane] .reply-actions {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  min-height: 22px;\n  margin-top: 2px;\n}\n[data-dsh-compact-lane] .reply-action {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 3px 7px;\n  border: 0;\n  border-radius: var(--radius-xs);\n  background: transparent;\n  color: var(--text-muted);\n  font-size: 12px;\n  line-height: 1.4;\n  cursor: pointer;\n  transition: color var(--transition-enter), background var(--transition-enter);\n}\n[data-dsh-compact-lane] .reply-action:hover:not(:disabled) {\n  color: var(--text-primary);\n  background: var(--bg-hover);\n}\n[data-dsh-compact-lane] .reply-action:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n[data-dsh-compact-lane] .reply-action:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: 1px;\n}\n[data-dsh-compact-lane] .reply-time {\n  margin-left: auto;\n  padding-left: 8px;\n  color: var(--text-muted);\n  font-size: 12px;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n\n[data-dsh-compact-lane] .time-spent-trigger {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  color: var(--text-muted);\n  font-size: 15px;\n  font-weight: 500;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  text-align: left;\n}\n[data-dsh-compact-lane] .time-spent-trigger.is-running { width: 100%; }\n[data-dsh-compact-lane] .assistant-turn-trigger {\n  width: 100%;\n  padding-bottom: 8px;\n  border-bottom: 1px solid var(--border-subtle);\n}\n[data-dsh-compact-lane] .time-spent-trigger-arrow {\n  transition: transform var(--transition-smooth);\n}\n/* \u6298\u53E0\u5757\u4F1A\u5D4C\u5957(\u601D\u8003\u5757\u4F4D\u4E8E"\u67E5\u770B\u8FC7\u7A0B"\u5185\u90E8),\u5C55\u5F00\u6001\u89C4\u5219\u5FC5\u987B\u53EA\u4F5C\u7528\u4E8E\u76F4\u63A5\u5B50\u7EA7,\n   \u5426\u5219\u5916\u5C42\u5C55\u5F00\u4F1A\u628A\u5185\u5C42\u6298\u53E0\u4F53\u4E00\u8D77\u5F3A\u5236\u6491\u5F00\u3002 */\n[data-dsh-compact-lane] .time-spent-collapsible.expanded > .time-spent-trigger .time-spent-trigger-arrow,[data-dsh-compact-lane] .time-spent-collapsible.expanded > .thinking-header > .time-spent-trigger .time-spent-trigger-arrow {\n  transform: rotate(90deg);\n}\n[data-dsh-compact-lane] .thinking-block { min-width: 0; }\n[data-dsh-compact-lane] .thinking-header {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .thinking-header > .time-spent-trigger { flex-shrink: 0; }\n[data-dsh-compact-lane] .thinking-header > .time-spent-trigger.is-running { flex: 1; }\n[data-dsh-compact-lane] .thinking-header button:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: 3px;\n  border-radius: 4px;\n}\n[data-dsh-compact-lane] .thinking-summary-inline {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  color: var(--text-muted);\n  font-size: 13px;\n}\n[data-dsh-compact-lane] .thinking-summary-preview,[data-dsh-compact-lane] .thinking-summary-action {\n  border: 0;\n  background: transparent;\n  color: var(--text-muted);\n  padding: 3px 0;\n  min-height: 28px;\n  text-align: left;\n  font-size: 13px;\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .thinking-summary-preview {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .thinking-summary-preview:hover,[data-dsh-compact-lane] .thinking-summary-action:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] .thinking-summary-label {\n  flex-shrink: 0;\n  color: var(--text-muted);\n  font-size: 12px;\n  font-weight: 500;\n}\n[data-dsh-compact-lane] .thinking-summary-excerpt {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n[data-dsh-compact-lane] .thinking-summary-status {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n[data-dsh-compact-lane] .thinking-summary-status .tool-activity-loader { margin: 0; }\n[data-dsh-compact-lane] .thinking-summary-failed { color: var(--danger); }\n[data-dsh-compact-lane] .thinking-summary-panel {\n  min-width: 0;\n  margin: 7px 0 2px;\n  padding-left: 14px;\n  border-left: 1px solid var(--border-subtle);\n  color: var(--text-primary);\n  font-size: 13px;\n  line-height: 1.62;\n  overflow-wrap: anywhere;\n}\n[data-dsh-compact-lane] .thinking-summary-panel p { margin: 5px 0 0; }\n/* \u603B\u7ED3\u4F5C\u4E3A\u6807\u9898:\u6574\u884C\u53EF\u70B9,\u8D85\u51FA\u65F6\u7701\u7565\u53F7\u622A\u65AD;\u5C55\u5F00\u540E\u6362\u56DE\u201C\u601D\u8003\u201D\u6807\u9898\u3002 */\n[data-dsh-compact-lane] .thinking-header > .thinking-headline-trigger {\n  flex: 1;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .thinking-headline-trigger:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] .thinking-headline-trigger .thinking-summary-excerpt { min-width: 0; }\n[data-dsh-compact-lane] .thinking-headline-trigger .time-spent-trigger-arrow { flex-shrink: 0; }\n/* \u603B\u7ED3\u8DDF\u968F\u56DE\u590D\u6B63\u6587:\u53BB\u6389\u201C\u601D\u8003\u201D\u201C\u603B\u7ED3\u201D\u5B57\u6837,\u6574\u6BB5\u53EF\u70B9,\u56FE\u6807\u8DDF\u5728\u6700\u540E\u4E00\u884C\u6587\u5B57\u540E\u9762\u5F00\u5408\u601D\u8003\u5185\u5BB9\u3002 */\n[data-dsh-compact-lane] .thinking-prose-summary {\n  min-width: 0;\n  /* \u6574\u6BB5\u603B\u7ED3\u90FD\u53EF\u70B9\u51FB\u5F00\u5408\u601D\u8003\u5185\u5BB9\u3002 */\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .thinking-prose-toggle {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: 4px;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  background: transparent;\n  color: var(--text-muted);\n  cursor: pointer;\n  vertical-align: -2px;\n}\n[data-dsh-compact-lane] .thinking-prose-toggle:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] .thinking-prose-toggle:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n/* \u4E0E\u5DE5\u5177\u8C03\u7528\u7684\u5C55\u5F00\u7BAD\u5934\u4E00\u81F4:12px\u3001\u6B21\u8981\u8272\u3001\u5C55\u5F00\u540E\u8F6C 90\xB0 \u671D\u4E0B\u3002 */\n[data-dsh-compact-lane] .thinking-prose-toggle svg { transition: transform var(--transition-smooth); }\n[data-dsh-compact-lane] .thinking-prose-toggle.expanded svg { transform: rotate(90deg); }\n[data-dsh-compact-lane] .assistant-turn-process-item {\n  margin: 6px 0 8px;\n}\n[data-dsh-compact-lane] .assistant-turn-process-item:last-child {\n  margin-bottom: 0;\n}\n/* \u6298\u53E0\u7528 0fr \u7F51\u683C\u5B9E\u73B0:\u5185\u5BB9\u4FDD\u6301\u6302\u8F7D,\u5F00\u5408\u65F6\u6709\u5E73\u6ED1\u7684\u9AD8\u5EA6\u8FC7\u6E21 */\n[data-dsh-compact-lane] .time-spent-body {\n  display: grid;\n  grid-template-rows: 0fr;\n  transition: grid-template-rows var(--transition-smooth);\n}\n[data-dsh-compact-lane] .time-spent-collapsible.expanded > .time-spent-body {\n  grid-template-rows: 1fr;\n}\n[data-dsh-compact-lane] .time-spent-body-inner {\n  min-height: 0;\n  overflow: hidden;\n  visibility: hidden;\n  transition: visibility 0s var(--transition-smooth);\n}\n[data-dsh-compact-lane] .time-spent-collapsible.expanded > .time-spent-body > .time-spent-body-inner {\n  visibility: visible;\n  transition-delay: 0s;\n}\n[data-dsh-compact-lane] .thinking-text {\n  color: var(--text-muted);\n  font-size: 15px;\n  line-height: 1.65;\n  padding-top: 6px;\n}\n[data-dsh-compact-lane] .thinking-scroll-shell {\n  position: relative;\n  min-width: 0;\n  --scroll-fade-background: var(--bg-chat);\n}\n[data-dsh-compact-lane] .thinking-scroll-viewport {\n  max-height: 280px;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--scrollbar-thumb) transparent;\n}\n[data-dsh-compact-lane] .thinking-scroll-viewport .thinking-text {\n  padding: 7px 14px 9px 0;\n  font-size: 13px;\n  line-height: 1.62;\n}\n[data-dsh-compact-lane] .thinking-scroll-viewport .md-content > p { margin: 0 0 0.85em; }\n[data-dsh-compact-lane] .thinking-scroll-viewport .md-content > p:last-child { margin-bottom: 0; }\n[data-dsh-compact-lane] .thinking-scroll-viewport::-webkit-scrollbar { width: 5px; }\n[data-dsh-compact-lane] .thinking-scroll-viewport::-webkit-scrollbar-thumb {\n  border-radius: var(--radius-pill);\n  background: var(--scrollbar-thumb);\n}\n[data-dsh-compact-lane] .thinking-scroll-fade {\n  position: absolute;\n  z-index: 1;\n  left: 0;\n  right: 5px;\n  height: var(--thinking-edge-height, 66px);\n  opacity: 0;\n  pointer-events: none;\n  /* \u80CC\u666F\u548C\u6EE4\u955C\u4F7F\u7528\u540C\u4E00\u6EDA\u52A8\u8DDD\u79BB\u6743\u91CD\u3002 */\n}\n[data-dsh-compact-lane] .thinking-edge-filter { position: absolute; pointer-events: none; }\n[data-dsh-compact-lane] .thinking-scroll-shell.has-content-edge-blur > .thinking-scroll-viewport {\n  filter: var(--scroll-edge-filter);\n}\n[data-dsh-compact-lane] .thinking-scroll-fade-top {\n  top: 0;\n  background: linear-gradient(\n    to bottom,\n    color-mix(in srgb, var(--scroll-fade-background) 88%, transparent) 0%,\n    color-mix(in srgb, var(--scroll-fade-background) 35%, transparent) 38%,\n    transparent 100%\n  );\n  -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);\n  mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);\n}\n[data-dsh-compact-lane] .thinking-scroll-fade-bottom {\n  bottom: 0;\n  background: linear-gradient(\n    to top,\n    color-mix(in srgb, var(--scroll-fade-background) 88%, transparent) 0%,\n    color-mix(in srgb, var(--scroll-fade-background) 35%, transparent) 38%,\n    transparent 100%\n  );\n  -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 100%);\n  mask-image: linear-gradient(to top, #000 0%, transparent 100%);\n}\n[data-dsh-compact-lane] .process-thinking-text {\n  padding-top: 0;\n  color: var(--text-muted);\n  font-size: 13px;\n  line-height: 1.45;\n}\n[data-dsh-compact-lane] .process-thinking-text .md-content > :first-child { margin-top: 0; }\n[data-dsh-compact-lane] .process-thinking-text .md-content > :last-child { margin-bottom: 0; }\n[data-dsh-compact-lane] .process-thinking-text .md-content h1,[data-dsh-compact-lane] .process-thinking-text .md-content h2,[data-dsh-compact-lane] .process-thinking-text .md-content h3,[data-dsh-compact-lane] .process-thinking-text .md-content h4,[data-dsh-compact-lane] .process-thinking-text .md-content h5,[data-dsh-compact-lane] .process-thinking-text .md-content h6 {\n  margin: 0 0 2px;\n  font-weight: 500;\n  letter-spacing: 0;\n}\n/* \u7D27\u51D1\u8FC7\u7A0B\u5361\u7247\u91CC\u6536\u7A84\u5C42\u7EA7\u5DEE,\u518D\u5927\u7684\u6807\u9898\u4E5F\u538B\u5728\u8FD9\u4E2A\u5B57\u53F7\u533A\u95F4\u3002 */\n[data-dsh-compact-lane] .process-thinking-text .md-content h1 { font-size: 15px; }\n[data-dsh-compact-lane] .process-thinking-text .md-content h2 { font-size: 14px; }\n[data-dsh-compact-lane] .process-thinking-text .md-content h3 { font-size: 13.5px; }\n[data-dsh-compact-lane] .process-thinking-text .md-content h4 { font-size: 13px; }\n[data-dsh-compact-lane] .process-thinking-text .md-content h5 { font-size: 12.5px; }\n[data-dsh-compact-lane] .process-thinking-text .md-content h6 { font-size: 12px; }\n[data-dsh-compact-lane] .thinking-text .md-content blockquote,[data-dsh-compact-lane] .thinking-text .md-content del {\n  color: inherit;\n}\n\n[data-dsh-compact-lane] .tool-card-list {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .tool-card {\n  min-width: 0;\n  background: var(--bg-surface-subtle);\n  border-radius: 12px;\n  overflow: hidden;\n}\n[data-dsh-compact-lane] .tool-kind-bash { --tool-accent: var(--tool-bash); --tool-tint: var(--tool-bash-tint); }\n[data-dsh-compact-lane] .tool-kind-read { --tool-accent: var(--tool-read); --tool-tint: var(--tool-read-tint); }\n[data-dsh-compact-lane] .tool-kind-edit { --tool-accent: var(--tool-edit); --tool-tint: var(--tool-edit-tint); }\n[data-dsh-compact-lane] .tool-kind-write { --tool-accent: var(--tool-write); --tool-tint: var(--tool-write-tint); }\n[data-dsh-compact-lane] .tool-kind-other { --tool-accent: var(--tool-other); --tool-tint: var(--tool-other-tint); }\n[data-dsh-compact-lane] .tool-card-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-width: 0;\n  padding: 8px 10px;\n  text-align: left;\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .tool-card-head:hover { background: var(--bg-hover); }\n[data-dsh-compact-lane] .tool-card-head:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: -2px;\n}\n[data-dsh-compact-lane] .tool-card-icon {\n  width: 22px;\n  height: 22px;\n  border-radius: 6px;\n  display: grid;\n  place-items: center;\n  flex: none;\n  background: var(--tool-tint);\n  color: var(--tool-accent);\n}\n[data-dsh-compact-lane] .tool-kind-label {\n  flex: none;\n  width: 44px;\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--tool-accent);\n}\n[data-dsh-compact-lane] .tool-card-main {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  min-width: 0;\n  flex: 1;\n}\n[data-dsh-compact-lane] .tool-card-name {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-primary);\n  font-weight: 600;\n}\n[data-dsh-compact-lane] .tool-card-name.grow { flex: 1; }\n[data-dsh-compact-lane] .tool-kind-bash .tool-card-name {\n  font-family: var(--font-mono);\n  font-size: 14px;\n  font-weight: 500;\n}\n[data-dsh-compact-lane] .tool-card-dir {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-muted);\n  font-size: 15px;\n}\n[data-dsh-compact-lane] .tool-stat,[data-dsh-compact-lane] .tool-lines,[data-dsh-compact-lane] .tool-status-mark,[data-dsh-compact-lane] .tool-spinner,[data-dsh-compact-lane] .tool-chevron { flex: none; }\n[data-dsh-compact-lane] .tool-stat {\n  display: inline-flex;\n  gap: 6px;\n  font-family: var(--font-mono);\n  font-size: 14px;\n  font-weight: 600;\n}\n[data-dsh-compact-lane] .tool-stat-add { color: var(--diff-stat-add-fg); }\n[data-dsh-compact-lane] .tool-stat-del { color: var(--diff-stat-del-fg); }\n[data-dsh-compact-lane] .tool-lines {\n  color: var(--text-muted);\n  font-size: 15px;\n  font-variant-numeric: tabular-nums;\n}\n[data-dsh-compact-lane] .tool-status-mark {\n  display: grid;\n  place-items: center;\n  width: 14px;\n  height: 14px;\n}\n[data-dsh-compact-lane] .tool-status-mark.done { color: var(--success); }\n[data-dsh-compact-lane] .tool-status-mark.error { color: var(--danger); }\n[data-dsh-compact-lane] .tool-activity-loader {\n  display: block;\n  width: 16px;\n  height: 16px;\n  flex: 0 0 16px;\n  margin-left: auto;\n  color: color-mix(in srgb, var(--accent-blue) 70%, white);\n}\n[data-dsh-compact-lane] .tool-spinner {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  border: 1.5px solid color-mix(in srgb, var(--tool-accent) 28%, transparent);\n  border-top-color: var(--tool-accent);\n  animation: tool-spin 0.7s linear infinite;\n}\n[data-dsh-compact-lane] .tool-chevron {\n  color: var(--text-muted);\n  transition: transform var(--transition-smooth);\n}\n[data-dsh-compact-lane] .tool-card.open .tool-chevron { transform: rotate(90deg); }\n[data-dsh-compact-lane] .tool-card.is-running .tool-card-icon {\n  box-shadow: 0 0 0 0 color-mix(in srgb, var(--tool-accent) 45%, transparent);\n  animation: tool-pulse 1.4s ease-out infinite;\n}\n\n/* \u8FDE\u7EED\u591A\u4E2A\u5DE5\u5177\u7684\u6298\u53E0\u5206\u7EC4 */\n[data-dsh-compact-lane] .tool-run {\n  min-width: 0;\n  background: var(--bg-surface-subtle);\n  border-radius: var(--radius-md);\n  overflow: hidden;\n}\n[data-dsh-compact-lane] .tool-run-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-width: 0;\n  padding: 8px 10px;\n  text-align: left;\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .tool-run-head:hover { background: var(--bg-hover); }\n[data-dsh-compact-lane] .tool-run-head:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: -2px;\n}\n[data-dsh-compact-lane] .tool-run-count {\n  flex: none;\n  padding: 1px 7px;\n  border-radius: var(--radius-pill);\n  background: var(--bg-hover);\n  font-family: var(--font-mono);\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-run-subject {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-secondary);\n  font-size: 15px;\n}\n[data-dsh-compact-lane] .tool-kind-bash .tool-run-subject {\n  font-family: var(--font-mono);\n  font-size: 14px;\n}\n[data-dsh-compact-lane] .tool-run-failed {\n  flex: none;\n  font-size: 15px;\n  font-weight: 600;\n  color: var(--diff-del-fg);\n}\n[data-dsh-compact-lane] .tool-run-chevron {\n  flex: none;\n  color: var(--text-muted);\n  transition: transform var(--transition-smooth);\n}\n[data-dsh-compact-lane] .tool-run.open .tool-run-chevron { transform: rotate(90deg); }\n[data-dsh-compact-lane] .tool-run.is-running .tool-card-icon {\n  box-shadow: 0 0 0 0 color-mix(in srgb, var(--tool-accent) 45%, transparent);\n  animation: tool-pulse 1.4s ease-out infinite;\n}\n[data-dsh-compact-lane] .tool-run-body {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 8px 10px 10px;\n  background: var(--bg-card-surface);\n}\n\n\n/* \u2550\u2550\u2550 compact+plan+agent \u2550\u2550\u2550 */\n/* \u7D27\u51D1\u6A21\u5F0F\u628A\u5DE5\u5177\u4F5C\u4E3A\u8FC7\u7A0B\u6587\u672C\u9605\u8BFB;\u80CC\u666F\u53EA\u5728\u60AC\u505C/\u952E\u76D8\u805A\u7126\u65F6\u51FA\u73B0\u3002 */\n[data-dsh-compact-lane] .tool-card-list.is-compact { gap: 1px; }\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-main,[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-name.grow { flex: 0 1 auto; }\n/* \u7BAD\u5934\u4FDD\u7559\u5360\u4F4D,\u53EA\u5728\u5BF9\u5E94\u6587\u5B57\u60AC\u505C\u6216\u952E\u76D8\u805A\u7126\u65F6\u663E\u793A,\u907F\u514D\u6587\u5B57\u8DF3\u52A8\u3002 */\n[data-dsh-compact-lane] .tool-compact-chevron,[data-dsh-compact-lane] .tool-card-list.is-compact .tool-chevron,[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-block .time-spent-trigger-arrow,[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-prose-toggle svg {\n  opacity: 0;\n}\n[data-dsh-compact-lane] .tool-compact-summary:has(:is(.tool-compact-label, .tool-compact-sample):hover) > .tool-compact-chevron,[data-dsh-compact-lane] .tool-compact-summary:focus-visible > .tool-compact-chevron,[data-dsh-compact-lane] .tool-compact-line:has(:is(.tool-compact-action, .tool-compact-name, .tool-compact-dir, .tool-compact-cmd, .agent-compact-name):hover) .tool-compact-chevron,[data-dsh-compact-lane] button.tool-compact-line:focus-visible > .tool-compact-chevron,[data-dsh-compact-lane] .tool-compact-line:has(> button:focus-visible) .tool-compact-chevron,[data-dsh-compact-lane] .tool-compact-chevron:hover,[data-dsh-compact-lane] .tool-compact-detail-toggle:is(:hover, :focus-visible) .tool-compact-chevron,[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-head:has(:is(.tool-kind-label, .tool-card-main, .tool-mcp-source):hover) .tool-chevron,[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-head:focus-visible .tool-chevron,[data-dsh-compact-lane] .tool-card-list.is-compact .tool-chevron:hover,[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-header:has(:is(.time-spent-trigger > span, .thinking-summary-preview):hover) .time-spent-trigger-arrow,[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-header:has(:focus-visible) .time-spent-trigger-arrow,[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-block .time-spent-trigger-arrow:hover,[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-prose-summary:hover .thinking-prose-toggle svg,[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-prose-toggle:focus-visible svg {\n  opacity: 1;\n}\n[data-dsh-compact-lane] .tool-compact-summary {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  min-width: 0;\n  padding: 2px 0;\n  border: none;\n  border-radius: 4px;\n  background: none;\n  text-align: left;\n  cursor: pointer;\n  font-size: 14px;\n  line-height: 1.55;\n}\n[data-dsh-compact-lane] .tool-compact-summary:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] .tool-compact-summary:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: -2px;\n}\n[data-dsh-compact-lane] .tool-compact-icon {\n  width: 16px;\n  height: 16px;\n  display: grid;\n  place-items: center;\n  flex: none;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-compact-label {\n  flex: 0 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .tool-compact-sample {\n  flex: 0 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-muted);\n  font-size: 13px;\n}\n[data-dsh-compact-lane] .tool-compact-failed {\n  flex: none;\n  font-weight: 600;\n  color: var(--diff-del-fg);\n}\n/* \u8017\u65F6\u6BB5\u9760\u53F3;\u5C55\u5F00\u7BAD\u5934\u5FC5\u987B\u6392\u5728\u5B83\u524D\u9762,\u624D\u80FD\u7D27\u8DDF\u5DE6\u4FA7\u5185\u5BB9\u800C\u4E0D\u88AB auto \u5916\u8FB9\u8DDD\u63A8\u53F3\u3002 */\n[data-dsh-compact-lane] .tool-duration,[data-dsh-compact-lane] .tool-compact-steps {\n  flex: none;\n  margin-left: auto;\n  color: var(--text-secondary);\n  font-family: var(--font-mono);\n  font-size: 12px;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n[data-dsh-compact-lane] .tool-duration {\n  min-width: 7ch;\n  text-align: right;\n}\n[data-dsh-compact-lane] .tool-duration.is-failed {\n  color: var(--danger);\n}\n[data-dsh-compact-lane] .tool-compact-steps {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n[data-dsh-compact-lane] .tool-compact-stat {\n  flex: none;\n  display: inline-flex;\n  gap: 6px;\n  font-family: var(--font-mono);\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n}\n[data-dsh-compact-lane] .tool-compact-chevron {\n  flex: none;\n  color: var(--text-muted);\n  transition: transform var(--transition-smooth);\n}\n[data-dsh-compact-lane] .tool-compact-summary:hover .tool-compact-label { color: var(--text-primary); }\n[data-dsh-compact-lane] .tool-compact-group.open > .tool-compact-summary .tool-compact-chevron { transform: rotate(90deg); }\n[data-dsh-compact-lane] .tool-compact-item.open > .tool-compact-line .tool-compact-chevron { transform: rotate(90deg); }\n/* \u5206\u7EC4\u5185\u7684\u5DE6\u5BFC\u8F68\u59CB\u7EC8\u4FDD\u7559:\u5C55\u5F00\u67D0\u6761\u6587\u4EF6\u5DEE\u5F02\u9884\u89C8\u65F6\u53EA\u8C03\u6574\u5361\u7247\u81EA\u8EAB\u95F4\u8DDD,\u4E0D\u80FD\u628A\u6574\u6761\u5BFC\u8F68\u6536\u56DE\u3002 */\n[data-dsh-compact-lane] .tool-compact-lines {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  margin: 2px 0 6px 16px;\n  padding: 1px 0 1px 10px;\n  border-left: 1px solid var(--border-subtle);\n}\n[data-dsh-compact-lane] .tool-compact-line {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  min-width: 0;\n  padding: 2px 0;\n  border: none;\n  border-radius: 4px;\n  background: none;\n  font-size: 14px;\n  line-height: 1.5;\n  color: var(--text-secondary);\n  text-align: left;\n}\n[data-dsh-compact-lane] button.tool-compact-line { cursor: pointer; }\n[data-dsh-compact-lane] button.tool-compact-line:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] button.tool-compact-line:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: -2px;\n}\n[data-dsh-compact-lane] .tool-compact-action {\n  flex: none;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .file-type-icon {\n  display: inline-block;\n  flex: none;\n  width: 14px;\n  height: 14px;\n  object-fit: contain;\n}\n[data-dsh-compact-lane] .tool-compact-name {\n  flex: 0 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  padding: 0;\n  border: none;\n  background: none;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-decoration: none;\n}\n[data-dsh-compact-lane] button.tool-compact-name:hover { text-decoration: underline; text-underline-offset: 2px; }\n[data-dsh-compact-lane] .tool-compact-name.is-static { font-weight: 500; }\n[data-dsh-compact-lane] .tool-compact-dir {\n  flex: 0 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-compact-text-toggle {\n  display: inline-flex;\n  align-items: center;\n  min-width: 0;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .tool-compact-text-toggle:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: 1px;\n  border-radius: 3px;\n}\n[data-dsh-compact-lane] .tool-compact-action-toggle { flex: none; }\n[data-dsh-compact-lane] .tool-compact-path-toggle {\n  flex: 0 1 auto;\n}\n[data-dsh-compact-lane] .tool-compact-action-toggle:hover .tool-compact-action,[data-dsh-compact-lane] .tool-compact-path-toggle:hover .tool-compact-dir,[data-dsh-compact-lane] button.tool-compact-line:hover .tool-compact-action,[data-dsh-compact-lane] button.tool-compact-line:hover .tool-compact-cmd {\n  color: var(--text-primary);\n}\n[data-dsh-compact-lane] .tool-compact-cmd {\n  flex: 0 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family: var(--font-mono);\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .tool-compact-error {\n  flex: none;\n  display: grid;\n  place-items: center;\n  color: var(--danger);\n}\n[data-dsh-compact-lane] .tool-compact-detail-toggle {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  padding: 0;\n  border: 0;\n  border-radius: 4px;\n  background: transparent;\n  color: var(--text-muted);\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .tool-compact-detail-toggle:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] .tool-compact-detail-toggle:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: -2px;\n}\n[data-dsh-compact-lane] .tool-compact-file-detail {\n  max-height: 220px;\n  margin: 3px 8px 7px 22px;\n  overflow: auto;\n}\n[data-dsh-compact-lane] .tool-compact-file-detail .tool-note { margin: 4px 0 6px; }\n[data-dsh-compact-lane] .tool-compact-file-detail.has-diff-preview {\n  max-height: none;\n  margin: 3px 0 7px;\n  overflow: visible;\n}\n[data-dsh-compact-lane] .compact-diff-card {\n  min-width: 0;\n  overflow: hidden;\n  border: 1px solid var(--border-subtle);\n  border-radius: 10px;\n  background: var(--bg-card-surface);\n}\n[data-dsh-compact-lane] .compact-diff-card-head {\n  min-height: 28px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 2px 6px 2px 10px;\n  border-bottom: 1px solid var(--border-subtle);\n  background: var(--bg-surface-subtle);\n}\n[data-dsh-compact-lane] .compact-diff-card-name {\n  min-width: 0;\n  flex: 0 1 auto;\n  overflow: hidden;\n  color: var(--text-primary);\n  font-size: 12px;\n  font-weight: 550;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n[data-dsh-compact-lane] .compact-diff-card-stat {\n  flex: none;\n  display: inline-flex;\n  gap: 6px;\n  font-family: var(--font-mono);\n  font-size: 12px;\n  font-weight: 600;\n  font-variant-numeric: tabular-nums;\n}\n[data-dsh-compact-lane] .compact-diff-card-copy {\n  width: 20px;\n  height: 20px;\n  flex: none;\n  display: grid;\n  place-items: center;\n  margin-left: auto;\n  padding: 0;\n  border: 0;\n  border-radius: 4px;\n  color: var(--text-muted);\n  background: transparent;\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .compact-diff-card-copy:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] .compact-diff-card-copy:focus-visible {\n  outline: 2px solid var(--accent-blue);\n  outline-offset: -2px;\n}\n[data-dsh-compact-lane] .compact-diff-card-note {\n  margin: 0;\n  padding: 6px 10px;\n  border-bottom: 1px solid var(--border-subtle);\n  color: var(--text-muted);\n  font-size: 12px;\n  line-height: 1.5;\n}\n[data-dsh-compact-lane] .thinking-scroll-shell.compact-diff-scroll-shell {\n  min-width: 0;\n  background: var(--bg-card-surface);\n  --scroll-fade-background: var(--bg-card-surface);\n}\n[data-dsh-compact-lane] .compact-diff-scroll-shell .thinking-scroll-viewport .thinking-text {\n  padding: 0;\n}\n[data-dsh-compact-lane] .compact-diff-scroll-content { min-width: 0; }\n[data-dsh-compact-lane] .tool-sheet.tool-sheet-compact-diff {\n  border-radius: 0;\n  background: var(--bg-card-surface);\n  font-size: 12px;\n  line-height: 1.65;\n}\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-code-line {\n  min-height: 22px;\n  padding-right: 8px;\n}\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-gutter {\n  position: relative;\n  z-index: 3;\n  display: flex;\n  align-self: stretch;\n  align-items: baseline;\n  justify-content: flex-end;\n  min-width: 4.5em;\n  margin-right: 9px;\n  border-right: 1px solid var(--border-subtle);\n}\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-code-text { position: relative; z-index: 3; }\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-sign { display: none; }\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-diff-line { position: relative; }\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-diff-line.add::before,[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-diff-line.del::before {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 3px;\n  content: "";\n}\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-diff-line.add::before { background: var(--success); }\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-diff-line.del::before { background: var(--danger); }\n[data-dsh-compact-lane] .tool-sheet-compact-diff .tool-diff-gap.is-compact {\n  height: 7px;\n  padding: 0;\n  border-top: 1px solid var(--border-subtle);\n  background: var(--bg-card-surface);\n}\n[data-dsh-compact-lane] .tool-compact-out { margin: 0 8px 4px; }\n\n/* ---------- Browser REPL \u8C03\u7528 ---------- */\n[data-dsh-compact-lane] .browser-call { min-width: 0; margin: 2px 0; }\n[data-dsh-compact-lane] .browser-call-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  min-width: 0;\n  padding: 3px 0;\n  border: none;\n  border-radius: 6px;\n  background: none;\n  font-size: 14px;\n  line-height: 1.5;\n  color: var(--text-secondary);\n  text-align: left;\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .browser-call-head:hover { color: var(--text-primary); }\n[data-dsh-compact-lane] .browser-call-head:focus-visible { outline: 2px solid var(--accent-blue); outline-offset: -2px; }\n[data-dsh-compact-lane] .browser-call-badge {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 6px;\n  background: color-mix(in srgb, var(--accent-blue) 13%, transparent);\n  color: var(--accent-blue);\n  transition: background-color 140ms ease;\n}\n[data-dsh-compact-lane] .browser-call.is-running .browser-call-badge { animation: browser-call-pulse 1.4s ease-in-out infinite; }\n[data-dsh-compact-lane] .browser-call.is-error .browser-call-badge {\n  background: color-mix(in srgb, var(--danger) 13%, transparent);\n  color: var(--danger);\n}\n/* \u7D27\u51D1\u6A21\u5F0F\u4E0B Browser REPL \u7684\u56FE\u6807\u4E0D\u8981\u5E95\u8272,\u5C3A\u5BF8\u4E0E\u5176\u4ED6\u7D27\u51D1\u56FE\u6807(16px)\u5BF9\u9F50\u3002 */\n[data-dsh-compact-lane] .browser-call.is-compact .browser-call-badge,[data-dsh-compact-lane] .browser-call.is-compact.is-error .browser-call-badge {\n  width: 16px;\n  height: 16px;\n  border-radius: 0;\n  background: transparent;\n}\n[data-dsh-compact-lane] .browser-call-steps {\n  flex: 0 1 auto;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  min-width: 0;\n  overflow: hidden;\n}\n[data-dsh-compact-lane] .browser-call-step-wrap {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  min-width: 0;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .browser-call-step {\n  min-width: 0;\n  max-width: 260px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  padding: 0 7px;\n  border-radius: 999px;\n  background: var(--bg-surface-subtle);\n  box-shadow: inset 0 0 0 1px var(--border-subtle);\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n[data-dsh-compact-lane] .browser-call-shots {\n  flex: none;\n  display: inline-flex;\n  align-items: center;\n  gap: 3px;\n  padding: 0 6px;\n  border-radius: 999px;\n  background: var(--success-tint);\n  color: var(--success);\n  font-family: var(--font-mono);\n  font-size: 12px;\n  font-variant-numeric: tabular-nums;\n}\n[data-dsh-compact-lane] .browser-call.open > .browser-call-head .browser-call-chevron { transform: rotate(90deg); }\n[data-dsh-compact-lane] .browser-call:not(.is-compact) {\n  border-radius: 10px;\n  background: var(--bg-surface-subtle);\n  padding: 2px 10px;\n}\n[data-dsh-compact-lane] .browser-call:not(.is-compact) .browser-call-step { background: var(--bg-card-surface); }\n[data-dsh-compact-lane] .browser-call.open > .tool-collapse { grid-template-rows: 1fr; }\n[data-dsh-compact-lane] .browser-call-body {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  padding: 4px 0 8px 28px;\n}\n[data-dsh-compact-lane] .browser-call:not(.is-compact) .browser-call-body { padding-left: 28px; }\n[data-dsh-compact-lane] .browser-call-code {\n  position: relative;\n  margin: 0;\n  padding: 8px 10px 8px calc(10px + 1.2em);\n  border-radius: 8px;\n  background: var(--term-bg);\n  color: var(--term-fg);\n  font-family: var(--font-mono);\n  font-size: 13px;\n  line-height: 1.55;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n[data-dsh-compact-lane] .browser-call-prompt {\n  position: absolute;\n  left: 10px;\n  color: var(--accent-blue);\n  user-select: none;\n}\n[data-dsh-compact-lane] .browser-call-output {\n  padding: 0 2px;\n  font-size: 13px;\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .browser-call-output.failed,[data-dsh-compact-lane] .browser-call-output.failed .tool-markdown { color: var(--danger); }\n[data-dsh-compact-lane] .browser-call-text { margin: 0; }\n[data-dsh-compact-lane] .browser-call-wait { padding: 0 2px; font-size: 13px; color: var(--text-muted); }\n[data-dsh-compact-lane] .browser-call-frames { display: flex; flex-wrap: wrap; gap: 10px; }\n[data-dsh-compact-lane] .browser-call-frame {\n  margin: 0;\n  width: 240px;\n  max-width: 100%;\n  overflow: hidden;\n  border-radius: 8px;\n  background: var(--bg-card-surface);\n  box-shadow: 0 0 0 1px var(--border-subtle), 0 2px 8px rgba(0, 0, 0, 0.06);\n  transition: width var(--transition-smooth);\n}\n[data-dsh-compact-lane] .browser-call-frame.zoomed { width: 100%; }\n[data-dsh-compact-lane] .browser-call-chrome {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  height: 22px;\n  padding: 0 8px;\n  background: var(--bg-surface-subtle);\n  border-bottom: 1px solid var(--border-subtle);\n}\n[data-dsh-compact-lane] .browser-call-chrome > span {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--border-subtle);\n  box-shadow: inset 0 0 0 1px var(--border-subtle);\n}\n[data-dsh-compact-lane] .browser-call-chrome > em {\n  flex: 1;\n  min-width: 0;\n  margin-left: 6px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family: var(--font-mono);\n  font-size: 11px;\n  font-style: normal;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .browser-call-shot {\n  display: block;\n  width: 100%;\n  padding: 0;\n  border: none;\n  background: none;\n  cursor: zoom-in;\n}\n[data-dsh-compact-lane] .browser-call-frame.zoomed .browser-call-shot { cursor: zoom-out; }\n[data-dsh-compact-lane] .browser-call-shot img { display: block; width: 100%; height: auto; }\n@keyframes browser-call-pulse {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.5; }\n}\n@media (prefers-reduced-motion: reduce) {\n  [data-dsh-compact-lane] .browser-call.is-running .browser-call-badge { animation: none; }\n}\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card {\n  overflow: visible;\n  border-radius: 0;\n  background: transparent;\n}\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-head {\n  gap: 6px;\n  padding: 2px 0;\n}\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-head:hover { background: transparent; }\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-icon {\n  width: 16px;\n  height: 16px;\n  border-radius: 0;\n  background: transparent;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-kind-label {\n  width: auto;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-name { font-size: 14px; font-weight: 500; }\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-dir { font-size: 13px; }\n[data-dsh-compact-lane] .tool-card-list.is-compact .tool-card-body { padding: 2px 0 8px; }\n\n/* \u7D27\u51D1\u6A21\u5F0F\u7684\u5DE5\u5177\u56FE\u6807\u914D\u8272:\u8BBE\u7F6E \u2192 \u5BF9\u8BDD\u663E\u793A \u2192 \u5DE5\u5177\u56FE\u6807\u914D\u8272,\u5173\u95ED\u65F6\u4FDD\u6301\u7EDF\u4E00\u7070\u8272\u3002\n   Browser REPL \u7684\u56FE\u6807\u6709\u81EA\u5DF1\u7684\u84DD\u8272\u5E95,\u4E0D\u5728\u8FD9\u91CC\u5904\u7406\u3002 */\n[data-dsh-compact-lane],[data-dsh-compact-lane] {\n  --tool-icon-bash: #7c5cd6;\n  --tool-icon-read: #0f8a8a;\n  --tool-icon-edit: #c2710c;\n  --tool-icon-write: #1f9d55;\n  --tool-icon-group: #5b6fd6;\n  --tool-icon-mcp: #d6457a;\n  --tool-icon-agent: #b43fc7;\n  --tool-icon-ask: #0284c7;\n  --tool-icon-other: #e0603c;\n  --tool-icon-think: #84a10d;\n}\n[data-dsh-compact-lane] [data-scheme="dark"] {\n  --tool-icon-bash: #b9a4f5;\n  --tool-icon-read: #5fd0cc;\n  --tool-icon-edit: #fbbf6a;\n  --tool-icon-write: #6ee7a0;\n  --tool-icon-group: #a5b0f5;\n  --tool-icon-mcp: #f59ab9;\n  --tool-icon-agent: #e19af0;\n  --tool-icon-ask: #7dd3fc;\n  --tool-icon-other: #fb9b7e;\n  --tool-icon-think: #c3e35c;\n}\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-compact-icon,[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-card-list.is-compact .tool-card-icon,[data-dsh-compact-lane][data-tool-icon-color="true"] .question-compact-icon {\n  color: var(--tool-icon-other);\n}\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-kind-bash .tool-compact-icon,[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-card-list.is-compact .tool-kind-bash .tool-card-icon { color: var(--tool-icon-bash); }\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-kind-read .tool-compact-icon,[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-card-list.is-compact .tool-kind-read .tool-card-icon { color: var(--tool-icon-read); }\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-kind-edit .tool-compact-icon,[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-card-list.is-compact .tool-kind-edit .tool-card-icon { color: var(--tool-icon-edit); }\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-kind-write .tool-compact-icon,[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-card-list.is-compact .tool-kind-write .tool-card-icon { color: var(--tool-icon-write); }\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-compact-group.tool-kind-other > .tool-compact-summary .tool-compact-icon { color: var(--tool-icon-group); }\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-card-list.is-compact .tool-card.is-mcp .tool-card-icon { color: var(--tool-icon-mcp); }\n[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-card-list.is-compact .tool-card.is-task .tool-card-icon,[data-dsh-compact-lane][data-tool-icon-color="true"] .tool-compact-item.agent-compact .tool-compact-icon { color: var(--tool-icon-agent); }\n[data-dsh-compact-lane][data-tool-icon-color="true"] .question-compact-icon { color: var(--tool-icon-ask); }\n[data-dsh-compact-lane] .thinking-icon { display: none; }\n[data-dsh-compact-lane] .main-chat-view[data-tool-display="compact"] .thinking-icon {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 16px;\n  height: 16px;\n}\n[data-dsh-compact-lane][data-tool-icon-color="true"] .thinking-icon { color: var(--tool-icon-think); }\n/* \u5173\u95ED\u914D\u8272\u65F6,\u7D27\u51D1\u6A21\u5F0F\u7684 Browser REPL \u56FE\u6807\u4E5F\u56DE\u5230\u7070\u8272(\u5931\u8D25\u72B6\u6001\u7531\u53F3\u4FA7\u7684 \u2715 \u6807\u51FA)\u3002 */\n[data-dsh-compact-lane][data-tool-icon-color="false"] .browser-call.is-compact .browser-call-badge { color: var(--text-muted); }\n[data-dsh-compact-lane] .tool-collapse {\n  display: grid;\n  grid-template-rows: 0fr;\n  transition: grid-template-rows var(--transition-smooth);\n}\n[data-dsh-compact-lane] .tool-card.open > .tool-collapse,[data-dsh-compact-lane] .tool-run.open > .tool-collapse,[data-dsh-compact-lane] .tool-compact-group.open > .tool-collapse,[data-dsh-compact-lane] .tool-compact-item.open > .tool-collapse {\n  grid-template-rows: 1fr;\n}\n[data-dsh-compact-lane] .tool-collapse-inner {\n  min-height: 0;\n  overflow: hidden;\n}\n[data-dsh-compact-lane] .tool-card-body { padding: 0 10px 10px; }\n[data-dsh-compact-lane] .thinking-scroll-shell.tool-details-scroll {\n  --scroll-fade-background: var(--bg-surface-subtle);\n}\n[data-dsh-compact-lane] .tool-card-list.is-compact .thinking-scroll-shell.tool-details-scroll,[data-dsh-compact-lane] .tool-compact-item .thinking-scroll-shell.tool-details-scroll {\n  --scroll-fade-background: var(--bg-chat);\n}\n\n/* ---------- \u6267\u884C\u6E05\u5355\uFF08update_plan\uFF09\u5C55\u5F00\u89C6\u56FE ---------- */\n\n[data-dsh-compact-lane] .plan-checklist {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 7px;\n  padding: 2px 0 2px 2px;\n}\n/* \u7AD6\u5411\u5F15\u5BFC\u7EBF\uFF1A\u4ECE\u7B2C\u4E00\u4E2A\u56FE\u6807\u4E2D\u5FC3\u8FDE\u5230\u6700\u540E\u4E00\u4E2A\u56FE\u6807\u4E2D\u5FC3\u3002 */\n[data-dsh-compact-lane] .plan-checklist::before {\n  content: "";\n  position: absolute;\n  left: 8px;\n  top: 10px;\n  bottom: 10px;\n  width: 1px;\n  background: var(--border-subtle);\n}\n[data-dsh-compact-lane] .plan-checklist-item {\n  position: relative;\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  font-size: 13px;\n  line-height: 19px;\n}\n[data-dsh-compact-lane] .plan-status-icon {\n  display: inline-grid;\n  place-items: center;\n  flex: none;\n}\n[data-dsh-compact-lane] .plan-status-icon.is-completed { color: var(--success); }\n[data-dsh-compact-lane] .plan-status-icon.is-in_progress { color: var(--accent-blue); }\n[data-dsh-compact-lane] .plan-status-icon.is-pending { color: var(--text-muted); }\n/* \u56FE\u6807\u538B\u5728\u5F15\u5BFC\u7EBF\u4E0A\uFF0C\u7528\u5361\u7247\u5E95\u8272\u906E\u51FA\u4E00\u6BB5\u95F4\u9694\uFF0C\u5F62\u6210\u8282\u70B9\u6548\u679C\u3002 */\n[data-dsh-compact-lane] .plan-checklist-icon {\n  position: relative;\n  z-index: 1;\n  width: 13px;\n  height: 19px;\n  background: var(--bg-surface-subtle);\n}\n[data-dsh-compact-lane] .plan-checklist-text {\n  min-width: 0;\n  overflow-wrap: anywhere;\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .plan-checklist-item.is-completed .plan-checklist-text { color: var(--text-muted); }\n[data-dsh-compact-lane] .plan-checklist-item.is-in_progress .plan-checklist-text { color: var(--text-primary); font-weight: 600; }\n[data-dsh-compact-lane] .plan-status-inline { vertical-align: -2px; margin-right: 6px; }\n[data-dsh-compact-lane] .task-steps {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  margin: 0;\n  padding: 2px 2px 0;\n  list-style: none;\n}\n[data-dsh-compact-lane] .task-step {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  min-width: 0;\n  font-size: 15px;\n  line-height: 1.45;\n}\n[data-dsh-compact-lane] .task-step-name {\n  flex: none;\n  width: 44px;\n  font-weight: 600;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .task-step.is-running .task-step-name { color: var(--tool-accent); }\n[data-dsh-compact-lane] .task-step.is-error .task-step-name { color: var(--danger); }\n[data-dsh-compact-lane] .task-step-summary {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-primary);\n}\n[data-dsh-compact-lane] .task-report { margin: 8px 0 0; }\n[data-dsh-compact-lane] .agent-path {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  font-family: var(--font-mono);\n  color: var(--text-primary);\n}\n[data-dsh-compact-lane] .agent-kind {\n  flex: none;\n  padding: 0 5px;\n  border-radius: 5px;\n  background: var(--bg-surface-subtle);\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .agent-state { flex: none; color: var(--text-muted); }\n[data-dsh-compact-lane] .agent-state.is-running { color: var(--tool-accent); }\n[data-dsh-compact-lane] .agent-state.is-paused { color: var(--warning); }\n[data-dsh-compact-lane] .agent-state.is-failed { color: var(--danger); }\n[data-dsh-compact-lane] .agent-state.is-aborted { color: var(--text-muted); opacity: 0.7; }\n[data-dsh-compact-lane] .agent-status-dot {\n  flex: none;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--text-muted);\n}\n[data-dsh-compact-lane] .agent-status-dot.is-idle { opacity: 0.5; }\n[data-dsh-compact-lane] .agent-status-dot.is-paused { background: var(--warning); }\n[data-dsh-compact-lane] .agent-status-dot.is-completed { background: var(--success); }\n[data-dsh-compact-lane] .agent-status-dot.is-failed { background: var(--danger); }\n[data-dsh-compact-lane] .agent-status-dot.is-aborted { background: var(--text-muted); opacity: 0.55; }\n[data-dsh-compact-lane] .chat-agents-button {\n  display: inline-flex;\n  align-items: center;\n  flex: none;\n  gap: 6px;\n  height: 26px;\n  padding: 0 9px;\n  border-radius: 999px;\n  font-size: 13px;\n  white-space: nowrap;\n  color: var(--text-muted);\n  background: var(--bg-surface-subtle);\n  cursor: pointer;\n  -webkit-app-region: no-drag;\n}\n[data-dsh-compact-lane] .chat-agents-button:hover,[data-dsh-compact-lane] .chat-agents-button.active {\n  color: var(--text-primary);\n  background: var(--bg-hover);\n}\n[data-dsh-compact-lane] .agent-summary { padding-top: 2px; }\n[data-dsh-compact-lane] .thinking-scroll-shell.agent-summary-scroll {\n  /* \u5361\u7247\u6A21\u5F0F\u4E0B\u6A21\u7CCA\u5C42\u8981\u76D6\u4F4F\u5361\u7247\u5E95\u8272 */\n  --scroll-fade-background: var(--bg-surface-subtle);\n  margin-top: 2px;\n}\n/* \u7D27\u51D1\u6A21\u5F0F\u4E0B\u5361\u7247\u80CC\u666F\u662F\u900F\u660E\u7684\uFF0C\u6A21\u7CCA\u5C42\u8981\u8DDF\u804A\u5929\u5E95\u8272\u4E00\u81F4 */\n[data-dsh-compact-lane] .agent-compact .thinking-scroll-shell.agent-summary-scroll {\n  --scroll-fade-background: var(--bg-chat);\n}\n[data-dsh-compact-lane] .agent-summary-scroll .thinking-scroll-viewport {\n  max-height: 320px;\n  overflow-x: hidden;\n}\n[data-dsh-compact-lane] .agent-summary-scroll .thinking-scroll-viewport .thinking-text {\n  padding: 7px 10px 7px 0;\n}\n[data-dsh-compact-lane] .agent-summary-task { color: var(--text-secondary); }\n[data-dsh-compact-lane] .agent-summary-report {\n  margin-top: 10px;\n  padding-top: 10px;\n  border-top: 1px solid var(--border-subtle);\n  color: var(--text-primary);\n}\n[data-dsh-compact-lane] .agent-summary-error {\n  margin-top: 10px;\n  padding-top: 10px;\n  border-top: 1px solid var(--border-subtle);\n  color: var(--danger);\n}\n\n/* \u7D27\u51D1\u6A21\u5F0F\u4E0B\u7684\u4E00\u884C\uFF1A\u70B9\u540D\u79F0\u53BB\u53F3\u4FA7 Pane\uFF0C\u70B9\u5176\u4ED6\u533A\u57DF\u5F00\u5408\u6982\u51B5 */\n[data-dsh-compact-lane] .agent-compact-line {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  width: 100%;\n  min-width: 0;\n  padding: 2px 0;\n}\n[data-dsh-compact-lane] .agent-compact-toggle {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  border: none;\n  background: none;\n  padding: 0;\n  color: var(--text-muted);\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .agent-compact-toggle.is-lead { flex: none; }\n/* \u7BAD\u5934\u7D27\u8DDF\u540D\u79F0\uFF0C\u5269\u4F59\u7A7A\u95F4\u4ECD\u5C5E\u4E8E\u8FD9\u4E2A\u5F00\u5408\u533A\u57DF */\n[data-dsh-compact-lane] .agent-compact-toggle.is-tail { flex: 1; justify-content: flex-start; }\n[data-dsh-compact-lane] .agent-compact-line:has(.agent-compact-toggle:hover) .agent-compact-toggle,[data-dsh-compact-lane] .agent-compact-line:has(.agent-compact-toggle:hover) .tool-compact-icon,[data-dsh-compact-lane] .agent-compact-line:has(.agent-compact-toggle:hover) .tool-compact-action,[data-dsh-compact-lane] .agent-compact-line:has(.agent-compact-toggle:hover) .tool-compact-chevron {\n  color: var(--text-primary);\n}\n[data-dsh-compact-lane] .agent-compact-name {\n  flex: 0 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  padding: 0;\n  border: none;\n  background: none;\n  font-family: var(--font-mono);\n  font-size: 14px;\n  color: var(--text-primary);\n  cursor: pointer;\n}\n[data-dsh-compact-lane] .agent-compact-name:hover { text-decoration: underline; text-underline-offset: 2px; }\n[data-dsh-compact-lane] .agent-compact-name:disabled { color: var(--text-muted); cursor: default; }\n[data-dsh-compact-lane] .agent-compact-name:disabled:hover { text-decoration: none; }\n[data-dsh-compact-lane] .agent-compact-out { margin: 2px 8px 6px; }\n[data-dsh-compact-lane] .agent-open-hint {\n  display: block;\n  margin-top: 6px;\n  font-size: 13px;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-card.is-openable .tool-card-head { cursor: pointer; }\n\n\n/* \u2550\u2550\u2550 terminal+sheet+keyframes \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .tool-terminal {\n  border-radius: 8px;\n  background: var(--term-bg);\n  color: var(--term-fg);\n  font-family: var(--font-mono);\n  font-size: 14px;\n  line-height: 1.55;\n  overflow: hidden;\n}\n[data-dsh-compact-lane] .tool-terminal-cmd {\n  display: flex;\n  gap: 8px;\n  padding: 8px 10px;\n  color: var(--term-cmd);\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n[data-dsh-compact-lane] .tool-terminal-prompt {\n  color: var(--term-prompt);\n  flex: none;\n}\n[data-dsh-compact-lane] .tool-terminal.failed .tool-terminal-prompt { color: var(--term-error); }\n[data-dsh-compact-lane] .tool-terminal-out,[data-dsh-compact-lane] .tool-terminal-wait {\n  margin: 0;\n  padding: 8px 10px 10px;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n  font: inherit;\n  color: var(--term-fg);\n}\n[data-dsh-compact-lane] .tool-terminal-cmd + .tool-terminal-out,[data-dsh-compact-lane] .tool-terminal-cmd + .tool-terminal-wait {\n  border-top: 1px solid var(--border-subtle);\n}\n[data-dsh-compact-lane] .tool-terminal-wait { color: color-mix(in srgb, var(--term-fg) 62%, transparent); }\n[data-dsh-compact-lane] .tool-sheet {\n  border-radius: 8px;\n  background: var(--bg-code);\n  overflow: hidden;\n  font-family: var(--font-mono);\n  font-size: 14px;\n  line-height: 1.55;\n}\n[data-dsh-compact-lane] .tool-code-line {\n  display: flex;\n  align-items: flex-start;\n  min-width: 0;\n  padding-right: 10px;\n}\n[data-dsh-compact-lane] .tool-gutter {\n  flex: none;\n  min-width: 4.6em;\n  padding: 0 10px 0 8px;\n  text-align: right;\n  color: var(--text-dim);\n  user-select: none;\n  white-space: nowrap;\n  font-variant-numeric: tabular-nums;\n}\n[data-dsh-compact-lane] .tool-sign {\n  display: inline-block;\n  width: 0.8em;\n  text-align: center;\n}\n[data-dsh-compact-lane] .tool-code-text {\n  flex: 1;\n  min-width: 0;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .tool-diff-line.add { background: var(--diff-add-bg); }\n[data-dsh-compact-lane] .tool-diff-line.del { background: var(--diff-del-bg); }\n[data-dsh-compact-lane] .tool-diff-line.add .tool-code-text,[data-dsh-compact-lane] .tool-diff-line.add .tool-gutter { color: var(--diff-add-fg); }\n[data-dsh-compact-lane] .tool-diff-line.del .tool-code-text,[data-dsh-compact-lane] .tool-diff-line.del .tool-gutter { color: var(--diff-del-fg); }\n[data-dsh-compact-lane] .tool-diff-gap {\n  padding: 2px 12px;\n  color: var(--text-dim);\n  background: var(--bg-surface-subtle);\n}\n[data-dsh-compact-lane] .tool-sheet-note,[data-dsh-compact-lane] .tool-note,[data-dsh-compact-lane] .tool-wait {\n  font-family: var(--font-sans);\n  font-size: 15px;\n  line-height: 1.5;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-sheet-note { padding: 6px 10px 8px; }\n[data-dsh-compact-lane] .tool-note { white-space: pre-wrap; overflow-wrap: anywhere; margin-bottom: 6px; }\n[data-dsh-compact-lane] .tool-error {\n  margin: 0;\n  padding: 8px 10px;\n  border-radius: 8px;\n  background: var(--diff-del-bg);\n  color: var(--diff-del-fg);\n  font-family: var(--font-mono);\n  font-size: 14px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n[data-dsh-compact-lane] .tool-markdown {\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n@keyframes tool-spin { to { transform: rotate(360deg); } }\n@keyframes tool-pulse {\n  70% { box-shadow: 0 0 0 6px transparent; }\n  100% { box-shadow: 0 0 0 0 transparent; }\n}\n\n\n/* \u2550\u2550\u2550 composer-dock \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .chat-dock-wrapper {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  padding: 0 24px 18px;\n  /* \u4E0E\u6EDA\u52A8\u533A\u6263\u9664\u6EDA\u52A8\u6761\u540E\u7684\u53EF\u7528\u5BBD\u5EA6\u4E00\u81F4,\u8F93\u5165\u6846\u624D\u80FD\u548C\u6B63\u6587\u5217\u5BF9\u9F50\u3002 */\n  padding-right: calc(24px + var(--chat-scrollbar-width, 0px));\n  display: flex;\n  justify-content: center;\n  pointer-events: none;\n  /* \u8F93\u5165\u6846\u53CA\u5176\u4E0B\u65B9\u4FDD\u6301\u4E0D\u900F\u660E,\u6EDA\u52A8\u4E2D\u7684\u6B63\u6587\u4E0D\u4F1A\u4ECE\u8FB9\u4E0A\u548C\u5E95\u90E8\u900F\u51FA\u6765\u3002 */\n  background: var(--bg-chat);\n}\n/* \u9876\u90E8\u6539\u7528\u5411\u4E0A\u6E10\u8FDB\u6A21\u7CCA:\u4E0A\u65B9\u51E0\u4E4E\u4E0D\u6A21\u7CCA,\u8D8A\u9760\u8FD1\u8F93\u5165\u6846\u8D8A\u6A21\u7CCA,\u5E95\u90E8\u518D\u538B\u4E00\u5C42\u804A\u5929\u5E95\u8272\n   \u81EA\u7136\u63A5\u5230\u4E0D\u900F\u660E\u7684\u8F93\u5165\u533A,\u6EDA\u52A8\u4E2D\u7684\u6B63\u6587\u4E0D\u4F1A\u518D\u88AB\u4E00\u6761\u767D\u8272\u786C\u8FB9\u5207\u6389\u3002 */\n[data-dsh-compact-lane] .chat-dock-wrapper::before,[data-dsh-compact-lane] .chat-dock-wrapper::after {\n  content: "";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 100%;\n  height: 52px;\n  pointer-events: none;\n}\n/* \u8F7B\u6A21\u7CCA\u6253\u5E95,\u8BA9\u8FC7\u6E21\u4ECE\u5927\u81F4\u6E05\u6670\u9010\u6E10\u8FDB\u5165\u6A21\u7CCA\u3002 */\n[data-dsh-compact-lane] .chat-dock-wrapper::before {\n  -webkit-backdrop-filter: blur(3px);\n  backdrop-filter: blur(3px);\n  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.55) 50%, #000 100%);\n  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.55) 50%, #000 100%);\n}\n/* \u91CD\u6A21\u7CCA\u53E0\u52A0\u5728\u4E0B\u534A\u6BB5,\u9760\u8FD1\u8F93\u5165\u6846\u7684\u5730\u65B9\u6700\u6A21\u7CCA;\u6700\u540E\u4E00\u6BB5\u878D\u8FDB\u804A\u5929\u5E95\u8272\u3002 */\n[data-dsh-compact-lane] .chat-dock-wrapper::after {\n  background: linear-gradient(to bottom, transparent 50%, var(--bg-chat) 96%);\n  -webkit-backdrop-filter: blur(16px);\n  backdrop-filter: blur(16px);\n  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(0, 0, 0, 0.55) 74%, #000 100%);\n  mask-image: linear-gradient(to bottom, transparent 0%, transparent 45%, rgba(0, 0, 0, 0.55) 74%, #000 100%);\n}\n@container chat (max-width: 720px) {\n  [data-dsh-compact-lane] .chat-dock-wrapper,[data-dsh-compact-lane] .chat-scroll-area {\n    padding-left: 16px;\n    padding-right: 16px;\n  }\n  [data-dsh-compact-lane] .chat-dock-wrapper { padding-right: calc(16px + var(--chat-scrollbar-width, 0px)); }\n}\n\n[data-dsh-compact-lane] .floating-input-card {\n  pointer-events: auto;\n  position: relative;\n  /* flex:none \u4FDD\u8BC1\u5BBD\u5EA6\u4E0D\u88AB dock \u7684\u5269\u4F59\u7A7A\u95F4\u538B\u7F29;margin-right \u6491\u51FA\u8F66\u9053\u65F6\u5141\u8BB8\u6EA2\u51FA\u5C45\u4E2D\u3002 */\n  flex: none;\n  width: calc(min(100%, var(--chat-lane-max, 760px)) - var(--chat-lane-shrink, 0px));\n  /* \u4E0E\u5BF9\u8BDD\u5217\u5171\u7528\u8F66\u9053:margin-right \u662F\u5DE6\u79FB\u91CF\u7684\u4E24\u500D(\u5C45\u4E2D\u5E03\u5C40\u91CC\u53EA\u5151\u73B0\u4E00\u534A)\u3002 */\n  margin-right: calc(var(--chat-lane-shift, 0px) * 2);\n  background: var(--bg-elevated);\n  border: 1px solid var(--border-subtle);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-dock);\n  padding: 14px 16px 8px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n/* \u4F4E\u5F3A\u8C03\u5EA6\u7EDF\u8BA1\u884C,\u907F\u514D\u8F93\u5165\u6846\u5E95\u90E8\u518D\u5F62\u6210\u4E00\u4E2A\u72EC\u7ACB\u533A\u5757\u3002 */\n[data-dsh-compact-lane] .composer-stats-row {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  column-gap: 12px;\n  row-gap: 3px;\n  /* \u7A97\u53E3\u7A84\u5230\u653E\u4E0D\u4E0B\u4E09\u7EC4\u65F6\u6362\u884C,\u597D\u8FC7\u628A\u6BCF\u7EC4\u7684\u6570\u5B57\u90FD\u622A\u65AD\u3002 */\n  flex-wrap: wrap;\n  margin: 2px 0 0;\n  padding: 2px 0 0;\n  border-top: 0;\n  color: var(--text-muted);\n  font-size: 13px;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n[data-dsh-compact-lane] .composer-stat {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .composer-stat-text {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n[data-dsh-compact-lane] .composer-stat-icon {\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n  color: var(--text-dim);\n}\n[data-dsh-compact-lane] .composer-stat-context { flex-shrink: 0; }\n[data-dsh-compact-lane] .composer-stat-context.high { color: var(--warning-strong); }\n[data-dsh-compact-lane] .composer-stat-ring {\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n  color: var(--text-dim);\n}\n[data-dsh-compact-lane] .composer-stat-ring svg { transform: rotate(-90deg); }\n[data-dsh-compact-lane] .composer-stat-ring-track {\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 1.5;\n  opacity: 0.45;\n}\n[data-dsh-compact-lane] .composer-stat-ring-progress {\n  fill: none;\n  stroke: var(--accent-blue);\n  stroke-width: 1.5;\n  stroke-linecap: round;\n}\n[data-dsh-compact-lane] .composer-stat-context.high .composer-stat-ring-progress { stroke: var(--warning); }\n\n\n/* \u2550\u2550\u2550 composer-textarea \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .input-textarea {\n  width: 100%;\n  min-height: 44px;\n  max-height: 140px;\n  resize: none;\n  line-height: 1.5;\n  font-size: 15px;\n}\n[data-dsh-compact-lane] .input-textarea.with-skill { min-height: 28px; }\n[data-dsh-compact-lane] .input-textarea::placeholder { color: var(--text-muted); }\n[data-dsh-compact-lane] .input-textarea:disabled { opacity: 0.6; }\n[data-dsh-compact-lane] .input-textarea.with-prediction { padding-right: 44px; }\n[data-dsh-compact-lane] .composer-prediction-hint {\n  position: absolute;\n  right: 4px;\n  top: 0;\n  height: 44px;\n  display: inline-flex;\n  align-items: center;\n  pointer-events: none;\n  color: var(--text-muted);\n  font-size: 11px;\n}\n[data-dsh-compact-lane] .composer-prediction-hint::before {\n  content: "";\n  position: absolute;\n  inset: 13px -5px 13px -5px;\n  border: 1px solid var(--border-subtle);\n  border-radius: 5px;\n}\n\n\n/* \u2550\u2550\u2550 composer-controls \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .dock-controls-row,[data-dsh-compact-lane] .dock-controls-left,[data-dsh-compact-lane] .dock-controls-right {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n}\n[data-dsh-compact-lane] .dock-controls-row {\n  justify-content: space-between;\n  column-gap: 12px;\n  row-gap: 8px;\n}\n[data-dsh-compact-lane] .dock-controls-left,[data-dsh-compact-lane] .dock-controls-right { column-gap: 8px; row-gap: 8px; min-width: 0; }\n[data-dsh-compact-lane] .dock-controls-row :is(.attach-btn, .mode-pill, .sandbox-pill, .model-choice-pill):hover:not(:disabled) { opacity: 0.8; }\n[data-dsh-compact-lane] .dock-controls-left { flex: 1 1 auto; }\n[data-dsh-compact-lane] .dock-controls-left > * { flex-shrink: 0; }\n[data-dsh-compact-lane] .dock-controls-right {\n  flex: 1 1 auto;\n  flex-wrap: nowrap;\n  margin-left: auto;\n  justify-content: flex-end;\n}\n\n[data-dsh-compact-lane] .security-tag-pill,[data-dsh-compact-lane] .model-choice-pill {\n  display: flex;\n  align-items: center;\n  border-radius: var(--radius-pill);\n  font-size: 15px;\n  white-space: nowrap;\n}\n[data-dsh-compact-lane] .security-tag-pill {\n  padding: 3px 9px;\n  background: var(--warning-tint);\n  color: var(--warning);\n}\n[data-dsh-compact-lane] .model-choice-pill {\n  max-width: 240px;\n  gap: 4px;\n  padding: 4px 10px;\n  background: transparent;\n  color: var(--text-secondary);\n}\n[data-dsh-compact-lane] .model-choice-pill svg { flex-shrink: 0; }\n[data-dsh-compact-lane] .model-choice-pill:disabled { opacity: 0.55; cursor: default; }\n[data-dsh-compact-lane] .model-choice-pill.model-pill {\n  min-width: 0;\n  max-width: min(240px, 100%);\n}\n[data-dsh-compact-lane] .model-pill-label {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n[data-dsh-compact-lane] .dock-error {\n  color: var(--danger);\n  font-size: 15px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n[data-dsh-compact-lane] .send-action-blue-btn {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--accent-blue);\n  box-shadow: var(--shadow-btn-blue);\n  color: var(--accent-contrast);\n  display: grid;\n  place-items: center;\n  flex-shrink: 0;\n}\n[data-dsh-compact-lane] .send-action-blue-btn:hover:not(:disabled) { background: var(--accent-blue-hover); }\n[data-dsh-compact-lane] .send-action-blue-btn:disabled { opacity: 0.45; cursor: default; box-shadow: none; }\n[data-dsh-compact-lane] .send-action-blue-btn.stop { background: var(--text-primary); box-shadow: none; }\n[data-dsh-compact-lane] .stop-square {\n  width: 10px;\n  height: 10px;\n  border-radius: 2px;\n  background: var(--bg-chat);\n}\n\n\n/* \u2550\u2550\u2550 attach-btn \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .attach-btn {\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  display: grid;\n  place-items: center;\n  color: var(--text-secondary);\n  background: transparent;\n}\n[data-dsh-compact-lane] .attach-btn:hover:not(:disabled) { color: var(--text-primary); }\n\n/* \u2550\u2550\u2550 mode-pill \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .mode-pill {\n  display: inline-flex;\n  align-items: center;\n  padding: 4px 10px;\n  border-radius: var(--radius-pill);\n  font-size: 15px;\n  font-weight: 600;\n  white-space: nowrap;\n  background: transparent;\n}\n[data-dsh-compact-lane] .mode-pill:disabled { opacity: 0.55; cursor: default; }\n[data-dsh-compact-lane] .mode-pill.mode-agent { color: var(--text-secondary); }\n[data-dsh-compact-lane] .mode-pill.mode-plan { color: var(--accent-blue); }\n[data-dsh-compact-lane] .mode-pill.mode-goal { color: var(--violet); }\n\n/* \u2550\u2550\u2550 tool-card-top \u2550\u2550\u2550 */\n/* \u5DE5\u5177\u5361\u7247\u4E0A\u7684\u9884\u89C8\u6309\u94AE(\u4E0E\u5C55\u5F00\u6309\u94AE\u5E76\u6392) */\n[data-dsh-compact-lane] .tool-card-top {\n  display: flex;\n  align-items: stretch;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .tool-card-top .tool-card-head {\n  flex: 1;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .tool-card-open {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 30px;\n  border: none;\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .tool-card-open:hover {\n  color: var(--accent-blue);\n  background: var(--bg-hover);\n}\n\n\n/* \u2550\u2550\u2550 file-ref+turn-changes \u2550\u2550\u2550 */\n/* \u56DE\u590D\u6B63\u6587\u7684\u5185\u8054\u6587\u4EF6\u5F15\u7528 */\n[data-dsh-compact-lane] .md-content .code-file-ref {\n  cursor: pointer;\n  text-decoration: underline dotted transparent;\n  transition: color var(--transition-smooth), text-decoration-color var(--transition-smooth);\n}\n[data-dsh-compact-lane] .md-content .code-file-ref:hover,[data-dsh-compact-lane] .md-content .code-file-ref:focus-visible {\n  color: var(--accent-blue);\n  text-decoration-color: currentColor;\n}\n\n/* \u6BCF\u8F6E\u56DE\u590D\u4E4B\u540E\u7684\u6587\u4EF6\u7EDF\u8BA1\u5361\u7247 */\n[data-dsh-compact-lane] .turn-changes {\n  margin-top: 10px;\n  overflow: hidden;\n  border: 1px solid var(--border-subtle);\n  border-radius: 12px;\n  background: var(--bg-card-surface);\n}\n[data-dsh-compact-lane] .turn-changes-header {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 68px;\n  padding: 10px 12px;\n}\n[data-dsh-compact-lane] .turn-changes-icon {\n  display: grid;\n  flex: none;\n  place-items: center;\n  width: 40px;\n  height: 40px;\n  border-radius: 11px;\n  background: var(--bg-surface-subtle);\n  color: var(--text-muted);\n}\n[data-dsh-compact-lane] .turn-changes-summary {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-width: 0;\n  line-height: 1.4;\n}\n[data-dsh-compact-lane] .turn-changes-summary strong { font-size: 15px; font-weight: 600; }\n[data-dsh-compact-lane] .turn-changes-total { display: flex; gap: 5px; font-size: 15px; font-weight: 500; }\n[data-dsh-compact-lane] .turn-changes-added { color: var(--diff-stat-add-fg); }\n[data-dsh-compact-lane] .turn-changes-removed { color: var(--diff-stat-del-fg); }\n[data-dsh-compact-lane] .turn-changes-actions { display: flex; align-items: center; flex: none; gap: 6px; }\n[data-dsh-compact-lane] .turn-changes-undo {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  min-height: 30px;\n  padding: 3px 5px;\n  font-size: 15px;\n  font-weight: 600;\n}\n[data-dsh-compact-lane] .turn-changes-undo:hover:not(:disabled) { color: var(--accent-blue); }\n[data-dsh-compact-lane] .turn-changes-undo:disabled { opacity: 0.45; cursor: default; }\n[data-dsh-compact-lane] .turn-changes-review {\n  flex: none;\n  min-height: 30px;\n  padding: 3px 11px;\n  border: 1px solid var(--border-subtle);\n  border-radius: 9px;\n  font-size: 15px;\n  font-weight: 600;\n}\n[data-dsh-compact-lane] .turn-changes-review:hover { background: var(--bg-hover); }\n[data-dsh-compact-lane] .turn-changes-body { border-top: 1px solid var(--border-subtle); padding: 5px 12px 7px; }\n[data-dsh-compact-lane] .turn-changes-file {\n  display: flex;\n  align-items: start;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 4px 12px;\n  padding: 5px 0;\n  min-width: 0;\n}\n[data-dsh-compact-lane] .turn-changes-path {\n  display: block;\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--text-secondary);\n  font-size: 15px;\n}\n[data-dsh-compact-lane] button.turn-changes-path:hover { color: var(--accent-blue); }\n[data-dsh-compact-lane] .turn-changes-file-stat {\n  display: flex;\n  flex: none;\n  gap: 3px;\n  font-size: 15px;\n  font-variant-numeric: tabular-nums;\n}\n[data-dsh-compact-lane] .turn-changes-more {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  min-height: 28px;\n  color: var(--text-primary);\n  font-size: 15px;\n  font-weight: 600;\n}\n[data-dsh-compact-lane] .turn-changes-more:hover { color: var(--accent-blue); }\n[data-dsh-compact-lane] .turn-changes-more svg { transition: transform var(--transition-smooth); }\n[data-dsh-compact-lane] .turn-changes-more svg.is-up { transform: rotate(180deg); }\n\n\n/* \u2550\u2550\u2550 message-enter+reduced-motion \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .message-enter {\n  animation: message-in var(--transition-smooth) both;\n}\n@keyframes message-in {\n  from { opacity: 0; transform: translateY(6px); }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  [data-dsh-compact-lane] *,[data-dsh-compact-lane] *::before,[data-dsh-compact-lane] *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    animation-delay: 0s !important;\n    transition-duration: 0.01ms !important;\n    transition-delay: 0s !important;\n    scroll-behavior: auto !important;\n  }\n}\n\n\n/* \u2550\u2550\u2550 conversation-pane+jump-latest \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .chat-conversation-pane {\n  flex: 1; min-height: 0; display: flex; flex-direction: column; position: relative; z-index: 1;\n  --chat-lane-max: 760px;\n  --chat-lane-shift: 0px;\n  --chat-lane-shrink: 0px;\n}\n[data-dsh-compact-lane] .chat-conversation-pane[hidden] { display: none; }\n/* \u79BB\u5F00\u5E95\u90E8\u540E\u6D6E\u5728\u8F93\u5165\u6846\u4E0A\u65B9,\u70B9\u51FB\u56DE\u5230\u6700\u65B0\u8F93\u51FA\u5E76\u6062\u590D\u8DDF\u968F\u3002 */\n[data-dsh-compact-lane] .chat-jump-latest {\n  position: absolute; left: 50%; bottom: calc(var(--composer-clearance, 120px) - 24px); z-index: 3;\n  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;\n  color: var(--text-primary); font-size: 12px; cursor: pointer;\n  background: var(--bg-elevated); border: 1px solid var(--border-strong); border-radius: 999px;\n  box-shadow: 0 2px 8px var(--overlay);\n  opacity: 0; visibility: hidden; transform: translate(-50%, 6px);\n  transition: opacity var(--transition-enter), transform var(--transition-enter), visibility 0s linear 0.18s;\n}\n[data-dsh-compact-lane] .chat-jump-latest[data-visible="true"] {\n  opacity: 1; visibility: visible; transform: translate(-50%, 0);\n  transition: opacity var(--transition-enter), transform var(--transition-enter), visibility 0s;\n}\n[data-dsh-compact-lane] .chat-jump-latest:hover { color: var(--accent-blue); }\n@media (prefers-reduced-motion: reduce) { [data-dsh-compact-lane] .chat-jump-latest { transition: none; } }\n\n/* \u2550\u2550\u2550 md-block \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .md-block { display: contents; }\n[data-dsh-compact-lane] .md-content > .md-block:first-child > :first-child { margin-top: 0; }\n[data-dsh-compact-lane] .md-content > .md-block:last-child > :last-child { margin-bottom: 0; }\n[data-dsh-compact-lane] .thinking-scroll-viewport .md-content > .md-block > p { margin: 0 0 0.85em; }\n[data-dsh-compact-lane] .thinking-scroll-viewport .md-content > .md-block:last-child > p:last-child { margin-bottom: 0; }\n[data-dsh-compact-lane] .md-block.is-entering > * { animation: markdown-tail-in 120ms cubic-bezier(0.16, 1, 0.3, 1) backwards; }\n\n/* \u2550\u2550\u2550 summary-arrival \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .summary-arrival { animation: summary-in 180ms cubic-bezier(0.16, 1, 0.3, 1) backwards; }\n@keyframes summary-in { from { opacity: 0; transform: translateY(2px); } }\n\n/* \u2550\u2550\u2550 message-surface+content-swap \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .chat-message-surface {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 22px;\n  width: 100%;\n  min-height: 100%;\n  flex: 1 0 auto;\n}\n[data-dsh-compact-lane] .chat-message-surface > .user-msg-container,[data-dsh-compact-lane] .chat-message-surface > .assistant-block,[data-dsh-compact-lane] .chat-message-surface > .chat-error-card {\n  width: calc(min(100%, var(--chat-lane-max, 760px)) - var(--chat-lane-shrink, 0px));\n  margin-right: calc(var(--chat-lane-shift, 0px) * 2);\n}\n[data-dsh-compact-lane] .chat-message-surface > .empty-state { width: min(100%, 460px); }\n\n[data-dsh-compact-lane] .content-swap { position: relative; min-width: 0; }\n[data-dsh-compact-lane] .content-swap-current { display: block; animation: content-swap-in 140ms var(--motion-ease-enter); }\n[data-dsh-compact-lane] .content-swap-outgoing {\n  display: block;\n  position: absolute;\n  inset: 0;\n  pointer-events: none;\n  animation: content-swap-out var(--swap-exit-ms, 140ms) var(--motion-ease-exit) forwards;\n}\n@keyframes content-swap-in { from { opacity: 0; } to { opacity: 1; } }\n@keyframes content-swap-out { to { opacity: 0; } }\n\n\n/* \u2550\u2550\u2550 composer-action-slot \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .input-textarea { transition: height 120ms var(--motion-ease-enter); }\n[data-dsh-compact-lane] .composer-action-slot { display: inline-flex; align-items: center; gap: 6px; flex: none; min-height: 32px; }\n[data-dsh-compact-lane] .composer-action-stack { display: inline-grid; grid-auto-flow: column; align-items: center; gap: 6px; }\n[data-dsh-compact-lane] .composer-action-stack > .send-action-blue-btn {\n  grid-row: 1;\n  grid-column: 1;\n  opacity: 1;\n  transform: scale(1);\n  transition: opacity 120ms ease, transform 160ms var(--motion-ease-enter), background-color 100ms ease;\n}\n[data-dsh-compact-lane] .composer-action-stack > .send-action-blue-btn:disabled { opacity: 0.45; }\n[data-dsh-compact-lane] .composer-action-slot > .composer-action-stack > .stop,[data-dsh-compact-lane] .composer-action-slot.is-streaming:not(.has-instruction) > .composer-action-stack > .send { opacity: 0; transform: scale(0.86); pointer-events: none; }\n[data-dsh-compact-lane] .composer-action-slot.is-streaming > .composer-action-stack > .stop { opacity: 1; transform: scale(1); pointer-events: auto; }\n[data-dsh-compact-lane] .composer-action-slot.is-streaming.has-instruction > .composer-action-stack > .stop { grid-column: 2; }\n\n/* \u2550\u2550\u2550 tool-status-swap+tool-card-in \u2550\u2550\u2550 */\n[data-dsh-compact-lane] .tool-status-swap { display: inline-grid; flex: none; width: 16px; height: 16px; color: var(--text-muted); transition: color 140ms ease; }\n[data-dsh-compact-lane] .tool-status-swap.is-error { color: var(--danger); }\n[data-dsh-compact-lane] .tool-status-swap.is-done { color: var(--success); }\n[data-dsh-compact-lane] .tool-status-swap > .content-swap-current,[data-dsh-compact-lane] .tool-status-swap > .content-swap-outgoing { display: grid; place-items: center; }\n[data-dsh-compact-lane] .tool-status-swap.compact.is-done { width: 0; transition: width 140ms var(--motion-ease-enter), color 140ms ease; }\n[data-dsh-compact-lane] .tool-status-swap.compact { transition: width 140ms var(--motion-ease-enter), color 140ms ease; }\n[data-dsh-compact-lane] .tool-card,[data-dsh-compact-lane] .tool-run,[data-dsh-compact-lane] .tool-compact-item,[data-dsh-compact-lane] .tool-compact-group { animation: tool-card-in 180ms var(--motion-ease-enter); }\n@keyframes tool-card-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }\n\n[data-dsh-compact-lane] .dot-loader {\n  display: grid;\n  grid-template-columns: repeat(6, 1fr);\n  padding: .05em;\n  gap: .016em;\n  font-size: 16px;\n}\n[data-dsh-compact-lane] .dot-loader i {\n  position: relative;\n  display: block;\n  border-radius: 22%;\n  background: color-mix(in srgb, currentColor 12%, transparent);\n}\n[data-dsh-compact-lane] .dot-loader i::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  border-radius: inherit;\n  background: currentColor;\n  animation: dot-wave 2s ease-in-out var(--d, 0s) infinite;\n}\n@keyframes dot-wave {\n  0% { opacity: .5; } 25% { opacity: 0; } 50% { opacity: .5; } 75% { opacity: 1; } 100% { opacity: .5; }\n}\n';

// src/styles/host.css
var host_default = "/* Host-only integration. No CSS Modules class names or changes to host state. */\n[data-dsh-compact-lane] {\n  display: flex;\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n  background: var(--bg-chat);\n  color: var(--text-primary);\n  font-family: var(--font-sans);\n  font-size: 15px;\n}\n[data-dsh-compact-lane] .main-chat-view {\n  min-height: 0;\n  --composer-clearance: calc(var(--dsh-composer-height, 184px) + 36px);\n}\n[data-dsh-compact-lane] .chat-conversation-pane {\n  min-height: 0;\n}\n[data-dsh-compact-lane] .chat-message-surface {\n  flex-shrink: 0;\n}\n[data-dsh-compact-lane] .chat-scroll-area {\n  overflow-anchor: none;\n}\n[data-dsh-compact-lane] .lane-file-badge {\n  display: inline-grid;\n  place-items: center;\n  border-radius: 3px;\n  color: #fff;\n  font: 700 7px/1 var(--font-mono);\n  letter-spacing: -0.02em;\n}\n[data-dsh-compact-lane] .lane-raw-result {\n  margin: 0;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n  font: 12px/1.65 var(--font-mono);\n}\n[data-dsh-compact-lane] .lane-notice,\n[data-dsh-compact-lane] .lane-action-error {\n  font-size: 13px;\n  color: var(--text-muted);\n  overflow-wrap: anywhere;\n}\n[data-dsh-compact-lane] .lane-action-error {\n  color: var(--danger);\n}\n[data-dsh-compact-lane] .lane-load-older {\n  align-self: center;\n  color: var(--text-muted);\n  font-size: 13px;\n}\n[data-dsh-compact-lane] .compact-diff-scroll-content {\n  padding: 0;\n}\n[data-dsh-compact-lane] .compact-diff-scroll-shell > .thinking-scroll-viewport {\n  max-height: 320px;\n}\n/* The host Markdown parser is retained; neutralize only its outer typography. */\n[data-dsh-compact-lane] .md-content > div {\n  color: inherit;\n  font: inherit;\n  line-height: inherit;\n}\n[data-dsh-compact-lane] .md-content > div > :first-child {\n  margin-top: 0;\n}\n[data-dsh-compact-lane] .md-content > div > :last-child {\n  margin-bottom: 0;\n}\n[data-dsh-compact-lane] .assistant-turn-process-item:empty {\n  display: none;\n}\n[data-dsh-compact-lane] .no-enter {\n  animation: none !important;\n}\n[data-dsh-compact-lane] .lane-file-attachment {\n  border: 1px solid var(--border-subtle);\n  border-radius: 8px;\n  padding: 8px 12px;\n  font-size: 13px;\n}\n[data-dsh-compact-lane] .tool-compact-group.is-single > .tool-collapse,\n[data-dsh-compact-lane]\n  .tool-compact-group.is-single\n  > .tool-collapse\n  > .tool-collapse-inner,\n[data-dsh-compact-lane] .tool-compact-lines.is-single {\n  display: contents;\n}\n@media (prefers-reduced-motion: reduce) {\n  [data-dsh-compact-lane] .dot-loader i::after {\n    animation: none;\n    opacity: 0.65;\n  }\n}\n/* Settings page (rendered by the DSH settings shell, outside the lane root). */\n.compact-lane-settings-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 24px;\n  padding: 16px 0;\n}\n.compact-lane-settings-title {\n  font-size: 14px;\n  line-height: 20px;\n}\n.compact-lane-settings-description {\n  margin-top: 4px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 18px;\n}\n.compact-lane-settings-error {\n  margin-top: 4px;\n  color: var(--dsw-alias-state-error-primary);\n  font-size: 12px;\n}\n";

// src/integration.ts
var chatOverride = {
  name: "conversation.view",
  id: "chat",
  order: 0,
  priority: -100
};
function chatTabDedupCss(entries, developerTools) {
  const tabs = entries.filter(
    (e) => e.options.id !== void 0 && (developerTools || e.options.id !== "trajectory")
  );
  let seenChat = false;
  const hidden = [];
  tabs.forEach((entry, i) => {
    if (entry.options.id !== "chat") return;
    if (seenChat) hidden.push(i + 1);
    seenChat = true;
  });
  const strip = `[data-conversation-tabs]:has(> [role="tab"]:nth-child(${tabs.length}):last-child)`;
  if (hidden.length && tabs.length - hidden.length === 1)
    return `${strip} { display: none; }`;
  return hidden.map(
    (index) => `${strip} > [role="tab"]:nth-child(${index}) { display: none; }`
  ).join("\n");
}
function installChatTabDedup(slots, developerTools) {
  const style = document.createElement("style");
  style.dataset.dshCompactTabs = "";
  const update = () => {
    style.textContent = chatTabDedupCss(
      slots.entries("conversation.view"),
      developerTools.getSnapshot()
    );
  };
  const stopSlots = slots.subscribe("conversation.view", update);
  const stopTools = developerTools.subscribe(update);
  update();
  document.head.append(style);
  return () => {
    stopSlots();
    stopTools();
    style.remove();
  };
}

// src/ui/settings.tsx
var import_react7 = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/settings.ts
var NAMESPACE = "compact-lane";
function normalizeFoldMode(value) {
  return value === "unfolded" ? "unfolded" : "folded";
}
function normalizeIconColor(value) {
  return value !== false;
}

// src/ui/settings.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var SECTION_LABEL = "\u7D27\u51D1\u5BF9\u8BDD";
var OPTIONS = [
  { value: "folded", label: "\u6298\u53E0" },
  { value: "unfolded", label: "\u4E0D\u6298\u53E0" }
];
var ICON_COLOR_OPTIONS = [
  { value: "off", label: "\u5173\u95ED" },
  { value: "on", label: "\u5F00\u542F" }
];
var HINT = {
  folded: "\u8FC7\u7A0B\u884C\u548C\u5DE5\u5177\u8C03\u7528\u9ED8\u8BA4\u6536\u8D77\uFF0C\u70B9\u51FB\u540E\u5C55\u5F00\u3002",
  unfolded: "\u8FC7\u7A0B\u884C\u548C\u5DE5\u5177\u8C03\u7528\u9ED8\u8BA4\u5C55\u5F00\uFF0C\u4ECD\u53EF\u624B\u52A8\u6536\u8D77\u3002"
};
function SettingsSection({
  useForm,
  setFoldMode,
  setIconColor
}) {
  const snapshot = useForm((s) => s);
  const [busy, setBusy] = (0, import_react7.useState)(false), [failed, setFailed] = (0, import_react7.useState)(false);
  const mode = normalizeFoldMode(snapshot.value?.foldMode);
  const iconColor = normalizeIconColor(snapshot.value?.iconColor);
  const disabled = busy || !snapshot.writable || snapshot.status !== "ready";
  const save = (write) => {
    setFailed(false);
    setBusy(true);
    write.then((ok) => setFailed(!ok)).catch(() => setFailed(true)).finally(() => setBusy(false));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "compact-lane-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "compact-lane-settings-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "compact-lane-settings-title", children: "\u5DE5\u5177\u8C03\u7528\u5C55\u793A" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "compact-lane-settings-description", children: HINT[mode] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        import_dsh_client_ui_primitives2.SegmentedControl,
        {
          id: "compact-lane-fold-mode",
          label: "\u5DE5\u5177\u8C03\u7528\u5C55\u793A",
          value: mode,
          options: OPTIONS,
          disabled,
          onChange: (next) => save(setFoldMode(next))
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "compact-lane-settings-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "compact-lane-settings-title", children: "\u5DE5\u5177\u56FE\u6807\u914D\u8272" }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "compact-lane-settings-description", children: "\u5F00\u542F\u540E\uFF0C\u6BCF\u7C7B\u5DE5\u5177\u8C03\u7528\u7684\u5DE6\u4FA7\u56FE\u6807\u4F7F\u7528\u5404\u81EA\u7684\u989C\u8272\uFF1B\u5173\u95ED\u5219\u7EDF\u4E00\u4E3A\u7070\u8272\u3002" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        import_dsh_client_ui_primitives2.SegmentedControl,
        {
          id: "compact-lane-icon-color",
          label: "\u5DE5\u5177\u56FE\u6807\u914D\u8272",
          value: iconColor ? "on" : "off",
          options: ICON_COLOR_OPTIONS,
          disabled,
          onChange: (next) => save(setIconColor(next === "on"))
        }
      )
    ] }),
    failed && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { role: "alert", className: "compact-lane-settings-error", children: "\u8BBE\u7F6E\u672A\u80FD\u4FDD\u5B58\u3002\u901A\u8FC7 --patch \u53E0\u52A0\u5C42\u52A0\u8F7D\u7684\u63D2\u4EF6\uFF0C\u5176\u914D\u7F6E\u65E0\u6CD5\u7531\u5BBF\u4E3B\u5199\u5165\uFF1B\u8BF7\u6539\u7528 dsh plugin add \u5B89\u88C5\u3002" })
  ] });
}

// src/client.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function TurnSeat({
  turn,
  useTurn,
  actions
}) {
  const model = useTurn(String(turn));
  return model ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Turn, { model, actions }) : null;
}
function CompactView({
  sessionId,
  useFoldMode,
  useIconColor,
  useChat,
  useTurn,
  useSession,
  useSessions,
  useSessionStatus,
  openFile,
  openAgent,
  fork,
  loadOlder,
  loadImage
}) {
  const foldMode = useFoldMode((m) => m);
  const iconColor = useIconColor((v) => v);
  const order = useChat((s) => s.timeline.turnOrder);
  const more = useSession((s) => s.hasMore), loading = useSession((s) => s.loadingOlder), openError = useSession((s) => s.openError);
  const projections = useSessions(
    (s) => s.projectionsBySession[sessionId]?.values
  );
  const summaries = useSessions((s) => s.byId);
  const statuses = useSessionStatus((s) => s);
  const [error, setError] = (0, import_react8.useState)("");
  const actions = (0, import_react8.useMemo)(() => {
    const catalog = projections?.subagentCatalog;
    const agents = /* @__PURE__ */ new Map();
    if (Array.isArray(catalog)) {
      for (const entry of catalog)
        if (entry.mode !== "external")
          agents.set(entry.id, {
            mode: entry.mode,
            running: statuses.get(entry.id)?.running ?? summaries[entry.id]?.running
          });
    }
    return {
      openFile,
      fork,
      agents,
      loadImage,
      openAgent: (id) => {
        const a = agents.get(id);
        if (a) openAgent(id, a.mode);
      }
    };
  }, [projections, summaries, statuses, openFile, openAgent, fork, loadImage]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_dsh_client_ui_primitives3.MarkdownDelegateProvider,
    {
      openFile: async (path) => openFile(path),
      openExternalLink: (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FoldModeContext.Provider, { value: foldMode, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconColorContext.Provider, { value: iconColor, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Lane,
        {
          identity: sessionId,
          page: more ? {
            loading,
            load: async () => {
              setError("");
              try {
                await loadOlder();
              } catch (e) {
                setError(String(e));
              }
            }
          } : void 0,
          header: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
            (error || openError) && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { role: "alert", className: "lane-action-error", children: error || String(openError) }),
            !order.length && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "lane-notice", children: "\u5F00\u59CB\u5BF9\u8BDD\u540E\uFF0C\u5DE5\u5177\u8C03\u7528\u4F1A\u663E\u793A\u5728\u8FD9\u91CC\u3002" })
          ] }),
          children: order.map((turn) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            TurnSeat,
            {
              turn,
              useTurn,
              actions
            },
            turn
          ))
        }
      ) }) })
    }
  );
}
var inject = [
  "slots",
  "sessions",
  "uiConversation",
  "uiWorkspace",
  "sidebarRight",
  "configForms"
];
function installStyles(ctx) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.dshCompactLaneStyles = "";
    style.textContent = vela_compact_default + "\n" + host_default;
    document.head.append(style);
    return () => style.remove();
  });
}
function fieldOf(form, read) {
  return {
    getSnapshot: read,
    subscribe: (listener) => {
      let previous = read();
      return form.subscribe(() => {
        const next = read();
        if (next === previous) return;
        previous = next;
        listener();
      });
    }
  };
}
function foldModeOf(form) {
  return fieldOf(
    form,
    () => normalizeFoldMode(form.getSnapshot().value?.foldMode)
  );
}
function iconColorOf(form) {
  return fieldOf(
    form,
    () => normalizeIconColor(form.getSnapshot().value?.iconColor)
  );
}
function apply(ctx) {
  installStyles(ctx);
  const form = ctx.configForms.get(NAMESPACE);
  const foldMode = foldModeOf(form);
  const iconColor = iconColorOf(form);
  ctx.effect(
    () => ctx.configForms.whileServed(
      [NAMESPACE],
      () => ctx.slots.inject(
        "settings.section",
        () => ctx.slots.register(
          {
            name: "settings.section",
            id: "compact-lane",
            order: 30,
            label: SECTION_LABEL,
            inject: () => ({
              hooks: { form },
              setFoldMode: (mode) => form.set("foldMode", mode),
              setIconColor: (on) => form.set("iconColor", on)
            })
          },
          SettingsSection
        )
      )
    )
  );
  ctx.effect(
    () => installChatTabDedup(ctx.slots, ctx.configForms.developerTools.enabled)
  );
  ctx.slots.inject(
    "conversation.view",
    () => ctx.slots.register(
      {
        ...chatOverride,
        label: () => {
          const original = ctx.slots.entries("conversation.view").find(
            (entry) => entry.options.id === "chat" && entry.component !== CompactView
          );
          return (0, import_dsh_client_ui_slots.resolveSlotLabel)(original?.options.label) ?? "\u5BF9\u8BDD";
        },
        inject: (sessionId) => {
          const binding = ctx.sessions.binding(sessionId);
          if (!binding)
            throw new Error(`compact: unknown session ${sessionId}`);
          const target = ctx.uiConversation.binding(binding).target("chat");
          const source = {
            getSnapshot: () => {
              const value = target.getSnapshot();
              if (!value) throw new Error("compact: Chat target unavailable");
              return value;
            },
            subscribe: target.subscribe.bind(target)
          };
          const sources = /* @__PURE__ */ new Map();
          return {
            hooks: { foldMode, iconColor },
            keyedHooks: {
              turn: (key) => {
                let s = sources.get(key);
                if (!s) {
                  s = turnSource(source, Number(key));
                  sources.set(key, s);
                }
                return s;
              }
            },
            openFile: (path) => {
              const cwd = ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd;
              ctx.sidebarRight.openResource(
                fileAddressFor(sessionId, cwd, path)
              );
            },
            openAgent: (id, mode) => ctx.sidebarRight.openResource(
              `dsh-resource://subagentchat/session/${encodeURIComponent(id)}?parent=${encodeURIComponent(sessionId)}&mode=${encodeURIComponent(mode)}`,
              { kind: "subagentchat", preferNewPane: true }
            ),
            fork: async (seq) => {
              const child = await ctx.sessions.fork({
                sessionId,
                atSeq: seq,
                increaseTitle: true
              });
              ctx.uiWorkspace.openSession(child);
            },
            loadOlder: async () => {
              await binding.session.loadOlder();
            },
            loadImage: (attachment) => ctx.uiConversation.imageUrl(sessionId, attachment)
          };
        }
      },
      CompactView
    )
  );
}

return module.exports;}});
