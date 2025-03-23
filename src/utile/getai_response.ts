import { Chat } from "./types";

export default class Ai {
  history: Chat[] = []
  web_search: boolean = false
  model: string;
  api_endpoint: string = "http://127.0.0.1:8000";
  constructor(model: string = "gpt-4o", web_search: boolean = false, history: Chat[] = []) {
    this.model = model;
    this.history = history;
    this.web_search = web_search;
  }
  async get_response(prompt: string): Promise<string> {
    const response = await fetch(this.api_endpoint, {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify(
        {
          history: this.history,
          model: this.model,
          web_search: this.web_search,
          message: prompt
        }
      ),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    if (response.status !== 200) {
      console.log(data, response);
      throw new Error("Error while ai response")
    }
    this.history.push({
      "role": "assistant",
      "content": data.response
    })
    if (data.image !== undefined) {
      const image = base64JsonToImage(data.image)
      return image
    }
    return data.response
  }
}

function base64JsonToImage(b64_json: string, mimeType = "image/png") {
  const base64String = `data:${mimeType};base64,${b64_json}`;
  return base64String
}

