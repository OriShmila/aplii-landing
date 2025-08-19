#!/usr/bin/env node

import { exec, execSync } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

// Get environment parameter from command line arguments
const environment = process.argv[2];

if (!environment) {
  console.error("❌ Error: Environment parameter is required");
  console.log("Usage: npm run deploy <environment>");
  console.log("Example: npm run deploy dev");
  process.exit(1);
}

console.log(
  `🚀 Starting deployment to AWS Amplify for environment: ${environment}`
);

async function deployToAmplify() {
  try {
    // Check if dist folder exists (build output)
    const distPath = path.join(process.cwd(), "dist");
    if (!fs.existsSync(distPath)) {
      console.error(
        "❌ Error: dist folder not found. Make sure to run build first."
      );
      process.exit(1);
    }

    console.log("📦 Build files found, proceeding with deployment...");

    // Check if AWS CLI is installed
    try {
      await execAsync("aws --version");
      console.log("✅ AWS CLI is available");
    } catch (error) {
      console.error("❌ Error: AWS CLI is not installed or not in PATH");
      console.log(
        "Please install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
      );
      process.exit(1);
    }

    // Check if AWS Amplify service is available
    try {
      await execAsync("aws amplify list-apps --region us-east-1");
      console.log("✅ AWS Amplify service is available");
    } catch (error) {
      console.error("❌ Error: Cannot access AWS Amplify service");
      console.log("Please ensure:");
      console.log("1. AWS credentials are configured: aws configure");
      console.log("2. You have permissions for AWS Amplify service");
      console.log("3. Check your AWS region configuration");
      process.exit(1);
    }

    // Create zip file from dist folder
    console.log("📦 Creating deployment package...");
    const zipFileName = `aplii-landing-${environment}-${Date.now()}.zip`;

    await execAsync(`cd dist && zip -r ../${zipFileName} .`);
    console.log(`✅ Created deployment package: ${zipFileName}`);

    // Set environment variables for the deployment
    process.env.AMPLIFY_ENVIRONMENT = environment;

    console.log(`🔧 Configuring for environment: ${environment}`);

    // Deploy to Amplify using AWS CLI
    console.log("🚀 Starting AWS Amplify deployment...");

    // First, get the app ID and branch name (you may need to customize these)
    const appName = `aplii-landing-${environment}`;
    const region = process.env.AWS_DEFAULT_REGION || "us-east-1";

    console.log(`📡 Looking for Amplify app: ${appName} in region: ${region}`);

    try {
      // List apps to find the app ID
      const { stdout: appsOutput } = await execAsync(
        `aws amplify list-apps --region ${region}`
      );
      const apps = JSON.parse(appsOutput);

      let appId = null;
      const targetApp = apps.apps.find((app) => app.name === appName);

      if (targetApp) {
        appId = targetApp.appId;
        console.log(`✅ Found app ID: ${appId}`);

        // Check if main branch exists
        try {
          await execAsync(
            `aws amplify get-branch --app-id ${appId} --branch-name main --region ${region}`
          );
          console.log("✅ Main branch exists");
        } catch (branchError) {
          console.log("🌿 Main branch not found, creating it...");
          const createBranchCommand = `aws amplify create-branch --app-id ${appId} --branch-name main --region ${region}`;
          await execAsync(createBranchCommand);
          console.log("✅ Created main branch");
        }
      } else {
        console.log(`⚠️  App '${appName}' not found. Available apps:`);
        apps.apps.forEach((app) =>
          console.log(`  - ${app.name} (${app.appId})`)
        );
        console.log(`\n🔧 Creating new Amplify app: ${appName}`);

        // Create new Amplify app
        const createCommand = `aws amplify create-app --name "${appName}" --region ${region}`;
        const { stdout: createOutput } = await execAsync(createCommand);
        const createdApp = JSON.parse(createOutput);
        appId = createdApp.app.appId;
        console.log(`✅ Created new app with ID: ${appId}`);

        // Create the main branch for the new app
        console.log("🌿 Creating main branch...");
        const createBranchCommand = `aws amplify create-branch --app-id ${appId} --branch-name main --region ${region}`;
        await execAsync(createBranchCommand);
        console.log("✅ Created main branch");
      }

      // Use a simpler approach - directly deploy the zip file
      console.log("📦 Deploying using manual upload...");

      // For Amplify, we can use the simpler manual deployment approach
      // First, let's get the app's repository URL if it exists
      try {
        const { stdout: appOutput } = await execAsync(
          `aws amplify get-app --app-id ${appId} --region ${region}`
        );
        const appData = JSON.parse(appOutput);

        console.log(`📋 App details: ${appData.app.name}`);
        console.log(`🌐 Default domain: https://main.${appId}.amplifyapp.com`);

        // Check for running jobs and stop them if needed
        console.log("🔍 Checking for running deployments...");
        try {
          const { stdout: jobsOutput } = await execAsync(
            `aws amplify list-jobs --app-id ${appId} --branch-name main --region ${region} --max-results 5`
          );
          const jobs = JSON.parse(jobsOutput);

          const runningJobs = jobs.jobSummaries.filter(
            (job) => job.status === "PENDING" || job.status === "RUNNING"
          );

          if (runningJobs.length > 0) {
            console.log(
              `⚠️  Found ${runningJobs.length} running job(s). Stopping them...`
            );
            for (const job of runningJobs) {
              console.log(`🛑 Stopping job: ${job.jobId} (${job.status})`);
              try {
                await execAsync(
                  `aws amplify stop-job --app-id ${appId} --branch-name main --job-id ${job.jobId} --region ${region}`
                );
                console.log(`✅ Stopped job: ${job.jobId}`);
              } catch (stopError) {
                console.log(
                  `⚠️  Could not stop job ${job.jobId}: ${stopError.message}`
                );
              }
            }

            // Wait a moment for jobs to stop
            console.log("⏳ Waiting for jobs to stop...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
          } else {
            console.log("✅ No running jobs found");
          }
        } catch (jobError) {
          console.log("⚠️  Could not check running jobs:", jobError.message);
        }

        // Create a manual deployment
        console.log("🚀 Creating manual deployment...");

        // Use aws amplify create-deployment for manual zip uploads
        const deployCommand = `aws amplify create-deployment --app-id ${appId} --branch-name main --region ${region}`;
        const { stdout: deployOut } = await execAsync(deployCommand);

        console.log("📋 Raw deployment output:");
        console.log(deployOut);

        const deploymentData = JSON.parse(deployOut);

        if (deploymentData.zipUploadUrl && deploymentData.jobId) {
          console.log(`✅ Created job ID: ${deploymentData.jobId}`);

          // Upload the zip file
          console.log("⬆️  Uploading deployment package...");
          const uploadCommand = `curl -X PUT "${deploymentData.zipUploadUrl}" --data-binary "@${zipFileName}" -H "Content-Type: application/zip"`;
          await execAsync(uploadCommand);
          console.log("✅ Upload completed");

          // Start the deployment using execSync for better control
          console.log("🚀 Starting Amplify deployment...");
          const branchName = "main";
          const jobId = deploymentData.jobId;
          const env = { ...process.env, AWS_DEFAULT_REGION: region };

          const startCmd = `aws amplify start-deployment --app-id ${appId} --branch-name ${branchName} --job-id ${jobId} --output json`;
          execSync(startCmd, { stdio: "inherit", env });

          // Poll status until completion
          const pollCmd = `aws amplify get-job --app-id ${appId} --branch-name ${branchName} --job-id ${jobId} --query "job.summary.status" --output text`;
          let status = "PENDING";
          const startTime = Date.now();
          const timeoutMs = 15 * 60 * 1000; // 15 minutes
          process.stdout.write("⏳ Waiting for deployment to complete");

          while (Date.now() - startTime < timeoutMs) {
            try {
              status = execSync(pollCmd, {
                stdio: ["ignore", "pipe", "pipe"],
                env,
              })
                .toString()
                .trim();
            } catch {
              // ignore transient errors
            }
            process.stdout.write(".");
            if (status === "SUCCEED") break;
            if (status === "FAILED" || status === "CANCELLED") break;
            await new Promise((r) => setTimeout(r, 5000));
          }
          process.stdout.write("\n");
          console.log(`📈 Deployment status: ${status}`);

          if (status === "SUCCEED") {
            console.log("🎉 Deployment completed successfully!");
            console.log(
              `🌐 Your app is live at: https://main.${appId}.amplifyapp.com`
            );
          } else if (status === "FAILED" || status === "CANCELLED") {
            throw new Error(`Deployment ${status.toLowerCase()}`);
          } else {
            console.log(
              "⚠️  Deployment timed out, but may still be running. Check the console for updates."
            );
          }
        } else {
          throw new Error(
            "Failed to get deployment URL or ID from AWS response"
          );
        }
      } catch (deployError) {
        console.log(
          "⚠️  Manual deployment approach failed, trying alternative..."
        );
        console.log("Error details:", deployError.message);

        // Alternative: Use AWS S3 upload approach (if you have an S3 backend)
        console.log(
          "💡 Consider using AWS Amplify Console for manual deployments"
        );
        console.log(
          "📱 Alternative: Upload via Amplify Console at https://console.aws.amazon.com/amplify/"
        );
        console.log(
          `🔗 Direct app link: https://console.aws.amazon.com/amplify/home#/${appId}`
        );

        throw deployError;
      }
    } catch (deployError) {
      console.error("❌ AWS Amplify deployment error:", deployError.message);
      throw deployError;
    }

    // Clean up zip file
    try {
      fs.unlinkSync(zipFileName);
      console.log("🧹 Cleaned up deployment package");
    } catch (error) {
      console.log("⚠️  Could not clean up zip file:", zipFileName);
    }

    console.log(
      `✅ Successfully deployed to AWS Amplify environment: ${environment}`
    );
    console.log("🎉 Deployment completed!");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);

    // If it's an AWS-specific error, provide helpful guidance
    if (error.message.includes("aws") || error.message.includes("amplify")) {
      console.log("\n📝 AWS Amplify Setup Notes:");
      console.log(
        "1. Ensure your AWS credentials are configured: aws configure"
      );
      console.log("2. Make sure you have permissions for AWS Amplify service");
      console.log(
        "3. Check your AWS region is set correctly (default: us-east-1)"
      );
      console.log(`4. The app name will be: aplii-landing-${environment}`);
      console.log("5. If app doesn't exist, it will be created automatically");
    }

    process.exit(1);
  }
}

// Run the deployment
deployToAmplify();
