output "api_endpoint" {
  description = "URL of the API Gateway"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "website_url" {
  description = "URL of the CloudFront Distribution"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_url" {
  description = "Full HTTPS URL of CloudFront (for CORS)"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket to upload files to"
  value       = aws_s3_bucket.frontend.id
}
