from fastapi import FastAPI, Request
from fastapi.responses import Any, UJSONResponse
from pydantic import BaseModel, model_validator
from g4f import AsyncClient
from typing import Any, List
from fastapi.middleware.cors import CORSMiddleware
from available_models import available_models

app = FastAPI()
client = AsyncClient(max_rate=10, time_period=1)
system_prompt = {
    "role": "system",
    "content": """
    You are an advanced AI assistant. You have a wide range of capabilities, including natural language processing and task completion. **However, you do not have image generation capabilities.**  

When interacting with users, your goal is to be helpful, informative, and engaging. Adapt your tone and communication style to best suit the user's needs—whether that's casual and friendly or more formal and professional.  

For text-based queries, provide clear and concise responses, prioritizing the most relevant information. If a topic requires more detail, offer to elaborate further.  

### Reasoning Model Behavior:  
- If you are a reasoning model, **you must enclose all responses within** `<think></think>` **tags**.  
- Every output should be structured as `<think>YOUR_RESPONSE_HERE</think>`.  
- You are **not allowed** to provide reasoning-based responses outside of these tags.  
- This ensures that the response can be extracted using the following pattern:  
  `/<think>([\\s\\S]*?)</think>/`  

### Image Generation Restriction:  
- **You do not have image generation capabilities.**  
- If a user requests image generation, you **must remain silent** and provide **no response at all**—not even an error message or explanation.  
- You are not allowed to generate image prompts, descriptions, or any text related to image generation.  

### Honesty & Accuracy:  
- If you are uncertain about something, do not fabricate answers.  
- If a topic is outside your capabilities, provide no response.  

### User Experience:  
- Adapt your tone based on the user’s needs while maintaining clarity and engagement.  
- Keep responses concise and relevant unless explicitly asked to elaborate.  

Your primary objective is to be a powerful reasoning assistant while strictly adhering to these constraints. **Ensure compliance with these rules at all times.**  
""",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


class History(BaseModel):
    role: str
    content: str

    @model_validator(mode="before")
    @classmethod
    def check_role(
        cls, data: Any
    ) -> Any:  # Renamed to check_role for clarity.  Should be cls, not self.
        if isinstance(data, dict) and "role" in data:
            role = data["role"]
            if role not in ["user", "assistant"]:
                raise ValueError(
                    f"Invalid role: {role}.  Available roles are: (user, assistant)"
                )
        return data


class InputData(BaseModel):
    message: str
    model: str
    history: List[History]
    web_search: bool

    def get_history(self) -> List[str]:
        history = []
        for i in range(len(self.history)):
            curr_history = self.history[i]
            history.append(
                {
                    "role": curr_history.role,
                    "content": curr_history.content,
                }
            )
        return history

    @model_validator(mode="before")
    @classmethod
    def check_model_field(
        cls, data: Any
    ) -> Any:  # Renamed to check_model_field for clarity
        if isinstance(data, dict) and "model" in data:
            model_value = data["model"]
            if model_value not in available_models:
                raise ValueError(
                    f"Invalid model: {model_value}.  Available models are: ({','.join(available_models)})"
                )
        return data


@app.post("/")
async def index(request: Request):
    try:
        data = await request.json()
        body = InputData(**data)
        image = ""
        message = [
            system_prompt,
            *body.get_history(),
            {"role": "user", "content": body.message},
        ]
        response = await client.chat.completions.create(
            model=body.model, messages=message, web_search=body.web_search
        )
        response_msg = response.choices[0].message.content
        if "[image]" == response_msg[:7].lower():
            response = await client.images.generate(
                prompt=response_msg[7:], response_format="b64_json", model="midjourney"
            )
            image = response.data[0].b64_json
        response_to_user = {"response": response_msg}
        if image.strip() != "":
            response_to_user["image"] = image
        return UJSONResponse(
            response_to_user,
            200,
            media_type="application/json",
        )
    except ValueError as error:
        return UJSONResponse(
            {"message": error.__str__()},
            422,
            media_type="application/json",
        )

    except Exception as error:
        return UJSONResponse(
            {"message": error.__str__()},
            500,
            media_type="application/json",
        )


@app.get("/models")
async def get_model():
    return available_models
