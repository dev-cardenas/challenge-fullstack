variable "jwt_secret" {
  description = "Secret key for signing JWT tokens"
  type        = string
  sensitive   = true
  default     = "change-this-in-production-use-secrets-manager"
}
