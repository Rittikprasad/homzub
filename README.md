# Homzhub FE-Monorepo
A react and react-native Monorepo for the Homzhub web and mobile applications.

## Requirements
Node.js installed on your environement.
#### Node installation on Linux using NVM
To download and install the nvm script run:
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
#### Add NVM to Path
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

#### Install and verify node
    nvm --version
    nvm install node
    node --version
    nvm install 14.1.0
    nvm use 14.1.0
#### Install YARN
    npm -i g yarn
## Project Installation
    $ git clone https://github.com/HPL-Singapore/homzhubfrontend.git
    $ cd homzhubfrontend
    $ yarn install
## Install mobile application
    $ yarn android
    $ yarn ios
## Start & watch
    $ yarn start:web  
    $ yarn start:mobile 

## Simple build for production
    $ yarn build:web
    $ yarn build:mobile
## Run Test Cases
    $ yarn test
## Run Lint
    $ yarn lint
    $ yarn lint:fix
## Run Prettier
    $ yarn format
