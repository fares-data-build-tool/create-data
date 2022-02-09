data "aws_route53_zone" "dft_cfd_com" {
  provider = aws.core

  name = "dft-cfd.com."
}
