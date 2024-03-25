import typer

app = typer.Typer()


@app.command()
def add(track_filepath: str):
  print(f"TODO: add track {track_filepath}")


@app.command()
def search(recording_filepath: str):
  print(f"TODO: search track {recording_filepath}")


if __name__ == "__main__":
  app()