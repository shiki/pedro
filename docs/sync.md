# Synchronization

## Users

## Alerts

### Constraints

* Do not track `isDeleted` so we won't have to worry about the sync data and the database getting too big. Track the `isDeleted` on device only. However, we should be able to delete entities from the server too. 
* The client wins most of the time. Aside from `triggered` and `updated_at`, the server does not have to change any other fields.
* Should support multi-device sync. Alerts created on one device should be reflected on other devices too.
* The goal is to have eventual consistency
* Maximum row limit will be enforced on the client side for now.

### Protocol

Additional fields on client:

* `synchronized` (`bool`): Defaults to `true`. If `false`, this would have to be pushed to the server.
* `is_deleted` (`bool`): Defaults to `false`. If `true`, then delete this from the server during synchronization.

#### `POST /sync`

The first step of the sync is the client sending a request containing this:

```json
{
  "alerts": {
    "update": [ 
      // Created or updated
      { "uuid": ... },
      { "uuid": ... },
    ],
    "delete": [
      // Deleted locally (minimal data)
      { "uuid": "<uuid>", "updated_at": "<updated_at>" }, 
    ],
    "unmodified": [
      // Send minimal data only. 
      { "uuid": "<uuid>", "updated_at": "<updated_at>" }
    ]
  },
  "stocks": {
    "updated_after": "<date>"
  }
}
```

* The `update` list contains new or updated objects that the server should save. Merging is handled by the server. The server should return any objects that have been eventually modified.
* The `delete` list contains rows that should be deleted on the server.
* The `unmodified` list is processed by the server after the `update` and the `delete` list. Evaluations:
  * If there is a record in here that the server does not have any information on, it should be deleted on the client.
  * If the server has a row that is not in the `unmodified`, `update`, and `delete` list, the row is probably new and was created somewhere else. The server should return this row.

#### `POST /sync` Response

The server will respond with:

```json
{
  "meta": { },
  "data": {
    "alerts": {
      "modified": [
        { "uuid": ... },
        { "uuid": ... }
      ],
      "deleted": [
        // Minimal info only
        { "uuid": "<uuid>" },
        { "uuid": "<uuid>" },
      ]
    },
    "stocks": {
      "updated": [
        { "symbol": "<symbol>", ... },
        { "symbol": "<symbol>", ... }
      ]
    }
  }
}
```

* The `modified` list contains rows that were modified or created somewhere else. These should be saved in the client.
* The `deleted` list contains rows that are not in the server and should be deleted on the client too.
  * Once the client receives and processes this list, the client should delete the rows that are `is_deleted` too.
* The `stocks.updated` list contains:
  * All stocks that belong to all `alerts` belonging to the user. Deleted `alerts` would not be included in here. 
  * Were updated (`updated_at`) after the date given in the API request's `stocks.updated_after`

After the sync, the client should update all rows' `synchronized` property to `true`.

## References

### Couchbase

Here's an excerpt about Couchbase's synchronization protocol taken from [here](https://github.com/mirkokiefer/syncing-thesis):

The synchronization process from a CouchDB node A to B follows the following steps:

1. Read the last source sequence ID stored on B - it represents the last update it read on the previous synchronization.
2. Read a few entries from the changes stream of A starting at the last source sequence ID.
3. Send B the set of document revisions - B responds with the subset of those not stored in B.
4. Fetch the missing document revisions from A and write them to B.
5. Update the last source sequence ID on B.
6. Restart the process if there are remaining updates.

### Links

* https://www.slideshare.net/MicheleOrselli/server-side-data-sync
* https://culturedcode.com/things/blog/2010/12/state-of-sync-part-1/
* https://coderwall.com/p/gt_rfa/simple-data-synchronisation-for-web-mobile-apps-working-offline