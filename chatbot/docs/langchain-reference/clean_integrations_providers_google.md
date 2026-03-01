# Source: https://docs.langchain.com/oss/python/integrations/providers/google

[Skip to main content](#content-area)
[Docs by LangChain home page](/)
This page covers all LangChain integrations with [Google Gemini](https://ai.google.dev/gemini-api/docs), [Google Cloud](https://cloud.google.com/), and other Google products (such as Google Maps, YouTube, and [more](#other-google-products)).
**Unified SDK & Package Consolidation**As of `langchain-google-genai` 4.0.0, this package uses the consolidated [`google-genai`](https://googleapis.github.io/python-genai/) SDK and now supports **both the Gemini Developer API and Vertex AI** backends.The `langchain-google-vertexai` package remains supported for Vertex AI platform-specific features (Model Garden, Vector Search, evaluation services, etc.).Read the [full announcement and migration guide](https://github.com/langchain-ai/langchain-google/discussions/1422).
Not sure which package to use?
Google Generative AI (Gemini API & Vertex AI)
Access Google Gemini models via the **[Gemini Developer API](https://ai.google.dev/)** or **[Vertex AI](https://cloud.google.com/vertex-ai)**. The backend is selected automatically based on your configuration.
 * **Gemini Developer API** : Quick setup with API key, ideal for individual developers and rapid prototyping
 * **Vertex AI** : Enterprise features with Google Cloud integration (requires GCP project)
Use the `langchain-google-genai` package for chat models, LLMs, and embeddings.[See integrations.](#google-generative-ai)
Google Cloud (Vertex AI Platform Services)
Access Vertex AI platform-specific services beyond Gemini models: Model Garden (Llama, Mistral, Anthropic), evaluation services, and specialized vision models.Use the `langchain-google-vertexai` package for platform services and specific packages (e.g., `langchain-google-community`, `langchain-google-cloud-sql-pg`) for other cloud services like databases and storage.[See integrations.](#google-cloud)
See Google’s guide on [migrating from the Gemini API to Vertex AI](https://ai.google.dev/gemini-api/docs/migrate-to-cloud) for more details on the differences.
Integration packages for Gemini models and the Vertex AI platform are maintained in the [`langchain-google`](https://github.com/langchain-ai/langchain-google) repository.You can find a host of LangChain integrations with other Google APIs and services in the `langchain-google-community` package (listed on this page) and the [`googleapis`](https://github.com/orgs/googleapis/repositories?q=langchain) GitHub organization.
##
[​](#google-generative-ai)
Google generative AI
Access Google Gemini models via the [Gemini Developer API](https://ai.google.dev/gemini-api/docs) or [Vertex AI](https://cloud.google.com/vertex-ai) using the unified `langchain-google-genai` package.
**Package consolidation** Certain `langchain-google-vertexai` classes for Gemini models are being deprecated in favor of the unified `langchain-google-genai` package. Please migrate to the new classes.Read the [full announcement and migration guide](https://github.com/langchain-ai/langchain-google/discussions/1422).
###
[​](#chat-models)
Chat models
## [ChatGoogleGenerativeAIGoogle Gemini chat models via **Gemini Developer API** or **Vertex AI**.](/oss/python/integrations/chat/google_generative_ai)
###
[​](#llms)
LLMs
## [GoogleGenerativeAIAccess the same Gemini models (via **Gemini Developer API** or **Vertex AI**) using the (legacy) LLM text completion interface.](/oss/python/integrations/llms/google_ai)
###
[​](#embedding-models)
Embedding models
## [GoogleGenerativeAIEmbeddingsGemini embedding models via **Gemini Developer API** or **Vertex AI**.](/oss/python/integrations/text_embedding/google_generative_ai)
##
[​](#google-cloud)
Google cloud
Access Vertex AI platform-specific services including Model Garden (Llama, Mistral, Anthropic), Vector Search, evaluation services, and specialized vision models.
###
[​](#chat-models-2)
Chat models
**For Gemini models** , use [`ChatGoogleGenerativeAI`](/oss/python/integrations/chat/google_generative_ai) from `langchain-google-genai` instead of `ChatVertexAI`. It supports both Gemini Developer API and Vertex AI backends.The classes below focus on **Vertex AI platform services** that are _not_ available in the consolidated SDK.Read the [full announcement and migration guide](https://github.com/langchain-ai/langchain-google/discussions/1422).
## [ChatVertexAI**Deprecated** – Use [`ChatGoogleGenerativeAI`](/oss/python/integrations/chat/google_generative_ai) for Gemini models instead.](/oss/python/integrations/chat/google_vertex_ai)## [ChatAnthropicVertexAnthropic on Vertex AI Model Garden](/oss/python/integrations/chat/google_anthropic_vertex)
VertexModelGardenLlama
Llama on Vertex AI Model Garden
Copy
 from langchain_google_vertexai.model_garden_maas.llama import VertexModelGardenLlama
VertexModelGardenMistral
Mistral on Vertex AI Model Garden
Copy
 from langchain_google_vertexai.model_garden_maas.mistral import VertexModelGardenMistral
GemmaChatLocalHF
Local Gemma model loaded from HuggingFace.
Copy
 from langchain_google_vertexai.gemma import GemmaChatLocalHF
GemmaChatLocalKaggle
Local Gemma model loaded from Kaggle.
Copy
 from langchain_google_vertexai.gemma import GemmaChatLocalKaggle
GemmaChatVertexAIModelGarden
Gemma on Vertex AI Model Garden
Copy
 from langchain_google_vertexai.gemma import GemmaChatVertexAIModelGarden
VertexAIImageCaptioningChat
Implementation of the Image Captioning model as a chat.
Copy
 from langchain_google_vertexai.vision_models import VertexAIImageCaptioningChat
VertexAIImageEditorChat
Given an image and a prompt, edit the image. Currently only supports mask-free editing.
Copy
 from langchain_google_vertexai.vision_models import VertexAIImageEditorChat
VertexAIImageGeneratorChat
Generates an image from a prompt.
Copy
 from langchain_google_vertexai.vision_models import VertexAIImageGeneratorChat
VertexAIVisualQnAChat
Chat implementation of a visual QnA model.
Copy
 from langchain_google_vertexai.vision_models import VertexAIVisualQnAChat
###
[​](#llms-2)
LLMs
(legacy) string-in, string-out LLM interface.
## [VertexAIModelGardenAccess Gemini, and hundreds of OSS models via Vertex AI Model Garden service.](/oss/python/integrations/llms/google_vertex_ai#vertex-model-garden)## [VertexAI**Deprecated** – Use [`GoogleGenerativeAI`](/oss/python/integrations/llms/google_generative_ai) for Gemini models instead.](/oss/python/integrations/llms/google_vertex_ai)
Gemma:
Gemma local from Hugging Face
Local Gemma model loaded from HuggingFace.
Copy
 from langchain_google_vertexai.gemma import GemmaLocalHF
Gemma local from Kaggle
Local Gemma model loaded from Kaggle.
Copy
 from langchain_google_vertexai.gemma import GemmaLocalKaggle
Gemma on Vertex AI Model Garden
Copy
 from langchain_google_vertexai.gemma import GemmaVertexAIModelGarden
Vertex AI image captioning
Implementation of the Image Captioning model as an LLM.
Copy
 from langchain_google_vertexai.vision_models import VertexAIImageCaptioning
###
[​](#embedding-models-2)
Embedding models
## [VertexAIEmbeddings**Deprecated** – Use [`GenerativeAIEmbeddings`](/oss/python/integrations/text_embedding/google_generative_ai) instead.](/oss/python/integrations/text_embedding/google_vertex_ai)
###
[​](#document-loaders)
Document loaders
Load documents from various Google Cloud sources.
## [AlloyDB for PostgreSQLGoogle Cloud AlloyDB is a fully managed PostgreSQL-compatible database service.](/oss/python/integrations/document_loaders/google_alloydb)## [BigQueryGoogle Cloud BigQuery is a serverless data warehouse.](/oss/python/integrations/document_loaders/google_bigquery)## [BigtableGoogle Cloud Bigtable is a scalable, fully managed key-value and wide-column store ideal for fast access to structured, semi-structured, or unstructured data.](/oss/python/integrations/document_loaders/google_bigtable)## [Cloud SQL for MySQLGoogle Cloud SQL for MySQL is a fully-managed MySQL database service.](/oss/python/integrations/document_loaders/google_cloud_sql_mysql)## [Cloud SQL for SQL ServerGoogle Cloud SQL for SQL Server is a fully-managed SQL Server database service.](/oss/python/integrations/document_loaders/google_cloud_sql_mssql)## [Cloud SQL for PostgreSQLGoogle Cloud SQL for PostgreSQL is a fully-managed PostgreSQL database service.](/oss/python/integrations/document_loaders/google_cloud_sql_pg)## [Cloud Storage (directory)Google Cloud Storage is a managed service for storing unstructured data.](/oss/python/integrations/document_loaders/google_cloud_storage_directory)## [Cloud Storage (file)Google Cloud Storage is a managed service for storing unstructured data.](/oss/python/integrations/document_loaders/google_cloud_storage_file)## [El Carro for Oracle WorkloadsGoogle El Carro Oracle Operator runs Oracle databases in Kubernetes.](/oss/python/integrations/document_loaders/google_el_carro)## [Firestore (Native Mode)Google Cloud Firestore is a NoSQL document database.](/oss/python/integrations/document_loaders/google_firestore)## [Firestore (Datastore Mode)Google Cloud Firestore in Datastore mode](/oss/python/integrations/document_loaders/google_datastore)## [Memorystore for RedisGoogle Cloud Memorystore for Redis is a fully managed Redis service.](/oss/python/integrations/document_loaders/google_memorystore_redis)## [SpannerGoogle Cloud Spanner is a fully managed, globally distributed relational database service.](/oss/python/integrations/document_loaders/google_spanner)## [Speech-to-TextGoogle Cloud Speech-to-Text transcribes audio files.](/oss/python/integrations/document_loaders/google_speech_to_text)
## Cloud Vision loader
Load data using Google Cloud Vision API.
Copy
 from langchain_google_community.vision import CloudVisionLoader
###
[​](#document-transformers)
Document transformers
Transform documents using Google Cloud services.
## [Document AITransform unstructured data from documents into structured data, making it easier to understand, analyze, and consume.](/oss/python/integrations/document_transformers/google_docai)## [Google TranslateTranslate text and HTML with the Google Cloud Translation API.](/oss/python/integrations/document_transformers/google_translate)
###
[​](#vector-stores)
Vector stores
Store and search vectors using Google Cloud databases and Vertex AI Vector Search.
## [AlloyDB for PostgreSQLGoogle Cloud AlloyDB is a fully managed relational database service that offers high performance, seamless integration, and impressive scalability on Google Cloud. AlloyDB is 100% compatible with PostgreSQL.](/oss/python/integrations/vectorstores/google_alloydb)## [BigQuery Vector SearchBigQuery vector search lets you use GoogleSQL to do semantic search, using vector indexes for fast but approximate results, or using brute force for exact results.](/oss/python/integrations/vectorstores/google_bigquery_vector_search)## [Memorystore for RedisVector store using Memorystore for Redis](/oss/python/integrations/vectorstores/google_memorystore_redis)## [SpannerVector store using Cloud Spanner](/oss/python/integrations/vectorstores/google_spanner)## [BigtableVector store using Cloud Bigtable](/oss/python/integrations/vectorstores/google_bigtable)## [Firestore (Native Mode)Vector store using Firestore](/oss/python/integrations/vectorstores/google_firestore)## [Cloud SQL for MySQLVector store using Cloud SQL for MySQL](/oss/python/integrations/vectorstores/google_cloud_sql_mysql)## [Cloud SQL for PostgreSQLVector store using Cloud SQL for PostgreSQL.](/oss/python/integrations/vectorstores/google_cloud_sql_pg)## [Vertex AI Vector SearchFormerly known as Vertex AI Matching Engine, provides a low latency vector database. These vector databases are commonly referred to as vector similarity-matching or an approximate nearest neighbor (ANN) service.](/oss/python/integrations/vectorstores/google_vertex_ai_vector_search)## [With DataStore BackendVector search using Datastore for document storage.](/oss/python/integrations/vectorstores/google_vertex_ai_vector_search#optional--you-can-also-create-vectore-and-store-chunks-in-a-datastore)
###
[​](#retrievers)
Retrievers
Retrieve information using Google Cloud services.
## [Vertex AI SearchBuild generative AI powered search engines using Vertex AI Search](/oss/python/integrations/retrievers/google_vertex_ai_search)## [Document AI WarehouseSearch, store, and manage documents using Document AI Warehouse.](https://cloud.google.com/document-ai-warehouse)
Other retrievers
Copy
 from langchain_google_community import VertexAIMultiTurnSearchRetriever
 from langchain_google_community import VertexAISearchRetriever
 from langchain_google_community import VertexAISearchSummaryTool
###
[​](#tools)
Tools
Integrate agents with various Google Cloud services.
## [Text-to-SpeechGoogle Cloud Text-to-Speech synthesizes natural-sounding speech with 100+ voices in multiple languages.](/oss/python/integrations/tools/google_cloud_texttospeech)
###
[​](#callbacks)
Callbacks
Track LLM/Chat model usage.
Vertex AI callback handler
Callback Handler that tracks `VertexAI` usage info.
Copy
 from langchain_google_vertexai.callbacks import VertexAICallbackHandler
Google BigQuery
See the [documentation](/oss/python/integrations/callbacks/google_bigquery) for more details.
Copy
 from langchain_google_community.callbacks.bigquery_callback import BigQueryCallbackHandler
###
[​](#evaluators)
Evaluators
Evaluate model outputs using Vertex AI.
VertexPairWiseStringEvaluator
Pair-wise evaluation using Vertex AI models.
Copy
 from langchain_google_vertexai.evaluators.evaluation import VertexPairWiseStringEvaluator
VertexStringEvaluator
Evaluate a single prediction string using Vertex AI models.
Copy
 from langchain_google_vertexai.evaluators.evaluation import VertexStringEvaluator
##
[​](#other-google-products)
Other Google products
Integrations with various Google services beyond the core Cloud Platform.
###
[​](#document-loaders-2)
Document loaders
## [Google DriveGoogle Drive file storage. Currently supports Google Docs.](/oss/python/integrations/document_loaders/google_drive)
###
[​](#vector-stores-2)
Vector stores
## [ScaNN (Local Index)ScaNN is a method for efficient vector similarity search at scale.](/oss/python/integrations/vectorstores/google_scann)
###
[​](#retrievers-2)
Retrievers
## [Google DriveRetrieve documents from Google Drive.](/oss/python/integrations/retrievers/google_drive)
###
[​](#tools-2)
Tools
## [Google SearchPerform web searches using Google Custom Search Engine (CSE).](/oss/python/integrations/tools/google_search)## [Google DriveTools for interacting with Google Drive.](/oss/python/integrations/tools/google_drive)## [Google FinanceQuery financial data.](/oss/python/integrations/tools/google_finance)## [Google JobsQuery job listings.](/oss/python/integrations/tools/google_jobs)## [Google LensPerform visual searches.](/oss/python/integrations/tools/google_lens)## [Google PlacesSearch for places information.](/oss/python/integrations/tools/google_places)## [Google ScholarSearch academic papers.](/oss/python/integrations/tools/google_scholar)## [Google TrendsQuery Google Trends data.](/oss/python/integrations/tools/google_trends)
###
[​](#mcp)
MCP
## [MCP ToolboxSimple and efficient way to connect to your databases, including those on Google Cloud like Cloud SQL and AlloyDB](/oss/python/integrations/tools/mcp_toolbox)
###
[​](#toolkits)
Toolkits
Collections of tools for specific Google services.
## [GmailToolkit to create, get, search, and send emails using the Gmail API.](/oss/python/integrations/tools/google_gmail)
###
[​](#chat-loaders)
Chat loaders
## [GmailLoad chat history from Gmail threads.](/oss/python/integrations/chat_loaders/google_gmail)
##
[​](#3rd-party-integrations)
3rd party integrations
Access Google services via unofficial third-party APIs.
## [SearchApisearchapi.io provides API access to Google search results, YouTube, and more.](/oss/python/integrations/tools/searchapi)## [SerpApiSerpApi provides API access to Google search results.](/oss/python/integrations/tools/serpapi)## [Serper.devserper.dev provides API access to Google search results.](/oss/python/integrations/tools/google_serper)## [clorocloro provides API access to Google Search results, with AI Overview support.](/oss/python/integrations/tools/cloro)
###
[​](#youtube)
YouTube
## [Search toolSearch YouTube videos without the official API.](/oss/python/integrations/tools/youtube)## [Audio loaderDownload audio from YouTube videos.](/oss/python/integrations/document_loaders/youtube_audio)## [Transcripts loaderLoad video transcripts.](/oss/python/integrations/document_loaders/youtube_transcript)
[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/providers/google.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
Was this page helpful?
[Anthropic (Claude) integrationsPrevious](/oss/python/integrations/providers/anthropic)[AWS (Amazon) integrationsNext](/oss/python/integrations/providers/aws)
Ctrl+I
Responses are generated using AI and may contain mistakes.