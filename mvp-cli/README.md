# mvp-cli

MVP CLI project for testing the basic search algorithm.

## Setup

Create venv `python -m venv .venv` and activate venv
* Linux/Mac: `source .venv/bin/activate`
* Windows: `source .venv/Scripts/activate`
Or use the vscode Python extension.

Install packages with `python -m pip install -r requirements.txt`

### Installing new packages

Run `pip install <package>`

Then write to requirements.txt with `pip freeze > requirements.txt`

## Usage

`python main.py --help`

### Debugging

In `config.py` set `DEBUGGER = True` then run the command as normal. When it
indicates that it's waiting for the debugger, start the
`Python Debugger: Remote Attach` debug configuration.