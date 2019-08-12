FROM ubuntu:16.04

WORKDIR /

# Install apt-add-repository
RUN apt-get update && \
    apt-get install -y software-properties-common

# Install dependencies for webassembly and KFR
RUN apt-add-repository "deb http://apt.llvm.org/trusty/ llvm-toolchain-trusty-4.0 main" && \
    apt-get install -y build-essential clang-4.0 lldb-4.0 cmake python git && \
    apt-get update

# Install webassembly from the precompiled build (building it ourselves takes forever)
RUN git clone https://github.com/emscripten-core/emsdk.git /emsdk && \
    cd ./emsdk && \
    ./emsdk install latest && \
    ./emsdk activate latest

# Add the emscripten commands to the bash profile
RUN echo "source /emsdk/emsdk_env.sh --build=Release > /dev/null" >> ~/.bashrc && \
    echo "source /emsdk/emsdk_env.sh --build=Release > /dev/null" >> ~/.profile

WORKDIR /

# Download KFR
RUN git clone https://github.com/kfrlib/kfr.git kfr

WORKDIR /kfr

# Compile KFR
RUN mkdir /kfr/build && cd ./build && \
    cmake -DENABLE_TESTS=OFF -DCMAKE_CXX_COMPILER=clang++-4.0 -DCMAKE_BUILD_TYPE=Release .. && \
    make -j

# Install node 12.0 and dos2unix
RUN apt-get install -y curl dos2unix bash && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install nodejs

# Install the client    
WORKDIR /app

COPY ./package*.json ./

# Install npm dependencies
RUN npm install

# Install gulp cli
RUN npm install gulp-cli -g

# Copy all the client files
COPY . .

# Start dev server
CMD ["npm", "run", "start:dev"]