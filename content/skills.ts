import type { SkillGroup } from "@/lib/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Backend",
    skills: [".NET Core", "ASP.NET Core", "C#", "Entity Framework Core", "SignalR", "Dapper"],
  },
  {
    category: "Databases",
    skills: ["MSSQL", "PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    category: "Infrastructure",
    skills: ["RabbitMQ", "Docker", "CI/CD", "Jenkins", "Git", "xUnit"],
  },
  {
    category: "AI & Intelligence",
    skills: ["OpenAI API", "RAG", "Prompt Engineering", "Ollama", "ML.NET", "Claude API", "Cursor"],
  },
];
