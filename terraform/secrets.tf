# --- AWS Secrets Manager for JWT Secret ---
resource "aws_secretsmanager_secret" "jwt_secret" {
  name        = "${local.project_name}-jwt-secret"
  description = "JWT signing secret for authentication"

  recovery_window_in_days = 7 # Allow recovery if accidentally deleted
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret
}

# IAM policy to allow Lambda to read the secret
resource "aws_iam_role_policy" "secrets_access" {
  name = "secrets_access"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "secretsmanager:GetSecretValue"
      ]
      Effect   = "Allow"
      Resource = aws_secretsmanager_secret.jwt_secret.arn
    }]
  })
}
