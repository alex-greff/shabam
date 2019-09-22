# Records Worker

Manages the track record sets as well as track record matching.

## HTTP Requests

*Note:* these requests are internal to the docker network and are not exposed externally.

**Search Address Database**

Searches the given address database for the given track. If no address databases are specified then the single worker instance searches all address databases sequentially, else it searches the given address databases in the array. Returns a map of all the matched couples and the number of matches for each one.

* Endpoint: `POST [...]/records_worker/search_address_db`
    
* Body:

    ```json
    {
        "addressDbNums": "Array of Integers (optional)",
        "windowSize": "Integer (required)",
        "partitionSize": "Integer (required)",
        "fingerprint": "Fingerprint ArrayBuffer (required)"
    }
    ```

**Add Track Addresses**

Computes and adds the given track addresses from the provided fingerprint. If no address databases is specified then the worker finds the first address database that I can put it in and does so. Returns information on the address database where it stored the computed addresses.

* Endpoint: `POST [...]/records_worker/add_track_addresses`

* Body:

    ```json
    {
        "addressDbNum": "Integer (optional)",
        "windowSize": "Integer (required)",
        "partitionSize": "Integer (required)",
        "fingerprint": "Fingerprint ArrayBuffer (required)",
        "trackID": "Integer (required)"
    }
    ```

**Delete Track Addresses**

Removes all associated addresses to the given track ID. If no address databases are specified then the single worker instance searches all address databases sequentially, else it searches the given address databases in the array.

* Endpoint: `DELETE [...]/records_worker/delete_track_addresses`

* Body: 

    ```json
    {
        "addressDbNums": "Array of Integers (optional)",
        "trackID": "Integer (required)"
    }
    ```