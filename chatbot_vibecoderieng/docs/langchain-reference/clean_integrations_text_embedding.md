# Source: https://docs.langchain.com/oss/python/integrations/text_embedding

[Skip to main content](#content-area)
[Docs by LangChain home page](/)
##
[​](#overview)
Overview
This overview covers **text-based embedding models**. LangChain does not currently support multimodal embeddings.See [top embedding models](#top-integrations).
Embedding models transform raw text—such as a sentence, paragraph, or tweet—into a fixed-length vector of numbers that captures its **semantic meaning**. These vectors allow machines to compare and search text based on meaning rather than exact words. In practice, this means that texts with similar ideas are placed close together in the vector space. For example, instead of matching only the phrase _“machine learning”_ , embeddings can surface documents that discuss related concepts even when different wording is used.
###
[​](#how-it-works)
How it works
 1. **Vectorization** — The model encodes each input string as a high-dimensional vector.
 2. **Similarity scoring** — Vectors are compared using mathematical metrics to measure how closely related the underlying texts are.
###
[​](#similarity-metrics)
Similarity metrics
Several metrics are commonly used to compare embeddings:
 * **Cosine similarity** — measures the angle between two vectors.
 * **Euclidean distance** — measures the straight-line distance between points.
 * **Dot product** — measures how much one vector projects onto another.
Here’s an example of computing cosine similarity between two vectors:
Copy
 import numpy as np
 def cosine_similarity(vec1, vec2):
 dot = np.dot(vec1, vec2)
 return dot / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
 similarity = cosine_similarity(query_embedding, document_embedding)
 print("Cosine Similarity:", similarity)
##
[​](#interface)
Interface
LangChain provides a standard interface for text embedding models (e.g., OpenAI, Cohere, Hugging Face) via the [Embeddings](https://reference.langchain.com/python/langchain_core/embeddings/#langchain_core.embeddings.embeddings.Embeddings) interface. Two main methods are available:
 * `embed_documents(texts: List[str]) → List[List[float]]`: Embeds a list of documents.
 * `embed_query(text: str) → List[float]`: Embeds a single query.
The interface allows queries and documents to be embedded with different strategies, though most providers handle them the same way in practice.
##
[​](#top-integrations)
Top integrations
Model| Package
---|---
[`OpenAIEmbeddings`](/oss/python/integrations/text_embedding/openai)| [`langchain-openai`](https://python.langchain.com/api_reference/openai/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html)
[`AzureOpenAIEmbeddings`](/oss/python/integrations/text_embedding/azure_openai)| [`langchain-openai`](https://python.langchain.com/api_reference/openai/embeddings/langchain_openai.embeddings.azure.AzureOpenAIEmbeddings.html)
[`GoogleGenerativeAIEmbeddings`](/oss/python/integrations/text_embedding/google_generative_ai)| [`langchain-google-genai`](https://python.langchain.com/api_reference/google_genai/embeddings/langchain_google_genai.embeddings.GoogleGenerativeAIEmbeddings.html)
[`OllamaEmbeddings`](/oss/python/integrations/text_embedding/ollama)| [`langchain-ollama`](https://python.langchain.com/api_reference/ollama/embeddings/langchain_ollama.embeddings.OllamaEmbeddings.html)
[`TogetherEmbeddings`](/oss/python/integrations/text_embedding/together)| [`langchain-together`](https://python.langchain.com/api_reference/together/embeddings/langchain_together.embeddings.TogetherEmbeddings.html)
[`FireworksEmbeddings`](/oss/python/integrations/text_embedding/fireworks)| [`langchain-fireworks`](https://python.langchain.com/api_reference/fireworks/embeddings/langchain_fireworks.embeddings.FireworksEmbeddings.html)
[`MistralAIEmbeddings`](/oss/python/integrations/text_embedding/mistralai)| [`langchain-mistralai`](https://python.langchain.com/api_reference/mistralai/embeddings/langchain_mistralai.embeddings.MistralAIEmbeddings.html)
[`VoyageAIEmbeddings`](/oss/python/integrations/text_embedding/voyageai)| [`langchain-voyageai`](https://python.langchain.com/api_reference/voyageai/embeddings/langchain_voyageai.embeddings.VoyageAIEmbeddings.html)
[`CohereEmbeddings`](/oss/python/integrations/text_embedding/cohere)| [`langchain-cohere`](https://python.langchain.com/api_reference/community/llms/langchain_community.llms.cohere.Cohere.html)
[`NomicEmbeddings`](/oss/python/integrations/text_embedding/nomic)| [`langchain-nomic`](https://python.langchain.com/api_reference/nomic/embeddings/langchain_nomic.embeddings.NomicEmbeddings.html)
[`FakeEmbeddings`](/oss/python/integrations/text_embedding/fake)| [`langchain-core`](https://python.langchain.com/api_reference/core/embeddings/langchain_core.embeddings.fake.FakeEmbeddings.html)
[`DatabricksEmbeddings`](/oss/python/integrations/text_embedding/databricks)| [`databricks-langchain`](https://api-docs.databricks.com/python/databricks-ai-bridge/latest/databricks_langchain.html#databricks_langchain.DatabricksEmbeddings)
[`WatsonxEmbeddings`](/oss/python/integrations/text_embedding/ibm_watsonx)| [`langchain-ibm`](https://python.langchain.com/api_reference/ibm/embeddings/langchain_ibm.embeddings.WatsonxEmbeddings.html)
[`NVIDIAEmbeddings`](/oss/python/integrations/text_embedding/nvidia_ai_endpoints)| [`langchain-nvidia`](https://python.langchain.com/api_reference/nvidia_ai_endpoints/embeddings/langchain_nvidia_ai_endpoints.embeddings.NVIDIAEmbeddings.html)
[`AIMLAPIEmbeddings`](/oss/python/integrations/text_embedding/aimlapi)| [`langchain-aimlapi`](https://python.langchain.com/api_reference/aimlapi/embeddings/langchain_aimlapi.embeddings.AIMLAPIEmbeddings.html)
##
[​](#caching)
Caching
Embeddings can be stored or temporarily cached to avoid needing to recompute them. Caching embeddings can be done using a `CacheBackedEmbeddings`. This wrapper stores embeddings in a key-value store, where the text is hashed and the hash is used as the key in the cache. The main supported way to initialize a `CacheBackedEmbeddings` is `from_bytes_store`. It takes the following parameters:
 * **`underlying_embedder`** : The embedder to use for embedding.
 * **`document_embedding_cache`** : Any [`ByteStore`](/oss/python/integrations/stores) for caching document embeddings.
 * **`batch_size`** : (optional, defaults to `None`) The number of documents to embed between store updates.
 * **`namespace`** : (optional, defaults to `""`) The namespace to use for the document cache. Helps avoid collisions (e.g., set it to the embedding model name).
 * **`query_embedding_cache`** : (optional, defaults to `None`) A [`ByteStore`](/oss/python/integrations/stores) for caching query embeddings, or `True` to reuse the same store as `document_embedding_cache`.
Copy
 import time
 from langchain_classic.embeddings import CacheBackedEmbeddings
 from langchain_classic.storage import LocalFileStore
 from langchain_core.vectorstores import InMemoryVectorStore
 # Create your underlying embeddings model
 underlying_embeddings = ... # e.g., OpenAIEmbeddings(), HuggingFaceEmbeddings(), etc.
 # Store persists embeddings to the local filesystem
 # This isn't for production use, but is useful for local
 store = LocalFileStore("./cache/")
 cached_embedder = CacheBackedEmbeddings.from_bytes_store(
 underlying_embeddings,
 store,
 namespace=underlying_embeddings.model
 # Example: caching a query embedding
 tic = time.time()
 print(cached_embedder.embed_query("Hello, world!"))
 print(f"First call took: {time.time() - tic:.2f} seconds")
 # Subsequent calls use the cache
 tic = time.time()
 print(cached_embedder.embed_query("Hello, world!"))
 print(f"Second call took: {time.time() - tic:.2f} seconds")
In production, you would typically use a more robust persistent store, such as a database or cloud storage. Please see [stores integrations](/oss/python/integrations/stores) for options.
##
[​](#all-embedding-models)
All embedding models
## [Aleph Alpha](/oss/python/integrations/text_embedding/aleph_alpha)## [Anyscale](/oss/python/integrations/text_embedding/anyscale)## [Ascend](/oss/python/integrations/text_embedding/ascend)## [AI/ML API](/oss/python/integrations/text_embedding/aimlapi)## [AwaDB](/oss/python/integrations/text_embedding/awadb)## [AzureOpenAI](/oss/python/integrations/text_embedding/azure_openai)## [Baichuan Text Embeddings](/oss/python/integrations/text_embedding/baichuan)## [Baidu Qianfan](/oss/python/integrations/text_embedding/baidu_qianfan_endpoint)## [Baseten](/oss/python/integrations/text_embedding/baseten)## [Bedrock](/oss/python/integrations/text_embedding/bedrock)## [BGE on Hugging Face](/oss/python/integrations/text_embedding/bge_huggingface)## [Bookend AI](/oss/python/integrations/text_embedding/bookend)## [Clarifai](/oss/python/integrations/text_embedding/clarifai)## [Cloudflare Workers AI](/oss/python/integrations/text_embedding/cloudflare_workersai)## [Clova Embeddings](/oss/python/integrations/text_embedding/clova)## [Cohere](/oss/python/integrations/text_embedding/cohere)## [DashScope](/oss/python/integrations/text_embedding/dashscope)## [Databricks](/oss/python/integrations/text_embedding/databricks)## [DeepInfra](/oss/python/integrations/text_embedding/deepinfra)## [EDEN AI](/oss/python/integrations/text_embedding/edenai)## [Elasticsearch](/oss/python/integrations/text_embedding/elasticsearch)## [Embaas](/oss/python/integrations/text_embedding/embaas)## [Fake Embeddings](/oss/python/integrations/text_embedding/fake)## [FastEmbed by Qdrant](/oss/python/integrations/text_embedding/fastembed)## [Fireworks](/oss/python/integrations/text_embedding/fireworks)## [Google Gemini](/oss/python/integrations/text_embedding/google_generative_ai)## [Google Vertex AI](/oss/python/integrations/text_embedding/google_vertex_ai)## [GPT4All](/oss/python/integrations/text_embedding/gpt4all)## [Gradient](/oss/python/integrations/text_embedding/gradient)## [GreenNode](/oss/python/integrations/text_embedding/greennode)## [Hugging Face](/oss/python/integrations/text_embedding/huggingfacehub)## [IBM watsonx.ai](/oss/python/integrations/text_embedding/ibm_watsonx)## [Infinity](/oss/python/integrations/text_embedding/infinity)## [Instruct Embeddings](/oss/python/integrations/text_embedding/instruct_embeddings)## [IPEX-LLM CPU](/oss/python/integrations/text_embedding/ipex_llm)## [IPEX-LLM GPU](/oss/python/integrations/text_embedding/ipex_llm_gpu)## [Isaacus](/oss/python/integrations/text_embedding/isaacus)## [Intel Extension for Transformers](/oss/python/integrations/text_embedding/itrex)## [Jina](/oss/python/integrations/text_embedding/jina)## [John Snow Labs](/oss/python/integrations/text_embedding/johnsnowlabs_embedding)## [LASER](/oss/python/integrations/text_embedding/laser)## [Lindorm](/oss/python/integrations/text_embedding/lindorm)## [Llama.cpp](/oss/python/integrations/text_embedding/llamacpp)## [LLMRails](/oss/python/integrations/text_embedding/llm_rails)## [LocalAI](/oss/python/integrations/text_embedding/localai)## [MiniMax](/oss/python/integrations/text_embedding/minimax)## [MistralAI](/oss/python/integrations/text_embedding/mistralai)## [Model2Vec](/oss/python/integrations/text_embedding/model2vec)## [ModelScope](/oss/python/integrations/text_embedding/modelscope_embedding)## [MosaicML](/oss/python/integrations/text_embedding/mosaicml)## [Naver](/oss/python/integrations/text_embedding/naver)## [Nebius](/oss/python/integrations/text_embedding/nebius)## [Netmind](/oss/python/integrations/text_embedding/netmind)## [NLP Cloud](/oss/python/integrations/text_embedding/nlp_cloud)## [Nomic](/oss/python/integrations/text_embedding/nomic)## [NVIDIA NIMs](/oss/python/integrations/text_embedding/nvidia_ai_endpoints)## [Oracle Cloud Infrastructure](/oss/python/integrations/text_embedding/oci_generative_ai)## [Ollama](/oss/python/integrations/text_embedding/ollama)## [OpenClip](/oss/python/integrations/text_embedding/open_clip)## [OpenAI](/oss/python/integrations/text_embedding/openai)## [OpenVINO](/oss/python/integrations/text_embedding/openvino)## [Optimum Intel](/oss/python/integrations/text_embedding/optimum_intel)## [Oracle AI Database](/oss/python/integrations/text_embedding/oracleai)## [OVHcloud](/oss/python/integrations/text_embedding/ovhcloud)## [Pinecone Embeddings](/oss/python/integrations/text_embedding/pinecone)## [PredictionGuard](/oss/python/integrations/text_embedding/predictionguard)## [PremAI](/oss/python/integrations/text_embedding/premai)## [SageMaker](/oss/python/integrations/text_embedding/sagemaker-endpoint)## [SambaNova](/oss/python/integrations/text_embedding/sambanova)## [Self Hosted](/oss/python/integrations/text_embedding/self-hosted)## [Sentence Transformers](/oss/python/integrations/text_embedding/sentence_transformers)## [Solar](/oss/python/integrations/text_embedding/solar)## [SpaCy](/oss/python/integrations/text_embedding/spacy_embedding)## [SparkLLM](/oss/python/integrations/text_embedding/sparkllm)## [TensorFlow Hub](/oss/python/integrations/text_embedding/tensorflowhub)## [Text Embeddings Inference](/oss/python/integrations/text_embedding/text_embeddings_inference)## [TextEmbed](/oss/python/integrations/text_embedding/textembed)## [Titan Takeoff](/oss/python/integrations/text_embedding/titan_takeoff)## [Together AI](/oss/python/integrations/text_embedding/together)## [Upstage](/oss/python/integrations/text_embedding/upstage)## [Volc Engine](/oss/python/integrations/text_embedding/volcengine)## [Voyage AI](/oss/python/integrations/text_embedding/voyageai)## [Xinference](/oss/python/integrations/text_embedding/xinference)## [YandexGPT](/oss/python/integrations/text_embedding/yandex)## [ZhipuAI](/oss/python/integrations/text_embedding/zhipuai)
[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/text_embedding/index.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
Was this page helpful?
[Text splitter integrationsPrevious](/oss/python/integrations/splitters)[Vector store integrationsNext](/oss/python/integrations/vectorstores)
Ctrl+I
Responses are generated using AI and may contain mistakes.