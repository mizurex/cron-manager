/**
 *   GET  /crontab  - list current cron jobs
 *   POST /crontab - add one cron job
 *   PUT  /crontab - replace all cron jobs
 */

import http from "http";
import {shellGetCrontab, shellAddCronJob, shellWriteAllCronjobs} from "./utils/helper";

type CronJob = {
  Cron: string; 
  Job: string;  
};


const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.url !== "/crontab") {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  // GET /crontab -> return current system crontab
  if (req.method === "GET") {
    const jobs = shellGetCrontab();
    return res.end(JSON.stringify(jobs, null, 2));
  }

  // POST /crontab -> add one job
  if (req.method === "POST") {
    let body = "";
    req.on("data", c => (body += c));
    req.on("end", () => {
      const job: CronJob = JSON.parse(body);
      shellAddCronJob(job);
      res.end(JSON.stringify(job, null, 2));
    });
    return;
  }

  // PUT /crontab -> replace all jobs
  if (req.method === "PUT") {
    let body = "";
    req.on("data", c => (body += c));
    req.on("end", () => {
      const jobs: CronJob[] = JSON.parse(body);
      shellWriteAllCronjobs(jobs);
      res.end(JSON.stringify(jobs, null, 2));
    });
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method not allowed" }));
});


server.listen(8816, "0.0.0.0", () => {
  console.log("Running");
});
