terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
      version = "~> 1.0.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}

variable "vercel_api_token" {
  type = string
  sensitive = true
}

variable "project_name" {
  type = string
  default = "my-vercel-app"
}

locals {
  resource_name = replace(var.project_name, "-", "_")
}

resource "null_resource" "project_keeper" {
  triggers = {
    project_name = var.project_name
  }
}

resource "vercel_project" "example" {
  name = var.project_name
  framework = "nextjs"
  protection_bypass_for_automation = true
  build_command = "corepack enable && NODE_ENV=development pnpm install && NODE_ENV=production pnpm build"
  install_command = "corepack enable && NODE_ENV=development pnpm install"

  lifecycle {
    create_before_destroy = true
    replace_triggered_by = [
      null_resource.project_keeper.id
    ]
  }
}

data "vercel_project_directory" "files" {
  path = path.module
}

resource "vercel_deployment" "production" {
  project_id = vercel_project.example.id
  production = true
  files = data.vercel_project_directory.files.files

  lifecycle {
    create_before_destroy = true
    replace_triggered_by = [
      null_resource.project_keeper.id
    ]
  }
}

output "project_url" {
  value = "https://${vercel_project.example.name}.vercel.app"
}

output "deployment_url" {
  value = vercel_deployment.production.url
}
