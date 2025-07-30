# backend/demo.py
#  This is a CLI demo of the agent

import os
import sys
import dotenv

dotenv.load_dotenv()


def get_provider_and_model():
    provider = os.getenv("PROVIDER")
    model = os.getenv("MODEL")

    if not provider or not model:
        print("Error: PROVIDER and MODEL must be set")
        sys.exit(1)

    return provider, model


def run_agent(provider, model):
    pass



def demo():
    provider, model = get_provider_and_model()

    # print Begin agent initialization
    print(f"Starting with provider: {provider} and model: {model}")
    print("Begin 🌅 Agent initialization")
