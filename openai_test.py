from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS, Chroma 
from langchain.text_splitter import CharacterTextSplitter
from langchain import OpenAI, VectorDBQA
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.document_loaders import DirectoryLoader, TextLoader
import magic
from langchain.chains import RetrievalQAWithSourcesChain, RetrievalQA
import os
import nltk


openai_api_key = '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'
loader = DirectoryLoader(r'C:\Users\rishu\recipe_store\recipe_txt', glob='*.txt', loader_cls=TextLoader)
documents = loader.load()
print(documents)
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200, length_function=len)
texts = text_splitter.split_documents(documents)
print(texts)
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
docsearch = Chroma.from_documents(texts, embeddings,  persist_directory='db', metadatas=[{"source": f"{i}-pl"} for i in range(len(texts))])

# openai_api_key = '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'
# loader = DirectoryLoader(r'C:\Users\rishu\recipe_store\recipe_txt', glob='*.txt', loader_cls=TextLoader)
# documents = loader.load()
# text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
# texts = text_splitter.split_documents(documents)
# embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
# docsearch = Chroma.from_texts(texts, embeddings, metadatas=[{"source": str(i)} for i in range(len(texts))], persist_directory='db')
query = "suggest me some banana recipe"
# turbo_llm = ChatOpenAI(
# 	temperature = 0.6,
# 	model_name = "gpt-3.5-turbo"
# 	)
retriever = docsearch.as_retriever(search_kwargs={"k": 2})
chain = RetrievalQA.from_chain_type(llm=OpenAI(temperature=1), chain_type="stuff", retriever=retriever, return_source_documents=True)
result = chain(query)
# qa = RetrievalQA.from_chain_type(llm=OpenAI(temperature=0), chain_type="stuff", retriever=docsearch.as_retriever(search_type="similarity", search_kwargs={"k":3}), return_source_documents=True)
# query = "suggest me pie using banana"
# docs = docsearch.similarity_search(query)
# answer = chain({"input_documents": docs, "question": query}, return_only_outputs=True)
# openai_response = qa({"query": query})
# result = openai_response['result']
# source_docs = openai_response["source_documents"]
# recipe_id = docs[0].metadata["source"][-6:-4]
print(result["result"])