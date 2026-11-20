"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { profile } from "@/content/profile";

type Entry = {
  input: string;
  output: ReactNode;
};

function Help() {
  const rows = [
    ["contact", "Email address", "ml-4"],
    ["github", "GitHub profile", "ml-5"],
    ["linkedin", "LinkedIn profile", "ml-3"],
    ["status", "Current availability", "ml-5"],
    ["clear", "Clear terminal", "ml-6"],
  ] as const;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted">Available commands:</span>
      {rows.map(([command, description, gap]) => (
        <span key={command}>
          <span className="text-copper">{command}</span>
          <span className={`text-muted ${gap}`}>— {description}</span>
        </span>
      ))}
    </div>
  );
}

function LinkLine({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ice underline transition-colors hover:text-ice/80"
    >
      {label}
    </a>
  );
}

export function CommandTerminal() {
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([{ input: "help", output: <Help /> }]);

  const respond = (command: string) => {
    switch (command) {
      case "help":
        return <Help />;
      case "contact":
        return profile.email ? (
          <a href={`mailto:${profile.email}`} className="text-copper hover:text-copper/80">
            {profile.email}
          </a>
        ) : (
          <span className="text-muted">Email has not been added yet.</span>
        );
      case "github":
        return <LinkLine href={profile.githubUrl} label={profile.github} />;
      case "linkedin":
        return <LinkLine href={profile.linkedinUrl} label={profile.linkedin} />;
      case "status":
        return <span className="text-green">{profile.statusMessage}</span>;
      default:
        return (
          <span className="text-muted">
            Command not found: <span className="text-copper">{command}</span>. Type{" "}
            <span className="text-copper">help</span> for available commands.
          </span>
        );
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      setEntries([]);
      setValue("");
      return;
    }
    setEntries((current) => [...current, { input: value.trim(), output: respond(command) }]);
    setValue("");
  };

  return (
    <div className="w-full border border-border bg-deep font-code text-sm">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-border" />
          <div className="h-3 w-3 rounded-full bg-border" />
          <div className="h-3 w-3 rounded-full bg-green/60" />
        </div>
        <span className="ml-2 font-mono text-[10px] tracking-widest uppercase text-muted">
          {profile.terminalHost}
        </span>
      </div>
      <div className="flex max-h-[400px] min-h-[260px] flex-col gap-3 overflow-y-auto p-5">
        <div className="font-mono text-[11px] text-muted">
          Welcome. Type <span className="text-copper">help</span> to see available commands.
        </div>
        {entries.map((entry, index) => (
          <div key={`${entry.input}-${index}`} className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-copper">$ </span>
              <span className="text-text/70">{entry.input}</span>
            </div>
            {entry.output ? <div className="pl-4 text-text/80">{entry.output}</div> : null}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border px-5 py-4">
        <span className="shrink-0 text-copper">$</span>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="type a command..."
          className="flex-1 bg-transparent font-code text-sm text-text/80 caret-copper outline-none placeholder:text-muted/40"
        />
      </form>
    </div>
  );
}
