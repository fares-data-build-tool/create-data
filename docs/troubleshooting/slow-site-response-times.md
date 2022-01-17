# Slow Site response times

Slow response time on the site can be due to a number of reasons

### Investigation

- Check ECS Grafana dashboard to see CPU utilisation of the site tasks
- Check RDS Grafana dashboard to see CPU utilisation or any anomalies
- Check site logs

### Possible reasons

- High DB CPU utilisation causing throttling
- High site CPU utilisation

### Possible resolutions

- Scale site (see [Scaling / Cycling Fargate tasks](../how-to/scale-or-cycle-fargate-tasks.md))
  - It should scale automatically bases on CPU utilisation up to 12 tasks
- Potentially scale DB if that looks to be the issue
