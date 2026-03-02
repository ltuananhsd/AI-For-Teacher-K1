# Source: https://docs.langchain.com/oss/python/integrations/providers/aws

[Skip to main content](#content-area)
[Docs by LangChain home page](/)
This page covers all LangChain integrations with the [Amazon Web Services (AWS)](https://aws.amazon.com/) platform.
##
[​](#chat-models)
Chat models
###
[​](#bedrock-chat)
Bedrock chat
> [Amazon Bedrock](https://aws.amazon.com/bedrock/) is a fully managed service that offers a choice of high-performing foundation models (FMs) from leading AI companies like `AI21 Labs`, `Anthropic`, `Cohere`, `Meta`, `Stability AI`, and `Amazon` via a single API, along with a broad set of capabilities you need to build generative AI applications with security, privacy, and responsible AI. Using `Amazon Bedrock`, you can easily experiment with and evaluate top FMs for your use case, privately customize them with your data using techniques such as fine-tuning and `Retrieval Augmented Generation` (`RAG`), and build agents that execute tasks using your enterprise systems and data sources. Since `Amazon Bedrock` is serverless, you don’t have to manage any infrastructure, and you can securely integrate and deploy generative AI capabilities into your applications using the AWS services you are already familiar with.
See a [usage example](/oss/python/integrations/chat/bedrock).
Copy
 from langchain_aws import ChatBedrock
###
[​](#bedrock-converse)
Bedrock converse
AWS Bedrock maintains a [Converse API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) that provides a unified conversational interface for Bedrock models. This API does not yet support custom models. You can see a list of all [models that are supported here](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html).
**We recommend the Converse API for users who do not need to use custom models. It can be accessed using[ChatBedrockConverse](https://python.langchain.com/api_reference/aws/chat_models/langchain_aws.chat_models.bedrock_converse.ChatBedrockConverse.html).**
See a [usage example](/oss/python/integrations/chat/bedrock).
Copy
 from langchain_aws import ChatBedrockConverse
##
[​](#llms)
LLMs
###
[​](#bedrock)
Bedrock
See a [usage example](/oss/python/integrations/llms/bedrock).
Copy
 from langchain_aws import BedrockLLM
###
[​](#amazon-api-gateway)
Amazon API Gateway
> [Amazon API Gateway](https://aws.amazon.com/api-gateway/) is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. APIs act as the “front door” for applications to access data, business logic, or functionality from your backend services. Using `API Gateway`, you can create RESTful APIs and WebSocket APIs that enable real-time two-way communication applications. `API Gateway` supports containerized and serverless workloads, as well as web applications. `API Gateway` handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traffic management, CORS support, authorization and access control, throttling, monitoring, and API version management. `API Gateway` has no minimum fees or startup costs. You pay for the API calls you receive and the amount of data transferred out and, with the `API Gateway` tiered pricing model, you can reduce your cost as your API usage scales.
See a [usage example](/oss/python/integrations/llms/amazon_api_gateway).
Copy
 from langchain_community.llms import AmazonAPIGateway
###
[​](#sagemaker-endpoint)
SageMaker endpoint
> [Amazon SageMaker](https://aws.amazon.com/sagemaker/) is a system that can build, train, and deploy machine learning (ML) models with fully managed infrastructure, tools, and workflows.
We use `SageMaker` to host our model and expose it as the `SageMaker Endpoint`. See a [usage example](/oss/python/integrations/llms/sagemaker).
Copy
 from langchain_aws import SagemakerEndpoint
##
[​](#embedding-models)
Embedding models
###
[​](#bedrock-2)
Bedrock
See a [usage example](/oss/python/integrations/text_embedding/bedrock).
Copy
 from langchain_aws import BedrockEmbeddings
###
[​](#sagemaker-endpoint-2)
SageMaker endpoint
See a [usage example](/oss/python/integrations/text_embedding/sagemaker-endpoint).
Copy
 from langchain_community.embeddings import SagemakerEndpointEmbeddings
 from langchain_community.llms.sagemaker_endpoint import ContentHandlerBase
##
[​](#document-loaders)
Document loaders
###
[​](#aws-s3-directory-and-file)
AWS S3 directory and file
> [Amazon Simple Storage Service (Amazon S3)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-folders.html) is an object storage service. [AWS S3 Directory](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-folders.html) [AWS S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html)
See a [usage example for S3DirectoryLoader](/oss/python/integrations/document_loaders/aws_s3_directory). See a [usage example for S3FileLoader](/oss/python/integrations/document_loaders/aws_s3_file).
Copy
 from langchain_community.document_loaders import S3DirectoryLoader, S3FileLoader
###
[​](#amazon-textract)
Amazon textract
> [Amazon Textract](https://docs.aws.amazon.com/managedservices/latest/userguide/textract.html) is a machine learning (ML) service that automatically extracts text, handwriting, and data from scanned documents.
See a [usage example](/oss/python/integrations/document_loaders/amazon_textract).
Copy
 from langchain_community.document_loaders import AmazonTextractPDFLoader
###
[​](#amazon-athena)
Amazon athena
> [Amazon Athena](https://aws.amazon.com/athena/) is a serverless, interactive analytics service built on open-source frameworks, supporting open-table and file formats.
See a [usage example](/oss/python/integrations/document_loaders/athena).
Copy
 from langchain_community.document_loaders.athena import AthenaLoader
###
[​](#aws-glue)
AWS glue
> The [AWS Glue Data Catalog](https://docs.aws.amazon.com/en_en/glue/latest/dg/catalog-and-crawler.html) is a centralized metadata repository that allows you to manage, access, and share metadata about your data stored in AWS. It acts as a metadata store for your data assets, enabling various AWS services and your applications to query and connect to the data they need efficiently.
See a [usage example](/oss/python/integrations/document_loaders/glue_catalog).
Copy
 from langchain_community.document_loaders.glue_catalog import GlueCatalogLoader
##
[​](#vector-stores)
Vector stores
###
[​](#amazon-opensearch-service)
Amazon OpenSearch Service
> [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service/) performs interactive log analytics, real-time application monitoring, website search, and more. `OpenSearch` is an open source, distributed search and analytics suite derived from `Elasticsearch`. `Amazon OpenSearch Service` offers the latest versions of `OpenSearch`, support for many versions of `Elasticsearch`, as well as visualization capabilities powered by `OpenSearch Dashboards` and `Kibana`.
We need to install several python libraries.
Copy
 pip install boto3 requests requests-aws4auth
See a [usage example](/oss/python/integrations/vectorstores/opensearch#using-aos-amazon-opensearch-service).
Copy
 from langchain_community.vectorstores import OpenSearchVectorSearch
###
[​](#amazon-documentdb-vector-search)
Amazon DocumentDB vector search
> [Amazon DocumentDB (with MongoDB Compatibility)](https://docs.aws.amazon.com/documentdb/) makes it easy to set up, operate, and scale MongoDB-compatible databases in the cloud. With Amazon DocumentDB, you can run the same application code and use the same drivers and tools that you use with MongoDB. Vector search for Amazon DocumentDB combines the flexibility and rich querying capability of a JSON-based document database with the power of vector search.
####
[​](#installation-and-setup)
Installation and setup
See [detail configuration instructions](/oss/python/integrations/vectorstores/documentdb). We need to install the `pymongo` python package.
Copy
 pip install pymongo
####
[​](#deploy-documentdb-on-aws)
Deploy DocumentDB on AWS
[Amazon DocumentDB (with MongoDB Compatibility)](https://docs.aws.amazon.com/documentdb/) is a fast, reliable, and fully managed database service. Amazon DocumentDB makes it easy to set up, operate, and scale MongoDB-compatible databases in the cloud. AWS offers services for computing, databases, storage, analytics, and other functionality. For an overview of all AWS services, see [Cloud Computing with Amazon Web Services](https://aws.amazon.com/what-is-aws/). See a [usage example](/oss/python/integrations/vectorstores/documentdb).
Copy
 from langchain_community.vectorstores import DocumentDBVectorSearch
###
[​](#amazon-memorydb)
Amazon MemoryDB
[Amazon MemoryDB](https://aws.amazon.com/memorydb/) is a durable, in-memory database service that delivers ultra-fast performance. MemoryDB is compatible with Redis OSS, a popular open source data store, enabling you to quickly build applications using the same flexible and friendly Redis OSS APIs, and commands that they already use today. InMemoryVectorStore class provides a vectorstore to connect with Amazon MemoryDB.
Copy
 from langchain_aws.vectorstores.inmemorydb import InMemoryVectorStore
 vds = InMemoryVectorStore.from_documents(
 chunks,
 embeddings,
 redis_url="rediss://cluster_endpoint:6379/ssl=True ssl_cert_reqs=none",
 vector_schema=vector_schema,
 index_name=INDEX_NAME,
See a [usage example](/oss/python/integrations/vectorstores/memorydb).
##
[​](#retrievers)
Retrievers
###
[​](#amazon-kendra)
Amazon kendra
> [Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html) is an intelligent search service provided by `Amazon Web Services` (`AWS`). It utilizes advanced natural language processing (NLP) and machine learning algorithms to enable powerful search capabilities across various data sources within an organization. `Kendra` is designed to help users find the information they need quickly and accurately, improving productivity and decision-making.
> With `Kendra`, we can search across a wide range of content types, including documents, FAQs, knowledge bases, manuals, and websites. It supports multiple languages and can understand complex queries, synonyms, and contextual meanings to provide highly relevant search results.
We need to install the `langchain-aws` library.
Copy
 pip install langchain-aws
See a [usage example](/oss/python/integrations/retrievers/amazon_kendra_retriever).
Copy
 from langchain_aws import AmazonKendraRetriever
###
[​](#amazon-bedrock-knowledge-bases)
Amazon Bedrock (Knowledge bases)
> [Knowledge bases for Amazon Bedrock](https://aws.amazon.com/bedrock/knowledge-bases/) is an `Amazon Web Services` (`AWS`) offering which lets you quickly build RAG applications by using your private data to customize foundation model response.
We need to install the `langchain-aws` library.
Copy
 pip install langchain-aws
See a [usage example](/oss/python/integrations/retrievers/bedrock).
Copy
 from langchain_aws import AmazonKnowledgeBasesRetriever
##
[​](#tools)
Tools
###
[​](#aws-lambda)
AWS lambda
> [`Amazon AWS Lambda`](https://aws.amazon.com/pm/lambda/) is a serverless computing service provided by `Amazon Web Services` (`AWS`). It helps developers to build and run applications and services without provisioning or managing servers. This serverless architecture enables you to focus on writing and deploying code, while AWS automatically takes care of scaling, patching, and managing the infrastructure required to run your applications.
We need to install `boto3` python library.
Copy
 pip install boto3
See a [usage example](/oss/python/integrations/tools/awslambda).
Copy
 from langchain_community.chat_message_histories import DynamoDBChatMessageHistory
###
[​](#amazon-bedrock-agentcore-browser)
Amazon Bedrock AgentCore Browser
> [Amazon Bedrock AgentCore Browser](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html) enables agents to interact with web pages through a managed Chrome browser for navigation, content extraction, and web automation.
Copy
 pip install langchain-aws bedrock-agentcore playwright beautifulsoup4
See a [usage example](/oss/python/integrations/tools/bedrock_agentcore_browser).
Copy
 from langchain_aws.tools import create_browser_toolkit
 # Create toolkit
 toolkit, browser_tools = create_browser_toolkit(region="us-west-2")
 # Use with an agent
 agent = create_react_agent(model=llm, tools=browser_tools)
 result = await agent.ainvoke(
 {"messages": [{"role": "user", "content": "Go to example.com and get the heading"}]},
 config={"configurable": {"thread_id": "session-1"}}
 # Cleanup when done
 await toolkit.cleanup()
###
[​](#amazon-bedrock-agentcore-code-interpreter)
Amazon Bedrock AgentCore Code Interpreter
> [Amazon Bedrock AgentCore Code Interpreter](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html) enables agents to execute Python, JavaScript, and TypeScript code in secure, managed sandbox environments for calculations, data analysis, and visualizations.
Copy
 pip install langchain-aws bedrock-agentcore
See a [usage example](/oss/python/integrations/tools/bedrock_agentcore_code_interpreter).
Copy
 from langchain_aws.tools import create_code_interpreter_toolkit
 # Create toolkit (async)
 toolkit, code_tools = await create_code_interpreter_toolkit(region="us-west-2")
 # Use with an agent
 agent = create_react_agent(model=llm, tools=code_tools)
 result = await agent.ainvoke(
 {"messages": [{"role": "user", "content": "Calculate factorial of 10"}]},
 config={"configurable": {"thread_id": "session-1"}}
 # Cleanup when done
 await toolkit.cleanup()
##
[​](#graphs)
Graphs
###
[​](#amazon-neptune)
Amazon neptune
> [Amazon Neptune](https://aws.amazon.com/neptune/) is a high-performance graph analytics and serverless database for superior scalability and availability.
For the Cypher and SPARQL integrations below, we need to install the `langchain-aws` library.
Copy
 pip install langchain-aws
###
[​](#amazon-neptune-with-cypher)
Amazon neptune with cypher
See a [usage example](/oss/python/integrations/graphs/amazon_neptune_open_cypher).
Copy
 from langchain_aws.graphs import NeptuneGraph
 from langchain_aws.graphs import NeptuneAnalyticsGraph
 from langchain_aws.chains import create_neptune_opencypher_qa_chain
###
[​](#amazon-neptune-with-sparql)
Amazon neptune with SPARQL
Copy
 from langchain_aws.graphs import NeptuneRdfGraph
 from langchain_aws.chains import create_neptune_sparql_qa_chain
##
[​](#memory)
Memory
###
[​](#amazon-bedrock-agentcore-memory)
Amazon Bedrock AgentCore Memory
> [Amazon Bedrock AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) provides managed persistence for LangGraph agents, enabling conversation history and state management across sessions with automatic scaling and high availability.
Copy
 pip install langgraph-checkpoint-aws
Copy
 from langgraph_checkpoint_aws import AgentCoreMemorySaver
 # Create checkpointer
 checkpointer = AgentCoreMemorySaver(
 memory_id="your-memory-id",
 region_name="us-west-2"
 # Use with LangGraph
 graph = workflow.compile(checkpointer=checkpointer)
 # Invoke with thread_id and actor_id for conversation persistence
 config = {
 "configurable": {
 "thread_id": "user-123",
 "actor_id": "my-agent" # Required for AgentCore
 result = graph.invoke({"messages": []}, config)
Key features:
 * Managed infrastructure with no database setup required
 * Automatic scaling and high availability
 * Multi-agent support via `actor_id` isolation
 * Encryption at rest and in transit
###
[​](#amazon-bedrock-agentcore-memory-store)
Amazon Bedrock AgentCore Memory Store
> [Amazon Bedrock AgentCore Memory Store](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) provides long-term memory with semantic search capabilities for LangGraph agents, enabling storage and retrieval of user preferences, facts, and extracted memories across sessions.
Copy
 from langgraph_checkpoint_aws import AgentCoreMemoryStore
 # Initialize store for long-term memories
 store = AgentCoreMemoryStore(memory_id="your-memory-id", region_name="us-west-2")
 # Use in a pre-model hook to save and retrieve memories
 def pre_model_hook(state, config, *, store):
 actor_id = config["configurable"]["actor_id"]
 thread_id = config["configurable"]["thread_id"]
 namespace = (actor_id, thread_id)
 # Save a message
 store.put(namespace, str(uuid.uuid4()), {"message": msg})
 # Search for relevant memories
 results = store.search(("preferences", actor_id), query="user preferences", limit=5)
 return {"model_input_messages": state["messages"]}
##
[​](#callbacks)
Callbacks
###
[​](#bedrock-token-usage)
Bedrock token usage
Copy
 from langchain_community.callbacks.bedrock_anthropic_callback import BedrockAnthropicTokenUsageCallbackHandler
###
[​](#sagemaker-tracking)
SageMaker tracking
> [Amazon SageMaker](https://aws.amazon.com/sagemaker/) is a fully managed service that is used to quickly and easily build, train and deploy machine learning (ML) models.
> [Amazon SageMaker Experiments](https://docs.aws.amazon.com/sagemaker/latest/dg/experiments.html) is a capability of `Amazon SageMaker` that lets you organize, track, compare and evaluate ML experiments and model versions.
We need to install several python libraries.
Copy
 pip install google-search-results sagemaker
See a [usage example](/oss/python/integrations/callbacks/sagemaker_tracking).
Copy
 from langchain_community.callbacks import SageMakerCallbackHandler
##
[​](#chains)
Chains
###
[​](#amazon-comprehend-moderation-chain)
Amazon Comprehend moderation chain
> [Amazon Comprehend](https://aws.amazon.com/comprehend/) is a natural-language processing (NLP) service that uses machine learning to uncover valuable insights and connections in text.
We need to install the `boto3` and `nltk` libraries.
Copy
 pip install boto3 nltk
See a [usage example](https://python.langchain.com/v0.1/docs/guides/productionization/safety/amazon_comprehend_chain/).
Copy
 from langchain_experimental.comprehend_moderation import AmazonComprehendModerationChain
##
[​](#runtime)
Runtime
###
[​](#amazon-bedrock-agentcore-runtime)
Amazon Bedrock AgentCore Runtime
> [Amazon Bedrock AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html) provides managed, serverless execution for LangGraph agents with built-in observability, automatic scaling, and seamless integration with other AgentCore services.
Copy
 pip install bedrock-agentcore
Copy
 from bedrock_agentcore.runtime import BedrockAgentCoreApp
 app = BedrockAgentCoreApp()
 @app.entrypoint
 def agent_invocation(payload, context):
 result = graph.invoke({"messages": [{"role": "user", "content": payload["prompt"]}]})
 return {"result": result["messages"][-1].content}
 app.run()
Deploy using the AgentCore CLI:
Copy
 # Configure your agent
 agentcore configure
 # Deploy to AgentCore Runtime
 agentcore launch -e your_agent.py
[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/providers/aws.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
Was this page helpful?
[Google integrationsPrevious](/oss/python/integrations/providers/google)[Hugging Face integrationsNext](/oss/python/integrations/providers/huggingface)
Ctrl+I
Responses are generated using AI and may contain mistakes.