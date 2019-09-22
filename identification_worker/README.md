# Identification Worker

The worker responsible for identifying tracks based of fingerprint information.

## HTTP Requests

*Note:* these requests are internal to the docker network and are not exposed externally.

**Identify Fingerprint**

Attempts to identify the track in the given fingerprint. Will return the track ID for the best match, if any.

* Endpoint: `POST [...]/identification_worker/identify_fingerprint`

* Body:

    ```json
    {
        "windowSize": "Integer (required)",
        "partitionSize": "Integer (required)",
        "fingerprint": "Fingerprint ArrayBuffer (required)",
    }
    ```