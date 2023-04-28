from flask import Flask, request, jsonify
from flask_cors import CORS

import os
from langchain.llms import OpenAI
from langchain.document_loaders import OnlinePDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chains.question_answering import load_qa_chain
import pinecone
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
PINECONE_API_ENV = os.getenv('PINECONE_API_ENV')


def process_document_and_query(pdf_link, question):
    loader = OnlinePDFLoader(pdf_link)
    data = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_documents(data)

    embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
    # initialize pinecone
    pinecone.init(
        api_key=PINECONE_API_KEY,
        environment=PINECONE_API_ENV
    )
    index_name = "langchain2"

    docsearch = Pinecone.from_texts([t.page_content for t in texts], embeddings, index_name=index_name)

    docs = docsearch.similarity_search(question, include_metadata=True)

    llm = OpenAI(temperature=0, openai_api_key=OPENAI_API_KEY)
    chain = load_qa_chain(llm, chain_type="stuff")

    answer = chain.run(input_documents=docs, question=question)

    return answer


@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    pdf_link = request.json['pdfLink']
    question = request.json['question']
    
    answer = process_document_and_query(pdf_link, question)

    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(port=5001)
