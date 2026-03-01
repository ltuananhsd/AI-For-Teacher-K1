import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

def export_faiss_to_md():
    faiss_path = "./faiss_index"
    output_file = "faiss_dump.md"
    
    if not os.path.exists(faiss_path):
        print(f"Error: FAISS index not found at {faiss_path}")
        return

    print("Loading FAISS index...")
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = FAISS.load_local(faiss_path, embeddings, allow_dangerous_deserialization=True)
    
    docstore = vectorstore.docstore._dict
    
    print(f"Found {len(docstore)} documents. Exporting to {output_file}...")
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# FAISS RAG Database Dump\n\n")
        f.write(f"**Total Chunks:** {len(docstore)}\n\n")
        f.write("---\n\n")
        
        for idx, (doc_id, doc) in enumerate(docstore.items()):
            source = doc.metadata.get('source', 'Unknown')
            title = doc.metadata.get('title', 'Unknown Title')
            type_meta = doc.metadata.get('type', 'Unknown Type')
            
            f.write(f"## Chunk {idx + 1}\n")
            f.write(f"- **Source:** `{source}`\n")
            f.write(f"- **Title:** `{title}`\n")
            f.write(f"- **Type:** `{type_meta}`\n")
            if 'summary' in doc.metadata and doc.metadata['summary']:
                f.write(f"- **Summary:** {doc.metadata['summary']}\n")
                
            f.write("\n**Content:**\n")
            f.write("```text\n")
            f.write(doc.page_content)
            f.write("\n```\n\n")
            f.write("---\n\n")
            
    print(f"✅ Export completed successfully! You can view the contents in '{output_file}'")

if __name__ == "__main__":
    export_faiss_to_md()
