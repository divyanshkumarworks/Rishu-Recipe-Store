from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS, Chroma 
from langchain.text_splitter import CharacterTextSplitter
from langchain import OpenAI, VectorDBQA
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.document_loaders import DirectoryLoader, TextLoader
import magic
import os
import nltk


openai_api_key = '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'
loader = DirectoryLoader(r'C:\Users\rishu\recipe_store\recipe_txt', glob='*.txt', loader_cls=TextLoader)
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
docsearch = Chroma.from_documents(texts, embeddings,  persist_directory='db', metadatas=[{"source": f"{i}-pl"} for i in range(len(texts))])

# openai_api_key = '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'
# loader = DirectoryLoader(r'C:\Users\rishu\recipe_store\recipe_txt', glob='*.txt', loader_cls=TextLoader)
# documents = loader.load()
# text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
# texts = text_splitter.split_documents(documents)
# embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
# docsearch = Chroma.from_texts(texts, embeddings, metadatas=[{"source": str(i)} for i in range(len(texts))], persist_directory='db')
chain = RetrievalQAWithSourcesChain.from_chain_type(OpenAI(temperature=0.6), chain_type="stuff", retriever=docsearch.as_retriever())
query = "suggest me a rice recipe"
docs = docsearch.similarity_search(query)
answer = chain({"question": query}, return_only_outputs=True)
# qa = RetrievalQA.from_chain_type(llm=OpenAI(temperature=0), chain_type="stuff", retriever=docsearch.as_retriever(search_type="similarity", search_kwargs={"k":3}), return_source_documents=True)
# query = "suggest me pie using banana"
# docs = docsearch.similarity_search(query)
# answer = chain({"input_documents": docs, "question": query}, return_only_outputs=True)
# openai_response = qa({"query": query})
# result = openai_response['result']
# source_docs = openai_response["source_documents"]
recipe_id = docs[0].metadata["source"][-6:-4]