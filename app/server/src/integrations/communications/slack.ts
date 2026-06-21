import axios from "axios";

interface SlackInput {
  credentials: {
    webhookUrl: string;
  };
  text: string;
}

export async function sendSlackMessage(
  input: SlackInput
) {
  const response =
    await axios.post(
      input.credentials.webhookUrl,
      {
        text: input.text,
      }
    );

  return {
    success: true,
    status: response.status,
  };
}