# Source: https://docs.langchain.com/oss/python/integrations/vectorstores

[Skip to main content](#content-area)
[Docs by LangChain home page](/)
##
[​](#overview)
Overview
A vector stores [embedded](/oss/python/integrations/text_embedding) data and performs similarity search.
📤 Query phase (retrieval)
📥 Indexing phase (store)
📄 Documents
🔢 Embedding model
🔘 Embedding vectors
Vector store
❓ Query text
🔢 Embedding model
🔘 Query vector
🔍 Similarity search
📄 Top-k results
###
[​](#interface)
Interface
LangChain provides a unified interface for vector stores, allowing you to:
 * `add_documents` \- Add documents to the store.
 * `delete` \- Remove stored documents by ID.
 * `similarity_search` \- Query for semantically similar documents.
This abstraction lets you switch between different implementations without altering your application logic.
###
[​](#initialization)
Initialization
To initialize a vector store, provide it with an embedding model:
Copy
 from langchain_core.vectorstores import InMemoryVectorStore
 vector_store = InMemoryVectorStore(embedding=SomeEmbeddingModel())
###
[​](#adding-documents)
Adding documents
Add [`Document`](https://reference.langchain.com/python/langchain_core/documents/#langchain_core.documents.base.Document) objects (holding `page_content` and optional metadata) like so:
Copy
 vector_store.add_documents(documents=[doc1, doc2], ids=["id1", "id2"])
###
[​](#deleting-documents)
Deleting documents
Delete by specifying IDs:
Copy
 vector_store.delete(ids=["id1"])
###
[​](#similarity-search)
Similarity search
Issue a semantic query using `similarity_search`, which returns the closest embedded documents:
Copy
 similar_docs = vector_store.similarity_search("your query here")
Many vector stores support parameters like:
 * `k` — number of results to return
 * `filter` — conditional filtering based on metadata
###
[​](#similarity-metrics-&-indexing)
Similarity metrics & indexing
Embedding similarity may be computed using:
 * **Cosine similarity**
 * **Euclidean distance**
 * **Dot product**
Efficient search often employs indexing methods such as HNSW (Hierarchical Navigable Small World), though specifics depend on the vector store.
###
[​](#metadata-filtering)
Metadata filtering
Filtering by metadata (e.g., source, date) can refine search results:
Copy
 vector_store.similarity_search(
 "query",
 k=3,
 filter={"source": "tweets"}
##
[​](#top-integrations)
Top integrations
**Select embedding model:**
OpenAI
Copy
 pip install -qU langchain-openai
Copy
 import getpass
 import os
 if not os.environ.get("OPENAI_API_KEY"):
 os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")
 from langchain_openai import OpenAIEmbeddings
 embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
Azure
Copy
 pip install -qU langchain-azure-ai
Copy
 import getpass
 import os
 if not os.environ.get("AZURE_OPENAI_API_KEY"):
 os.environ["AZURE_OPENAI_API_KEY"] = getpass.getpass("Enter API key for Azure: ")
 from langchain_openai import AzureOpenAIEmbeddings
 embeddings = AzureOpenAIEmbeddings(
 azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
 azure_deployment=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
 openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
Google Gemini
Copy
 pip install -qU langchain-google-genai
Copy
 import getpass
 import os
 if not os.environ.get("GOOGLE_API_KEY"):
 os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")
 from langchain_google_genai import GoogleGenerativeAIEmbeddings
 embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
Google Vertex
Copy
 pip install -qU langchain-google-vertexai
Copy
 from langchain_google_vertexai import VertexAIEmbeddings
 embeddings = VertexAIEmbeddings(model="text-embedding-005")
AWS
Copy
 pip install -qU langchain-aws
Copy
 from langchain_aws import BedrockEmbeddings
 embeddings = BedrockEmbeddings(model_id="amazon.titan-embed-text-v2:0")
HuggingFace
Copy
 pip install -qU langchain-huggingface
Copy
 from langchain_huggingface import HuggingFaceEmbeddings
 embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
Ollama
Copy
 pip install -qU langchain-ollama
Copy
 from langchain_ollama import OllamaEmbeddings
 embeddings = OllamaEmbeddings(model="llama3")
Cohere
Copy
 pip install -qU langchain-cohere
Copy
 import getpass
 import os
 if not os.environ.get("COHERE_API_KEY"):
 os.environ["COHERE_API_KEY"] = getpass.getpass("Enter API key for Cohere: ")
 from langchain_cohere import CohereEmbeddings
 embeddings = CohereEmbeddings(model="embed-english-v3.0")
Mistral AI
Copy
 pip install -qU langchain-mistralai
Copy
 import getpass
 import os
 if not os.environ.get("MISTRALAI_API_KEY"):
 os.environ["MISTRALAI_API_KEY"] = getpass.getpass("Enter API key for MistralAI: ")
 from langchain_mistralai import MistralAIEmbeddings
 embeddings = MistralAIEmbeddings(model="mistral-embed")
Nomic
Copy
 pip install -qU langchain-nomic
Copy
 import getpass
 import os
 if not os.environ.get("NOMIC_API_KEY"):
 os.environ["NOMIC_API_KEY"] = getpass.getpass("Enter API key for Nomic: ")
 from langchain_nomic import NomicEmbeddings
 embeddings = NomicEmbeddings(model="nomic-embed-text-v1.5")
NVIDIA
Copy
 pip install -qU langchain-nvidia-ai-endpoints
Copy
 import getpass
 import os
 if not os.environ.get("NVIDIA_API_KEY"):
 os.environ["NVIDIA_API_KEY"] = getpass.getpass("Enter API key for NVIDIA: ")
 from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
 embeddings = NVIDIAEmbeddings(model="NV-Embed-QA")
Voyage AI
Copy
 pip install -qU langchain-voyageai
Copy
 import getpass
 import os
 if not os.environ.get("VOYAGE_API_KEY"):
 os.environ["VOYAGE_API_KEY"] = getpass.getpass("Enter API key for Voyage AI: ")
 from langchain-voyageai import VoyageAIEmbeddings
 embeddings = VoyageAIEmbeddings(model="voyage-3")
IBM watsonx
Copy
 pip install -qU langchain-ibm
Copy
 import getpass
 import os
 if not os.environ.get("WATSONX_APIKEY"):
 os.environ["WATSONX_APIKEY"] = getpass.getpass("Enter API key for IBM watsonx: ")
 from langchain_ibm import WatsonxEmbeddings
 embeddings = WatsonxEmbeddings(
 model_id="ibm/slate-125m-english-rtrvr",
 url="https://us-south.ml.cloud.ibm.com",
 project_id="<WATSONX PROJECT_ID>",
Fake
Copy
 pip install -qU langchain-core
Copy
 from langchain_core.embeddings import DeterministicFakeEmbedding
 embeddings = DeterministicFakeEmbedding(size=4096)
xAI
Copy
 pip install -qU langchain-xai
Copy
 import getpass
 import os
 if not os.environ.get("XAI_API_KEY"):
 os.environ["XAI_API_KEY"] = getpass.getpass("Enter API key for xAI: ")
 from langchain.chat_models import init_chat_model
 model = init_chat_model("grok-2", model_provider="xai")
Perplexity
Copy
 pip install -qU langchain-perplexity
Copy
 import getpass
 import os
 if not os.environ.get("PPLX_API_KEY"):
 os.environ["PPLX_API_KEY"] = getpass.getpass("Enter API key for Perplexity: ")
 from langchain.chat_models import init_chat_model
 model = init_chat_model("llama-3.1-sonar-small-128k-online", model_provider="perplexity")
DeepSeek
Copy
 pip install -qU langchain-deepseek
Copy
 import getpass
 import os
 if not os.environ.get("DEEPSEEK_API_KEY"):
 os.environ["DEEPSEEK_API_KEY"] = getpass.getpass("Enter API key for DeepSeek: ")
 from langchain.chat_models import init_chat_model
 model = init_chat_model("deepseek-chat", model_provider="deepseek")
**Select vector store:**
In-memory
Copy
 pip install -qU langchain-core
Copy
 from langchain_core.vectorstores import InMemoryVectorStore
 vector_store = InMemoryVectorStore(embeddings)
Amazon OpenSearch
pip
Copy
 pip install -qU boto3
Copy
 from opensearchpy import RequestsHttpConnection
 service = "es" # must set the service as 'es'
 region = "us-east-2"
 credentials = boto3.Session(
 aws_access_key_id="xxxxxx", aws_secret_access_key="xxxxx"
 ).get_credentials()
 awsauth = AWS4Auth("xxxxx", "xxxxxx", region, service, session_token=credentials.token)
 vector_store = OpenSearchVectorSearch.from_documents(
 docs,
 embeddings,
 opensearch_url="host url",
 http_auth=awsauth,
 timeout=300,
 use_ssl=True,
 verify_certs=True,
 connection_class=RequestsHttpConnection,
 index_name="test-index",
Astra DB
Copy
 pip install -qU langchain-astradb
Copy
 from langchain_astradb import AstraDBVectorStore
 vector_store = AstraDBVectorStore(
 embedding=embeddings,
 api_endpoint=ASTRA_DB_API_ENDPOINT,
 collection_name="astra_vector_langchain",
 token=ASTRA_DB_APPLICATION_TOKEN,
 namespace=ASTRA_DB_NAMESPACE,
Azure Cosmos DB NoSQL
Copy
 pip install -qU langchain-azure-ai azure-cosmos
Copy
 from langchain_azure_ai.vectorstores.azure_cosmos_db_no_sql import (
 AzureCosmosDBNoSqlVectorSearch,
 vector_search = AzureCosmosDBNoSqlVectorSearch.from_documents(
 documents=docs,
 embedding=openai_embeddings,
 cosmos_client=cosmos_client,
 database_name=database_name,
 container_name=container_name,
 vector_embedding_policy=vector_embedding_policy,
 full_text_policy=full_text_policy,
 indexing_policy=indexing_policy,
 cosmos_container_properties=cosmos_container_properties,
 cosmos_database_properties={},
 full_text_search_enabled=True,
Azure Cosmos DB Mongo vCore
Copy
 pip install -qU langchain-azure-ai pymongo
Copy
 from langchain_azure_ai.vectorstores.azure_cosmos_db_mongo_vcore import (
 AzureCosmosDBMongoVCoreVectorSearch,
 vectorstore = AzureCosmosDBMongoVCoreVectorSearch.from_documents(
 docs,
 openai_embeddings,
 collection=collection,
 index_name=INDEX_NAME,
Chroma
Copy
 pip install -qU langchain-chroma
Copy
 from langchain_chroma import Chroma
 vector_store = Chroma(
 collection_name="example_collection",
 embedding_function=embeddings,
 persist_directory="./chroma_langchain_db", # Where to save data locally, remove if not necessary
CockroachDB
Copy
 pip install -qU langchain-cockroachdb
Copy
 from langchain_cockroachdb import AsyncCockroachDBVectorStore, CockroachDBEngine
 CONNECTION_STRING = "cockroachdb://user:pass@host:26257/db?sslmode=verify-full"
 engine = CockroachDBEngine.from_connection_string(CONNECTION_STRING)
 await engine.ainit_vectorstore_table(
 table_name="vectors",
 vector_dimension=1536,
 vector_store = AsyncCockroachDBVectorStore(
 engine=engine,
 embeddings=embeddings,
 collection_name="vectors",
FAISS
Copy
 pip install -qU langchain-community
Copy
 import faiss
 from langchain_community.docstore.in_memory import InMemoryDocstore
 from langchain_community.vectorstores import FAISS
 embedding_dim = len(embeddings.embed_query("hello world"))
 index = faiss.IndexFlatL2(embedding_dim)
 vector_store = FAISS(
 embedding_function=embeddings,
 index=index,
 docstore=InMemoryDocstore(),
 index_to_docstore_id={},
Milvus
Copy
 pip install -qU langchain-milvus
Copy
 from langchain_milvus import Milvus
 URI = "./milvus_example.db"
 vector_store = Milvus(
 embedding_function=embeddings,
 connection_args={"uri": URI},
 index_params={"index_type": "FLAT", "metric_type": "L2"},
MongoDB
Copy
 pip install -qU langchain-mongodb
Copy
 from langchain_mongodb import MongoDBAtlasVectorSearch
 vector_store = MongoDBAtlasVectorSearch(
 embedding=embeddings,
 collection=MONGODB_COLLECTION,
 index_name=ATLAS_VECTOR_SEARCH_INDEX_NAME,
 relevance_score_fn="cosine",
PGVector
Copy
 pip install -qU langchain-postgres
Copy
 from langchain_postgres import PGVector
 vector_store = PGVector(
 embeddings=embeddings,
 collection_name="my_docs",
 connection="postgresql+psycopg://..."
PGVectorStore
Copy
 pip install -qU langchain-postgres
Copy
 from langchain_postgres import PGEngine, PGVectorStore
 $engine = PGEngine.from_connection_string(
 url="postgresql+psycopg://..."
 vector_store = PGVectorStore.create_sync(
 engine=pg_engine,
 table_name='test_table',
 embedding_service=embedding
Pinecone
Copy
 pip install -qU langchain-pinecone
Copy
 from langchain_pinecone import PineconeVectorStore
 from pinecone import Pinecone
 pc = Pinecone(api_key=...)
 index = pc.Index(index_name)
 vector_store = PineconeVectorStore(embedding=embeddings, index=index)
Qdrant
Copy
 pip install -qU langchain-qdrant
Copy
 from qdrant_client.models import Distance, VectorParams
 from langchain_qdrant import QdrantVectorStore
 from qdrant_client import QdrantClient
 client = QdrantClient(":memory:")
 vector_size = len(embeddings.embed_query("sample text"))
 if not client.collection_exists("test"):
 client.create_collection(
 collection_name="test",
 vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
 vector_store = QdrantVectorStore(
 client=client,
 collection_name="test",
 embedding=embeddings,
Oracle AI Database
Copy
 pip install -qU langchain-oracledb
Copy
 import oracledb
 from langchain_oracledb.vectorstores import OracleVS
 from langchain_oracledb.vectorstores.oraclevs import create_index
 from langchain_community.vectorstores.utils import DistanceStrategy
 username = "<username>"
 password = "<password>"
 dsn = "<hostname>:<port>/<service_name>"
 connection = oracledb.connect(user=username, password=password, dsn=dsn)
 vector_store = OracleVS(
 client=connection,
 embedding_function=embedding_model,
 table_name="VECTOR_SEARCH_DEMO",
 distance_strategy=DistanceStrategy.EUCLIDEAN_DISTANCE
Vectorstore| Delete by ID| Filtering| Search by Vector| Search with score| Async| Passes Standard Tests| Multi Tenancy| IDs in add Documents
---|---|---|---|---|---|---|---|---
[`AstraDBVectorStore`](/oss/python/integrations/vectorstores/astradb)| ✅| ✅| ✅| ✅| ✅| ✅| ✅| ✅
[`AzureCosmosDBNoSqlVectorStore`](/oss/python/integrations/vectorstores/azure_cosmos_db_no_sql)| ✅| ✅| ✅| ✅| ❌| ✅| ✅| ✅
[`AzureCosmosDBMongoVCoreVectorStore`](/oss/python/integrations/vectorstores/azure_cosmos_db_mongo_vcore)| ✅| ✅| ✅| ✅| ❌| ✅| ✅| ✅
[`Chroma`](/oss/python/integrations/vectorstores/chroma)| ✅| ✅| ✅| ✅| ✅| ✅| ✅| ✅
[`Clickhouse`](/oss/python/integrations/vectorstores/clickhouse)| ✅| ✅| ❌| ✅| ❌| ❌| ❌| ✅
[`AsyncCockroachDBVectorStore`](/oss/python/integrations/vectorstores/cockroachdb)| ✅| ✅| ✅| ✅| ✅| ✅| ❌| ✅
[`CouchbaseSearchVectorStore`](/oss/python/integrations/vectorstores/couchbase)| ✅| ✅| ✅| ✅| ✅| ❌| ✅| ✅
[`DatabricksVectorSearch`](/oss/python/integrations/vectorstores/databricks_vector_search)| ✅| ✅| ✅| ✅| ✅| ❌| ❌| ✅
[`ElasticsearchStore`](/oss/python/integrations/vectorstores/elasticsearch)| ✅| ✅| ✅| ✅| ✅| ❌| ❌| ✅
[`FAISS`](/oss/python/integrations/vectorstores/faiss)| ✅| ✅| ✅| ✅| ✅| ❌| ❌| ✅
[`InMemoryVectorStore`](https://python.langchain.com/api_reference/core/vectorstores/langchain_core.vectorstores.in_memory.InMemoryVectorStore.html)| ✅| ✅| ❌| ✅| ✅| ❌| ❌| ✅
[`LambdaDB`](/oss/python/integrations/vectorstores/lambdadb)| ✅| ✅| ✅| ✅| ✅| ✅| ❌| ✅
[`Milvus`](/oss/python/integrations/vectorstores/milvus)| ✅| ✅| ✅| ✅| ✅| ✅| ✅| ✅
[`Moorcheh`](/oss/python/integrations/vectorstores/moorcheh)| ✅| ✅| ✅| ✅| ✅| ✅| ✅| ✅
[`MongoDBAtlasVectorSearch`](/oss/python/integrations/vectorstores/mongodb_atlas)| ✅| ✅| ✅| ✅| ✅| ✅| ✅| ✅
[`openGauss`](/oss/python/integrations/vectorstores/opengauss)| ✅| ✅| ✅| ✅| ❌| ✅| ❌| ✅
[`PGVector`](/oss/python/integrations/vectorstores/pgvector)| ✅| ✅| ✅| ✅| ✅| ❌| ❌| ✅
[`PGVectorStore`](/oss/python/integrations/vectorstores/pgvectorstore)| ✅| ✅| ✅| ✅| ✅| ✅| ❌| ✅
[`PineconeVectorStore`](/oss/python/integrations/vectorstores/pinecone)| ✅| ✅| ✅| ❌| ✅| ❌| ❌| ✅
[`QdrantVectorStore`](/oss/python/integrations/vectorstores/qdrant)| ✅| ✅| ✅| ✅| ✅| ❌| ✅| ✅
[`Weaviate`](/oss/python/integrations/vectorstores/weaviate)| ✅| ✅| ✅| ✅| ✅| ❌| ✅| ✅
[`SQLServer`](/oss/python/integrations/vectorstores/sqlserver)| ✅| ✅| ✅| ✅| ❌| ❌| ❌| ✅
[`ZeusDB`](/oss/python/integrations/vectorstores/zeusdb)| ✅| ✅| ✅| ✅| ✅| ✅| ❌| ✅
[`Oracle AI Database`](/oss/python/integrations/vectorstores/oracle)| ✅| ✅| ✅| ✅| ✅| ✅| ❌| ✅
##
[​](#all-vector-stores)
All vector stores
## [Activeloop Deep Lake](/oss/python/integrations/vectorstores/activeloop_deeplake)## [Alibaba Cloud MySQL](/oss/python/integrations/vectorstores/alibabacloud_mysql)## [Alibaba Cloud OpenSearch](/oss/python/integrations/vectorstores/alibabacloud_opensearch)## [AnalyticDB](/oss/python/integrations/vectorstores/analyticdb)## [Annoy](/oss/python/integrations/vectorstores/annoy)## [Apache Doris](/oss/python/integrations/vectorstores/apache_doris)## [ApertureDB](/oss/python/integrations/vectorstores/aperturedb)## [Astra DB Vector Store](/oss/python/integrations/vectorstores/astradb)## [Atlas](/oss/python/integrations/vectorstores/atlas)## [AwaDB](/oss/python/integrations/vectorstores/awadb)## [Azure Cosmos DB Mongo vCore](/oss/python/integrations/vectorstores/azure_cosmos_db_mongo_vcore)## [Azure Cosmos DB No SQL](/oss/python/integrations/vectorstores/azure_cosmos_db_no_sql)## [Azure Database for PostgreSQL - Flexible Server](/oss/python/integrations/vectorstores/azure_db_for_postgresql)## [Azure AI Search](/oss/python/integrations/vectorstores/azuresearch)## [Bagel](/oss/python/integrations/vectorstores/bagel)## [BagelDB](/oss/python/integrations/vectorstores/bageldb)## [Baidu Cloud ElasticSearch VectorSearch](/oss/python/integrations/vectorstores/baiducloud_vector_search)## [Baidu VectorDB](/oss/python/integrations/vectorstores/baiduvectordb)## [Apache Cassandra](/oss/python/integrations/vectorstores/cassandra)## [Chroma](/oss/python/integrations/vectorstores/chroma)## [Clarifai](/oss/python/integrations/vectorstores/clarifai)## [ClickHouse](/oss/python/integrations/vectorstores/clickhouse)## [CockroachDB](/oss/python/integrations/vectorstores/cockroachdb)## [Couchbase](/oss/python/integrations/vectorstores/couchbase)## [DashVector](/oss/python/integrations/vectorstores/dashvector)## [Databricks](/oss/python/integrations/vectorstores/databricks_vector_search)## [IBM Db2](/oss/python/integrations/vectorstores/db2)## [DingoDB](/oss/python/integrations/vectorstores/dingo)## [DocArray HnswSearch](/oss/python/integrations/vectorstores/docarray_hnsw)## [DocArray InMemorySearch](/oss/python/integrations/vectorstores/docarray_in_memory)## [Amazon Document DB](/oss/python/integrations/vectorstores/documentdb)## [DuckDB](/oss/python/integrations/vectorstores/duckdb)## [China Mobile ECloud ElasticSearch](/oss/python/integrations/vectorstores/ecloud_vector_search)## [Elasticsearch](/oss/python/integrations/vectorstores/elasticsearch)## [Epsilla](/oss/python/integrations/vectorstores/epsilla)## [Faiss](/oss/python/integrations/vectorstores/faiss)## [Faiss (Async)](/oss/python/integrations/vectorstores/faiss_async)## [FalkorDB](/oss/python/integrations/vectorstores/falkordbvector)## [Gel](/oss/python/integrations/vectorstores/gel)## [Google AlloyDB](/oss/python/integrations/vectorstores/google_alloydb)## [Google BigQuery Vector Search](/oss/python/integrations/vectorstores/google_bigquery_vector_search)## [Google Cloud SQL for MySQL](/oss/python/integrations/vectorstores/google_cloud_sql_mysql)## [Google Cloud SQL for PostgreSQL](/oss/python/integrations/vectorstores/google_cloud_sql_pg)## [Firestore](/oss/python/integrations/vectorstores/google_firestore)## [Google Memorystore for Redis](/oss/python/integrations/vectorstores/google_memorystore_redis)## [Google Spanner](/oss/python/integrations/vectorstores/google_spanner)## [Google Bigtable](/oss/python/integrations/vectorstores/google_bigtable)## [Google Vertex AI Feature Store](/oss/python/integrations/vectorstores/google_vertex_ai_feature_store)## [Google Vertex AI Vector Search](/oss/python/integrations/vectorstores/google_vertex_ai_vector_search)## [Hippo](/oss/python/integrations/vectorstores/hippo)## [Hologres](/oss/python/integrations/vectorstores/hologres)## [Jaguar Vector Database](/oss/python/integrations/vectorstores/jaguar)## [Kinetica](/oss/python/integrations/vectorstores/kinetica)## [LambdaDB](/oss/python/integrations/vectorstores/lambdadb)## [LanceDB](/oss/python/integrations/vectorstores/lancedb)## [Lantern](/oss/python/integrations/vectorstores/lantern)## [Lindorm](/oss/python/integrations/vectorstores/lindorm)## [LLMRails](/oss/python/integrations/vectorstores/llm_rails)## [ManticoreSearch](/oss/python/integrations/vectorstores/manticore_search)## [MariaDB](/oss/python/integrations/vectorstores/mariadb)## [Marqo](/oss/python/integrations/vectorstores/marqo)## [Meilisearch](/oss/python/integrations/vectorstores/meilisearch)## [Amazon MemoryDB](/oss/python/integrations/vectorstores/memorydb)## [Milvus](/oss/python/integrations/vectorstores/milvus)## [Momento Vector Index](/oss/python/integrations/vectorstores/momento_vector_index)## [Moorcheh](/oss/python/integrations/vectorstores/moorcheh)## [MongoDB Atlas](/oss/python/integrations/vectorstores/mongodb_atlas)## [MyScale](/oss/python/integrations/vectorstores/myscale)## [Neo4j Vector Index](/oss/python/integrations/vectorstores/neo4jvector)## [NucliaDB](/oss/python/integrations/vectorstores/nucliadb)## [Oceanbase](/oss/python/integrations/vectorstores/oceanbase)## [openGauss](/oss/python/integrations/vectorstores/opengauss)## [OpenSearch](/oss/python/integrations/vectorstores/opensearch)## [Oracle AI Database](/oss/python/integrations/vectorstores/oracle)## [Pathway](/oss/python/integrations/vectorstores/pathway)## [Postgres Embedding](/oss/python/integrations/vectorstores/pgembedding)## [PGVecto.rs](/oss/python/integrations/vectorstores/pgvecto_rs)## [PGVector](/oss/python/integrations/vectorstores/pgvector)## [PGVectorStore](/oss/python/integrations/vectorstores/pgvectorstore)## [Pinecone](/oss/python/integrations/vectorstores/pinecone)## [Pinecone (sparse)](/oss/python/integrations/vectorstores/pinecone_sparse)## [Qdrant](/oss/python/integrations/vectorstores/qdrant)## [Relyt](/oss/python/integrations/vectorstores/relyt)## [Rockset](/oss/python/integrations/vectorstores/rockset)## [SAP HANA Cloud Vector Engine](/oss/python/integrations/vectorstores/sap_hanavector)## [ScaNN](/oss/python/integrations/vectorstores/google_scann)## [SemaDB](/oss/python/integrations/vectorstores/semadb)## [SingleStore](/oss/python/integrations/vectorstores/singlestore)## [scikit-learn](/oss/python/integrations/vectorstores/sklearn)## [SQLiteVec](/oss/python/integrations/vectorstores/sqlitevec)## [SQLite-VSS](/oss/python/integrations/vectorstores/sqlitevss)## [SQLServer](/oss/python/integrations/vectorstores/sqlserver)## [StarRocks](/oss/python/integrations/vectorstores/starrocks)## [Supabase](/oss/python/integrations/vectorstores/supabase)## [SurrealDB](/oss/python/integrations/vectorstores/surrealdb)## [Tablestore](/oss/python/integrations/vectorstores/tablestore)## [Tair](/oss/python/integrations/vectorstores/tair)## [Tencent Cloud VectorDB](/oss/python/integrations/vectorstores/tencentvectordb)## [Teradata VectorStore](/oss/python/integrations/vectorstores/teradata)## [ThirdAI NeuralDB](/oss/python/integrations/vectorstores/thirdai_neuraldb)## [TiDB Vector](/oss/python/integrations/vectorstores/tidb_vector)## [Tigris](/oss/python/integrations/vectorstores/tigris)## [TileDB](/oss/python/integrations/vectorstores/tiledb)## [Timescale Vector](/oss/python/integrations/vectorstores/timescalevector)## [Typesense](/oss/python/integrations/vectorstores/typesense)## [Upstash Vector](/oss/python/integrations/vectorstores/upstash)## [USearch](/oss/python/integrations/vectorstores/usearch)## [Vald](/oss/python/integrations/vectorstores/vald)## [VDMS](/oss/python/integrations/vectorstores/vdms)## [veDB for MySQL](/oss/python/integrations/vectorstores/vedb_for_mysql)## [Vearch](/oss/python/integrations/vectorstores/vearch)## [Vectara](/oss/python/integrations/vectorstores/vectara)## [Vespa](/oss/python/integrations/vectorstores/vespa)## [viking DB](/oss/python/integrations/vectorstores/vikingdb)## [vlite](/oss/python/integrations/vectorstores/vlite)## [Volcengine RDS for MySQL](/oss/python/integrations/vectorstores/volcengine_mysql)## [Weaviate](/oss/python/integrations/vectorstores/weaviate)## [Xata](/oss/python/integrations/vectorstores/xata)## [YDB](/oss/python/integrations/vectorstores/ydb)## [Yellowbrick](/oss/python/integrations/vectorstores/yellowbrick)## [Zep](/oss/python/integrations/vectorstores/zep)## [Zep Cloud](/oss/python/integrations/vectorstores/zep_cloud)## [ZeusDB](/oss/python/integrations/vectorstores/zeusdb)## [Zilliz](/oss/python/integrations/vectorstores/zilliz)## [Zvec](/oss/python/integrations/vectorstores/zvec)
[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/vectorstores/index.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
Was this page helpful?
[Embedding model integrationsPrevious](/oss/python/integrations/text_embedding)[Document loader integrationsNext](/oss/python/integrations/document_loaders)
Ctrl+I
Responses are generated using AI and may contain mistakes.