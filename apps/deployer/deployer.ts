import path from "path";
import { tmpdir } from "node:os";
import { existsSync } from "fs";
import { mkdir, writeFile, readFile } from "fs/promises";
import { execa } from "execa";

export const vercelDeployer = async (jobId: string) => {
  const tmpPath = path.join(tmpdir(), `vercel-deploy-${jobId}`);
  const projectName = process.env.PROJECT_NAME || "omakase-app";

  try {
    if (existsSync(tmpPath)) {
      await execa("rm", ["-rf", tmpPath]);
    }

    await mkdir(tmpPath, { recursive: true });

    const repoUrl = "https://github.com/masato-io/omakase.git";
    await execa("git", ["clone", "--depth", "1", repoUrl, path.join(tmpPath, "source")]);

    const frontendPath = path.join(tmpPath, "source", "apps", "frontend");
    await execa("cp", ["-R", frontendPath + "/.", tmpPath]);
    await execa("cp", [path.join(frontendPath, "main.tf"), tmpPath]);
    await execa("rm", ["-rf", path.join(tmpPath, "source")]);

    const mainTfPath = path.join(tmpPath, "main.tf");
    let mainTfContent = await readFile(mainTfPath, "utf8");
    mainTfContent = mainTfContent
      .replace(/source\s*=\s*"git::https:\/\/github\.com\/masato-io\/omakase\.git[^\"]*"/g, 'source = "./"');

    await writeFile(mainTfPath, mainTfContent, "utf8");

    const tfvarsContent = `vercel_api_token = "${process.env.VERCEL_API_TOKEN}"
project_name = "${projectName}"`;
    await writeFile(path.join(tmpPath, "terraform.tfvars"), tfvarsContent);

    process.chdir(tmpPath);
    await execa("rm", ["-rf", ".terraform*"], { shell: true, reject: false });
    await execa("rm", ["-f", "terraform.tfstate*"], { shell: true, reject: false });
    await execa("rm", ["-f", ".terraform.lock.hcl"], { shell: true, reject: false });

    await execa("ls", ["-la"], { stdio: "inherit" });
    await execa("terraform", ["init"], {
      stdio: "inherit",
      env: {
        ...process.env,
        TF_VAR_vercel_api_token: process.env.VERCEL_API_TOKEN,
      },
    });

    await execa("terraform", ["apply", "-auto-approve", `-var=project_name=${projectName}`], {
      stdio: "inherit",
      env: {
        ...process.env,
        TF_VAR_vercel_api_token: process.env.VERCEL_API_TOKEN,
      },
    });
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  } finally {
    if (existsSync(tmpPath)) {
      await execa("rm", ["-rf", tmpPath]);
    }
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.VERCEL_API_TOKEN) {
    console.error('Error: VERCEL_API_TOKEN environment variable is required');
    console.error('Usage: VERCEL_API_TOKEN=xyz PROJECT_NAME=my-app npx tsx deployer.ts');
    process.exit(1);
  }

  vercelDeployer('test-job-' + Date.now())
    .catch(error => {
      console.error('Deployment failed:', error);
      process.exit(1);
    });
}
