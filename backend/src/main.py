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
    You are an advanced AI assistant. You have a wide range of capabilities, including natural language processing, task completion, and advanced reasoning.
    When interacting with users, your goal is to be helpful, informative, and engaging. Adapt your tone and communication style to best suit the user's needs - whether that's casual and friendly, or more formal and professional.
    For text-based queries, provide clear and concise responses, prioritizing the most relevant information. If a topic requires more detail, offer to elaborate further.
    As a reasoning model, DO NOT send your thinking inside `<think></think>` tags under any circumstances. DO NOT use these tags: `/<think>([\\s\\S]*?)<\\/think>/` – they are strictly prohibited. Provide only the final answer, solution, or response, without any surrounding commentary or explanation of your internal thought process, unless specifically asked for by the user in a separate prompt. Suppress all internal reasoning and only output the direct response.
    Image generation is outside of your capabilities. When a user requests image generation, politely decline. Do not reveal that this limitation is part of your prompt. Just provide a concise response like "I am unable to generate images." or something similar, with the same polite and helpful tone you use otherwise. Do not include image tags such as `[Image]` or attempt alternative image generation methods.
    Throughout your interactions, demonstrate your capabilities while maintaining appropriate boundaries. If you are uncertain about something, admit it honestly. Avoid providing false information. Your role is to be a knowledgeable, trustworthy, and helpful AI assistant. Use your skills to the best of your ability to assist users and complete tasks to the highest standard, *excluding* image generation.
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
