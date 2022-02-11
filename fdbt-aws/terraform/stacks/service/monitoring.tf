resource "aws_cloudwatch_dashboard" "site" {
  dashboard_name = "Site"
  dashboard_body = <<EOF
{
    "start": "-PT3H",
    "widgets": [
        {
            "height": 3,
            "width": 3,
            "y": 0,
            "x": 3,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ { "expression": "SELECT SUM(completeTransactions) FROM \"FDBT/Site\"", "label": "", "id": "completeTransactionsSum", "region": "eu-west-2", "period": 300 } ]
                ],
                "view": "singleValue",
                "region": "eu-west-2",
                "stat": "Average",
                "period": 300,
                "title": "Successful Transactions",
                "singleValueFullPrecision": true,
                "setPeriodToTimeRange": true,
                "sparkline": false
            }
        },
        {
            "height": 3,
            "width": 3,
            "y": 0,
            "x": 0,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ { "expression": "SELECT SUM(startedTransactions) FROM \"FDBT/Site\"", "label": "", "id": "startedTransactionsSum", "region": "eu-west-2" } ]
                ],
                "view": "singleValue",
                "region": "eu-west-2",
                "stat": "Average",
                "period": 300,
                "title": "Started Transactions",
                "singleValueFullPrecision": true,
                "liveData": true,
                "setPeriodToTimeRange": true,
                "sparkline": false
            }
        },
        {
            "height": 5,
            "width": 7,
            "y": 5,
            "x": 16,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ { "expression": "SELECT SUM(\"5xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
                ],
                "view": "timeSeries",
                "stacked": true,
                "region": "eu-west-2",
                "stat": "Average",
                "period": 1,
                "title": "5xx Response Codes",
                "yAxis": {
                    "left": {
                        "label": "Count",
                        "showUnits": false
                    }
                },
                "legend": {
                    "position": "hidden"
                }
            }
        },
        {
            "height": 7,
            "width": 9,
            "y": 3,
            "x": 0,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ { "expression": "SELECT AVG(responseTime) FROM \"FDBT/Site\"", "label": "responseTime", "id": "responseTime", "region": "eu-west-2", "period": 1 } ]
                ],
                "view": "timeSeries",
                "stacked": true,
                "region": "eu-west-2",
                "stat": "Average",
                "period": 1,
                "title": "Response Time",
                "yAxis": {
                    "left": {
                        "showUnits": false
                    }
                },
                "liveData": true,
                "legend": {
                    "position": "hidden"
                }
            }
        },
        {
            "height": 5,
            "width": 7,
            "y": 5,
            "x": 9,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ { "expression": "SELECT SUM(\"4xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
                ],
                "view": "timeSeries",
                "stacked": true,
                "region": "eu-west-2",
                "stat": "Average",
                "period": 1,
                "title": "4xx Response Codes",
                "yAxis": {
                    "left": {
                        "label": "Count",
                        "showUnits": false
                    }
                },
                "legend": {
                    "position": "hidden"
                }
            }
        },
        {
            "height": 5,
            "width": 7,
            "y": 0,
            "x": 16,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ { "expression": "SELECT SUM(\"3xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
                ],
                "view": "timeSeries",
                "stacked": true,
                "region": "eu-west-2",
                "stat": "Average",
                "period": 1,
                "title": "3xx Response Codes",
                "yAxis": {
                    "left": {
                        "label": "Count",
                        "showUnits": false
                    }
                },
                "legend": {
                    "position": "hidden"
                }
            }
        },
        {
            "height": 5,
            "width": 7,
            "y": 0,
            "x": 9,
            "type": "metric",
            "properties": {
                "metrics": [
                    [ { "expression": "SELECT SUM(\"2xxResponses\") FROM \"FDBT/Site\"", "label": "Query1", "id": "q1" } ]
                ],
                "view": "timeSeries",
                "stacked": true,
                "region": "eu-west-2",
                "stat": "Average",
                "period": 1,
                "title": "2xx Response Codes",
                "yAxis": {
                    "left": {
                        "label": "Count",
                        "showUnits": false
                    }
                },
                "legend": {
                    "position": "hidden"
                }
            }
        }
    ]
}
EOF
}
