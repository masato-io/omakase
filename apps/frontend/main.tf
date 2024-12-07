terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
      version = "~> 0.15.0"
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

resource "vercel_project" "example" {
  name = var.project_name
  framework = "nextjs"
  root_directory = "apps/frontend"
  
  git_repository = {
    type = "github"
    repo = "username/repo-name"  
    production_branch = "main"
  }
}

resource "vercel_deployment" "production" {
  project_id = vercel_project.example.id
  production = true
  
  files = [
    {
      file = "package.json"
      content = file("${path.module}/package.json")
    },
    {
      file = "next.config.js"
      content = file("${path.module}/next.config.js")
    }
  ]
}

output "project_url" {
  value = vercel_project.example.url
}

output "deployment_url" {
  value = vercel_deployment.production.url
}
