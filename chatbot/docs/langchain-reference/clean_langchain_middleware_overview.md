# Source: https://docs.langchain.com/oss/python/langchain/middleware/overview

[Skip to main content](#content-area)
[Docs by LangChain home page](/)
Middleware provides a way to more tightly control what happens inside the agent. Middleware is useful for the following:
 * Tracking agent behavior with logging, analytics, and debugging.
 * Transforming prompts, [tool selection](/oss/python/langchain/middleware/built-in#llm-tool-selector), and output formatting.
 * Adding [retries](/oss/python/langchain/middleware/built-in#tool-retry), [fallbacks](/oss/python/langchain/middleware/built-in#model-fallback), and early termination logic.
 * Applying [rate limits](/oss/python/langchain/middleware/built-in#model-call-limit), guardrails, and [PII detection](/oss/python/langchain/middleware/built-in#pii-detection).
Add middleware by passing them to [`create_agent`](https://reference.langchain.com/python/langchain/agents/#langchain.agents.create_agent):
Copy
 from langchain.agents import create_agent
 from langchain.agents.middleware import SummarizationMiddleware, HumanInTheLoopMiddleware
 agent = create_agent(
 model="gpt-4.1",
 tools=[...],
 middleware=[
 SummarizationMiddleware(...),
 HumanInTheLoopMiddleware(...)
##
[​](#the-agent-loop)
The agent loop
The core agent loop involves calling a model, letting it choose tools to execute, and then finishing when it calls no more tools: Middleware exposes hooks before and after each of those steps:
##
[​](#additional-resources)
Additional resources
## [Built-in middlewareExplore built-in middleware for common use cases.](/oss/python/langchain/middleware/built-in)## [Custom middlewareBuild your own middleware with hooks and decorators.](/oss/python/langchain/middleware/custom)## [Middleware API referenceComplete API reference for middleware.](https://reference.langchain.com/python/langchain/middleware/)## [Testing agentsTest your agents with LangSmith.](/oss/python/langchain/test)
[Edit this page on GitHub](https://github.com/langchain-ai/docs/edit/main/src/oss/langchain/middleware/overview.mdx) or [file an issue](https://github.com/langchain-ai/docs/issues/new/choose).
[Connect these docs](/use-these-docs) to Claude, VSCode, and more via MCP for real-time answers.
Was this page helpful?
[Structured outputPrevious](/oss/python/langchain/structured-output)[Prebuilt middlewareNext](/oss/python/langchain/middleware/built-in)
Ctrl+I
Responses are generated using AI and may contain mistakes.