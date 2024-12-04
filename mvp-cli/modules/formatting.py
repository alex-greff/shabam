"""Module for storing common terminal styling strings."""
from colorama import Fore, Style

HEAD_STYLE = f"{Style.RESET_ALL}{Style.BRIGHT}{Fore.CYAN}"
BOLD_STYLE = f"{Style.RESET_ALL}{Style.BRIGHT}{Fore.WHITE}"
NORMAL_STYLE = f"{Style.RESET_ALL}{Style.NORMAL}{Fore.WHITE}"
DIM_STYLE = f"{Style.RESET_ALL}{Style.DIM}{Fore.WHITE}"
DEBUG_STYLE = f"{Style.RESET_ALL}{Style.BRIGHT}{Fore.RED}"

BULLET = f"{Style.RESET_ALL}{Style.BRIGHT}{Fore.CYAN}•{Style.RESET_ALL}"
CARET = f"{Style.RESET_ALL}{Style.BRIGHT}{Fore.RED}›{Style.RESET_ALL}"
