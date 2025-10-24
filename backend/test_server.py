#!/usr/bin/env python
from main import app

if __name__ == "__main__":
    import uvicorn
    print("Starting server on http://localhost:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
