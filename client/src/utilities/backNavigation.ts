class BackNavigation {
  private _backPath: string | null;

  constructor() {
    this._backPath = null;
  }

  get backPath() {
    return this._backPath;
  }

  set backPath(value) {
    this._backPath = value;
  }

  get hasBackPath() {
    return !!this._backPath;
  }

  public clearBackPath() {
    this._backPath = null;
  }
}

export default new BackNavigation();
