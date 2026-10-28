import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import type { Plugin as OpenCodePlugin, Skill } from "@opencode/plugin";
import { registerSkills } from "../src/skills.ts";

function fakeSkill(id: string, name = id): Skill.Info {
  return {
    id: id as Skill.ID,
    name: name as Skill.Name,
    description: "User-owned skill",
    path: `C:/user/skills/${id}/SKILL.md` as Skill.Info["path"],
    content: "User-owned content",
  };
}

async function setup(existingSkills: Skill.Info[] = []) {
  const skills = new Map<string, Skill.Info>(existingSkills.map((skill) => [skill.id, skill]));
  const context = {
    skill: {
      list: async () => ({ data: [...skills.values()] }),
      transform: async (
        register: (editor: { add(skill: Skill.Info): void }) => void,
      ) => register({ add: (skill) => skills.set(skill.id, skill) }),
    },
  } as unknown as OpenCodePlugin.Context;

  await registerSkills(context);
  return skills;
}

describe("V2 skill registration", () => {
  it("registers every packaged skill with its body and absolute source path", async () => {
    const skills = await setup();

    expect([...skills.keys()]).toEqual(["ralph-loop", "cancel-ralph", "help"]);
    for (const skill of skills.values()) {
      expect(skill.path).toMatch(/^(?:[A-Za-z]:[\\/]|\/)/);
      expect(existsSync(skill.path)).toBe(true);
      expect(skill.content).toMatch(/^#/);
      expect(skill.content).not.toMatch(/^---/);
      expect(skill.description).toBeTruthy();
    }
  });

  it("skips an existing ID without replacing the user-owned skill", async () => {
    const userHelp = fakeSkill("help", "Custom Help");
    const skills = await setup([userHelp]);

    expect([...skills.keys()]).toEqual(["help", "ralph-loop", "cancel-ralph"]);
    expect(skills.get("help")).toBe(userHelp);
    expect(skills.get("ralph-loop")?.content).toContain("completion promise");
  });
});
