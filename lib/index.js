import z from "@deepseek-ai/schemastery";
const Config = z.object({
  foldMode: z.union([z.const("folded"), z.const("unfolded")]).default("folded").volatile(),
  iconColor: z.boolean().default(true).volatile()
});
function apply(ctx) {
  ctx.inject(["settings"], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
}
export {
  Config,
  apply
};
