FROM ubuntu:16.04

WORKDIR /

# Install dependencies for webassembly as well as nodejs
RUN apt-get update && \
    apt-get install -y build-essential cmake python git curl bash && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt install nodejs

# Install webassembly from the precompiled build (building it ourselves takes forever)
RUN git clone https://github.com/emscripten-core/emsdk.git && \
    cd ./emsdk && \
    ./emsdk install latest && \
    ./emsdk activate latest

# Add the emscripten commands to the bash profile
RUN echo "source /emsdk/emsdk_env.sh --build=Release > /dev/null" >> ~/.bashrc && \
    echo "source /emsdk/emsdk_env.sh --build=Release > /dev/null" >> ~/.profile
    
# Install the client
WORKDIR /app

COPY ./package*.json ./

RUN npm install

# Copy all the client files
COPY . .

# Start dev server
CMD ["npm", "run", "start:dev"]