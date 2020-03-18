const url = require("url");
const https = require("https");

const postMessage = (message, callback) => {
  const body = JSON.stringify(message);
  const options = url.parse(process.env.HOOK_URL);
  options.method = "POST";
  options.headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  };

  const postReq = https.request(options, res => {
    const chunks = [];
    res.setEncoding("utf8");
    res.on("data", chunk => chunks.push(chunk));
    res.on("end", () => {
      const body = chunks.join("");
      if (callback) {
        callback({
          body: body,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage
        });
      }
    });

    return res;
  });

  postReq.write(body);
  postReq.end();
};

const handleCloudWatch = event => {
  const timestamp = new Date(event.Records[0].Sns.Timestamp).getTime() / 1000;
  const message = JSON.parse(event.Records[0].Sns.Message);
  const region = event.Records[0].EventSubscriptionArn.split(":")[3];
  const subject = "AWS CloudWatch Notification";
  const alarmName = message.AlarmName;
  const metricName = message.Trigger.MetricName;
  const oldState = message.OldStateValue;
  const newState = message.NewStateValue;
  const alarmDescription = message.AlarmDescription;
  const trigger = message.Trigger;
  let color = "warning";

  if (message.NewStateValue === "ALARM") {
    color = "danger";
  } else if (message.NewStateValue === "OK") {
    color = "good";
  }

  const slackMessage = {
    text: "*" + subject + "*",
    attachments: [
      {
        color: color,
        fields: [
          { title: "Alarm Name", value: alarmName, short: true },
          { title: "Alarm Description", value: alarmDescription, short: false },
          {
            title: "Trigger",
            value: `${trigger.Statistic} ${metricName} ${trigger.ComparisonOperator} ${trigger.Threshold} for ${trigger.EvaluationPeriods} period(s) of ${trigger.Period} seconds.`,
            short: false
          },
          { title: "Old State", value: oldState, short: true },
          { title: "Current State", value: newState, short: true },
          {
            title: "Link to Alarm",
            value: `https://console.aws.amazon.com/cloudwatch/home?region=${region}#alarm:alarmFilter=ANY;name=${encodeURIComponent(
              alarmName
            )}`,
            short: false
          }
        ],
        ts: timestamp
      }
    ]
  };

  return slackMessage;
};

const handleCatchAll = event => {
  const record = event.Records[0];
  const subject = record.Sns.Subject;
  const timestamp = new Date(record.Sns.Timestamp).getTime() / 1000;
  const message = JSON.parse(record.Sns.Message);
  let color = "warning";

  if (message.NewStateValue === "ALARM") {
    color = "danger";
  } else if (message.NewStateValue === "OK") {
    color = "good";
  }

  let description = "";

  for (let key in message) {
    const renderedMessage =
      typeof message[key] === "object"
        ? JSON.stringify(message[key])
        : message[key];

    description = `${description}\n${key}: ${renderedMessage}`;
  }

  const slackMessage = {
    text: `*${subject}*`,
    attachments: [
      {
        color: color,
        fields: [
          { title: "Message", value: subject, short: false },
          { title: "Description", value: description, short: false }
        ],
        ts: timestamp
      }
    ]
  };

  return slackMessage;
};

const processEvent = (event, context) => {
  console.info("SNS received:" + JSON.stringify(event, null, 2));
  let slackMessage = null;
  const eventSnsMessageRaw = event.Records[0].Sns.Message;
  let eventSnsMessage = null;

  try {
    eventSnsMessage = JSON.parse(eventSnsMessageRaw);
  } catch (e) {
    throw new Error(`Unable to parse SNS message: ${eventSnsMessageRaw}`);
  }

  if (
    eventSnsMessage &&
    "AlarmName" in eventSnsMessage &&
    "AlarmDescription" in eventSnsMessage
  ) {
    console.info("Processing cloudwatch notification");
    slackMessage = handleCloudWatch(event, context);
  } else {
    slackMessage = handleCatchAll(event, context);
  }

  postMessage(slackMessage, response => {
    if (response.statusCode < 400) {
      console.info("message posted successfully");
      context.succeed();
    } else if (response.statusCode < 500) {
      console.error(
        `Error posting message to slack API: ${response.statusCode} - ${response.statusMessage}`
      );
      context.succeed();
    } else {
      context.fail(
        `Server error when processing message: ${response.statusCode} - ${response.statusCode}`
      );
    }
  });
};

exports.handler = (event, context) => {
  try {
    processEvent(event, context);
  } catch (e) {
    console.error(e.stack);
    context.fail(e.stack);
  }
};
