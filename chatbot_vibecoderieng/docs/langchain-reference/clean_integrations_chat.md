# Source: https://docs.langchain.com/oss/python/integrations/chat

[Skip to main content](#content-area)
[Docs by LangChain home page](/)
[Chat models](/oss/python/langchain/models) are language models that use a sequence of [messages](/oss/python/langchain/messages) as inputs and return messages as outputs .
##
[​](#featured-models)
Featured models
**While these LangChain classes support the indicated advanced feature** , you may need to refer to provider-specific documentation to learn which hosted models or backends support the feature.
Model| [Tool calling](/oss/python/langchain/tools)| [Structured output](/oss/python/langchain/structured-output)| [Multimodal](/oss/python/langchain/messages#multimodal)
---|---|---|---
[`ChatOpenAI`](/oss/python/integrations/chat/openai)| ✅| ✅| ✅
[`ChatAnthropic`](/oss/python/integrations/chat/anthropic)| ✅| ✅| ✅
[`ChatVertexAI`](/oss/python/integrations/chat/google_vertex_ai) (deprecated)| ✅| ✅| ✅
[`ChatGoogleGenerativeAI`](/oss/python/integrations/chat/google_generative_ai)| ✅| ✅| ✅
[`AzureChatOpenAI`](/oss/python/integrations/chat/azure_chat_openai)| ✅| ✅| ✅
[`ChatGroq`](/oss/python/integrations/chat/groq)| ✅| ✅| ❌
[`ChatBedrock`](/oss/python/integrations/chat/bedrock)| ✅| ✅| ❌
[`ChatAmazonNova`](/oss/python/integrations/chat/amazon_nova)| ✅| ❌| ✅
[`ChatHuggingFace`](/oss/python/integrations/chat/huggingface)| ✅| ✅| ❌
[`ChatOllama`](/oss/python/integrations/chat/ollama)| ✅| ✅| ❌
[`ChatWatsonx`](/oss/python/integrations/chat/ibm_watsonx)| ✅| ✅| ✅
[`ChatXAI`](/oss/python/integrations/chat/xai)| ✅| ✅| ❌
[`ChatNVIDIA`](/oss/python/integrations/chat/nvidia_ai_endpoints)| ✅| ✅| ✅
[`ChatCohere`](/oss/python/integrations/chat/cohere)| ✅| ✅| ❌
[`ChatMistralAI`](/oss/python/integrations/chat/mistralai)| ✅| ✅| ❌
[`ChatTogether`](/oss/python/integrations/chat/together)| ✅| ✅| ❌
[`ChatFireworks`](/oss/python/integrations/chat/fireworks)| ✅| ✅| ❌
[`ChatLlamaCpp`](/oss/python/integrations/chat/llamacpp)| ✅| ✅| ❌
[`ChatDatabricks`](/oss/python/integrations/chat/databricks)| ✅| ✅| ❌
[`ChatPerplexity`](/oss/python/integrations/chat/perplexity)| ❌| ✅| ✅
##
[​](#chat-completions-api)
Chat Completions API
Certain model providers offer endpoints that are compatible with OpenAI’s (legacy) [Chat Completions API](https://platform.openai.com/docs/guides/completions). In such case, you can use [`ChatOpenAI`](/oss/python/integrations/chat/openai) with a custom `base_url` to connect to these endpoints. Note that features built on top of the Chat Completions API may not be fully supported by `ChatOpenAI`; in such cases, consider using a provider-specific class if available (e.g. [`ChatLiteLLM`](https://github.com/Akshay-Dongare/langchain-litellm/) (community-maintained) for [LiteLLM](https://litellm.ai/)).
Example: OpenRouter
To use OpenRouter, you will need to sign up for an account and obtain an [API key](https://openrouter.ai/docs/api-reference/authentication).
Copy
 from langchain_openai import ChatOpenAI
 model = ChatOpenAI(
 model="...", # Specify a model available on OpenRouter
 api_key="OPENROUTER_API_KEY",
 base_url="https://openrouter.ai/api/v1",
Refer to the [OpenRouter documentation](https://openrouter.ai/docs/quickstart) for more details.
To capture [reasoning tokens](https://openrouter.ai/docs/use-cases/reasoning-tokens),
 1. Switch imports from `langchain_openai` to `langchain_deepseek`
 2. Use `ChatDeepSeek` instead of `ChatOpenAI`. You will need to change param `base_url` to `api_base`.
 3. Adjust reasoning parameters as needed under `extra_body`, e.g.:
Copy
 model = ChatDeepSeek(
 model="...",
 api_key="...",
 api_base="https://openrouter.ai/api/v1",
 extra_body={"reasoning": {"enabled": True}},
This is a known limitation with `ChatOpenAI` and will be addressed in a future release.
##
[​](#all-chat-models)
All chat models
## [Abso](/oss/python/integrations/chat/abso)## [AI21 Labs](/oss/python/integrations/chat/ai21)## [AI/ML API](/oss/python/integrations/chat/aimlapi)## [Alibaba Cloud PAI EAS](/oss/python/integrations/chat/alibaba_cloud_pai_eas)## [Amazon Nova](/oss/python/integrations/chat/amazon_nova)## [Anthropic](/oss/python/integrations/chat/anthropic)## [AzureAIChatCompletionsModel](/oss/python/integrations/chat/azure_ai)## [Azure OpenAI](/oss/python/integrations/chat/azure_chat_openai)## [Azure ML Endpoint](/oss/python/integrations/chat/azureml_chat_endpoint)## [Baichuan Chat](/oss/python/integrations/chat/baichuan)## [Baidu Qianfan](/oss/python/integrations/chat/baidu_qianfan_endpoint)## [Baseten](/oss/python/integrations/chat/baseten)## [AWS Bedrock](/oss/python/integrations/chat/bedrock)## [Cerebras](/oss/python/integrations/chat/cerebras)## [CloudflareWorkersAI](/oss/python/integrations/chat/cloudflare_workersai)## [Cohere](/oss/python/integrations/chat/cohere)## [ContextualAI](/oss/python/integrations/chat/contextual)## [Coze Chat](/oss/python/integrations/chat/coze)## [Dappier AI](/oss/python/integrations/chat/dappier)## [Databricks](/oss/python/integrations/chat/databricks)## [DeepInfra](/oss/python/integrations/chat/deepinfra)## [DeepSeek](/oss/python/integrations/chat/deepseek)## [Eden AI](/oss/python/integrations/chat/edenai)## [EverlyAI](/oss/python/integrations/chat/everlyai)## [Featherless AI](/oss/python/integrations/chat/featherless_ai)## [Fireworks](/oss/python/integrations/chat/fireworks)## [ChatFriendli](/oss/python/integrations/chat/friendli)## [Google Gemini](/oss/python/integrations/chat/google_generative_ai)## [Google Cloud Vertex AI](/oss/python/integrations/chat/google_vertex_ai)## [GPTRouter](/oss/python/integrations/chat/gpt_router)## [DigitalOcean Gradient](/oss/python/integrations/chat/gradientai)## [GreenNode](/oss/python/integrations/chat/greennode)## [Groq](/oss/python/integrations/chat/groq)## [ChatHuggingFace](/oss/python/integrations/chat/huggingface)## [IBM watsonx.ai](/oss/python/integrations/chat/ibm_watsonx)## [JinaChat](/oss/python/integrations/chat/jinachat)## [Kinetica](/oss/python/integrations/chat/kinetica)## [Konko](/oss/python/integrations/chat/konko)## [LiteLLM](/oss/python/integrations/chat/litellm)## [Llama 2 Chat](/oss/python/integrations/chat/llama2_chat)## [Llama API](/oss/python/integrations/chat/llama_api)## [LlamaEdge](/oss/python/integrations/chat/llama_edge)## [Llama.cpp](/oss/python/integrations/chat/llamacpp)## [maritalk](/oss/python/integrations/chat/maritalk)## [MiniMax](/oss/python/integrations/chat/minimax)## [MistralAI](/oss/python/integrations/chat/mistralai)## [MLX](/oss/python/integrations/chat/mlx)## [ModelScope](/oss/python/integrations/chat/modelscope_chat_endpoint)## [Moonshot](/oss/python/integrations/chat/moonshot)## [Naver](/oss/python/integrations/chat/naver)## [Nebius](/oss/python/integrations/chat/nebius)## [Netmind](/oss/python/integrations/chat/netmind)## [NVIDIA AI Endpoints](/oss/python/integrations/chat/nvidia_ai_endpoints)## [ChatOCIModelDeployment](/oss/python/integrations/chat/oci_data_science)## [OCIGenAI](/oss/python/integrations/chat/oci_generative_ai)## [ChatOctoAI](/oss/python/integrations/chat/octoai)## [Ollama](/oss/python/integrations/chat/ollama)## [OpenAI](/oss/python/integrations/chat/openai)## [Outlines](/oss/python/integrations/chat/outlines)## [Perplexity](/oss/python/integrations/chat/perplexity)## [Pipeshift](/oss/python/integrations/chat/pipeshift)## [ChatPredictionGuard](/oss/python/integrations/chat/predictionguard)## [PremAI](/oss/python/integrations/chat/premai)## [PromptLayer ChatOpenAI](/oss/python/integrations/chat/promptlayer_chatopenai)## [Qwen QwQ](/oss/python/integrations/chat/qwq)## [Qwen](/oss/python/integrations/chat/qwen)## [Reka](/oss/python/integrations/chat/reka)## [RunPod Chat Model](/oss/python/integrations/chat/runpod)## [SambaNova](/oss/python/integrations/chat/sambanova)## [ChatSeekrFlow](/oss/python/integrations/chat/seekrflow)## [Snowflake Cortex](/oss/python/integrations/chat/snowflake)## [SparkLLM Chat](/oss/python/integrations/chat/sparkllm)## [Nebula (Symbl.ai)](/oss/python/integrations/chat/symblai_nebula)## [Tencent Hunyuan](/oss/python/integrations/chat/tencent_hunyuan)## [Together](/oss/python/integrations/chat/together)## [Tongyi Qwen](/oss/python/integrations/chat/tongyi)## [Upstage](/oss/python/integrations/chat/upstage)## [vLLM Chat](/oss/python/integrations/chat/vllm)## [Volc Engine Maas](/oss/python/integrations/chat/volcengine_maas)## [ChatWriter](/oss/python/integrations/chat/writer)## [xAI](/oss/python/integrations/chat/xai)## [Xinference](/oss/python/integrations/chat/xinference)## [YandexGPT](/oss/python/integrations/chat/yandex)## [ChatYI](/oss/python/integrations/chat/yi)## [Yuan2.0](/oss/python/integrations/chat/yuan2)## [ZHIPU AI](/oss/python/integrations/chat/zhipuai)
If you’d like to contribute an integration, see [Contributing integrations](/oss/python/contributing#add-a-new-integration).
[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/chat/index.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
Was this page helpful?
[Groq integrationsPrevious](/oss/python/integrations/providers/groq)[Tool integrationsNext](/oss/python/integrations/tools)
Ctrl+I
Responses are generated using AI and may contain mistakes.