module "vercel_deployment" {
  source = "https://github.com/masato-io/omakase/tree/main/apps/frontend"
  project_name = var.project_name
  vercel_api_token = var.vercel_api_token
}