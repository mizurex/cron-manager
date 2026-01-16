import { execSync } from "child_process";

type CronJob = {
  Cron: string; 
  Job: string;  
};

export function shellGetCrontab(): CronJob[] {
  let out = "";
  try {
    out = execSync("crontab -l", { encoding: "utf8" });
  } catch {
    return [];
  }

  const lines = out.split("\n");
  const jobs: CronJob[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // skip comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    const parts = trimmed.split(/\s+/);

    if (parts.length < 6) continue;

    const cron = parts.slice(0, 5).join(" ");
    const job = parts.slice(5).join(" ");

    jobs.push({ Cron: cron, Job: job });
  }

  return jobs;
}


export function shellWriteAllCronjobs(jobs: CronJob[]) {
    let text = "";
    for (const job of jobs) {
      text += `${job.Cron} ${job.Job}\n`;
    }
    execSync("crontab -", { input: text });
  }
  
  /**
   * Adds one job to the existing crontab.
   */
  export function shellAddCronJob(job: CronJob) {
    const existing = shellGetCrontab();
    existing.push(job);
    shellWriteAllCronjobs(existing);
  }
  