# Source: https://docs.langchain.com/oss/python/integrations/stores

[Skip to main content](#content-area)
[Docs by LangChain home page](/)
##
[​](#overview)
Overview
LangChain provides a key-value store interface for storing and retrieving data by key. The key-value store interface in LangChain is primarily used for caching [embeddings](/oss/python/integrations/text_embedding).
##
[​](#interface)
Interface
All [`BaseStores`](https://python.langchain.com/api_reference/core/stores/langchain_core.stores.BaseStore.html) support the following interface:
 * `mget(key: Sequence[str]) -> List[Optional[bytes]]`: get the contents of multiple keys, returning `None` if the key does not exist
 * `mset(key_value_pairs: Sequence[Tuple[str, bytes]]) -> None`: set the contents of multiple keys
 * `mdelete(key: Sequence[str]) -> None`: delete multiple keys
 * `yield_keys(prefix: Optional[str] = None) -> Iterator[str]`: yield all keys in the store, optionally filtering by a prefix
Base stores are designed to work **multiple** key-value pairs at once for efficiency. This saves on network round-trips and may allow for more efficient batch operations in the underlying store.
##
[​](#built-in-stores-for-local-development)
Built-in stores for local development
## [InMemoryByteStore](/oss/python/integrations/stores/in_memory)## [LocalFileStore](/oss/python/integrations/stores/file_system)
##
[​](#custom-stores)
Custom stores
You can also implement your own custom store by extending the [`BaseStore`](https://reference.langchain.com/python/langgraph/store/#langgraph.store.base.BaseStore) class. See the [store interface documentation](https://python.langchain.com/api_reference/core/stores/langchain_core.stores.BaseStore.html) for more details.
##
[​](#all-key-value-stores)
All key-value stores
## [AstraDBByteStore](/oss/python/integrations/stores/astradb)## [CassandraByteStore](/oss/python/integrations/stores/cassandra)## [ElasticsearchEmbeddingsCache](/oss/python/integrations/stores/elasticsearch)## [RedisStore](/oss/python/integrations/stores/redis)## [UpstashRedisByteStore](/oss/python/integrations/stores/upstash_redis)## [BigtableByteStore](/oss/python/integrations/stores/bigtable)
[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/stores/index.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
Was this page helpful?
[Document loader integrationsPrevious](/oss/python/integrations/document_loaders)
Ctrl+I
Responses are generated using AI and may contain mistakes.