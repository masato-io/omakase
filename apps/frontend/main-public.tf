module "vercel_deployment" {
  source = "github.com/masato-io/omakase/apps/frontend"
  project_name = var.project_name
  vercel_api_token = var.vercel_api_token
}