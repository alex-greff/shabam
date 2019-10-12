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
        // The address databases to search from, if not included then all are searched
        "addressDbNums": "Array of Integers (optional)", 
        // The number of windows in the fingerprint arraybuffer (x-axis size)
        "windowAmount": "Integer (required)",
        // The number of partitions in the fingerprint arraybuffer (y-axis size)
        "partitionAmount": "Integer (required)",
        // The fingerprint array buffer
        "fingerprint": "Fingerprint ArrayBuffer (required)"
    }
    ```

* Response:
    
    `200` if the track is successfully matched.

    ```json
    {
        "trackID": "Integer"
    }
    ```

    `404` if no match is found.

**Add Track Addresses**

Computes and adds the given track addresses from the provided fingerprint. If no address databases is specified then the worker finds the first address database that I can put it in and does so. Returns information on the address database where it stored the computed addresses.

* Endpoint: `POST [...]/records_worker/add_track_addresses`

* Body:

    ```json
    {
        // The address database to insert the track records in. If not specified then a suitable address database will be found automatically.
        "addressDbNum": "Integer (optional)",
        // The number of windows in the fingerprint arraybuffer (x-axis size)
        "windowAmount": "Integer (required)",
        // The number of partitions in the fingerprint arraybuffer (y-axis size)
        "partitionAmount": "Integer (required)",
        // The fingerprint array buffer
        "fingerprint": "Fingerprint ArrayBuffer (required)",
        // The ID of the track for the corresponding records
        "trackID": "Integer (required)"
    }
    ```

* Response:

    `201` if track records are added successfully and returns back what address database the records were added to.

    ```json
    {
        "addressDbNum": "Integer"
    }
    ```

    `507` if the track records were not added to a records database (usually because all of them are full).

**Delete Track Addresses**

Removes all associated addresses to the given track ID. If no address databases are specified then the single worker instance searches all address databases sequentially, else it searches the given address databases in the array.

* Endpoint: `DELETE [...]/records_worker/delete_track_addresses`

* Body: 

    ```json
    {
        // The address databases that the track records will be searched for in. If not specified then all record databases will be searched.
        "addressDbNums": "Array of Integers (optional)",
        // The ID of the track
        "trackID": "Integer (required)"
    }
    ```

* Response: 

    `200` if the track records were deleted sucessfully.

    `404` if the track records were not found.

**Get Address Database**

Gets the address database that the records for a specific track are stored in.

* Endpoint: `POST [...]/records_worker/get_address_database`

* Body: 
    ```json
    {
        // The address databases that the track records will be searched for in. If not specified then all record databases will be searched.
        "addressDbNums": "Array of Integers (optional)",
        // The ID of the track
        "trackID": "Integer (required)"
    }
    ```

* Response:

    `200` if the track records are found.

    ```json
    {
        "addressDbNum": "Integer"
    }
    ```

    `404` if the track records are not found.