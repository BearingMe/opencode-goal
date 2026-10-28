import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Plugin, Skill } from "@opencode/plugin";

const SKILL_IDS = ["ralph-loop", "cancel-ralph", "help"] as const;
const SKILLS_DIRECTORY = join(dirname(fileURLToPath(import.meta.url)), "..", "skills");

export async function registerSkills(ctx: Plugin.Context): Promise<void> {
  const { data } = await ctx.skill.list();
  const existing = new Set<string>(data.map((skill) => skill.id));
  const packaged = SKILL_IDS.filter((id) => !existing.has(id)).map(loadSkill);

  await ctx.skill.transform((editor) => {
    for (const skill of packaged) editor.add(skill);
  });
}

function loadSkill(id: (typeof SKILL_IDS)[number]): Skill.Info {
  const path = join(SKILLS_DIRECTORY, id, "SKILL.md");
  const source = readFileSync(path, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Packaged skill ${id} has invalid frontmatter.`);

  const metadata = match[1];
  const name = metadata.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = metadata.match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name || !description) throw new Error(`Packaged skill ${id} requires name and description.`);

  return {
    id: id as Skill.ID,
    name: name as Skill.Name,
    description,
    path: path as Skill.Info["path"],
    content: match[2].replace(/^\r?\n/, ""),
  };
}
